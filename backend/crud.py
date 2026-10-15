"""
crud.py — Database access layer.
Every function accepts user_id and filters data to that user only.
No user can ever read, edit, or delete another user's tasks.
"""

from datetime import datetime, timezone, timedelta
from typing import Optional

from sqlalchemy import or_, asc, desc
from sqlalchemy.orm import Session

import models
import schemas
from services.status_service import validate_status_transition


# ── Activity log helper ────────────────────────────────────────────────────

def _log(db: Session, user_id: int, task_id: int, task_title: str,
         action: str, detail: Optional[str] = None) -> None:
    db.add(models.ActivityLog(
        user_id=user_id,
        task_id=task_id,
        task_title=task_title,
        action=action,
        detail=detail,
    ))
    db.flush()


# ── Task CRUD ──────────────────────────────────────────────────────────────

def create_task(db: Session, data: schemas.TaskCreate, user_id: int) -> models.Task:
    task = models.Task(
        user_id=user_id,
        title=data.title,
        description=data.description,
        status=data.status.value,
        priority=data.priority.value,
        due_date=data.due_date,
    )
    db.add(task)
    db.flush()
    _log(db, user_id, task.id, task.title, "created",
         f"Created with status '{task.status}'")
    db.commit()
    db.refresh(task)
    return task


def get_task(db: Session, task_id: int, user_id: int) -> Optional[models.Task]:
    """Return a task only if it belongs to user_id."""
    return (
        db.query(models.Task)
        .filter(models.Task.id == task_id, models.Task.user_id == user_id)
        .first()
    )


def get_tasks(
    db: Session,
    user_id: int,
    search: Optional[str] = None,
    status_filter: Optional[str] = None,
    priority_filter: Optional[str] = None,
    sort_by: str = "created_at",
    sort_order: str = "desc",
    page: int = 1,
    page_size: int = 20,
) -> tuple[list[models.Task], int]:
    q = db.query(models.Task).filter(models.Task.user_id == user_id)

    if search:
        pat = f"%{search}%"
        q = q.filter(or_(
            models.Task.title.ilike(pat),
            models.Task.description.ilike(pat),
        ))
    if status_filter:
        q = q.filter(models.Task.status == status_filter)
    if priority_filter:
        q = q.filter(models.Task.priority == priority_filter)

    total = q.count()
    col_map = {
        "created_at": models.Task.created_at,
        "title":      models.Task.title,
        "due_date":   models.Task.due_date,
        "priority":   models.Task.priority,
        "status":     models.Task.status,
    }
    col = col_map.get(sort_by, models.Task.created_at)
    q = q.order_by((desc if sort_order == "desc" else asc)(col))
    tasks = q.offset((page - 1) * page_size).limit(page_size).all()
    return tasks, total


def update_task(
    db: Session,
    task: models.Task,
    data: schemas.TaskUpdate,
) -> models.Task:
    """task must already be owned by the current user (verified in route)."""
    changes: list[str] = []

    if data.title is not None and data.title != task.title:
        changes.append(f"title: '{task.title}' → '{data.title}'")
        task.title = data.title

    if data.description is not None and data.description != task.description:
        changes.append("description updated")
        task.description = data.description

    if data.status is not None:
        new_val = data.status.value
        if new_val != task.status:
            validate_status_transition(task.status, new_val)
            old = task.status
            task.status = new_val
            changes.append(f"status: '{old}' → '{new_val}'")
            _log(db, task.user_id, task.id, task.title, "status_changed",
                 f"'{old}' → '{new_val}'")

    if data.priority is not None and data.priority.value != task.priority:
        changes.append(f"priority: '{task.priority}' → '{data.priority.value}'")
        task.priority = data.priority.value

    if data.due_date is not None and data.due_date != task.due_date:
        changes.append("due_date updated")
        task.due_date = data.due_date

    if changes:
        task.updated_at = datetime.now(timezone.utc)
        _log(db, task.user_id, task.id, task.title, "updated", "; ".join(changes))

    db.commit()
    db.refresh(task)
    return task


def delete_task(db: Session, task: models.Task) -> None:
    _log(db, task.user_id, task.id, task.title, "deleted",
         f"Deleted (was '{task.status}')")
    db.delete(task)
    db.commit()


# ── Stats (scoped to user) ─────────────────────────────────────────────────

def get_stats(db: Session, user_id: int) -> dict:
    now       = datetime.now(timezone.utc)
    now_naive = now.replace(tzinfo=None)

    q = db.query(models.Task).filter(models.Task.user_id == user_id)

    total     = q.count()
    pending   = q.filter(models.Task.status == "pending").count()
    in_prog   = q.filter(models.Task.status == "in-progress").count()
    completed = q.filter(models.Task.status == "completed").count()

    # Threshold: tasks due within the next 24 hours (but not already past)
    soon_threshold = now + timedelta(hours=24)
    soon_threshold_naive = soon_threshold.replace(tzinfo=None)

    overdue      = 0
    due_soon     = 0
    urgent_tasks = []

    active_with_due = q.filter(
        models.Task.status != "completed",
        models.Task.due_date.isnot(None),
    ).all()

    for t in active_with_due:
        dt = t.due_date
        # Normalise comparison: use naive or aware consistently
        if dt.tzinfo:
            cmp_now  = now
            cmp_soon = soon_threshold
        else:
            cmp_now  = now_naive
            cmp_soon = soon_threshold_naive

        if dt < cmp_now:
            overdue += 1
            urgent_tasks.append(t)
        elif dt <= cmp_soon:
            due_soon += 1
            urgent_tasks.append(t)

    return {
        "total": total,
        "pending": pending,
        "in_progress": in_prog,
        "completed": completed,
        "overdue": overdue,
        "due_soon": due_soon,
        "completion_rate": round(completed / total * 100, 1) if total else 0.0,
        "urgent_tasks": [
            {"id": t.id, "title": t.title, "due_date": t.due_date.isoformat() if t.due_date else None}
            for t in urgent_tasks
        ],
    }


# ── Activity log (scoped to user) ─────────────────────────────────────────

def get_activity_logs(
    db: Session,
    user_id: int,
    task_id: Optional[int] = None,
    limit: int = 100,
) -> tuple[list[models.ActivityLog], int]:
    q = db.query(models.ActivityLog).filter(models.ActivityLog.user_id == user_id)
    if task_id:
        q = q.filter(models.ActivityLog.task_id == task_id)
    total = q.count()
    logs = q.order_by(desc(models.ActivityLog.created_at)).limit(limit).all()
    return logs, total
