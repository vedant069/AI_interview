# AI Interview Preparation Bot

An AI-powered application that generates interview questions based on your resume.

## Prerequisites

- Node.js and npm
- Python 3.x
- [Ollama](https://ollama.com/)

## Installation & Setup

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### Backend Setup
In a new terminal:
```bash
cd backend
pip install -r requirements.txt
python app.py
```

### ML Model Setup
1. Download and install Ollama from https://ollama.com/
2. Run the language model:
```bash
ollama run llama2:3b
```

## Project Structure

```
.
├── backend
│   ├── app.py
│   ├── rag.py
│   ├── requirements.txt
├── frontend
│   ├── src
│   ├── .gitignore
│   ├── eslint.config.js
│   ├── index.html
│   ├── package-lock.json
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   ├── tsconfig.app.json
│   ├── tsconfig.json
│   ├── tsconfig.node.json
│   ├── vite.config.ts
│   ├── .gitignore

## Usage

1. Start all three components (frontend, backend, and Ollama)
2. Navigate to the frontend URL shown in your terminal
3. Upload your resume
4. The AI will generate tailored interview questions based on your experience

## Tech Stack

- Frontend: React with TypeScript, Tailwind CSS, Vite
- Backend: Python
- ML: Llama 3.2 (3B parameters) via Ollama