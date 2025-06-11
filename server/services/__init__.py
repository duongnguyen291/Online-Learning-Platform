"""
Services package for the Online Learning Platform API.
"""

from typing import Optional
from motor.motor_asyncio import AsyncIOMotorClient
from .learning_path import LearningPathService
from .ai_advisor import AIAdvisorService

class ServiceManager:
    _instance = None
    learning_path_service: Optional[LearningPathService] = None
    ai_advisor_service: Optional[AIAdvisorService] = None

    @classmethod
    def get_instance(cls):
        if cls._instance is None:
            cls._instance = ServiceManager()
        return cls._instance

    def init_services(self, db_client: AsyncIOMotorClient):
        """Initialize all services with the database client"""
        self.learning_path_service = LearningPathService(db_client)
        self.ai_advisor_service = AIAdvisorService()

service_manager = ServiceManager.get_instance() 