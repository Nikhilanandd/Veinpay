from pydantic import BaseModel
from typing import Any


class StandardResponse(BaseModel):
    """Standardized API response format."""

    status: str  # "success" or "error"
    message: str
    data: Any = None


class RegisterResponse(BaseModel):
    """Response data for registration."""

    user_id: str
    embedding_length: int


class AuthenticateResponse(BaseModel):
    """Response data for authentication."""

    authenticated: bool
    similarity_score: float
    matched_user: str | None = None


class AnalyticsResponse(BaseModel):
    """Response data for analytics."""

    total_users: int
    total_authentications: int
    successful_authentications: int
    failed_authentications: int
    success_rate: float
    recent_authentications: list[dict] = []


class HealthResponse(BaseModel):
    """Health check response."""

    status: str
    version: str
    database: str
