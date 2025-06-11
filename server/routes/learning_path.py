from fastapi import APIRouter, HTTPException, Request
from typing import Dict, Any
import traceback
from services import service_manager

router = APIRouter(prefix="/learning-path", tags=["learning-path"])

@router.get("/debug/user/{user_code}")
async def debug_user_info(request: Request, user_code: str) -> Dict[str, Any]:
    """Debug endpoint to check user existence and details"""
    try:
        print(f"\n=== Debug User Info Request ===")
        print(f"URL: {request.url}")
        print(f"Method: {request.method}")
        print(f"Headers: {request.headers}")
        print(f"User code: {user_code}")
        
        # Get user from database
        db = service_manager.learning_path_service.db
        print(f"Database: {db.name}")
        
        # Try both fields
        print("Searching with UserCode...")
        user = await db.User.find_one({"UserCode": user_code})
        print(f"Result with UserCode: {user}")
        
        if not user:
            print("Searching with userId...")
            user = await db.User.find_one({"userId": user_code})
            print(f"Result with userId: {user}")
            
        if not user:
            # List all users for debugging
            print("User not found, listing all users...")
            all_users = await db.User.find().to_list(length=None)
            user_list = [{"userId": u.get("userId"), "UserCode": u.get("UserCode"), "Name": u.get("Name")} for u in all_users]
            print(f"All users: {user_list}")
            return {
                "status": "error",
                "message": f"User not found: {user_code}",
                "all_users": user_list
            }
            
        # Get progress records
        print("Getting progress records...")
        progress = await db.UserProgress.find({
            "$or": [
                {"userCode": user_code},
                {"userId": user_code}
            ]
        }).to_list(length=None)
        print(f"Found {len(progress) if progress else 0} progress records")
        
        result = {
            "status": "success",
            "user": {
                "userId": user.get("userId"),
                "UserCode": user.get("UserCode"),
                "Name": user.get("Name")
            },
            "progress_count": len(progress) if progress else 0
        }
        print(f"Returning result: {result}")
        return result
        
    except Exception as e:
        print(f"Error in debug_user_info: {str(e)}")
        print(f"Traceback: {traceback.format_exc()}")
        raise HTTPException(
            status_code=500,
            detail=f"Error checking user info: {str(e)}"
        )

@router.get("/advice/{user_code}")
async def get_learning_path_advice(user_code: str) -> Dict[str, Any]:
    try:
        advice = await service_manager.learning_path_service.generate_learning_path_advice(user_code)
        return {"status": "success", "advice": advice}
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        print(f"Error in get_learning_path_advice: {str(e)}")
        print(f"Traceback: {traceback.format_exc()}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to generate learning path advice: {str(e)}"
        )

@router.get("/recommendations/{user_code}")
async def get_course_recommendations(user_code: str) -> Dict[str, Any]:
    try:
        courses = await service_manager.learning_path_service.get_recommended_courses(user_code)
        
        # Convert MongoDB documents to serializable dictionaries
        serializable_courses = []
        for course in courses:
            course_dict = dict(course)
            # Convert ObjectId to string
            if '_id' in course_dict:
                course_dict['_id'] = str(course_dict['_id'])
            serializable_courses.append(course_dict)
            
        return {"status": "success", "courses": serializable_courses}
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        print(f"Error in get_course_recommendations: {str(e)}")
        print(f"Traceback: {traceback.format_exc()}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to get course recommendations: {str(e)}"
        ) 