from pydantic import BaseModel, Field
from datetime import datetime


class UserDocument(BaseModel):
    """Represents a user document in MongoDB."""

    user_id: str = Field(..., min_length=1, max_length=100, description="Unique user ID")
    embedding: list[float] = Field(..., description="MobileNetV2 embedding vector")
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)
