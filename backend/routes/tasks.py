"""
routes/tasks.py — All /tasks endpoints.
Every endpoint requires a valid JWT. Tasks are scoped to the logged-in user.
"""

import math
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

import crud
import schemas
import models
from database import get_db
from auth import get_current_user
from services.status_service import get_allowed_next

router = APIRouter(prefix="/tasks", tags=["Tasks"])


def _get_or_404(task_id: int, user_id: int, db: Session) -> models.Task:
    """Return task only if it exists AND belongs to the current user."""
    task = crud.get_task(db, task_id, user_id)
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Task {task_id} not found.",
        )
    return task


@router.post(
    "/",
    response_model=schemas.TaskResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a task",
)
def create_task(
    data: schemas.TaskCreate,
    db:   Session = Depends(get_db),
    me:   models.User = Depends(get_current_user),
):
    return crud.create_task(db, data, user_id=me.id)


@router.get(
    "/stats",
    summary="Dashboard statistics for the current user",
)
def get_stats(
    db: Session = Depends(get_db),
    me: models.User = Depends(get_current_user),
):
    return crud.get_stats(db, user_id=me.id)


@router.get(
    "/",
    response_model=schemas.TaskListResponse,
    summary="List current user's tasks",
)
def list_tasks(
    search:     Optional[str]                 = Query(None),
    status:     Optional[schemas.TaskStatus]  = Query(None),
    priority:   Optional[schemas.TaskPriority]= Query(None),
    sort_by:    str = Query("created_at", pattern="^(created_at|title|due_date|priority|status)$"),
    sort_order: str = Query("desc", pattern="^(asc|desc)$"),
    page:       int = Query(1, ge=1),
    page_size:  int = Query(20, ge=1, le=100),
    db: Session      = Depends(get_db),
    me: models.User  = Depends(get_current_user),
):
    tasks, total = crud.get_tasks(
        db,
        user_id=me.id,
        search=search,
        status_filter=status.value if status else None,
        priority_filter=priority.value if priority else None,
        sort_by=sort_by,
        sort_order=sort_order,
        page=page,
        page_size=page_size,
    )
    return schemas.TaskListResponse(
        tasks=tasks,
        total=total,
        page=page,
        page_size=page_size,
        total_pages=math.ceil(total / page_size) if page_size else 1,
    )


@router.get(
    "/{task_id}",
    response_model=schemas.TaskResponse,
    summary="Get a single task",
)
def get_task(
    task_id: int,
    db: Session     = Depends(get_db),
    me: models.User = Depends(get_current_user),
):
    return _get_or_404(task_id, me.id, db)


@router.put(
    "/{task_id}",
    response_model=schemas.TaskResponse,
    summary="Update a task",
)
def update_task(
    task_id: int,
    data:    schemas.TaskUpdate,
    db: Session     = Depends(get_db),
    me: models.User = Depends(get_current_user),
):
    task = _get_or_404(task_id, me.id, db)
    return crud.update_task(db, task, data)


@router.delete(
    "/{task_id}",
    response_model=schemas.MessageResponse,
    summary="Delete a task",
)
def delete_task(
    task_id: int,
    db: Session     = Depends(get_db),
    me: models.User = Depends(get_current_user),
):
    task = _get_or_404(task_id, me.id, db)
    crud.delete_task(db, task)
    return schemas.MessageResponse(message=f"Task {task_id} deleted.")


@router.get(
    "/{task_id}/allowed-transitions",
    summary="Valid next statuses for a task",
)
def allowed_transitions(
    task_id: int,
    db: Session     = Depends(get_db),
    me: models.User = Depends(get_current_user),
):
    task = _get_or_404(task_id, me.id, db)
    return {"current_status": task.status, "allowed_next": get_allowed_next(task.status)}
