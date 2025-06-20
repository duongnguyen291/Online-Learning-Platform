from typing import Dict, List, Any
from datetime import datetime
from motor.motor_asyncio import AsyncIOMotorClient
from bson.objectid import ObjectId

class LearningPathService:
    def __init__(self, db_client: AsyncIOMotorClient):
        self.db = db_client.get_default_database()

    async def generate_learning_path_advice(self, user_code: str) -> str:
        """Generate personalized learning path advice for a user"""
        try:
            # Get user details including progress
            user_details = await self.get_user_details(user_code)
            if not user_details or not user_details.get("user"):
                raise ValueError(f"User not found: {user_code}")

            user = user_details["user"]
            learning_status = user_details["learning_status"]

            # Get recommended courses
            recommended_courses = await self.get_recommended_courses(user_code)

            # Calculate learning metrics
            total_courses = len(learning_status["completed_courses"]) + len(learning_status["in_progress_courses"])
            completion_rate = len(learning_status["completed_courses"]) / total_courses if total_courses > 0 else 0
            avg_time_per_course = learning_status["total_learning_time"] / total_courses if total_courses > 0 else 0

            # Get AI-generated advice
            from services import service_manager
            ai_advice = await service_manager.ai_advisor_service.generate_advice(user_details)

            # Format the advice string
            advice = f"Xin chào {user.get('Name', '')}, dựa trên quá trình học tập của bạn:\n\n"

            # Current progress summary
            if learning_status["in_progress_courses"]:
                advice += "Các khóa học đang theo học:\n"
                for course in learning_status["in_progress_courses"]:
                    advice += f"- {course['title']} ({course['progress']}% hoàn thành)\n"
                    advice += f"  Thời gian đã học: {course['time_spent']} phút\n"
                    if course['last_accessed']:
                        advice += f"  Truy cập gần nhất: {course['last_accessed'].strftime('%d/%m/%Y %H:%M')}\n"
                advice += "\n"

            # Learning time stats
            total_hours = learning_status["total_learning_time"] / 60
            advice += f"Tổng thời gian học: {total_hours:.1f} giờ\n\n"

            # Add AI-generated advice
            advice += ai_advice

            return advice

        except Exception as e:
            print(f"Error generating learning path advice: {str(e)}")
            raise

    def _generate_suggested_path(self, learning_status: Dict, recommended_courses: List) -> List[Dict]:
        """Generate a suggested learning path based on user's status and recommended courses"""
        current_level = "Beginner"
        if len(learning_status["completed_courses"]) >= 7:
            current_level = "Advanced"
        elif len(learning_status["completed_courses"]) >= 3:
            current_level = "Intermediate"

        # Create a structured learning path
        path = []
        
        # Add in-progress courses first
        for course in learning_status["in_progress_courses"]:
            path.append({
                "step": len(path) + 1,
                "type": "current",
                "course": course["course_id"],
                "status": "in_progress",
                "priority": "high",
                "estimated_completion": "2-3 weeks"  # This could be calculated based on progress
            })

        # Add recommended courses
        for course in recommended_courses[:3]:  # Top 3 recommendations
            path.append({
                "step": len(path) + 1,
                "type": "recommended",
                "course": course["CourseCode"],
                "status": "recommended",
                "priority": "medium",
                "estimated_completion": course.get("EstimatedDuration", "4-6 weeks")
            })

        return path

    async def get_user_details(self, user_code: str) -> Dict:
        """Get detailed user information including enrolled courses and progress"""
        try:
            # Get user basic info from User collection
            print(f"Looking for user with code: {user_code}")
            
            # Try to find user with UserCode first
            user = await self.db.User.find_one({"UserCode": user_code})
            if not user:
                # If not found, try with userId
                print(f"User not found with UserCode, trying userId...")
                user = await self.db.User.find_one({"userId": user_code})
                
            print(f"Found user: {user}")
            
            if not user:
                # Print all users for debugging
                all_users = await self.db.User.find().to_list(length=None)
                print("All users in database:")
                for u in all_users:
                    print(f"User: {u.get('userId')} / {u.get('UserCode')} - {u.get('Name')}")
                raise ValueError(f"User not found with code: {user_code}")

            # Get user's progress from UserProgress collection
            print(f"Getting progress records for user: {user_code}")
            progress_records = await self.db.UserProgress.find({
                "$or": [
                    {"UserCode": user_code},  # Changed to match database schema
                    {"userId": user_code}
                ]
            }).to_list(length=None)
            print(f"Found progress records: {progress_records}")

            if not progress_records:
                # Return basic user info if no progress records found
                return {
                    "user": user,
                    "learning_status": {
                        "completed_courses": [],
                        "in_progress_courses": [],
                        "total_learning_time": 0,
                        "skill_levels": {},
                        "preferred_categories": set()
                    }
                }

            # Get all relevant course details from Course collection
            course_codes = [p.get("CourseCode") for p in progress_records if p.get("CourseCode")]  # Changed to match database schema
            print(f"Looking for courses with codes: {course_codes}")
            courses = await self.db.Course.find({
                "CourseCode": {"$in": course_codes}
            }).to_list(length=None)
            print(f"Found courses: {courses}")

            # Organize course information
            course_details = {}
            for course in courses:
                course_details[course["CourseCode"]] = course

            # Organize user's learning status
            learning_status = {
                "completed_courses": [],
                "in_progress_courses": [],
                "total_learning_time": 0,
                "skill_levels": {},
                "preferred_categories": set()
            }

            for progress in progress_records:
                course = course_details.get(progress.get("CourseCode"))  # Changed to match database schema
                if not course:
                    continue

                # Get progress value handling both cases
                progress_value = progress.get("progress", progress.get("Progress", 0))
                status = progress.get("status", progress.get("Status", "in_progress"))
                time_spent = progress.get("timeSpent", progress.get("TimeSpent", 0))
                last_accessed = progress.get("lastAccessed", progress.get("LastAccessed"))

                # Track course status
                course_info = {
                    "course_id": progress.get("CourseCode"),  # Changed to match database schema
                    "title": course["Name"],
                    "category": course.get("category", "Unknown"),
                    "progress": progress_value,
                    "time_spent": time_spent,
                    "last_accessed": last_accessed
                }

                if status.lower() == "completed":
                    learning_status["completed_courses"].append(course_info)
                    # Add to skill levels
                    if course.get("skillTags"):
                        for skill in course["skillTags"]:
                            learning_status["skill_levels"][skill] = learning_status["skill_levels"].get(skill, 0) + 1
                else:
                    learning_status["in_progress_courses"].append(course_info)

                # Track learning time
                learning_status["total_learning_time"] += time_spent
                # Track preferred categories
                if course.get("category"):
                    learning_status["preferred_categories"].add(course["category"])

            return {
                "user": user,
                "learning_status": learning_status
            }
        except Exception as e:
            print(f"Error getting user details: {str(e)}")
            raise

    async def get_recommended_courses(self, user_code: str) -> List[Dict[str, Any]]:
        try:
            user_details = await self.get_user_details(user_code)
            learning_status = user_details["learning_status"]

            # Get current course IDs to exclude
            current_course_codes = [
                c["course_id"] 
                for c in learning_status["completed_courses"] + learning_status["in_progress_courses"]
            ]

            # Build base query - only exclude current courses and ensure active status
            query = {
                "CourseCode": {"$nin": current_course_codes},
                "Status": "Active"
            }

            # Add preferred categories and skill tags as optional criteria
            if learning_status["preferred_categories"]:
                # Use $or to match either category or skill tags, but don't make it required
                query["$or"] = [
                    {"category": {"$in": list(learning_status["preferred_categories"])}},
                    {"skillTags": {"$in": list(learning_status["skill_levels"].keys() if learning_status["skill_levels"] else [])}}
                ]

            # Get recommendations from Course collection
            recommended_courses = await self.db.Course.find(query).limit(5).to_list(length=None)
            
            # If no courses found with filters, try without category/skill filters
            if not recommended_courses:
                basic_query = {
                    "Status": "Active",
                    "CourseCode": {"$nin": current_course_codes}
                }
                recommended_courses = await self.db.Course.find(basic_query).limit(5).to_list(length=None)

            return recommended_courses

        except Exception as e:
            print(f"Error getting recommended courses: {str(e)}")
            raise

# Create singleton instance
learning_path_service = None

def init_learning_path_service(db_client: AsyncIOMotorClient) -> LearningPathService:
    """Initialize the learning path service with a database client"""
    global learning_path_service
    if learning_path_service is None:
        learning_path_service = LearningPathService(db_client)
    return learning_path_service 