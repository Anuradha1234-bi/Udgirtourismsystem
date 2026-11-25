from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from app.database.session import get_db
from app.models.models import Category
from app.schemas.schemas import CategoryOut

router = APIRouter(prefix="/categories", tags=["Categories"])

@router.get("", response_model=List[CategoryOut])
def get_categories(db: Session = Depends(get_db)):
    return db.query(Category).all()
