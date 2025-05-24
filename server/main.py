from fastapi import FastAPI, UploadFile, File, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from routes.rag import router as rag_router
import os
from dotenv import load_dotenv
from services.ragService import rag_service
from typing import Dict, Any

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
async def upload_document(file: UploadFile = File(...)):
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
            result = await rag_service.add_document(file_path)
            
            if result["status"] == "error":
                raise HTTPException(status_code=500, detail=result["message"])
            
            return result
        finally:
            # Clean up temporary file
            if os.path.exists(file_path):
                os.remove(file_path)
                
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/rag/query")
async def query(request: Dict[str, Any] = Body(...)):
    try:
        question = request.get("question")
        context = request.get("context")
        
        if not question:
            raise HTTPException(status_code=400, detail="Question is required")
            
        result = await rag_service.query(question, context)
        
        if result["status"] == "error":
            raise HTTPException(status_code=500, detail=result["message"])
            
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/rag/context")
async def get_context(request: Dict[str, Any] = Body(...)):
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

@app.get("/")
async def root():
    return {
        "message": "Welcome to the Online Learning Platform API",
        "docs_url": "/docs",
        "redoc_url": "/redoc"
    } 