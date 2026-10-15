"""
models.py — SQLAlchemy ORM models.
Tasks and ActivityLogs are scoped per user via user_id.
"""

from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean, ForeignKey, Enum as SAEnum
from sqlalchemy.sql import func
from database import Base


class Task(Base):
    __tablename__ = "tasks"

    id          = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id     = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    title       = Column(String(255), nullable=False, index=True)
    description = Column(Text, nullable=True)
    status      = Column(
        SAEnum("pending", "in-progress", "completed", name="task_status"),
        nullable=False, default="pending", server_default="pending",
    )
    priority    = Column(
        SAEnum("low", "medium", "high", name="task_priority"),
        nullable=False, default="medium", server_default="medium",
    )
    due_date   = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)


class ActivityLog(Base):
    __tablename__ = "activity_logs"

    id         = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id    = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    task_id    = Column(Integer, nullable=False, index=True)
    task_title = Column(String(255), nullable=False)
    action     = Column(String(50), nullable=False)
    detail     = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)


class User(Base):
    __tablename__ = "users"

    id         = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name       = Column(String(100), nullable=False)
    email      = Column(String(255), nullable=False, unique=True, index=True)
    password   = Column(String(255), nullable=False)
    is_active  = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
