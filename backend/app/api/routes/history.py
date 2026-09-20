import json
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Dict
from app.db.database import get_db
from app.db.models import AnalysisRecord

router = APIRouter()

@router.get("/history", response_model=List[Dict])
async def get_analysis_history(db: Session = Depends(get_db)):
    """
    Retrieves candidate analysis history stored in the database.
    """
    records = db.query(AnalysisRecord).order_by(AnalysisRecord.created_at.desc()).limit(20).all()
    return [rec.to_dict() for rec in records]

@router.get("/history/{record_id}", response_model=Dict)
async def get_analysis_record(record_id: str, db: Session = Depends(get_db)):
    """
    Retrieves a specific analysis record by ID.
    """
    record = db.query(AnalysisRecord).filter(AnalysisRecord.id == record_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Analysis record not found.")
    return record.to_dict()
