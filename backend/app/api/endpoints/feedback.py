from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database.session import get_db
from app.models.models import VisitorFeedback
from app.schemas.schemas import VisitorFeedbackCreate, VisitorFeedbackOut

router = APIRouter(prefix="/feedback", tags=["Visitor Feedback"])

@router.get("", response_model=List[VisitorFeedbackOut])
def get_approved_feedback(db: Session = Depends(get_db)):
    return db.query(VisitorFeedback).filter(
        VisitorFeedback.is_approved == True
    ).order_by(VisitorFeedback.created_at.desc()).limit(20).all()

@router.post("", response_model=VisitorFeedbackOut, status_code=status.HTTP_201_CREATED)
def submit_feedback(
    payload: VisitorFeedbackCreate,
    db: Session = Depends(get_db)
):
    feedback = VisitorFeedback(
        name=payload.name.strip(),
        email=payload.email.strip(),
        rating=payload.rating,
        visit_purpose=payload.visit_purpose,
        destination_visited=payload.destination_visited,
        comments=payload.comments.strip(),
        is_approved=True
    )
    db.add(feedback)
    db.commit()
    db.refresh(feedback)
    return feedback
