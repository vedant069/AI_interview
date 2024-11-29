from flask import Flask, request, jsonify, session
from flask_cors import CORS
import ollama
from flask_session import Session
from rag import generate_interview_questions, save_resume
import re

app = Flask(__name__)
app.secret_key = 'your_secret_key_here'  # Replace with a secure key in production
app.config['SESSION_TYPE'] = 'filesystem'
Session(app)

OLLAMA_URL = 'https://9024-34-16-183-110.ngrok-free.app/'
client = ollama.Client(host=OLLAMA_URL)

# Configure CORS to allow requests from the frontend
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

        if resume_text:
            questions = generate_interview_questions(
                resume_text=resume_text,
                job_description=job_description if is_custom_job else f"Role: {role} in {domain}",
                experience_level=experience,
                num_questions=question_count
            )
        else:
            questions = []
            for i in range(question_count):
                if is_custom_job:
                    system_prompt = f"""
                    You are a professional technical interviewer.
                    Based on the following job description, generate a relevant technical interview question.
                    Only provide the question without any additional context or explanations.
                    """
                    
                    question_prompt = f"Generate the next technical interview question based on the job requirements."
                else:
                    system_prompt = f"""
                    You are a professional interviewer with expertise in {domain}. 
                    Your job is to conduct an interview for the role of {role}. 
                    Generate one structured and insightful question suitable for a {experience}-level candidate. 
                    Ask simple question which can be answered in 2-3 lines max.
                    Do not include any assessment details or explanations; only provide the question.
                    There is only one candidate you are interviewing, ask a new question.
                    Don't give the answer.
                    """
                    
                    question_prompt = f"Ask the next {experience}-level interview question for a {role} in {domain}."
                
                try:
                    response = client.generate(
                        model="llama3.2:3b",
                        prompt=question_prompt,
                        system=system_prompt,
                    )
                    
                    question = {
                        "question": response['response'].strip(),
                    }
                    session[f'question_{i}'] = question
                    questions.append(question)
                    
                except Exception as e:
                    print(f"Error generating question {i}: {str(e)}")
                    return jsonify({"error": f"Error generating questions: {str(e)}"}), 500

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

@app.route('/api/submit-answer', methods=['POST'])
def submit_answer():
    try:
        data = request.json
        answer = data.get('answer')
        question_index = data.get('questionIndex')
        
        if answer is None or question_index is None:
            return jsonify({"error": "Missing answer or question index"}), 400
        
        question_key = f'question_{question_index}'
        if question_key not in session:
            return jsonify({"error": "Question not found in session"}), 400

        candidate_answers = session.get('candidate_answers', [])
        candidate_answers.append({
            'question': session[question_key]['question'],
            'answer': answer
        })
        session['candidate_answers'] = candidate_answers
        session.modified = True
        
        return jsonify({"success": True})
    except Exception as e:
        print(f"Error in submit_answer: {str(e)}")
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
            has_technical_terms = bool(re.search(r'\b(api|code|data|function|method|class|algorithm|database|framework|library|server|client|test|debug|deploy)\b', answer))
            has_explanation = bool(re.search(r'\b(because|therefore|hence|since|as|due to)\b', answer))
            
            # Score calculation
            answer_score = min(100, (
                (min(word_count, 50) / 50 * 40) +  # Up to 40 points for length
                (30 if has_technical_terms else 0) +  # 30 points for technical terms
                (30 if has_explanation else 0)  # 30 points for explanation
            ))
            
            total_score += answer_score

        # Average score across all answers
        final_score = int(total_score / len(candidate_answers))

        # Generate appropriate feedback based on score
        if final_score >= 80:
            strength = "Strong technical knowledge demonstrated"
            areas_improvement = "Add more specific examples"
            weakness = "Could provide more detailed explanations"
        elif final_score >= 60:
            strength = "Good basic understanding shown"
            areas_improvement = "Technical depth, practical examples"
            weakness = "Needs more technical specifics"
        elif final_score >= 40:
            strength = "Shows fundamental knowledge"
            areas_improvement = "Technical terms, clarity, depth"
            weakness = "Answers lack technical detail"
        else:
            strength = "Willing to attempt answers"
            areas_improvement = "Technical knowledge, specificity"
            weakness = "Insufficient technical depth"

        feedback_data = {
            "strength": strength,
            "areasOfImprovement": areas_improvement,
            "weakness": weakness,
            "overallScore": str(final_score)
        }

        return jsonify(feedback_data)

    except Exception as e:
        print(f"Error in get_feedback: {str(e)}")
        return jsonify({
            "strength": "Attempted to answer questions",
            "areasOfImprovement": "Technical depth, clarity",
            "weakness": "Needs more preparation",
            "overallScore": "50"
        }), 200

if __name__ == '__main__':
    app.run(debug=True)