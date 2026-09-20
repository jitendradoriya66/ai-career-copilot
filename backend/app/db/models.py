import uuid
import json
from datetime import datetime
from sqlalchemy import Column, String, Float, Text, DateTime
from app.db.database import Base

class AnalysisRecord(Base):
    __tablename__ = "analysis_records"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    job_title = Column(String(255), nullable=True)
    company_name = Column(String(255), nullable=True)
    resume_text = Column(Text, nullable=False)
    job_description = Column(Text, nullable=False)
    match_score = Column(Float, nullable=False)
    ats_grade = Column(String(10), nullable=False)
    skill_match_percent = Column(Float, nullable=False)
    matched_skills_json = Column(Text, nullable=True)
    missing_skills_json = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "job_title": self.job_title,
            "company_name": self.company_name,
            "match_score": self.match_score,
            "ats_grade": self.ats_grade,
            "skill_match_percent": self.skill_match_percent,
            "matched_skills": json.loads(self.matched_skills_json) if self.matched_skills_json else [],
            "missing_skills": json.loads(self.missing_skills_json) if self.missing_skills_json else [],
            "created_at": self.created_at.isoformat() if self.created_at else None
        }
