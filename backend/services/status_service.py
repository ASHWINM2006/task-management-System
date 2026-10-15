"""
services/status_service.py
Central, reusable status-transition validator.

Allowed transitions (enforced ONLY here — backend never relies on frontend):
    pending     -> pending       OK
    pending     -> in-progress   OK
    in-progress -> in-progress   OK
    in-progress -> completed     OK
    completed   -> completed     OK

Forbidden:
    pending     -> completed     400
    in-progress -> pending       400
    completed   -> in-progress   400
    completed   -> pending       400
"""

from fastapi import HTTPException, status

ALLOWED_TRANSITIONS: dict[str, set[str]] = {
    "pending":     {"pending", "in-progress"},
    "in-progress": {"in-progress", "completed"},
    "completed":   {"completed"},
}


def validate_status_transition(current: str, new: str) -> None:
    """Raise HTTP 400 if the transition is forbidden."""
    allowed = ALLOWED_TRANSITIONS.get(current, set())
    if new not in allowed:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=(
                f"Invalid status transition: '{current}' \u2192 '{new}'. "
                f"Allowed from '{current}': {sorted(allowed)}."
            ),
        )


def get_allowed_next(current: str) -> list[str]:
    return sorted(ALLOWED_TRANSITIONS.get(current, set()))
