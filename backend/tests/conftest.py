"""
tests/conftest.py
Isolated in-memory SQLite database for every test function.
Development data is never touched.

Every `client` fixture is pre-authenticated: a fresh test user is created
and a valid JWT is obtained via /auth/register.  All requests made through
the client automatically include the Bearer token so no test needs to think
about auth.
"""

import os, sys
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from database import Base, get_db
import models  # noqa: F401 — registers models on Base.metadata

TEST_DB_URL = "sqlite:///:memory:"

# Keep one connection alive so the in-memory DB is not destroyed between
# session-factory calls (SQLite in-memory DBs are connection-scoped).
_engine     = create_engine(TEST_DB_URL, connect_args={"check_same_thread": False})
_connection = _engine.connect()
_Session    = sessionmaker(autocommit=False, autoflush=False, bind=_connection)


def _override_get_db():
    db = _Session()
    try:
        yield db
    finally:
        db.close()


@pytest.fixture(scope="function")
def client():
    from main import app

    # Fresh schema for every test
    Base.metadata.create_all(bind=_connection)
    app.dependency_overrides[get_db] = _override_get_db

    with TestClient(app, raise_server_exceptions=False) as c:
        # Register a test user and grab the JWT
        resp = c.post("/auth/register", json={
            "name":     "Test User",
            "email":    "testuser@example.com",
            "password": "testpassword123",
        })
        token = resp.json()["access_token"]

        # Monkey-patch the client so every subsequent request carries the header
        c.headers.update({"Authorization": f"Bearer {token}"})

        yield c

    Base.metadata.drop_all(bind=_connection)
    app.dependency_overrides.clear()
