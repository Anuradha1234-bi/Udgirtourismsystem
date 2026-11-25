from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.core.config import settings
from app.api.router import api_router
from app.database.init_db import init_db
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("explore_udgir")

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: ensure tables and seed data are ready
    logger.info("Initializing database and verifying seed data...")
    init_db()
    logger.info("Explore Udgir API is online and ready!")
    yield
    # Shutdown logic if any
    logger.info("Explore Udgir API is shutting down...")

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Official Digital Tourism Portal REST API for Udgir, Latur District, Maharashtra.",
    lifespan=lifespan
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount all API endpoints
app.include_router(api_router, prefix=settings.API_V1_STR)

@app.exception_handler(Exception)
async def generic_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled server error on {request.method} {request.url.path}: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"detail": "An internal server error occurred. Please contact the administrator."}
    )

@app.get("/api/health", tags=["Health"])
def health_check():
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "database": "connected"
    }

@app.get("/", tags=["Root"])
def root():
    return {
        "message": "Welcome to Explore Udgir Tourism API",
        "documentation": "/docs",
        "health": "/api/health"
    }
