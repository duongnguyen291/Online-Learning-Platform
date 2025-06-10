from fastapi import FastAPI, UploadFile, File, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from routes.rag import router as rag_router
import os
from dotenv import load_dotenv
from services.ragService import rag_service
from typing import Dict, Any
from datetime import datetime
from models.userKnowledge import UserKnowledge

# Load environment variables
load_dotenv()

# Check for required environment variables
if not os.getenv("OPENAI_API_KEY"):
    raise ValueError("OPENAI_API_KEY environment variable is required")

app = FastAPI(
    title="Online Learning Platform API",
    description="API for the Online Learning Platform's RAG-enabled chatbot",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(rag_router)

# Ensure upload directory exists
UPLOAD_DIR = "./uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@app.post("/rag/upload")
async def upload_document(
    file: UploadFile = File(...),
    user_id: str = None,
    is_private: bool = True
):
    """
    Upload a document to the RAG system.
    If user_id is provided and is_private is True, the document will be added to user's personal knowledge base.
    Otherwise, it will be added to the global knowledge base.
    """
    try:
        # Validate file type
        allowed_extensions = ['.txt', '.pdf', '.doc', '.docx']
        file_ext = os.path.splitext(file.filename)[1].lower()
        
        if file_ext not in allowed_extensions:
            raise HTTPException(
                status_code=400,
                detail=f"File type not supported. Allowed types: {', '.join(allowed_extensions)}"
            )

        # Save file temporarily
        file_path = os.path.join(UPLOAD_DIR, file.filename)
        try:
            with open(file_path, "wb") as buffer:
                content = await file.read()
                buffer.write(content)
            
            # Process document with RAG
            result = await rag_service.add_document(
                file_path,
                user_id=user_id if is_private else None
            )
            
            if result["status"] == "error":
                raise HTTPException(status_code=500, detail=result["message"])
            
            # If user_id is provided, update their knowledge profile
            if user_id:
                await UserKnowledge.findOneAndUpdate(
                    { "userId": user_id },
                    {
                        "$push": {
                            "documents": {
                                "title": file.filename,
                                "fileHash": result["doc_id"],
                                "fileType": file_ext,
                                "uploadDate": datetime.now(),
                                "metadata": {}
                            }
                        }
                    },
                    { "upsert": True }
                )
            
            return result
        finally:
            # Clean up temporary file
            if os.path.exists(file_path):
                os.remove(file_path)
                
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/rag/documents/{doc_id}")
async def remove_document(doc_id: str):
    """
    Remove a document from the RAG system by its ID.
    """
    result = await rag_service.remove_document(doc_id)
    if result["status"] == "error":
        raise HTTPException(status_code=404 if "not found" in result["message"].lower() else 500, 
                          detail=result["message"])
    return result

@app.get("/rag/documents")
async def list_documents():
    """
    List all documents in the RAG system.
    """
    result = await rag_service.list_documents()
    if result["status"] == "error":
        raise HTTPException(status_code=500, detail=result["message"])
    return result

@app.post("/rag/query")
async def query(
    request: Dict[str, Any] = Body(...),
    user_id: str = None
):
    """
    Query the RAG system with a question.
    If user_id is provided, the system will search through both the user's personal knowledge base
    and the global knowledge base.
    """
    try:
        question = request.get("question")
        context = request.get("context")
        
        if not question:
            raise HTTPException(status_code=400, detail="Question is required")
            
        result = await rag_service.query(question, user_id, context)
        
        if result["status"] == "error":
            raise HTTPException(status_code=500, detail=result["message"])
            
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/rag/context")
async def get_context(request: Dict[str, Any] = Body(...)):
    """
    Get relevant context from the RAG system for a given query.
    The system will search through all uploaded documents to find relevant passages.
    """
    try:
        query = request.get("query")
        if not query:
            raise HTTPException(status_code=400, detail="Query is required")
            
        result = await rag_service.get_relevant_context(query)
        
        if result["status"] == "error":
            raise HTTPException(status_code=500, detail=result["message"])
            
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/rag/suggest-learning-path/{user_id}")
async def suggest_learning_path(user_id: str):
    """
    Generate a personalized learning path suggestion based on user's profile,
    learning history, and knowledge base.
    """
    try:
        # Get user knowledge from database
        user_knowledge = await UserKnowledge.findOne({ "userId": user_id })
        if not user_knowledge:
            raise HTTPException(status_code=404, detail="User knowledge profile not found")
            
        result = await rag_service.suggest_learning_path(user_id, user_knowledge)
        
        if result["status"] == "error":
            raise HTTPException(status_code=500, detail=result["message"])
            
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/")
async def root():
    return {
        "message": "Welcome to the Online Learning Platform API",
        "docs_url": "/docs",
        "redoc_url": "/redoc"
    } 