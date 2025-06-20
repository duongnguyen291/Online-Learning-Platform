# Online Learning Platform – Server (FastAPI)

This is the **AI and backend API server** for the Online Learning Platform. It powers the platform's Retrieval-Augmented Generation (RAG) chatbot, personalized learning path recommendations, and AI-driven advice for students and lecturers.

---

## 🚀 Features

- **RAG Chatbot API**: Upload documents, ask questions, and get answers grounded in your own learning materials
- **Personalized Learning Path**: AI-driven course and skill recommendations based on user progress
- **AI Advisor**: GPT-4-powered advice for learning strategies and skill development
- **Document Ingestion**: Supports `.txt`, `.pdf`, `.doc`, `.docx` uploads for knowledge base expansion
- **MongoDB & ChromaDB**: Persistent storage for user data and vector search
- **FastAPI**: Modern, async Python API with OpenAPI docs

---

## 🏗️ Architecture

- **FastAPI** for REST endpoints
- **MongoDB** for user, course, and progress data
- **ChromaDB** for vector search and RAG
- **LangChain** for document processing and LLM integration
- **OpenAI GPT-4** for advanced AI advice and chat
- **Docker** support for easy deployment

---

## 📂 Project Structure

- `main.py` – FastAPI entry point, service initialization, and route registration
- `routes/` – API endpoints for RAG and learning path
- `services/` – Core business logic: RAG, learning path, AI advisor
- `data/chroma_db/` – ChromaDB vector store files
- `uploads/` – Temporary file uploads for document ingestion

---

## ⚙️ Setup & Installation

### 1. Manual (Local)

1. **Install Python 3.10+**
2. `pip install -r requirements.txt`
3. Set up your `.env` file (see below)
4. Start the server:
   ```bash
   uvicorn main:app --reload
   ```

### 2. Docker

```bash
docker build -t olp-server .
docker run -p 8000:8000 --env-file .env olp-server
```

---

## 🔑 Environment Variables

Create a `.env` file in this directory with:

```
OPENAI_API_KEY=your-openai-key
MONGODB_URL=your-mongodb-uri
```

- `OPENAI_API_KEY` (required): For GPT-4 and embeddings
- `MONGODB_URL` (optional): MongoDB connection string (falls back to Atlas or localhost)

---

## 🛠️ Main Dependencies

- `fastapi`, `uvicorn` – API server
- `langchain`, `langchain-openai`, `langchain-community` – LLM and RAG
- `openai`, `tiktoken` – GPT-4 and embeddings
- `chromadb` – Vector database
- `motor` – Async MongoDB client
- `python-dotenv`, `pydantic`, `SQLAlchemy`, `passlib`, `bcrypt` – Auth, config, and DB

---

## 📚 API Overview

- **Health Check**: `GET /health`
- **RAG**:
  - `POST /rag/upload` – Upload a document for ingestion
  - `POST /rag/query` – Ask a question (with optional context)
  - `POST /rag/context` – Get relevant context for a query
- **Learning Path**:
  - `GET /learning-path/advice/{user_code}` – Get personalized learning advice
  - `GET /learning-path/recommendations/{user_code}` – Get recommended courses

See `/docs` (Swagger UI) or `/redoc` for full OpenAPI documentation after running the server.

---

## 🧠 Services

- **RAG Service**: Handles document ingestion, vectorization, and retrieval-augmented Q&A
- **Learning Path Service**: Analyzes user progress and recommends next steps
- **AI Advisor**: Uses GPT-4 to generate personalized study advice in Vietnamese

---

## 🗄️ Data & Storage

- **MongoDB**: Stores users, courses, progress, etc.
- **ChromaDB**: Stores document embeddings for fast semantic search
- **Uploads**: Temporary storage for user-uploaded files

---

## 🔗 Related Docs

- [Project-level README](../README.md)
- [Client README](../client/README.md)
- [Admin README](../admin/README.md)
- [Lecturer README](../lecturer/README.md)

---

## 📝 Example .env

```
OPENAI_API_KEY=sk-...
MONGODB_URL=mongodb+srv://user:pass@host/db
```

---

## 🤖 Notes

- Requires an OpenAI API key for all AI features
- All endpoints return JSON
- For production, restrict CORS and secure your environment variables

---

## 📞 Support

See the main project README for contact and contribution guidelines.
