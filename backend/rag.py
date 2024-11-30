import ollama
from sentence_transformers import SentenceTransformer
import chromadb
from chromadb.utils import embedding_functions
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
import PyPDF2
import os
OLLAMA_URL='https://02b3-34-87-144-56.ngrok-free.app/'
# Initialize clients and models
client = ollama.Client(host=OLLAMA_URL)
embeddingModel = SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2')
chromaClient = chromadb.Client()

def get_or_create_collection(name="ragDocuments"):
    existing_collections = chromaClient.list_collections()
    for col in existing_collections:
        if col.name == name:
            return chromaClient.get_collection(name=name)
    return chromaClient.create_collection(
        name=name, 
        embedding_function=embedding_functions.SentenceTransformerEmbeddingFunction()
    )

def chunk_text(text, chunk_size=300):
    words = text.split()
    chunks = [' '.join(words[i:i + chunk_size]) for i in range(0, len(words), chunk_size)]
    return chunks

def read_pdf(file_path):
    try:
        with open(file_path, 'rb') as file:
            reader = PyPDF2.PdfReader(file)
            text = ""
            for page_num in range(len(reader.pages)):
                page = reader.pages[page_num]
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\n"
        return text
    except Exception as e:
        print(f"Error reading PDF: {e}")
        return ""

# Initialize the collection
collection = get_or_create_collection()

def add_document_to_vector_db(doc_id, text):
    chunks = chunk_text(text)
    embeddings = embeddingModel.encode(chunks)
    for i, (chunk, embedding) in enumerate(zip(chunks, embeddings)):
        collection.add(
            documents=[chunk],
            embeddings=[embedding.tolist()],
            ids=[f"{doc_id}_chunk{i}"]
        )
    print(f"Document '{doc_id}' has been added to the vector database with {len(chunks)} chunks.")

def retrieve_relevant_chunks(query, top_k=3):
    query_embedding = embeddingModel.encode([query])[0]
    records = collection.get(include=["embeddings", "documents"])
    if len(records["embeddings"]) == 0 or len(records["documents"]) == 0:
        print("No documents are present in the vector database. Please add a document first.")
        return []
    embeddings = np.array(records["embeddings"])
    similarities = cosine_similarity([query_embedding], embeddings)[0]
    top_indices = np.argsort(similarities)[-top_k:][::-1]
    top_chunks = [records["documents"][idx] for idx in top_indices]
    return top_chunks

def generate_interview_questions(resume_text, job_description, experience_level, num_questions=5):
    """
    Generate interview questions based on resume and job description using RAG.
    
    Args:
        resume_text (str): The text content of the resume
        job_description (str): The job description
        experience_level (str): The candidate's experience level
        num_questions (int): Number of questions to generate
        
    Returns:
        list: A list of generated questions
    """
    # Add both resume and job description to vector DB with unique IDs
    add_document_to_vector_db("resume", resume_text)
    add_document_to_vector_db("job", job_description)
    
    questions = []
    for i in range(num_questions):
        # Get relevant context from both documents
        context = retrieve_relevant_chunks(f"technical skills and experience from resume and job requirements")
        
        prompt = f"""
        Based on the following context from a resume and job description:
        
        {' '.join(context)}
        
        Generate a specific theory interview question for a {experience_level} candidate.
        The question should:
        1. Start with some behavioral questions
        2. Be relevant to the candidate's background and job requirements
        3. Be answerable in 2-3 lines
        4. Focus on theoritical skills mentioned in both resume and job description
        5. Be appropriate for the candidate's experience level.
        6. Ask the user to explain one of its project. 
        7. Only Ask theoritical questions.
        8. dont mention "Here's a specific theory-based interview question for an entry-level candidate:"
        Generate only the question, without any explanations or answers.
        """
        
        response = client.generate(
            model="llama3.2:3b",
            prompt=prompt
        )['response'].strip()
        
        questions.append({"question": response})
    
    # Clean up the collection for the next use
    collection.delete(ids=[f"resume_chunk{i}" for i in range(100)])  # Assuming max 100 chunks
    collection.delete(ids=[f"job_chunk{i}" for i in range(100)])
    
    return questions

def save_resume(file_data, filename):
    """
    Save uploaded resume file and return its content
    
    Args:
        file_data (bytes): The uploaded file data
        filename (str): Original filename
        
    Returns:
        str: Extracted text from the resume
    """
    upload_dir = "uploads"
    if not os.path.exists(upload_dir):
        os.makedirs(upload_dir)
        
    file_path = os.path.join(upload_dir, filename)
    with open(file_path, 'wb') as f:
        f.write(file_data)
    
    if filename.lower().endswith('.pdf'):
        text = read_pdf(file_path)
    else:
        with open(file_path, 'r', encoding='utf-8') as f:
            text = f.read()
    
    # Clean up the file
    os.remove(file_path)
    
    return text