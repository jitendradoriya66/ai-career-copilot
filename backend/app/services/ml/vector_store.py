import os
from typing import List, Dict

# Standard curated vector knowledge base for RAG retrieval
INITIAL_STAR_TEMPLATES = [
    {
        "id": "star_react_1",
        "category": "Frontend",
        "skill": "react",
        "text": "Architected modular React 18 frontend dashboard using TypeScript and Tailwind CSS, reducing initial page render time by 42% for 100k+ active users.",
        "impact": "Performance Optimization & Scale"
    },
    {
        "id": "star_python_1",
        "category": "Backend & ML",
        "skill": "python",
        "text": "Engineered RESTful FastAPI microservices in Python with asynchronous DB pooling, handling 15M+ monthly API calls at sub-40ms latency.",
        "impact": "High Throughput Microservices"
    },
    {
        "id": "star_aws_1",
        "category": "DevOps & Cloud",
        "skill": "aws",
        "text": "Automated AWS cloud infrastructure provisioning using Terraform and GitHub Actions CI/CD pipelines, decreasing deployment cycle time by 65%.",
        "impact": "Cloud Automation & CI/CD"
    },
    {
        "id": "star_ai_1",
        "category": "AI / ML",
        "skill": "langchain",
        "text": "Built enterprise Retrieval-Augmented Generation (RAG) agent using LangChain, Vector Databases, and PyTorch, reaching 94% retrieval precision across 500k documents.",
        "impact": "RAG Architecture & High Accuracy"
    },
    {
        "id": "star_sql_1",
        "category": "Databases",
        "skill": "postgresql",
        "text": "Optimized complex PostgreSQL query execution plans and indexed high-volume tables, cutting database CPU utilization by 50%.",
        "impact": "Database Tuning & Query Speed"
    }
]

def search_rag_recommendations(missing_skills: List[str], top_k: int = 3) -> List[Dict]:
    """
    RAG Retrieval Pipeline:
    Matches missing skill terms against the vector knowledge base
    to retrieve high-impact STAR bullet point templates and strategy hints.
    """
    if not missing_skills:
        return INITIAL_STAR_TEMPLATES[:top_k]

    norm_missing = [s.lower() for s in missing_skills]
    matched_templates = []

    # Vector / Keyword Match Retrieval
    for tpl in INITIAL_STAR_TEMPLATES:
        if tpl["skill"] in norm_missing or any(m in tpl["text"].lower() for m in norm_missing):
            matched_templates.append(tpl)

    # If top matches are fewer than top_k, fill with top curated templates
    for tpl in INITIAL_STAR_TEMPLATES:
        if tpl not in matched_templates and len(matched_templates) < top_k:
            matched_templates.append(tpl)

    return matched_templates[:top_k]
