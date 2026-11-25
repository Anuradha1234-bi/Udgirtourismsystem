from fastapi import APIRouter, Depends, HTTPException, status, Header
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database.session import get_db
from app.models.models import (
    AdminUser, TouristPlace, Category, ContactMessage,
    VisitorFeedback, Hotel, Restaurant, PlaceImage, ItineraryItem
)
from app.schemas.schemas import (
    AdminLogin, Token, AdminUserOut,
    TouristPlaceCreate, TouristPlaceUpdate, TouristPlaceOut,
    ContactMessageOut, VisitorFeedbackOut, CategoryCreate, CategoryOut
)
from app.core.security import verify_password, create_access_token, decode_access_token

router = APIRouter(prefix="/admin", tags=["Admin Portal"])

def get_current_admin(
    authorization: Optional[str] = Header(None),
    db: Session = Depends(get_db)
) -> AdminUser:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication token required"
        )
    parts = authorization.split(" ")
    if len(parts) != 2 or not parts[1].strip():
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication token required"
        )
    token = parts[1].strip()
    payload = decode_access_token(token)
    if not payload or "sub" not in payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired session token"
        )
    admin = db.query(AdminUser).filter(AdminUser.username == payload["sub"]).first()
    if not admin or not admin.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Admin user not found or inactive"
        )
    return admin

@router.post("/login", response_model=Token)
def admin_login(payload: AdminLogin, db: Session = Depends(get_db)):
    admin = db.query(AdminUser).filter(AdminUser.username == payload.username.strip()).first()
    if not admin or not verify_password(payload.password, admin.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password"
        )
    token = create_access_token({"sub": admin.username})
    return {"access_token": token, "token_type": "bearer", "username": admin.username}

@router.get("/me", response_model=AdminUserOut)
def get_admin_profile(current_admin: AdminUser = Depends(get_current_admin)):
    return current_admin

@router.get("/stats")
def get_admin_dashboard_stats(
    current_admin: AdminUser = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    total_places = db.query(TouristPlace).count()
    verified_places = db.query(TouristPlace).filter(TouristPlace.verification_status == "officially_verified").count()
    total_messages = db.query(ContactMessage).count()
    unread_messages = db.query(ContactMessage).filter(ContactMessage.is_read == False).count()
    total_feedback = db.query(VisitorFeedback).count()
    total_hotels = db.query(Hotel).count()
    total_restaurants = db.query(Restaurant).count()

    return {
        "total_places": total_places,
        "verified_places": verified_places,
        "total_messages": total_messages,
        "unread_messages": unread_messages,
        "total_feedback": total_feedback,
        "total_hotels": total_hotels,
        "total_restaurants": total_restaurants
    }

# Places Admin CRUD
@router.get("/places", response_model=List[TouristPlaceOut])
def admin_get_places(
    current_admin: AdminUser = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    return db.query(TouristPlace).order_by(TouristPlace.name_en.asc()).all()

@router.get("/places/{place_id}", response_model=TouristPlaceOut)
def admin_get_place(
    place_id: int,
    current_admin: AdminUser = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    place = db.query(TouristPlace).filter(TouristPlace.id == place_id).first()
    if not place:
        raise HTTPException(status_code=404, detail="Destination not found")
    return place

@router.post("/places", response_model=TouristPlaceOut, status_code=status.HTTP_201_CREATED)
def admin_create_place(
    payload: TouristPlaceCreate,
    current_admin: AdminUser = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    existing = db.query(TouristPlace).filter(TouristPlace.slug == payload.slug).first()
    if existing:
        raise HTTPException(status_code=400, detail="Slug already exists")

    category = db.query(Category).filter(Category.id == payload.category_id).first()
    if not category:
        raise HTTPException(status_code=400, detail=f"Category ID {payload.category_id} does not exist")

    data = payload.model_dump()
    gallery_images = data.pop("gallery_images", None)

    place = TouristPlace(**data)
    if gallery_images:
        for idx, img_url in enumerate(gallery_images):
            trimmed = img_url.strip() if isinstance(img_url, str) else ""
            if trimmed:
                place.images.append(PlaceImage(image_url=trimmed, display_order=idx))

    db.add(place)
    db.commit()
    db.refresh(place)
    return place

@router.put("/places/{place_id}", response_model=TouristPlaceOut)
def admin_update_place(
    place_id: int,
    payload: TouristPlaceUpdate,
    current_admin: AdminUser = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    place = db.query(TouristPlace).filter(TouristPlace.id == place_id).first()
    if not place:
        raise HTTPException(status_code=404, detail="Destination not found")

    update_data = payload.model_dump(exclude_unset=True)

    # Check for slug collision if slug is being modified
    if "slug" in update_data and update_data["slug"] != place.slug:
        existing = db.query(TouristPlace).filter(TouristPlace.slug == update_data["slug"]).first()
        if existing and existing.id != place.id:
            raise HTTPException(status_code=400, detail="Slug already in use by another destination")

    # Check category existence if category_id is being modified
    if "category_id" in update_data and update_data["category_id"] is not None:
        cat = db.query(Category).filter(Category.id == update_data["category_id"]).first()
        if not cat:
            raise HTTPException(status_code=400, detail=f"Category ID {update_data['category_id']} does not exist")

    gallery_images = update_data.pop("gallery_images", None)
    for key, value in update_data.items():
        setattr(place, key, value)

    if gallery_images is not None:
        place.images.clear()
        for idx, img_url in enumerate(gallery_images):
            trimmed = img_url.strip() if isinstance(img_url, str) else ""
            if trimmed:
                place.images.append(PlaceImage(image_url=trimmed, display_order=idx))

    db.commit()
    db.refresh(place)
    return place

@router.delete("/places/{place_id}", status_code=status.HTTP_200_OK)
def admin_delete_place(
    place_id: int,
    current_admin: AdminUser = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    place = db.query(TouristPlace).filter(TouristPlace.id == place_id).first()
    if not place:
        raise HTTPException(status_code=404, detail="Destination not found")

    # Detach any itinerary items referencing this place before deleting
    db.query(ItineraryItem).filter(ItineraryItem.place_id == place_id).update({"place_id": None})

    db.delete(place)
    db.commit()
    return {"message": f"Destination '{place.name_en}' deleted successfully"}

# Contact Messages Management
@router.get("/contact-messages", response_model=List[ContactMessageOut])
def admin_get_contact_messages(
    current_admin: AdminUser = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    return db.query(ContactMessage).order_by(ContactMessage.created_at.desc()).all()

@router.put("/contact-messages/{msg_id}/read")
def admin_mark_message_read(
    msg_id: int,
    current_admin: AdminUser = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    msg = db.query(ContactMessage).filter(ContactMessage.id == msg_id).first()
    if not msg:
        raise HTTPException(status_code=404, detail="Message not found")
    msg.is_read = True
    db.commit()
    return {"message": "Marked as read"}

# Visitor Feedback Management
@router.get("/feedback", response_model=List[VisitorFeedbackOut])
def admin_get_feedback(
    current_admin: AdminUser = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    return db.query(VisitorFeedback).order_by(VisitorFeedback.created_at.desc()).all()

@router.delete("/feedback/{feedback_id}")
def admin_delete_feedback(
    feedback_id: int,
    current_admin: AdminUser = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    item = db.query(VisitorFeedback).filter(VisitorFeedback.id == feedback_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Feedback not found")
    db.delete(item)
    db.commit()
    return {"message": "Feedback deleted"}
