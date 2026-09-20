from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional

class AnalysisRequest(BaseModel):
    resume_text: str = Field(..., description="Plain text extracted from candidate resume")
    job_description: str = Field(..., description="Target job description requirements text")

class MatchedSkill(BaseModel):
    name: str
    category: str
    status: str = "matched"

class MissingSkill(BaseModel):
    name: str
    category: str
    priority: str
    status: str = "missing"

class ATSMetrics(BaseModel):
    action_verb_score: int
    metric_score: int
    section_score: int
    found_verbs: List[str]
    metric_count: int
    found_sections: List[str]
    missing_sections: List[str]

class Recommendation(BaseModel):
    type: str
    title: str
    description: str

class InterviewQuestion(BaseModel):
    id: str
    category: str
    type: str
    question: str
    hint: str

class AnalysisResponse(BaseModel):
    match_score: float = Field(..., description="Combined weighted match score (0-100)")
    tfidf_score: float = Field(..., description="Exact keyword TF-IDF Cosine Similarity score")
    semantic_score: float = Field(..., description="Dense Vector Embedding Semantic Similarity score")
    ats_grade: str = Field(..., description="ATS letter grade (A+, A, B, C, D)")
    skill_match_percent: float = Field(..., description="Percentage of JD skills present in resume")
    matched_skills: List[MatchedSkill] = Field(default_factory=list)
    missing_skills: List[MissingSkill] = Field(default_factory=list)
    matched_terms: List[str] = Field(default_factory=list)
    missing_terms: List[str] = Field(default_factory=list)
    ats_metrics: ATSMetrics
    recommendations: List[Recommendation] = Field(default_factory=list)
    interview_questions: List[InterviewQuestion] = Field(default_factory=list)
