from fastapi import FastAPI, UploadFile, File, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from routes.rag import router as rag_router
from routes.learning_path import router as learning_path_router
import os
from dotenv import load_dotenv
from services.ragService import rag_service
from services import service_manager
from motor.motor_asyncio import AsyncIOMotorClient
from typing import Dict, Any
import traceback
import uvicorn

# Load environment variables
load_dotenv()

# Check for required environment variables
required_env_vars = ["OPENAI_API_KEY"]
missing_vars = [var for var in required_env_vars if not os.getenv(var)]
if missing_vars:
    raise ValueError(f"Missing required environment variables: {', '.join(missing_vars)}")

# MongoDB setup with fallback options
MONGODB_URLS = [
    os.getenv("MONGODB_URL"),  # Try environment variable first
    "mongodb+srv://duong291:duong291@test0.lxws5.mongodb.net/OnlineLearningPlatform?retryWrites=true&w=majority&appName=Cluster0",  # MongoDB Atlas URL
    "mongodb://localhost:27017/online_learning_platform",  # Try localhost hostname
]

# Try each MongoDB URL until one works
db_client = None
last_error = None

for url in MONGODB_URLS:
    if not url:
        continue
    try:
        print(f"Attempting to connect to MongoDB at: {url}")
        db_client = AsyncIOMotorClient(
            url,
            serverSelectionTimeoutMS=30000,  # Increased timeout
            connectTimeoutMS=30000,
            socketTimeoutMS=30000,
            maxPoolSize=50,
            minPoolSize=10,
            retryWrites=True,
            ssl=True,
            tlsAllowInvalidCertificates=True,  # Only for development
            directConnection=False,  # Important for Atlas
        )
        # Quick connection test
        db = db_client.get_default_database()
        break
    except Exception as e:
        last_error = e
        print(f"Failed to connect to {url}: {str(e)}")
        if db_client:
            db_client.close()
            db_client = None

if not db_client:
    raise ValueError(f"Could not connect to MongoDB. Last error: {last_error}")

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
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["*"]
)

# Initialize services with proper error handling
try:
    service_manager.init_services(db_client)
except Exception as e:
    print(f"Error initializing services: {e}")
    raise

# Remove the /api prefix from the router as it's already in the route paths
app.include_router(rag_router)
app.include_router(learning_path_router)

# Debug route to verify API is working
@app.get("/health")
async def health_check():
    return {"status": "ok", "message": "API is running"}

@app.on_event("startup")
async def startup_db_client():
    try:
        # Verify database connection
        print("Testing database connection...")
        await db_client.admin.command('ping')
        print("Successfully connected to MongoDB")
        
        # Print available databases and collections for debugging
        print("Fetching database information...")
        database_names = await db_client.list_database_names()
        print(f"Available databases: {database_names}")
        
        db = db_client.get_default_database()
        print(f"Selected database: {db.name}")
        collection_names = await db.list_collection_names()
        print(f"Collections in database: {collection_names}")

        # Test specific collection access
        print("Testing collection access...")
        user_count = await db.User.count_documents({})
        print(f"Found {user_count} users in database")
        
        print("Services initialized successfully")

    except Exception as e:
        print(f"Failed to initialize application: {str(e)}")
        print(f"Full error traceback:\n{traceback.format_exc()}")
        raise e

@app.on_event("shutdown")
async def shutdown_db_client():
    if db_client:
        db_client.close()
        print("MongoDB connection closed")

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

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="debug"
    ) 