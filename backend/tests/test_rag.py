from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_rag_recommendations_endpoint():
    payload = {
        "missing_skills": ["aws", "postgresql"]
    }
    response = client.post("/api/rag/recommendations", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "retrieved_templates" in data
    assert len(data["retrieved_templates"]) > 0
    skills = [t["skill"] for t in data["retrieved_templates"]]
    assert "aws" in skills or "postgresql" in skills
