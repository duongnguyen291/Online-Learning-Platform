from fastapi import APIRouter, HTTPException
from services.learning_path import learning_path_service
from typing import Dict, Any

router = APIRouter()

@router.get("/advice/{user_id}")
async def get_learning_path_advice(user_id: str) -> Dict[str, Any]:
    try:
        advice = await learning_path_service.generate_learning_path_advice(user_id)
        return {"status": "success", "advice": advice}
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to generate learning path advice: {str(e)}"
        )

@router.get("/recommendations/{user_id}")
async def get_course_recommendations(user_id: str) -> Dict[str, Any]:
    try:
        courses = await learning_path_service.get_recommended_courses(user_id)
        return {"status": "success", "courses": courses}
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to get course recommendations: {str(e)}"
        ) 