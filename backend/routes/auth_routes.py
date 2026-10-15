"""
routes/auth_routes.py  —  /auth/register  and  /auth/login
"""
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, EmailStr, Field, field_validator
from sqlalchemy.orm import Session

from database import get_db
from auth import hash_password, verify_password, create_access_token, get_current_user
import models

router = APIRouter(prefix="/auth", tags=["Auth"])


# ── Schemas ───────────────────────────────────────────────────

class RegisterRequest(BaseModel):
    name:     str   = Field(..., min_length=2, max_length=100)
    email:    EmailStr
    password: str   = Field(..., min_length=6, max_length=128)

    @field_validator("name")
    @classmethod
    def name_not_blank(cls, v):
        if not v.strip():
            raise ValueError("Name must not be blank.")
        return v.strip()


class LoginRequest(BaseModel):
    email:    EmailStr
    password: str


class AuthResponse(BaseModel):
    access_token: str
    token_type:   str = "bearer"
    user: dict


class UserResponse(BaseModel):
    id:    int
    name:  str
    email: str

    model_config = {"from_attributes": True}


# ── Routes ────────────────────────────────────────────────────

@router.post(
    "/register",
    status_code=status.HTTP_201_CREATED,
    response_model=AuthResponse,
    summary="Create a new account",
)
def register(body: RegisterRequest, db: Session = Depends(get_db)):
    # Check duplicate email
    existing = db.query(models.User).filter(models.User.email == body.email).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An account with this email already exists.",
        )

    user = models.User(
        name=body.name,
        email=body.email,
        password=hash_password(body.password),
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    token = create_access_token({"sub": str(user.id), "email": user.email})
    return AuthResponse(
        access_token=token,
        user={"id": user.id, "name": user.name, "email": user.email},
    )


@router.post(
    "/login",
    response_model=AuthResponse,
    summary="Login and get a JWT token",
)
def login(body: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == body.email).first()
    if not user or not verify_password(body.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password.",
        )
    if not user.is_active:
        raise HTTPException(status_code=403, detail="Account is deactivated.")

    token = create_access_token({"sub": str(user.id), "email": user.email})
    return AuthResponse(
        access_token=token,
        user={"id": user.id, "name": user.name, "email": user.email},
    )


@router.get(
    "/me",
    response_model=UserResponse,
    summary="Get current logged-in user",
)
def me(current_user: models.User = Depends(get_current_user)):
    return current_user
