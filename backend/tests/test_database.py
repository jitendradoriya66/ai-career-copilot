from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_database_persistence_and_history():
    # 1. Post analysis request
    payload = {
        "resume_text": "Full Stack Engineer with React, Python, PostgreSQL experience.",
        "job_description": "Senior React and Python developer for cloud analytics platform."
    }
    response = client.post("/api/analyze", json=payload)
    assert response.status_code == 200

    # 2. Query history endpoint
    history_resp = client.get("/api/history")
    assert history_resp.status_code == 200
    history_data = history_resp.json()
    assert isinstance(history_data, list)
    assert len(history_data) > 0
    assert "id" in history_data[0]
    assert "match_score" in history_data[0]
