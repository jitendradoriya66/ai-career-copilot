from fastapi import APIRouter
from pydantic import BaseModel, Field
from typing import List, Dict
from app.services.ml.vector_store import search_rag_recommendations

router = APIRouter()

class RAGRequest(BaseModel):
    missing_skills: List[str] = Field(default_factory=list, description="List of missing skills extracted from job analysis")

class RAGTemplate(BaseModel):
    id: str
    category: str
    skill: str
    text: str
    impact: str

class RAGResponse(BaseModel):
    retrieved_templates: List[RAGTemplate] = Field(default_factory=list)

@router.post("/rag/recommendations", response_model=RAGResponse)
async def get_rag_recommendations(request: RAGRequest):
    """
    RAG Endpoint: Retrieves contextually relevant STAR bullet templates from the Vector Store based on candidate skill gaps.
    """
    results = search_rag_recommendations(request.missing_skills)
    return RAGResponse(retrieved_templates=results)
