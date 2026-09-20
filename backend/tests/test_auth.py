from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_auth_token_issuance():
    payload = {
        "username": "candidate_alex",
        "password": "securepassword123"
    }
    response = client.post("/api/auth/token", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"
    assert isinstance(data["access_token"], str)
