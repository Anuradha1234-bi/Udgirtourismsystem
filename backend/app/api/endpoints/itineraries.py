from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database.session import get_db
from app.models.models import Itinerary
from app.schemas.schemas import ItineraryOut

router = APIRouter(prefix="/itineraries", tags=["Itineraries"])

@router.get("", response_model=List[ItineraryOut])
def get_itineraries(db: Session = Depends(get_db)):
    return db.query(Itinerary).filter(Itinerary.is_published == True).all()

@router.get("/{slug}", response_model=ItineraryOut)
def get_itinerary_by_slug(slug: str, db: Session = Depends(get_db)):
    itinerary = db.query(Itinerary).filter(
        Itinerary.slug == slug,
        Itinerary.is_published == True
    ).first()
    if not itinerary:
        raise HTTPException(status_code=404, detail="Itinerary not found")
    return itinerary
