"""
schemas.py
Pydantic v2 request/response schemas.
"""

from __future__ import annotations
from datetime import datetime
from enum import Enum
from typing import List, Optional

from pydantic import BaseModel, Field, field_validator


# ── Enums ─────────────────────────────────────────────────────────────────

class TaskStatus(str, Enum):
    pending     = "pending"
    in_progress = "in-progress"
    completed   = "completed"


class TaskPriority(str, Enum):
    low    = "low"
    medium = "medium"
    high   = "high"


# ── Task schemas ──────────────────────────────────────────────────────────

class TaskBase(BaseModel):
    title:       str            = Field(..., min_length=1, max_length=255)
    description: Optional[str] = Field(None)
    priority:    TaskPriority   = Field(TaskPriority.medium)
    due_date:    Optional[datetime] = Field(None)

    @field_validator("title")
    @classmethod
    def title_not_blank(cls, v: str) -> str:
        if not v.strip():
            raise ValueError("title must not be blank")
        return v.strip()


class TaskCreate(TaskBase):
    status: TaskStatus = Field(TaskStatus.pending)


class TaskUpdate(BaseModel):
    title:       Optional[str]          = Field(None, min_length=1, max_length=255)
    description: Optional[str]          = None
    status:      Optional[TaskStatus]   = None
    priority:    Optional[TaskPriority] = None
    due_date:    Optional[datetime]     = None

    @field_validator("title")
    @classmethod
    def title_not_blank(cls, v: Optional[str]) -> Optional[str]:
        if v is not None and not v.strip():
            raise ValueError("title must not be blank")
        return v.strip() if v else v


class TaskResponse(TaskBase):
    id:         int
    status:     TaskStatus
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class TaskListResponse(BaseModel):
    tasks:       List[TaskResponse]
    total:       int
    page:        int
    page_size:   int
    total_pages: int


# ── Activity log schemas ──────────────────────────────────────────────────

class ActivityLogResponse(BaseModel):
    id:         int
    task_id:    int
    task_title: str
    action:     str
    detail:     Optional[str]
    created_at: datetime

    model_config = {"from_attributes": True}


class ActivityLogListResponse(BaseModel):
    logs:  List[ActivityLogResponse]
    total: int


# ── Generic ───────────────────────────────────────────────────────────────

class MessageResponse(BaseModel):
    message: str


class ErrorResponse(BaseModel):
    detail: str
