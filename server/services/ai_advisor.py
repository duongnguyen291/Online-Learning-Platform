from typing import Dict, Any
import os
from openai import OpenAI

class AIAdvisorService:
    def __init__(self):
        self.client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

    async def generate_advice(self, user_data: Dict[str, Any]) -> str:
        """Generate personalized learning advice using GPT-4"""
        try:
            # Format user data for the prompt
            completed_courses = len(user_data["learning_status"]["completed_courses"])
            in_progress_courses = user_data["learning_status"]["in_progress_courses"]
            total_time = user_data["learning_status"]["total_learning_time"]
            skill_levels = user_data["learning_status"]["skill_levels"]
            
            # Create a detailed context for GPT-4
            context = f"""
Là một cố vấn học tập chuyên nghiệp, hãy phân tích dữ liệu học tập sau và đưa ra lời khuyên chi tiết, cá nhân hóa:

THÔNG TIN HỌC VIÊN:
- Tên: {user_data["user"].get("Name", "Học viên")}
- Số khóa học đã hoàn thành: {completed_courses}
- Các khóa học đang học:
{self._format_in_progress_courses(in_progress_courses)}
- Tổng thời gian học: {total_time} phút
- Các kỹ năng đã học: {', '.join(skill_levels.keys()) if skill_levels else "Chưa có"}

Hãy đưa ra lời khuyên chi tiết về:
1. Chiến lược học tập hiệu quả
2. Quản lý thời gian và tiến độ
3. Phát triển kỹ năng
4. Lộ trình học tập tiếp theo
5. Các tips cụ thể để cải thiện hiệu quả học tập

Lời khuyên cần:
- Cụ thể và thực tế
- Dựa trên dữ liệu học tập của học viên
- Có thể thực hiện ngay
- Tập trung vào điểm mạnh và cải thiện điểm yếu
- Giọng điệu thân thiện, động viên
"""

            # Call GPT-4
            response = self.client.chat.completions.create(
                model="gpt-4-turbo-preview",
                messages=[
                    {"role": "system", "content": "Bạn là một cố vấn học tập chuyên nghiệp với nhiều năm kinh nghiệm trong việc hướng dẫn và tư vấn cho học viên online."},
                    {"role": "user", "content": context}
                ],
                temperature=0.7,
                max_tokens=2000
            )

            return response.choices[0].message.content

        except Exception as e:
            print(f"Error generating AI advice: {str(e)}")
            return self._get_fallback_advice(user_data)

    def _format_in_progress_courses(self, courses: list) -> str:
        """Format in-progress courses for the prompt"""
        if not courses:
            return "Chưa có khóa học nào đang học"
        
        formatted = ""
        for course in courses:
            formatted += f"  + {course['title']} ({course['progress']}% hoàn thành)\n"
            formatted += f"    Thời gian đã học: {course['time_spent']} phút\n"
        return formatted

    def _get_fallback_advice(self, user_data: Dict[str, Any]) -> str:
        """Return fallback advice if AI generation fails"""
        completed = len(user_data["learning_status"]["completed_courses"])
        level = "Beginner"
        if completed >= 7:
            level = "Advanced"
        elif completed >= 3:
            level = "Intermediate"

        return f"""Xin chào {user_data["user"].get("Name", "")}, dựa trên quá trình học tập của bạn:

Với trình độ {level}, đây là một số gợi ý để cải thiện việc học:

1. Tập trung hoàn thành các khóa học hiện tại
2. Duy trì thời gian học tập đều đặn
3. Thực hành nhiều để củng cố kiến thức
4. Tham gia cộng đồng học tập để trao đổi kinh nghiệm

Chúc bạn học tập hiệu quả!""" 