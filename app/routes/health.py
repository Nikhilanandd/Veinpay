from fastapi import APIRouter

router = APIRouter(tags=["Health"])


@router.get("/health")
async def health_check():
    return {
        "status": "success",
        "message": "VeinPay API is running",
        "data": {"version": "1.0.0"},
    }
