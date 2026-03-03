from app.db.database import db
from app.core.logging import logger


async def get_analytics() -> dict:
    """
    Aggregate system analytics from the database.

    Returns:
        Dict with user count, auth stats, success rates, and recent history
    """
    logger.info("Fetching analytics data")

    total_users = db.users.count_documents({})
    total_auths = db.auth_logs.count_documents({})
    successful_auths = db.auth_logs.count_documents({"success": True})
    failed_auths = total_auths - successful_auths
    success_rate = round((successful_auths / total_auths * 100), 2) if total_auths > 0 else 0.0

    # Recent authentications (last 30)
    recent = list(
        db.auth_logs.find({}, {"_id": 0})
        .sort("timestamp", -1)
        .limit(30)
    )
    for r in recent:
        if "timestamp" in r:
            r["timestamp"] = r["timestamp"].isoformat()

    return {
        "total_users": total_users,
        "total_authentications": total_auths,
        "successful_authentications": successful_auths,
        "failed_authentications": failed_auths,
        "success_rate": success_rate,
        "recent_authentications": recent,
    }
