from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_analyze_endpoint_semantic_embeddings():
    payload = {
        "resume_text": "AWS Cloud Infrastructure Engineer with experience in Terraform, CI/CD, Kubernetes, and Python scripting.",
        "job_description": "We are seeking a DevOps Specialist to manage cloud platforms, automation pipelines, and container orchestration."
    }
    response = client.post("/api/analyze", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "match_score" in data
    assert "tfidf_score" in data
    assert "semantic_score" in data
    assert isinstance(data["semantic_score"], float)
    assert data["semantic_score"] > 0
