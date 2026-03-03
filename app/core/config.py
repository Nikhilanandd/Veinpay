import os
from dotenv import load_dotenv
from pydantic_settings import BaseSettings

load_dotenv()


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    MONGODB_URL: str = "mongodb://localhost:27017"
    DATABASE_NAME: str = "veinpay"
    SIMILARITY_THRESHOLD: float = 0.85
    CORS_ORIGINS: str = "http://localhost:5173,http://localhost:3000"
    LOG_LEVEL: str = "INFO"
    SECRET_KEY: str = "change-me-in-production"
    APP_VERSION: str = "1.0.0"

    model_config = {"env_file": ".env", "extra": "ignore"}


settings = Settings()
