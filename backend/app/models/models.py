from sqlalchemy import Column, Integer, String, Text, Float, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from app.database.session import Base

def utcnow():
    return datetime.now(timezone.utc)

class AdminUser(Base):
    __tablename__ = "admin_users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True, nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=utcnow)

class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True)
    slug = Column(String(50), unique=True, index=True, nullable=False)
    name_en = Column(String(100), nullable=False)
    name_mr = Column(String(100), nullable=False)
    description_en = Column(Text, nullable=True)
    description_mr = Column(Text, nullable=True)
    icon_name = Column(String(50), nullable=True)  # Lucide icon name

    places = relationship("TouristPlace", back_populates="category")

class TouristPlace(Base):
    __tablename__ = "tourist_places"

    id = Column(Integer, primary_key=True, index=True)
    slug = Column(String(100), unique=True, index=True, nullable=False)
    
    # Bilingual Names & Overview
    name_en = Column(String(150), nullable=False, index=True)
    name_mr = Column(String(150), nullable=False, index=True)
    tagline_en = Column(String(255), nullable=True)
    tagline_mr = Column(String(255), nullable=True)
    
    description_en = Column(Text, nullable=False)
    description_mr = Column(Text, nullable=False)
    
    # Historical & Cultural Sections
    history_en = Column(Text, nullable=True)
    history_mr = Column(Text, nullable=True)
    culture_en = Column(Text, nullable=True)
    culture_mr = Column(Text, nullable=True)
    highlights_en = Column(Text, nullable=True)  # JSON or newline-separated
    highlights_mr = Column(Text, nullable=True)
    
    # Location & Accessibility
    category_id = Column(Integer, ForeignKey("categories.id"), nullable=False)
    address_en = Column(String(255), nullable=False)
    address_mr = Column(String(255), nullable=False)
    distance_from_udgir_km = Column(Float, nullable=False, default=0.0)
    is_nearby_attraction = Column(Boolean, default=False)  # Distinguishes Udgir from Ausa/Kharosa
    
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    is_coordinates_approximate = Column(Boolean, default=False)
    google_maps_url = Column(String(500), nullable=True)
    
    # Practical Tourism Info (Nullable if unverified)
    opening_hours_en = Column(String(150), nullable=True)
    opening_hours_mr = Column(String(150), nullable=True)
    entry_fee_en = Column(String(150), nullable=True)
    entry_fee_mr = Column(String(150), nullable=True)
    facilities_en = Column(String(255), nullable=True)
    facilities_mr = Column(String(255), nullable=True)
    accessibility_info_en = Column(String(255), nullable=True)
    accessibility_info_mr = Column(String(255), nullable=True)
    travel_tips_en = Column(Text, nullable=True)
    travel_tips_mr = Column(Text, nullable=True)
    
    # Verification & Sourcing
    hero_image = Column(String(500), nullable=False)
    verification_status = Column(String(50), default="officially_verified")  # officially_verified, cross_verified, locally_reported, pending_verification, disputed_information
    source_name = Column(String(255), nullable=True)
    source_url = Column(String(500), nullable=True)
    source_type = Column(String(100), nullable=True)
    last_verified_at = Column(String(50), nullable=True)
    is_published = Column(Boolean, default=True)
    is_featured = Column(Boolean, default=False)
    
    created_at = Column(DateTime, default=utcnow)
    updated_at = Column(DateTime, default=utcnow, onupdate=utcnow)

    category = relationship("Category", back_populates="places")
    images = relationship("PlaceImage", back_populates="place", cascade="all, delete-orphan")
    source_references = relationship("SourceReference", back_populates="place", cascade="all, delete-orphan")

class PlaceImage(Base):
    __tablename__ = "place_images"

    id = Column(Integer, primary_key=True, index=True)
    place_id = Column(Integer, ForeignKey("tourist_places.id"), nullable=False)
    image_url = Column(String(500), nullable=False)
    caption_en = Column(String(255), nullable=True)
    caption_mr = Column(String(255), nullable=True)
    attribution = Column(String(255), nullable=True)
    license = Column(String(100), nullable=True)
    display_order = Column(Integer, default=0)

    place = relationship("TouristPlace", back_populates="images")

class SourceReference(Base):
    __tablename__ = "source_references"

    id = Column(Integer, primary_key=True, index=True)
    place_id = Column(Integer, ForeignKey("tourist_places.id"), nullable=False)
    source_name = Column(String(255), nullable=False)
    source_url = Column(String(500), nullable=True)
    source_type = Column(String(100), nullable=False)  # government_portal, gazetteer, academic, press, field_audit
    verification_notes = Column(Text, nullable=True)
    verified_date = Column(String(50), nullable=True)

    place = relationship("TouristPlace", back_populates="source_references")

class Hotel(Base):
    __tablename__ = "hotels"

    id = Column(Integer, primary_key=True, index=True)
    name_en = Column(String(150), nullable=False)
    name_mr = Column(String(150), nullable=False)
    category = Column(String(50), default="Hotel")  # Hotel, Lodge, Guest House
    address_en = Column(String(255), nullable=False)
    address_mr = Column(String(255), nullable=False)
    contact_number = Column(String(50), nullable=True)  # Null if unverified
    google_maps_url = Column(String(500), nullable=True)
    facilities_en = Column(String(255), nullable=True)
    facilities_mr = Column(String(255), nullable=True)
    price_range = Column(String(100), nullable=True)  # Null if unverified
    opening_hours = Column(String(100), nullable=True)  # Null if unverified
    booking_website = Column(String(500), nullable=True)
    image_url = Column(String(500), nullable=True)
    rating = Column(Float, nullable=True)
    review_count = Column(Integer, nullable=True)
    rating_source = Column(String(100), nullable=True)
    source_url = Column(String(500), nullable=True)
    last_checked_at = Column(String(50), nullable=True)
    verification_status = Column(String(50), default="cross_verified")
    is_published = Column(Boolean, default=True)

class Restaurant(Base):
    __tablename__ = "restaurants"

    id = Column(Integer, primary_key=True, index=True)
    name_en = Column(String(150), nullable=False)
    name_mr = Column(String(150), nullable=False)
    category = Column(String(50), default="Family Restaurant")  # Pure Veg, Maharashtrian Bhojnalaya, Dhaba, Cafe, Fast Food
    cuisine_type_en = Column(String(150), nullable=False)
    cuisine_type_mr = Column(String(150), nullable=False)
    is_pure_veg = Column(Boolean, default=True)
    address_en = Column(String(255), nullable=False)
    address_mr = Column(String(255), nullable=False)
    contact_number = Column(String(50), nullable=True)
    google_maps_url = Column(String(500), nullable=True)
    opening_hours = Column(String(100), nullable=True)
    price_range = Column(String(100), nullable=True)
    popular_dishes_en = Column(String(255), nullable=True)
    popular_dishes_mr = Column(String(255), nullable=True)
    facilities_en = Column(String(255), nullable=True)
    facilities_mr = Column(String(255), nullable=True)
    rating = Column(Float, nullable=True)
    review_count = Column(Integer, nullable=True)
    rating_source = Column(String(100), nullable=True)
    source_url = Column(String(500), nullable=True)
    last_checked_at = Column(String(50), nullable=True)
    image_url = Column(String(500), nullable=True)
    verification_status = Column(String(50), default="cross_verified")
    is_published = Column(Boolean, default=True)

class Itinerary(Base):
    __tablename__ = "itineraries"

    id = Column(Integer, primary_key=True, index=True)
    slug = Column(String(100), unique=True, index=True, nullable=False)
    title_en = Column(String(200), nullable=False)
    title_mr = Column(String(200), nullable=False)
    duration_type = Column(String(50), nullable=False)  # 1_day, 2_days, theme_historical, theme_nature, theme_religious
    description_en = Column(Text, nullable=False)
    description_mr = Column(Text, nullable=False)
    overview_en = Column(Text, nullable=True)
    overview_mr = Column(Text, nullable=True)
    is_published = Column(Boolean, default=True)

    items = relationship("ItineraryItem", back_populates="itinerary", cascade="all, delete-orphan", order_by="ItineraryItem.order_index")

class ItineraryItem(Base):
    __tablename__ = "itinerary_items"

    id = Column(Integer, primary_key=True, index=True)
    itinerary_id = Column(Integer, ForeignKey("itineraries.id"), nullable=False)
    order_index = Column(Integer, default=1)
    day_number = Column(Integer, default=1)
    time_slot_en = Column(String(50), nullable=False)  # e.g. "09:00 AM - 11:30 AM"
    time_slot_mr = Column(String(50), nullable=False)
    activity_title_en = Column(String(200), nullable=False)
    activity_title_mr = Column(String(200), nullable=False)
    description_en = Column(Text, nullable=False)
    description_mr = Column(Text, nullable=False)
    travel_tips_en = Column(Text, nullable=True)
    travel_tips_mr = Column(Text, nullable=True)
    place_id = Column(Integer, ForeignKey("tourist_places.id"), nullable=True)

    itinerary = relationship("Itinerary", back_populates="items")
    place = relationship("TouristPlace")

class GalleryImage(Base):
    __tablename__ = "gallery_images"

    id = Column(Integer, primary_key=True, index=True)
    title_en = Column(String(150), nullable=False)
    title_mr = Column(String(150), nullable=False)
    category = Column(String(50), nullable=False)  # Fort, Nature, Religious, Culture, Festivals
    image_url = Column(String(500), nullable=False)
    description_en = Column(Text, nullable=True)
    description_mr = Column(Text, nullable=True)
    attribution = Column(String(255), nullable=True)
    source_url = Column(String(500), nullable=True)
    license = Column(String(100), default="Public Domain / CC-BY-SA")

class ContactMessage(Base):
    __tablename__ = "contact_messages"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(100), nullable=False)
    phone = Column(String(20), nullable=True)
    subject = Column(String(200), nullable=False)
    message = Column(Text, nullable=False)
    created_at = Column(DateTime, default=utcnow)
    is_read = Column(Boolean, default=False)

class VisitorFeedback(Base):
    __tablename__ = "visitor_feedback"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(100), nullable=False)
    rating = Column(Integer, nullable=False)  # 1 to 5
    visit_purpose = Column(String(100), nullable=True)  # Solo, Family, Historical Study, Spiritual
    destination_visited = Column(String(150), nullable=True)
    comments = Column(Text, nullable=False)
    created_at = Column(DateTime, default=utcnow)
    is_approved = Column(Boolean, default=True)
