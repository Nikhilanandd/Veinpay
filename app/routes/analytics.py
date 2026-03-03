from fastapi import APIRouter
from app.services.analytics import get_analytics

router = APIRouter(tags=["Analytics"])


@router.get("/analytics")
async def analytics():
    result = await get_analytics()
    return result
