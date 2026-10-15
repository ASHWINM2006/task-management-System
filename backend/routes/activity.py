"""
routes/activity.py — Activity log scoped to the logged-in user.
"""
from typing import Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

import crud
import schemas
import models
from database import get_db
from auth import get_current_user

router = APIRouter(prefix="/activity", tags=["Activity Log"])


@router.get("/", response_model=schemas.ActivityLogListResponse)
def get_activity(
    task_id: Optional[int] = Query(None),
    limit:   int           = Query(100, ge=1, le=500),
    db: Session     = Depends(get_db),
    me: models.User = Depends(get_current_user),
):
    logs, total = crud.get_activity_logs(db, user_id=me.id, task_id=task_id, limit=limit)
    return schemas.ActivityLogListResponse(logs=logs, total=total)
