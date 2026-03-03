import numpy as np
import cv2
from datetime import datetime, timezone
from app.utils.preprocess import preprocess_image
from app.utils.extract_vein import extract_vein_pattern
from app.utils.mobilenet import get_embedding
from app.utils.similarity import cosine_similarity
from app.db.database import db
from app.core.config import settings
from app.core.logging import logger


def _log_auth(user_id: str | None, success: bool, similarity: float):
    """Log an authentication attempt to the database."""
    db.auth_logs.insert_one({
        "user_id": user_id,
        "success": success,
        "similarity_score": similarity,
        "timestamp": datetime.now(timezone.utc),
    })


async def authenticate_user(image_bytes: bytes) -> dict:
    """
    Full authentication pipeline: decode → preprocess → extract → embed → match against all users.

    Args:
        image_bytes: Raw image bytes from upload

    Returns:
        Dict with authentication result including match status, score, and matched user
    """
    logger.info("Starting authentication")

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
    new_embedding = get_embedding(gabor_out)

    # Compare against all stored embeddings
    users = list(db.users.find({}, {"_id": 0, "user_id": 1, "embedding": 1}))
    if not users:
        _log_auth(None, False, 0.0)
        return {
            "authenticated": False,
            "similarity_score": 0.0,
            "matched_user": None,
        }

    best_score = -1.0
    best_user = None

    for user in users:
        stored_embedding = np.array(user["embedding"], dtype=np.float32)
        score = cosine_similarity(new_embedding, stored_embedding)

        if score > best_score:
            best_score = score
            best_user = user["user_id"]

    authenticated = best_score >= settings.SIMILARITY_THRESHOLD

    # Log the attempt
    _log_auth(
        user_id=best_user if authenticated else None,
        success=authenticated,
        similarity=round(best_score, 4),
    )

    logger.info(
        f"Authentication result: {'SUCCESS' if authenticated else 'REJECTED'} "
        f"(score={best_score:.4f}, user={best_user})"
    )

    return {
        "authenticated": authenticated,
        "similarity_score": round(best_score, 4),
        "matched_user": best_user if authenticated else None,
    }
