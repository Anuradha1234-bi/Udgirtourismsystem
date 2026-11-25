from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database.session import get_db
from app.models.models import GalleryImage
from app.schemas.schemas import GalleryImageOut

router = APIRouter(prefix="/gallery", tags=["Photo Gallery"])

@router.get("", response_model=List[GalleryImageOut])
def get_gallery_images(
    category: Optional[str] = Query(None, description="Filter by category (Fort, Nature, Religious, Culture)"),
    db: Session = Depends(get_db)
):
    query = db.query(GalleryImage)
    if category and category != "All":
        query = query.filter(GalleryImage.category.ilike(f"%{category}%"))
    return query.all()
