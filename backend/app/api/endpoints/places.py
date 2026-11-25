from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_
from typing import List, Optional
from app.database.session import get_db
from app.models.models import TouristPlace, Category
from app.schemas.schemas import TouristPlaceOut, TouristPlaceListOut

router = APIRouter(prefix="/places", tags=["Tourist Places"])

@router.get("", response_model=List[TouristPlaceListOut])
def get_places(
    category: Optional[str] = Query(None, description="Category slug"),
    search: Optional[str] = Query(None, description="Search term for English/Marathi name or tagline"),
    is_nearby: Optional[bool] = Query(None, description="Filter nearby regional attractions vs Udgir attractions"),
    featured: Optional[bool] = Query(None, description="Filter featured attractions"),
    sort_by: Optional[str] = Query("default", description="Sort by: default, name, distance"),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    db: Session = Depends(get_db)
):
    query = db.query(TouristPlace).filter(TouristPlace.is_published == True)

    if category:
        cat = db.query(Category).filter(Category.slug == category).first()
        if cat:
            query = query.filter(TouristPlace.category_id == cat.id)
        else:
            return []

    if is_nearby is not None:
        query = query.filter(TouristPlace.is_nearby_attraction == is_nearby)

    if featured is not None:
        query = query.filter(TouristPlace.is_featured == featured)

    if search:
        search_filter = f"%{search.strip()}%"
        query = query.filter(
            or_(
                TouristPlace.name_en.ilike(search_filter),
                TouristPlace.name_mr.ilike(search_filter),
                TouristPlace.tagline_en.ilike(search_filter),
                TouristPlace.tagline_mr.ilike(search_filter),
                TouristPlace.description_en.ilike(search_filter),
                TouristPlace.description_mr.ilike(search_filter)
            )
        )

    if sort_by == "name":
        query = query.order_by(TouristPlace.name_en.asc())
    elif sort_by == "distance":
        query = query.order_by(TouristPlace.distance_from_udgir_km.asc())
    else:
        query = query.order_by(TouristPlace.is_featured.desc(), TouristPlace.distance_from_udgir_km.asc())

    return query.offset(skip).limit(limit).all()

@router.get("/nearby", response_model=List[TouristPlaceListOut])
def get_nearby_places(db: Session = Depends(get_db)):
    """Retrieve attractions located near Udgir (such as Ausa Fort, Kharosa Caves)."""
    return db.query(TouristPlace).filter(
        TouristPlace.is_published == True,
        TouristPlace.is_nearby_attraction == True
    ).order_by(TouristPlace.distance_from_udgir_km.asc()).all()

@router.get("/{slug}", response_model=TouristPlaceOut)
def get_place_by_slug(slug: str, db: Session = Depends(get_db)):
    place = db.query(TouristPlace).filter(
        TouristPlace.slug == slug,
        TouristPlace.is_published == True
    ).first()
    if not place:
        raise HTTPException(status_code=404, detail="Destination not found")
    return place
