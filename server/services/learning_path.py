from typing import Dict, List, Any
from datetime import datetime
from motor.motor_asyncio import AsyncIOMotorClient
from bson.objectid import ObjectId

class LearningPathService:
    def __init__(self, db_client: AsyncIOMotorClient):
        self.db = db_client.get_default_database()

    async def get_user_details(self, user_id: str) -> Dict:
        """Get detailed user information including enrolled courses and progress"""
        try:
            # Get user basic info from User collection
            user = await self.db.User.find_one({"UserCode": user_id})
            if not user:
                raise ValueError(f"User not found: {user_id}")

            # Get user's progress from UserProgress collection
            progress_records = await self.db.UserProgress.find({
                "userId": user_id
            }).to_list(length=None)

            # Get all relevant course details from Course collection
            course_ids = [p["courseId"] for p in progress_records]
            courses = await self.db.Course.find({
                "CourseCode": {"$in": course_ids}
            }).to_list(length=None)

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
                course = course_details.get(progress["courseId"])
                if not course:
                    continue

                # Track course status
                course_info = {
                    "course_id": progress["courseId"],
                    "title": course["Name"],
                    "category": course["category"],
                    "progress": progress["progress"],
                    "time_spent": progress.get("timeSpent", 0),
                    "last_accessed": progress.get("lastAccessed")
                }

                if progress["status"] == "completed":
                    learning_status["completed_courses"].append(course_info)
                    # Add to skill levels
                    if course.get("skillTags"):
                        for skill in course["skillTags"]:
                            learning_status["skill_levels"][skill] = learning_status["skill_levels"].get(skill, 0) + 1
                elif progress["status"] == "in_progress":
                    learning_status["in_progress_courses"].append(course_info)

                # Track learning time
                learning_status["total_learning_time"] += progress.get("timeSpent", 0)
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

    async def get_recommended_courses(self, user_id: str) -> List[Dict[str, Any]]:
        try:
            user_details = await self.get_user_details(user_id)
            learning_status = user_details["learning_status"]

            # Get current course IDs to exclude
            current_course_ids = [
                c["course_id"] 
                for c in learning_status["completed_courses"] + learning_status["in_progress_courses"]
            ]

            # Build recommendation query
            query = {
                "CourseCode": {"$nin": current_course_ids},
                "Status": "active"
            }

            # If user has preferred categories, prioritize them
            if learning_status["preferred_categories"]:
                query["$or"] = [
                    {"category": {"$in": list(learning_status["preferred_categories"])}},
                    {"skillTags": {"$in": list(learning_status["skill_levels"].keys())}}
                ]

            # Determine appropriate course level based on completed courses
            if len(learning_status["completed_courses"]) < 3:
                query["level"] = "Beginner"
            elif len(learning_status["completed_courses"]) < 7:
                query["level"] = "Intermediate"
            else:
                query["level"] = "Advanced"

            # Get recommendations from Course collection
            recommended_courses = await self.db.Course.find(query).limit(5).to_list(length=None)
            return recommended_courses

        except Exception as e:
            print(f"Error getting recommended courses: {str(e)}")
            raise

    async def generate_learning_path_advice(self, user_id: str) -> str:
        try:
            # Get user details and learning status
            user_details = await self.get_user_details(user_id)
            user = user_details["user"]
            learning_status = user_details["learning_status"]
            
            # Get course recommendations
            recommended_courses = await self.get_recommended_courses(user_id)

            # Generate personalized advice
            advice = f"Xin chào {user['Name']}, dựa trên quá trình học tập của bạn:\n\n"

            # Current progress summary
            if learning_status["in_progress_courses"]:
                advice += "Các khóa học đang theo học:\n"
                for course in learning_status["in_progress_courses"]:
                    advice += f"- {course['title']} ({course['progress']}% hoàn thành)\n"
                    advice += f"  Thời gian đã học: {course['time_spent']} phút\n"
                    if course['last_accessed']:
                        advice += f"  Truy cập gần nhất: {course['last_accessed'].strftime('%d/%m/%Y %H:%M')}\n"
                advice += "\n"

            # Skills analysis
            if learning_status["skill_levels"]:
                advice += "Kỹ năng đã tích lũy:\n"
                for skill, level in learning_status["skill_levels"].items():
                    advice += f"- {skill}: {'⭐' * level}\n"
                advice += "\n"

            # Learning time stats
            total_hours = learning_status["total_learning_time"] / 60
            advice += f"Tổng thời gian học: {total_hours:.1f} giờ\n\n"

            # Recommendations
            if recommended_courses:
                advice += "Khóa học được đề xuất:\n"
                for course in recommended_courses:
                    advice += f"- {course['Name']} (Cấp độ: {course['level']})\n"
                    advice += f"  Danh mục: {course['category']}\n"
                    if course.get('skillTags'):
                        advice += f"  Kỹ năng sẽ học: {', '.join(course['skillTags'])}\n"
                    if course.get('whatLearn'):
                        advice += f"  Bạn sẽ học được: {', '.join(course['whatLearn'][:3])}...\n"
                    advice += f"  Thời lượng: {course['totalLength']}\n"
                    advice += f"  Giá gốc: ${course['originalPrice']} - Giá ưu đãi: ${course['discountedPrice']}\n"
                    if course.get('rating'):
                        advice += f"  Đánh giá: {course['rating']}/5 ({course.get('reviews', 0)} lượt đánh giá)\n"
                    advice += "\n"

            # Learning suggestions
            advice += "Lời khuyên:\n"
            if learning_status["in_progress_courses"]:
                advice += "- Hãy hoàn thành các khóa học đang theo học trước khi bắt đầu khóa mới\n"
            if len(learning_status["completed_courses"]) < 3:
                advice += "- Tập trung vào các khóa học cơ bản để xây dựng nền tảng vững chắc\n"
            else:
                advice += "- Bạn đã có nền tảng tốt, có thể thử thách với các khóa học nâng cao\n"
            advice += "- Duy trì thời gian học tập đều đặn để đạt hiệu quả tốt nhất\n"

            return advice
        except Exception as e:
            print(f"Error generating learning path advice: {str(e)}")
            raise

# Create singleton instance
learning_path_service = None

def init_learning_path_service(db_client: AsyncIOMotorClient):
    global learning_path_service
    learning_path_service = LearningPathService(db_client)
    return learning_path_service 