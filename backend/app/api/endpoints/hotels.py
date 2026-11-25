from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_
from typing import List, Optional
from app.database.session import get_db
from app.models.models import Hotel
from app.schemas.schemas import HotelOut

router = APIRouter(prefix="/hotels", tags=["Hotels & Lodges"])

@router.get("", response_model=List[HotelOut])
def get_hotels(
    category: Optional[str] = Query(None, description="Hotel category: Hotel, Lodge, etc."),
    search: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    query = db.query(Hotel).filter(Hotel.is_published == True)

    if category:
        query = query.filter(Hotel.category.ilike(f"%{category}%"))

    if search:
        search_filter = f"%{search.strip()}%"
        query = query.filter(
            or_(
                Hotel.name_en.ilike(search_filter),
                Hotel.name_mr.ilike(search_filter),
                Hotel.address_en.ilike(search_filter),
                Hotel.address_mr.ilike(search_filter)
            )
        )

    return query.all()
