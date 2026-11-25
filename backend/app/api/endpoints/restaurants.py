from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_
from typing import List, Optional
from app.database.session import get_db
from app.models.models import Restaurant
from app.schemas.schemas import RestaurantOut

router = APIRouter(prefix="/restaurants", tags=["Restaurants & Dining"])

@router.get("", response_model=List[RestaurantOut])
def get_restaurants(
    category: Optional[str] = Query(None, description="Category filter (e.g. Pure Veg, Maharashtrian Bhojnalaya, Dhaba)"),
    is_pure_veg: Optional[bool] = Query(None),
    search: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    query = db.query(Restaurant).filter(Restaurant.is_published == True)

    if category:
        query = query.filter(Restaurant.category.ilike(f"%{category}%"))

    if is_pure_veg is not None:
        query = query.filter(Restaurant.is_pure_veg == is_pure_veg)

    if search:
        search_filter = f"%{search.strip()}%"
        query = query.filter(
            or_(
                Restaurant.name_en.ilike(search_filter),
                Restaurant.name_mr.ilike(search_filter),
                Restaurant.cuisine_type_en.ilike(search_filter),
                Restaurant.popular_dishes_en.ilike(search_filter),
                Restaurant.address_en.ilike(search_filter)
            )
        )

    return query.all()
