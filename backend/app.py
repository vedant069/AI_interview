from flask import Flask, request, jsonify, session
from flask_cors import CORS
from flask_session import Session
from groq import Groq
from rag import generate_interview_questions, save_resume
import re
import os
import traceback
import json
import numpy as np
from dataclasses import dataclass
from models.feedback import FeedbackModel
from models.user import UserModel

app = Flask(__name__)
app.secret_key = 'your_secret_key_here'  # Replace with a secure key in production
app.config['SESSION_TYPE'] = 'filesystem'
Session(app)

# Initialize Groq client with API key
os.environ["GROQ_API_KEY"] = "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"
client = Groq()

feedback_model = FeedbackModel()

# Configure CORS
CORS(app, 
     supports_credentials=True,
     resources={
         r"/api/*": {
             "origins": ["http://localhost:5173"],
             "methods": ["GET", "POST", "OPTIONS"],
             "allow_headers": ["Content-Type"],
             "supports_credentials": True
         }
     })

DOMAINS = ["Cloud Computing", "Data Science", "Web Development", "Cyber Security"]
ROLES = {
    "Cloud Computing": ["Cloud Architect", "Cloud Engineer", "Cloud Consultant"],
    "Data Science": ["Data Analyst", "Machine Learning Engineer", "Data Scientist"],
    "Web Development": ["Frontend Developer", "Backend Developer", "Full Stack Developer"],
    "Cyber Security": ["Security Analyst", "Penetration Tester", "Security Consultant"]
}

def generate_groq_response(system_prompt, user_prompt):
    try:
        completion = client.chat.completions.create(
            model="llama-3.2-3b-preview",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            temperature=1,
            max_tokens=1024,
            top_p=1,
            stream=False,
            stop=None
        )
        return completion.choices[0].message.content.strip()
    except Exception as e:
        print(f"Error in generate_groq_response: {str(e)}")
        raise

@app.route('/api/upload-resume', methods=['POST'])
def upload_resume():
    try:
        if 'resume' not in request.files:
            return jsonify({"error": "No resume file provided"}), 400
            
        file = request.files['resume']
        if file.filename == '':
            return jsonify({"error": "No selected file"}), 400
            
        if not file.filename.lower().endswith(('.pdf', '.txt', '.doc', '.docx')):
            return jsonify({"error": "Invalid file format"}), 400
        
        resume_text = save_resume(file.read(), file.filename)
        return jsonify({"resumeText": resume_text})
        
    except Exception as e:
        print(f"Error in upload_resume: {str(e)}")
        return jsonify({"error": str(e)}), 500
@app.route('/api/domains', methods=['GET'])
def get_domains():
    return jsonify(DOMAINS)

@app.route('/api/roles/<domain>', methods=['GET'])
def get_roles(domain):
    return jsonify(ROLES.get(domain, []))

def generate_behavioral_questions():
    questions = []
    
    intro_system_prompt = """
    You are a professional interviewer. Generate an introduction question that asks the candidate 
    to introduce themselves and their background. Keep it professional and concise.
    Only provide the question without any additional context or explanations.
    """
    intro_prompt = "Generate an introduction question for the interview."
    
    motivation_system_prompt = """
    You are a professional interviewer. Generate a question that asks about the candidate's 
    motivation for applying to this role and what interests them about it.
    Only provide the question without any additional context or explanations.
    """
    motivation_prompt = "Generate a question about role motivation."
    
    try:
        # Generate introduction question
        intro_response = generate_groq_response(intro_system_prompt, intro_prompt)
        questions.append({"question": intro_response})
        
        # Generate motivation question
        motivation_response = generate_groq_response(motivation_system_prompt, motivation_prompt)
        questions.append({"question": motivation_response})
        
    except Exception as e:
        print(f"Error generating behavioral questions: {str(e)}")
        questions = [
            {"question": "Could you please introduce yourself and tell us about your background?"},
            {"question": "What interests you about this role and why did you apply for it?"}
        ]
    
    return questions
@app.route('/api/submit-answer', methods=['POST', 'OPTIONS'])
def submit_answer():
    if request.method == 'OPTIONS':
        response = jsonify({"success": True})
        response.status_code = 200
        return response

    try:
        data = request.json
        if not data:
            return jsonify({"error": "Request body must be JSON"}), 400

        answer = data.get('answer')
        question_index = data.get('questionIndex')

        if not answer or not isinstance(answer, str):
            return jsonify({"error": "Invalid or missing 'answer'"}), 400

        if not isinstance(question_index, int):
            return jsonify({"error": "Invalid or missing 'questionIndex'"}), 400

        question_key = f'question_{question_index}'

        if question_key not in session:
            return jsonify({"error": f"Question not found in session: {question_key}"}), 400

        candidate_answers = session.get('candidate_answers', [])
        candidate_answers.append({
            'question': session[question_key]['question'],
            'answer': answer
        })
        session['candidate_answers'] = candidate_answers
        session.modified = True

        return jsonify({"success": True})

    except Exception as e:
        return jsonify({"error": str(e)}), 500
@app.route('/api/generate-questions', methods=['POST'])
def generate_questions():
    try:
        data = request.json
        is_custom_job = data.get('isCustomJob', False)
        job_description = data.get('jobDescription', '')
        domain = data.get('domain')
        role = data.get('role')
        experience = data.get('experience')
        question_count = data.get('questionCount', 1)
        resume_text = data.get('resumeText', '')

        if is_custom_job and not job_description:
            return jsonify({"error": "Job description is required for custom jobs"}), 400
        elif not is_custom_job and not all([domain, role]):
            return jsonify({"error": "Domain and role are required for quick setup"}), 400
        
        if not experience:
            return jsonify({"error": "Experience level is required"}), 400

        session['experience'] = experience
        session['candidate_answers'] = []
        session['current_question'] = 0

        # Generate behavioral questions first
        questions = generate_behavioral_questions()

        # Generate technical questions
        if resume_text:
            technical_questions = generate_interview_questions(
                resume_text=resume_text,
                job_description=job_description if is_custom_job else f"Role: {role} in {domain}",
                experience_level=experience,
                num_questions=question_count - 2
            )
            questions.extend(technical_questions)
        else:
            for i in range(question_count - 2):
                if is_custom_job:
                    system_prompt = """
                    You are a professional technical interviewer.
                    Based on the following job description, generate a relevant technical interview question.
                    Only provide the question without any additional context or explanations.
                    """
                    question_prompt = f"Generate a technical interview question based on the job requirements: {job_description}"
                else:
                    system_prompt = f"""
                    You are a professional interviewer with expertise in {domain}. 
                    Your job is to conduct an interview for the role of {role}. 
                    Generate one structured and insightful technical question suitable for a {experience}-level candidate. 
                    Ask simple question which can be answered in 2-3 lines max.
                    Do not include any assessment details or explanations; only provide the question.
                    There is only one candidate you are interviewing, ask a new question.
                    Don't give the answer.
                    """
                    question_prompt = f"Ask a technical {experience}-level interview question for a {role} in {domain}."
                
                try:
                    response = generate_groq_response(system_prompt, question_prompt)
                    question = {"question": response}
                    session[f'question_{i+2}'] = question
                    questions.append(question)
                    
                except Exception as e:
                    print(f"Error generating question {i}: {str(e)}")
                    return jsonify({"error": f"Error generating questions: {str(e)}"}), 500

        # Store all questions in session
        for i, question in enumerate(questions):
            session[f'question_{i}'] = question

        return jsonify(questions)

    except Exception as e:
        print(f"Error in generate_questions: {str(e)}")
        return jsonify({"error": str(e)}), 500

def generate_feedback(score, candidate_answers):
    try:
        # Prepare the answers for analysis
        answers_text = "\n".join([f"Q: {a['question']}\nA: {a['answer']}" for a in candidate_answers])
        
        system_prompt = """
        You are an expert interview assessor. Based on the candidate's answers and their score,
        provide detailed feedback in the following format:
        {
            "strength": "Main strength of the candidate",
            "areasOfImprovement": "Key areas that need improvement",
            "weakness": "Main weakness to address",
            "overallScore": "numerical_score"
        }
        Keep the feedback constructive, specific, and actionable.
        """

        prompt = f"""
        Score: {score}
        Candidate's Answers:
        {answers_text}

        Please provide detailed feedback addressing the strengths, areas of improvement, and weaknesses.
        """

        feedback_response = generate_groq_response(system_prompt, prompt)
        
        # Parse the response into JSON format
        try:
            feedback_dict = json.loads(feedback_response)
            feedback_dict['overallScore'] = str(score)  # Ensure we keep the original score
            return feedback_dict
        except json.JSONDecodeError:
            # Fallback if JSON parsing fails
            return {
                "strength": "Technical knowledge demonstrated",
                "areasOfImprovement": "Add more specific examples and technical depth",
                "weakness": "Could provide more detailed explanations",
                "overallScore": str(score)
            }

    except Exception as e:
        print(f"Error in generate_feedback: {str(e)}")
        # Fallback feedback based on score ranges
        if score >= 80:
            return {
                "strength": "Strong technical knowledge demonstrated",
                "areasOfImprovement": "Add more specific examples",
                "weakness": "Could provide more detailed explanations",
                "overallScore": str(score)
            }
        elif score >= 60:
            return {
                "strength": "Good basic understanding shown",
                "areasOfImprovement": "Technical depth, practical examples",
                "weakness": "Needs more technical specifics",
                "overallScore": str(score)
            }
        elif score >= 40:
            return {
                "strength": "Shows fundamental knowledge",
                "areasOfImprovement": "Technical terms, clarity, depth",
                "weakness": "Answers lack technical detail",
                "overallScore": str(score)
            }
        else:
            return {
                "strength": "Willing to attempt answers",
                "areasOfImprovement": "Technical knowledge, specificity",
                "weakness": "Insufficient technical depth",
                "overallScore": str(score)
            }

@app.route('/api/get-feedback', methods=['POST'])
def get_feedback():
    try:
        if 'candidate_answers' not in session:
            return jsonify({"error": "No answers found in session"}), 400

        experience = session.get('experience')
        candidate_answers = session.get('candidate_answers', [])
        
        # Calculate base score from answer quality
        total_score = 0
        for answer_data in candidate_answers:
            answer = answer_data['answer'].lower()
            question = answer_data['question'].lower()
            
            # Basic scoring criteria with improved weights
            word_count = len(answer.split())
            
            # More comprehensive technical terms regex
            has_technical_terms = bool(re.search(r'\b(api|code|data|function|method|class|algorithm|database|framework|library|server|client|test|debug|deploy|performance|optimization|scalability|security|encryption|protocol|thread|process|memory|storage|cloud|container|virtualization|network|frontend|backend|fullstack|devops|ci/cd|integration|authentication|authorization|middleware|cache|proxy|dns|http|https|ssl|tls|rest|soap|graphql|json|xml|ajax|mvc|orm|nosql|sql|crud|gui|cli|architecture|design pattern|microservice|docker|kubernetes|aws|azure|git|agile|scrum|testing|unit test|integration test|deployment|monitoring|logging|analytics|machine learning|ai|blockchain|iot|mobile|responsive|ui|ux|accessibility|seo|version control)\b', answer))
            
            # More comprehensive explanation terms regex
            has_explanation = bool(re.search(r'\b(because|therefore|hence|since|as|due to|thus|resulting in|consequently|so that|which means|thereby|accordingly|for this reason|in order to|on account of|this leads to|this ensures|this allows|this helps|this enables|this prevents|this improves|this optimizes|this facilitates|this maintains)\b', answer))
            
            # Content relevance (checking if answer contains keywords from question)
            question_keywords = set(re.findall(r'\b\w+\b', question))
            answer_keywords = set(re.findall(r'\b\w+\b', answer))
            relevance_score = len(question_keywords.intersection(answer_keywords)) / len(question_keywords) if question_keywords else 0
            
            # Improved scoring weights
            length_score = min(30, (min(word_count, 100) / 100) * 30)  # 30% for length (max 100 words)
            technical_score = 25 if has_technical_terms else 0  # 25% for technical terms
            explanation_score = 25 if has_explanation else 0    # 25% for explanation
            relevance_score = relevance_score * 20             # 20% for relevance to question
            
            # Calculate answer score
            answer_score = length_score + technical_score + explanation_score + relevance_score
            
            # Apply experience level modifier
            if experience == "Senior":
                answer_score *= 1.2  # Higher expectations for senior level
            elif experience == "Junior":
                answer_score *= 0.8  # Lower expectations for junior level
            
            total_score += min(100, answer_score)  # Cap at 100

        # Calculate final score
        final_score = int(total_score / len(candidate_answers))
        
        # Generate feedback using both score and answers
        feedback_data = generate_feedback(final_score, candidate_answers)
        return jsonify(feedback_data)

    except Exception as e:
        print(f"Error in get_feedback: {str(e)}")
        # More informative default feedback
        return jsonify({
            "strength": "None",
            "areasOfImprovement": "None",
            "weakness": "None",
            "overallScore": "0"  # Changed from 50 to be less punitive
        }), 200

@app.route('/api/feedback', methods=['POST'])
def save_feedback():
    try:
        data = request.json
        user_id = data.get('userId')
        
        if not user_id:
            return jsonify({"error": "User ID is required"}), 400

        feedback_data = {
            'domain': data.get('domain'),
            'role': data.get('role'),
            'feedback': {
                'strength': data.get('feedback', {}).get('strength'),
                'areasOfImprovement': data.get('feedback', {}).get('areasOfImprovement'),
                'weakness': data.get('feedback', {}).get('weakness'),
                'overallScore': data.get('feedback', {}).get('overallScore')
            },
            'questions': data.get('questions', []),
            'answers': data.get('answers', [])
        }

        result = feedback_model.save_feedback(user_id, feedback_data)
        
        if result['success']:
            return jsonify({"message": "Feedback saved successfully"}), 200
        else:
            return jsonify({"error": result['error']}), 500

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/feedback/<user_id>', methods=['GET'])
def get_feedback_history(user_id):
    try:
        feedbacks = feedback_model.get_user_feedback(user_id)
        return jsonify(feedbacks), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
@app.route('/api/ideal-answer', methods=['POST'])
def get_ideal_answer():
    try:
        data = request.json
        question = data.get('question')
        user_answer = data.get('userAnswer')
        
        if not question or not user_answer:
            return jsonify({"error": "Question and user answer are required"}), 400

        system_prompt = """
        You are an expert interviewer and mentor. Analyze the candidate's answer to the interview question
        and provide constructive feedback. Your response should have two parts:

        1. Analysis: Evaluate what the candidate did well and what could be improved. Be specific but constructive.
        2. Ideal Answer: Provide a model answer that demonstrates the key points that should be covered.

        Keep your response professional, clear, and helpful. Format your response with clear sections.
        """

        prompt = f"""
        Question: {question}
        Candidate's Answer: {user_answer}

        Please provide an analysis of the answer and an ideal response.
        """

        response = generate_groq_response(system_prompt, prompt)
        return jsonify({"response": response})

    except Exception as e:
        print(f"Error generating ideal answer: {str(e)}")
        return jsonify({"error": str(e)}), 500
@app.route('/api/users', methods=['POST'])
def create_user():
    try:
        user_data = request.json
        if not user_data or not all(k in user_data for k in ['uid', 'email', 'name']):
            return jsonify({"error": "Missing required user data"}), 400

        user_model = UserModel()
        result = user_model.create_user(user_data)
        
        if result['success']:
            return jsonify({"message": result['message']}), 200
        else:
            return jsonify({"error": result['error']}), 500

    except Exception as e:
        print(f"Error creating user: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/users/<uid>', methods=['GET'])
def get_user(uid):
    try:
        user_model = UserModel()
        user = user_model.get_user(uid)
        
        if user:
            return jsonify(user), 200
        else:
            return jsonify({"error": "User not found"}), 404

    except Exception as e:
        print(f"Error retrieving user: {str(e)}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)