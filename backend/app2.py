from flask import Flask, request, jsonify, session
from flask_cors import CORS
import ollama
from flask_session import Session
from rag import generate_interview_questions, save_resume
import re
import logging
from logging.handlers import RotatingFileHandler
import os
import traceback
import json
import numpy as np
from dataclasses import dataclass

# Configure logging
def setup_logger():
    if not os.path.exists('logs'):
        os.makedirs('logs')
    
    formatter = logging.Formatter(
        '%(asctime)s - %(name)s - %(levelname)s - [%(filename)s:%(lineno)d] - %(message)s'
    )
    
    file_handler = RotatingFileHandler(
        'logs/app.log', 
        maxBytes=10485760,
        backupCount=5
    )
    file_handler.setFormatter(formatter)
    file_handler.setLevel(logging.INFO)
    
    error_file_handler = RotatingFileHandler(
        'logs/error.log',
        maxBytes=10485760,
        backupCount=5
    )
    error_file_handler.setFormatter(formatter)
    error_file_handler.setLevel(logging.ERROR)
    
    root_logger = logging.getLogger()
    root_logger.setLevel(logging.INFO)
    root_logger.addHandler(file_handler)
    root_logger.addHandler(error_file_handler)
    
    return root_logger

logger = setup_logger()

app = Flask(__name__)
app.secret_key = 'your_secret_key_here'  # Replace with a secure key in production
app.config['SESSION_TYPE'] = 'filesystem'
Session(app)

OLLAMA_URL = 'https://02b3-34-87-144-56.ngrok-free.app/'
client = ollama.Client(host=OLLAMA_URL)

# Configure CORS
CORS(app, 
     supports_credentials=True, 
     resources={r"/api/*": {"origins": "http://localhost:5173"}})

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
        logger.info("Starting question generation process")
        data = request.json
        logger.debug(f"Received request data: {json.dumps(data, indent=2)}")
        
        is_custom_job = data.get('isCustomJob', False)
        job_description = data.get('jobDescription', '')
        domain = data.get('domain')
        role = data.get('role')
        experience = data.get('experience')
        question_count = data.get('questionCount', 1)
        resume_text = data.get('resumeText', '')

        if is_custom_job and not job_description:
            logger.error("Job description missing for custom job")
            return jsonify({"error": "Job description is required for custom jobs"}), 400
        elif not is_custom_job and not all([domain, role]):
            logger.error("Domain or role missing for quick setup")
            return jsonify({"error": "Domain and role are required for quick setup"}), 400
        
        if not experience:
            logger.error("Experience level missing")
            return jsonify({"error": "Experience level is required"}), 400

        # Initialize session data
        if 'interview_data' not in session:
            session['interview_data'] = {
                'experience': experience,
                'questions': [],
                'answers': [],
                'current_question': 0
            }
        
        questions = []
        if resume_text:
            logger.info("Generating questions based on resume")
            questions = generate_interview_questions(
                resume_text=resume_text,
                job_description=job_description if is_custom_job else f"Role: {role} in {domain}",
                experience_level=experience,
                num_questions=question_count
            )
        else:
            for i in range(question_count):
                if is_custom_job:
                    system_prompt = """
                    You are a professional technical interviewer.
                    Based on the job description, generate a relevant technical interview question.
                    Only provide the question without additional context or explanations.
                    """
                    question_prompt = f"Generate the next technical interview question based on the job requirements."
                else:
                    system_prompt = f"""
                    You are a professional interviewer with expertise in {domain}. 
                    Generate one structured question suitable for a {experience}-level {role} candidate.
                    Ask a simple question that can be answered in 2-3 lines max.
                    Only provide the question without any additional context.
                    """
                    question_prompt = f"Ask the next {experience}-level interview question for a {role} in {domain}."
                
                try:
                    response = client.generate(
                        model="llama3.2:3b",
                        prompt=question_prompt,
                        system=system_prompt,
                    )
                    
                    question = {
                        "id": i,
                        "question": response['response'].strip(),
                    }
                    questions.append(question)
                    
                except Exception as e:
                    logger.error(f"Error generating question {i}: {str(e)}")
                    return jsonify({"error": f"Error generating questions: {str(e)}"}), 500

        # Store questions in session
        session['interview_data']['questions'] = questions
        session.modified = True
        
        logger.info(f"Successfully generated {len(questions)} questions")
        return jsonify(questions)

    except Exception as e:
        logger.error(f"Error in generate_questions: {str(e)}\n{traceback.format_exc()}")
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
        logger.info("Processing answer submission")
        data = request.json
        if not data:
            logger.error("No data provided in request")
            return jsonify({"error": "No data provided"}), 400

        answer = data.get('answer')
        question_index = data.get('questionIndex')

        logger.debug(f"Received answer for question index {question_index}")

        if 'interview_data' not in session:
            logger.error("No interview data found in session")
            return jsonify({"error": "No interview session found"}), 400

        interview_data = session['interview_data']
        questions = interview_data.get('questions', [])

        if not questions or question_index >= len(questions):
            logger.error(f"Question index {question_index} not found in session questions")
            return jsonify({"error": "Question not found"}), 400

        # Store the answer
        if 'answers' not in interview_data:
            interview_data['answers'] = []

        answer_data = {
            'question': questions[question_index]['question'],
            'answer': answer,
            'question_index': question_index
        }

        interview_data['answers'].append(answer_data)
        interview_data['current_question'] = question_index + 1
        
        session['interview_data'] = interview_data
        session.modified = True

        logger.info(f"Successfully stored answer for question {question_index}")
        return jsonify({"success": True})

    except Exception as e:
        logger.error(f"Error in submit_answer: {str(e)}\n{traceback.format_exc()}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/get-feedback', methods=['POST'])

def get_feedback():
    try:
        logger.info("Generating feedback for interview")
        if 'interview_data' not in session:
            logger.error("No interview data found in session")
            return jsonify({"error": "No interview data found"}), 400

        interview_data = session['interview_data']
        answers = interview_data.get('answers', [])
        
        if not answers:
            logger.error("No answers found in session")
            return jsonify({"error": "No answers found"}), 400

        # Calculate score and generate feedback
        total_score = 0
        for answer_data in answers:
            answer = answer_data['answer'].lower()
            
            word_count = len(answer.split())
            has_technical_terms = bool(re.search(r'\b(api|code|data|function|method|class|algorithm|database|framework|library|server|client|test|debug|deploy)\b', answer))
            has_explanation = bool(re.search(r'\b(because|therefore|hence|since|as|due to)\b', answer))
            
            answer_score = min(100, (
                (min(word_count, 50) / 50 * 40) +
                (30 if has_technical_terms else 0) +
                (30 if has_explanation else 0)
            ))
            
            total_score += answer_score

        final_score = int(total_score / len(answers))

        # Generate feedback based on score
        feedback_data = generate_feedback(final_score)
        logger.info(f"Generated feedback with score {final_score}")
        
        return jsonify(feedback_data)

    except Exception as e:
        logger.error(f"Error in get_feedback: {str(e)}\n{traceback.format_exc()}")
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

if __name__ == '__main__':
    logger.info("Starting Flask application")
    app.run(debug=True)