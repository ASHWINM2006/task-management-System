"""
main.py
FastAPI application entry point.

Start with:
    uvicorn main:app --reload --port 8000
"""

from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy.exc import IntegrityError

import models
from database import engine
from routes.tasks import router as tasks_router
from routes.activity import router as activity_router
from routes.auth_routes import router as auth_router

# Create tables on startup (Alembic handles schema versioning;
# this ensures a fresh DB works without running migrations manually).
# During tests the conftest overrides get_db BEFORE any request, so this
# create_all call on the real engine is harmless — it runs once at import.
models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Task Management System",
    description="Production-style Task Management API with strict status-transition enforcement.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
)

# ── CORS ──────────────────────────────────────────────────────────────────
import os
cors_env = os.getenv("CORS_ORIGINS", "")
allowed_origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]
if cors_env:
    allowed_origins.extend([o.strip() for o in cors_env.split(",") if o.strip()])

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins if cors_env != "*" else ["*"],
    allow_origin_regex=r"https?://.*" if os.getenv("ALLOW_ALL_ORIGINS", "false").lower() == "true" else None,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Global error handlers ─────────────────────────────────────────────────

@app.exception_handler(IntegrityError)
async def integrity_handler(request: Request, exc: IntegrityError):
    return JSONResponse(status_code=409,
                        content={"detail": "Database integrity error."})


@app.exception_handler(Exception)
async def generic_handler(request: Request, exc: Exception):
    if isinstance(exc, HTTPException):
        raise exc
    return JSONResponse(status_code=500,
                        content={"detail": "An unexpected server error occurred."})


# ── Routers ───────────────────────────────────────────────────────────────
app.include_router(auth_router)
app.include_router(tasks_router)
app.include_router(activity_router)


@app.get("/", tags=["Health"])
def root():
    return {"status": "ok", "message": "Task Management API is running."}


@app.get("/health", tags=["Health"])
def health():
    return {"status": "healthy"}
