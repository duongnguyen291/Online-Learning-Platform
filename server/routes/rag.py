from fastapi import APIRouter, UploadFile, File, HTTPException, Body
from typing import Dict, Any
import shutil
import os
from tempfile import NamedTemporaryFile
from services.ragService import rag_service

router = APIRouter(
    prefix="/api/rag",
    tags=["rag"],
    responses={404: {"description": "Not found"}},
)

@router.post("/upload")
async def upload_document(file: UploadFile = File(...)) -> Dict[str, Any]:
    try:
        # Save uploaded file to temporary location
        with NamedTemporaryFile(delete=False, suffix=os.path.splitext(file.filename)[1]) as temp_file:
            shutil.copyfileobj(file.file, temp_file)
            temp_path = temp_file.name

        # Process the document
        result = await rag_service.add_document(temp_path)
        
        # Clean up temporary file
        os.unlink(temp_path)
        
        if result["status"] == "error":
            raise HTTPException(status_code=400, detail=result["message"])
            
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/query")
async def query_rag(request_data: Dict[str, Any] = Body(...)) -> Dict[str, Any]:
    try:
        print(f"Request data: {request_data}")
        message = request_data.get("message")
        context = request_data.get("context", {})
        
        if not message:
            raise HTTPException(status_code=400, detail="Message is required")
            
        result = await rag_service.query(message=message, context=context)
        
        if result["status"] == "error":
            raise HTTPException(status_code=500, detail=result["message"])
            
        return result
    except Exception as e:
        print(f"Error in query endpoint: {str(e)}")
        print(f"Request data: {request_data}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@router.get("/context")
async def get_context(query: str) -> Dict[str, Any]:
    try:
        if not query:
            raise HTTPException(status_code=400, detail="Query parameter is required")
            
        result = await rag_service.get_relevant_context(query)
        
        if result["status"] == "error":
            raise HTTPException(status_code=400, detail=result["message"])
            
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 