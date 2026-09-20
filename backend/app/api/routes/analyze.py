import json
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.db.models import AnalysisRecord
from app.schemas.analysis import AnalysisRequest, AnalysisResponse
from app.services.ml.tfidf import calculate_tfidf_match
from app.services.ml.embeddings import calculate_semantic_similarity
from app.services.ml.skills import extract_skills_from_text
from app.services.ml.ats_audit import audit_ats_content, generate_interview_questions

router = APIRouter()

@router.post("/analyze", response_model=AnalysisResponse)
async def analyze_resume_fit(request: AnalysisRequest, db: Session = Depends(get_db)):
    """
    Full ML, Semantic Embeddings, NLP & Persistence Analysis Endpoint:
    - Calculates TF-IDF exact keyword Cosine Similarity
    - Calculates Dense Vector Embedding Semantic Similarity
    - Performs taxonomy-based Skill Extraction (Matched vs Missing)
    - Audits ATS metrics (Action Verbs, Metric Density, Section Structure)
    - Generates actionable recommendations & targeted interview questions
    - Persists analysis result into the database for history tracking
    """
    if not request.resume_text.strip():
        raise HTTPException(status_code=400, detail="resume_text cannot be empty.")
    if not request.job_description.strip():
        raise HTTPException(status_code=400, detail="job_description cannot be empty.")

    # 1. Calculate TF-IDF Keyword Match
    tfidf_score, matched_terms, missing_terms = calculate_tfidf_match(
        resume_text=request.resume_text,
        job_description=request.job_description
    )

    # 2. Calculate Dense Vector Semantic Similarity
    semantic_score = calculate_semantic_similarity(
        resume_text=request.resume_text,
        jd_text=request.job_description
    )

    # 3. Extract Matched & Missing Skills
    matched_skills, missing_skills = extract_skills_from_text(
        resume_text=request.resume_text,
        jd_text=request.job_description
    )

    total_jd_skills = len(matched_skills) + len(missing_skills)
    skill_match_percent = round((len(matched_skills) / total_jd_skills * 100), 1) if total_jd_skills > 0 else tfidf_score

    # 4. Audit ATS Content
    audit_results = audit_ats_content(
        resume_text=request.resume_text,
        jd_text=request.job_description
    )
    ats_metrics = audit_results["ats_metrics"]
    recommendations = audit_results["recommendations"]

    # 5. Combined Weighted Overall Score & Grade
    overall_score = round(
        (semantic_score * 0.30) +
        (tfidf_score * 0.30) +
        (skill_match_percent * 0.20) +
        (ats_metrics["action_verb_score"] * 0.10) +
        (ats_metrics["metric_score"] * 0.10),
        1
    )

    if overall_score >= 90:
        grade = "A+"
    elif overall_score >= 80:
        grade = "A"
    elif overall_score >= 70:
        grade = "B+"
    elif overall_score >= 60:
        grade = "B"
    elif overall_score >= 50:
        grade = "C"
    else:
        grade = "D"

    # 6. Generate Targeted Interview Questions
    interview_questions = generate_interview_questions(matched_skills, missing_skills)

    # 7. Persist Record to Database
    try:
        record = AnalysisRecord(
            resume_text=request.resume_text,
            job_description=request.job_description,
            match_score=overall_score,
            ats_grade=grade,
            skill_match_percent=skill_match_percent,
            matched_skills_json=json.dumps(matched_skills),
            missing_skills_json=json.dumps(missing_skills)
        )
        db.add(record)
        db.commit()
    except Exception as db_err:
        db.rollback()
        print("Database persistence notice:", db_err)

    return AnalysisResponse(
        match_score=overall_score,
        tfidf_score=tfidf_score,
        semantic_score=semantic_score,
        ats_grade=grade,
        skill_match_percent=skill_match_percent,
        matched_skills=matched_skills,
        missing_skills=missing_skills,
        matched_terms=matched_terms,
        missing_terms=missing_terms,
        ats_metrics=ats_metrics,
        recommendations=recommendations,
        interview_questions=interview_questions
    )
