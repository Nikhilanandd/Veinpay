from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from app.services.registration import register_user
from app.services.authentication import authenticate_user

router = APIRouter(tags=["Authentication"])


@router.post("/register")
async def register(
    file: UploadFile = File(...),
    user_id: str = Form(...),
):
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")

    image_bytes = await file.read()

    if len(image_bytes) == 0:
        raise HTTPException(status_code=400, detail="Empty image file")

    if len(image_bytes) > 10 * 1024 * 1024:  # 10MB limit
        raise HTTPException(status_code=400, detail="Image too large (max 10MB)")

    result = await register_user(user_id.strip(), image_bytes)
    return {
        "status": "success",
        "message": f"User '{user_id}' registered successfully",
        "data": result,
    }


@router.post("/authenticate")
async def authenticate(
    file: UploadFile = File(...),
):
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")

    image_bytes = await file.read()

    if len(image_bytes) == 0:
        raise HTTPException(status_code=400, detail="Empty image file")

    result = await authenticate_user(image_bytes)
    return {
        "status": "success",
        "message": "Authentication complete",
        "data": result,
    }
