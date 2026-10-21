import pytest
from fastapi.testclient import TestClient
import sys
from pathlib import Path

# Add project root to sys.path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent.parent))

from backend.app.main import app
from backend.app.database import get_db, SessionLocal
from backend.app.security import hash_password
from backend.app.models import Admin

@pytest.fixture(scope="session")
def client():
    with TestClient(app) as test_client:
        yield test_client

@pytest.fixture(scope="session")
def db_session():
    db = SessionLocal()
    yield db
    db.close()

@pytest.fixture(scope="session")
def admin_token(client):
    response = client.post(
        "/api/admin/login",
        json={"username": "abdulhadi", "password": "HadiQuran2026!"}
    )
    assert response.status_code == 200, f"Login failed: {response.text}"
    return response.json()["access_token"]
