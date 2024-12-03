from flask import Flask, request, jsonify, session
from flask_cors import CORS
import ollama
from flask_session import Session
from rag import generate_interview_questions, save_resume
import re
import os
import traceback
import json
import numpy as np
from dataclasses import dataclass
from models.feedback import FeedbackModel

app = Flask(__name__)
app.secret_key = 'your_secret_key_here'  # Replace with a secure key in production
app.config['SESSION_TYPE'] = 'filesystem'
Session(app)

OLLAMA_URL = 'https://895e-34-16-166-53.ngrok-free.app/'
client = ollama.Client(host=OLLAMA_URL)
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
@app.route('/api/domains', methods=['GET'])
def get_domains():
    return jsonify(DOMAINS)

@app.route('/api/roles/<domain>', methods=['GET'])
def get_roles(domain):
    return jsonify(ROLES.get(domain, []))

def generate_behavioral_questions():
    questions = []
    
    # First behavioral question - Introduction
    intro_system_prompt = """
    You are a professional interviewer. Generate an introduction question that asks the candidate 
    to introduce themselves and their background. Keep it professional and concise.
    Only provide the question without any additional context or explanations.
    """
    intro_prompt = "Generate an introduction question for the interview."
    
    # Second behavioral question - Role motivation
    motivation_system_prompt = """
    You are a professional interviewer. Generate a question that asks about the candidate's 
    motivation for applying to this role and what interests them about it.
    Only provide the question without any additional context or explanations.
    """
    motivation_prompt = "Generate a question about role motivation."
    
    try:
        # Generate introduction question
        intro_response = client.generate(
            model="llama3.2:3b",
            prompt=intro_prompt,
            system=intro_system_prompt,
        )
        questions.append({"question": intro_response['response'].strip()})
        
        # Generate motivation question
        motivation_response = client.generate(
            model="llama3.2:3b",
            prompt=motivation_prompt,
            system=motivation_system_prompt,
        )
        questions.append({"question": motivation_response['response'].strip()})
        
    except Exception as e:
        print(f"Error generating behavioral questions: {str(e)}")
        questions = [
            {"question": "Could you please introduce yourself and tell us about your background?"},
            {"question": "What interests you about this role and why did you apply for it?"}
        ]
    
    return questions

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
                num_questions=question_count - 2  # Subtract 2 for behavioral questions
            )
            questions.extend(technical_questions)
        else:
            # Generate remaining technical questions
            for i in range(question_count - 2):
                if is_custom_job:
                    system_prompt = f"""
                    You are a professional technical interviewer.
                    Based on the following job description, generate a relevant technical interview question.
                    Only provide the question without any additional context or explanations.
                    """
                    
                    question_prompt = f"Generate a technical interview question based on the job requirements."
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
                    response = client.generate(
                        model="llama3.2:3b",
                        prompt=question_prompt,
                        system=system_prompt,
                    )
                    
                    question = {
                        "question": response['response'].strip(),
                    }
                    session[f'question_{i+2}'] = question  # Start from index 2 for technical questions
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

@app.route('/api/get-feedback', methods=['POST'])
def get_feedback():
    try:
        if 'candidate_answers' not in session:
            return jsonify({"error": "No answers found in session"}), 400

        experience = session.get('experience')
        candidate_answers = session.get('candidate_answers', [])
        
        # Calculate base score from answer lengths and keyword presence
        total_score = 0
        for answer_data in candidate_answers:
            answer = answer_data['answer'].lower()
            
            # Basic scoring criteria
            word_count = len(answer.split())
            has_technical_terms = bool(re.search(r'\b(api|code|data|function|method|class|algorithm|database|framework|library|server|client|test|debug|deploy|performance|optimization|scalability|security|encryption|protocol|thread|process|memory|storage|cloud|container|virtualization|network|frontend|backend|fullstack|devops|ci/cd|integration|authentication|authorization|middleware|cache|proxy|dns|http|https|ssl|tls|rest|soap|graphql|json|xml|ajax|mvc|orm|nosql|sql|crud|gui|cli)\b', answer.lower()))
            has_explanation = bool(re.search(r'\b(because|therefore|hence|since|as|due to|thus|resulting in|consequently|so that|which means|thereby|accordingly|for this reason|in order to|on account of)\b', answer.lower()))
            
            # Score calculation
            answer_score = min(100, (
                (min(word_count, 50) / 50 * 40) +  # Up to 40 points for length
                (30 if has_technical_terms else 0) +  # 30 points for technical terms
                (30 if has_explanation else 0)  # 30 points for explanation
            ))
            
            total_score += answer_score

        # Average score across all answers
        final_score = int(total_score / len(candidate_answers))
        
        feedback_data = generate_feedback(final_score)
        return jsonify(feedback_data)

    except Exception as e:
        print(f"Error in get_feedback: {str(e)}")
        return jsonify({
            "strength": "Attempted to answer questions",
            "areasOfImprovement": "Technical depth, clarity",
            "weakness": "Needs more preparation",
            "overallScore": "50"
        }), 200

def generate_feedback(score):
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

        response = client.generate(
            model="llama3.2:3b",
            prompt=prompt,
            system=system_prompt,
        )

        return jsonify({"response": response['response'].strip()})

    except Exception as e:
        print(f"Error generating ideal answer: {str(e)}")
        return jsonify({"error": str(e)}), 500
if __name__ == '__main__':
    app.run(debug=True)