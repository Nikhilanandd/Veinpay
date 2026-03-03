import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.core.config import settings
from app.core.logging_config import setup_logging
from app.routes import health_router, auth_router, analytics_router
from app.db.database import db

setup_logging()
logger = logging.getLogger("veinpay")


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info(f"Starting VeinPay v{settings.APP_VERSION}")
    db.connect()
    yield
    db.disconnect()
    logger.info("VeinPay shutdown complete")


app = FastAPI(
    title="VeinPay API",
    description="Biometric vein authentication system",
    version=settings.APP_VERSION,
    lifespan=lifespan,
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS.split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routes
app.include_router(health_router)
app.include_router(auth_router)
app.include_router(analytics_router)


# Global exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled error: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={
            "status": "error",
            "message": "Internal server error",
            "data": None,
        },
    )
