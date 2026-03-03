import numpy as np
import cv2
from datetime import datetime, timezone
from app.utils.preprocess import preprocess_image
from app.utils.extract_vein import extract_vein_pattern
from app.utils.mobilenet import get_embedding
from app.db.database import db
from app.core.logging import logger


async def register_user(user_id: str, image_bytes: bytes) -> dict:
    """
    Full registration pipeline: decode image → preprocess → extract veins → embed → store.

    Args:
        user_id: Unique identifier for the user
        image_bytes: Raw image bytes from upload

    Returns:
        Dict with registration result
    """
    logger.info(f"Starting registration for user: {user_id}")

    # Decode image
    np_img = np.frombuffer(image_bytes, np.uint8)
    img = cv2.imdecode(np_img, cv2.IMREAD_COLOR)
    if img is None:
        raise ValueError("Could not decode the uploaded image")

    # Preprocess
    gray = preprocess_image(img)

    # Extract vein pattern
    _, gabor_out, _ = extract_vein_pattern(gray)

    # Generate embedding
    embedding = get_embedding(gabor_out).tolist()

    # Store in database
    db.users.update_one(
        {"user_id": user_id},
        {
            "$set": {
                "user_id": user_id,
                "embedding": embedding,
                "updated_at": datetime.now(timezone.utc),
            },
            "$setOnInsert": {
                "created_at": datetime.now(timezone.utc),
            },
        },
        upsert=True,
    )

    logger.info(f"Registration successful for user: {user_id}, embedding size: {len(embedding)}")

    return {
        "user_id": user_id,
        "embedding_length": len(embedding),
    }
