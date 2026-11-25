import re
from pydantic import BaseModel, Field, ConfigDict, field_validator
from typing import Optional, List
from datetime import datetime

# Token Schemas
class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    username: str

class TokenPayload(BaseModel):
    sub: Optional[str] = None

class AdminLogin(BaseModel):
    username: str
    password: str

class AdminUserOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    username: str
    email: str
    is_active: bool

# Category Schemas
class CategoryBase(BaseModel):
    slug: str
    name_en: str
    name_mr: str
    description_en: Optional[str] = None
    description_mr: Optional[str] = None
    icon_name: Optional[str] = None

class CategoryCreate(CategoryBase):
    pass

class CategoryOut(CategoryBase):
    model_config = ConfigDict(from_attributes=True)

    id: int

# Place Images & Sources
class PlaceImageOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    image_url: str
    caption_en: Optional[str] = None
    caption_mr: Optional[str] = None
    attribution: Optional[str] = None
    license: Optional[str] = None
    display_order: int

class SourceReferenceOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    source_name: str
    source_url: Optional[str] = None
    source_type: str
    verification_notes: Optional[str] = None
    verified_date: Optional[str] = None

# Tourist Place Schemas
class TouristPlaceListOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    slug: str
    name_en: str
    name_mr: str
    tagline_en: Optional[str] = None
    tagline_mr: Optional[str] = None
    category_id: int
    category: Optional[CategoryOut] = None
    address_en: str
    address_mr: str
    distance_from_udgir_km: float
    is_nearby_attraction: bool
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    is_coordinates_approximate: bool
    hero_image: str
    verification_status: str
    is_published: bool
    is_featured: bool

class TouristPlaceOut(TouristPlaceListOut):
    description_en: str
    description_mr: str
    history_en: Optional[str] = None
    history_mr: Optional[str] = None
    culture_en: Optional[str] = None
    culture_mr: Optional[str] = None
    highlights_en: Optional[str] = None
    highlights_mr: Optional[str] = None
    google_maps_url: Optional[str] = None
    opening_hours_en: Optional[str] = None
    opening_hours_mr: Optional[str] = None
    entry_fee_en: Optional[str] = None
    entry_fee_mr: Optional[str] = None
    facilities_en: Optional[str] = None
    facilities_mr: Optional[str] = None
    accessibility_info_en: Optional[str] = None
    accessibility_info_mr: Optional[str] = None
    travel_tips_en: Optional[str] = None
    travel_tips_mr: Optional[str] = None
    source_name: Optional[str] = None
    source_url: Optional[str] = None
    source_type: Optional[str] = None
    last_verified_at: Optional[str] = None
    images: List[PlaceImageOut] = []
    source_references: List[SourceReferenceOut] = []

class TouristPlaceCreate(BaseModel):
    slug: str = Field(..., pattern=r"^[a-z0-9_-]+$", min_length=2, max_length=100)
    name_en: str = Field(..., min_length=2, max_length=150)
    name_mr: str = Field(..., min_length=2, max_length=150)
    tagline_en: Optional[str] = None
    tagline_mr: Optional[str] = None
    description_en: str = Field(..., min_length=5)
    description_mr: str = Field(..., min_length=5)
    history_en: Optional[str] = None
    history_mr: Optional[str] = None
    culture_en: Optional[str] = None
    culture_mr: Optional[str] = None
    highlights_en: Optional[str] = None
    highlights_mr: Optional[str] = None
    category_id: int
    address_en: str = Field(..., min_length=3, max_length=255)
    address_mr: str = Field(..., min_length=3, max_length=255)
    distance_from_udgir_km: float = Field(0.0, ge=0.0)
    is_nearby_attraction: bool = False
    latitude: Optional[float] = Field(None, ge=-90.0, le=90.0)
    longitude: Optional[float] = Field(None, ge=-180.0, le=180.0)
    is_coordinates_approximate: bool = False
    google_maps_url: Optional[str] = None
    opening_hours_en: Optional[str] = None
    opening_hours_mr: Optional[str] = None
    entry_fee_en: Optional[str] = None
    entry_fee_mr: Optional[str] = None
    facilities_en: Optional[str] = None
    facilities_mr: Optional[str] = None
    accessibility_info_en: Optional[str] = None
    accessibility_info_mr: Optional[str] = None
    travel_tips_en: Optional[str] = None
    travel_tips_mr: Optional[str] = None
    hero_image: str = Field(..., min_length=1)
    verification_status: str = "officially_verified"
    source_name: Optional[str] = None
    source_url: Optional[str] = None
    source_type: Optional[str] = None
    last_verified_at: Optional[str] = None
    is_published: bool = True
    is_featured: bool = False
    gallery_images: Optional[List[str]] = None

    @field_validator("slug", "name_en", "name_mr", "description_en", "description_mr", "address_en", "address_mr")
    @classmethod
    def check_not_blank(cls, v: str) -> str:
        if not v or not v.strip():
            raise ValueError("Field cannot be empty or whitespace only")
        return v.strip()

class TouristPlaceUpdate(BaseModel):
    slug: Optional[str] = Field(None, pattern=r"^[a-z0-9_-]+$", min_length=2, max_length=100)
    name_en: Optional[str] = None
    name_mr: Optional[str] = None
    tagline_en: Optional[str] = None
    tagline_mr: Optional[str] = None
    description_en: Optional[str] = None
    description_mr: Optional[str] = None
    history_en: Optional[str] = None
    history_mr: Optional[str] = None
    culture_en: Optional[str] = None
    culture_mr: Optional[str] = None
    highlights_en: Optional[str] = None
    highlights_mr: Optional[str] = None
    category_id: Optional[int] = None
    address_en: Optional[str] = None
    address_mr: Optional[str] = None
    distance_from_udgir_km: Optional[float] = Field(None, ge=0.0)
    is_nearby_attraction: Optional[bool] = None
    latitude: Optional[float] = Field(None, ge=-90.0, le=90.0)
    longitude: Optional[float] = Field(None, ge=-180.0, le=180.0)
    is_coordinates_approximate: Optional[bool] = None
    google_maps_url: Optional[str] = None
    opening_hours_en: Optional[str] = None
    opening_hours_mr: Optional[str] = None
    entry_fee_en: Optional[str] = None
    entry_fee_mr: Optional[str] = None
    facilities_en: Optional[str] = None
    facilities_mr: Optional[str] = None
    accessibility_info_en: Optional[str] = None
    accessibility_info_mr: Optional[str] = None
    travel_tips_en: Optional[str] = None
    travel_tips_mr: Optional[str] = None
    hero_image: Optional[str] = None
    verification_status: Optional[str] = None
    source_name: Optional[str] = None
    source_url: Optional[str] = None
    source_type: Optional[str] = None
    last_verified_at: Optional[str] = None
    is_published: Optional[bool] = None
    is_featured: Optional[bool] = None
    gallery_images: Optional[List[str]] = None

# Hotels & Restaurants
class HotelBase(BaseModel):
    name_en: str
    name_mr: str
    category: str = "Hotel"
    address_en: str
    address_mr: str
    contact_number: Optional[str] = None
    google_maps_url: Optional[str] = None
    facilities_en: Optional[str] = None
    facilities_mr: Optional[str] = None
    price_range: Optional[str] = None
    opening_hours: Optional[str] = None
    booking_website: Optional[str] = None
    image_url: Optional[str] = None
    rating: Optional[float] = None
    review_count: Optional[int] = None
    rating_source: Optional[str] = None
    source_url: Optional[str] = None
    last_checked_at: Optional[str] = None
    verification_status: str = "cross_verified"
    is_published: bool = True

class HotelCreate(HotelBase):
    pass

class HotelOut(HotelBase):
    model_config = ConfigDict(from_attributes=True)

    id: int

class RestaurantBase(BaseModel):
    name_en: str
    name_mr: str
    category: str = "Family Restaurant"
    cuisine_type_en: str
    cuisine_type_mr: str
    is_pure_veg: bool = True
    address_en: str
    address_mr: str
    contact_number: Optional[str] = None
    google_maps_url: Optional[str] = None
    opening_hours: Optional[str] = None
    price_range: Optional[str] = None
    popular_dishes_en: Optional[str] = None
    popular_dishes_mr: Optional[str] = None
    facilities_en: Optional[str] = None
    facilities_mr: Optional[str] = None
    rating: Optional[float] = None
    review_count: Optional[int] = None
    rating_source: Optional[str] = None
    source_url: Optional[str] = None
    last_checked_at: Optional[str] = None
    image_url: Optional[str] = None
    verification_status: str = "cross_verified"
    is_published: bool = True

class RestaurantCreate(RestaurantBase):
    pass

class RestaurantOut(RestaurantBase):
    model_config = ConfigDict(from_attributes=True)

    id: int

# Itinerary Schemas
class ItineraryItemOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    order_index: int
    day_number: int
    time_slot_en: str
    time_slot_mr: str
    activity_title_en: str
    activity_title_mr: str
    description_en: str
    description_mr: str
    travel_tips_en: Optional[str] = None
    travel_tips_mr: Optional[str] = None
    place_id: Optional[int] = None

class ItineraryOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    slug: str
    title_en: str
    title_mr: str
    duration_type: str
    description_en: str
    description_mr: str
    overview_en: Optional[str] = None
    overview_mr: Optional[str] = None
    items: List[ItineraryItemOut] = []

# Gallery Image
class GalleryImageOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    title_en: str
    title_mr: str
    category: str
    image_url: str
    description_en: Optional[str] = None
    description_mr: Optional[str] = None
    attribution: Optional[str] = None
    source_url: Optional[str] = None
    license: str

# Contact & Feedback
class ContactMessageCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: str = Field(..., min_length=5, max_length=150)
    phone: Optional[str] = None
    subject: str = Field(..., min_length=3, max_length=200)
    message: str = Field(..., min_length=10)

    @field_validator("email")
    @classmethod
    def validate_email_format(cls, v: str) -> str:
        trimmed = v.strip() if isinstance(v, str) else ""
        if not re.match(r"^[^@\s]+@[^@\s]+\.[^@\s]+$", trimmed):
            raise ValueError("Invalid email format")
        return trimmed

    @field_validator("name", "subject", "message")
    @classmethod
    def check_not_blank(cls, v: str) -> str:
        if not v or not v.strip():
            raise ValueError("Field cannot be empty or whitespace only")
        return v.strip()

class ContactMessageOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    email: str
    phone: Optional[str] = None
    subject: str
    message: str
    created_at: datetime
    is_read: bool

class VisitorFeedbackCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: str = Field(..., min_length=5, max_length=150)
    rating: int = Field(..., ge=1, le=5)
    visit_purpose: Optional[str] = None
    destination_visited: Optional[str] = None
    comments: str = Field(..., min_length=5)

    @field_validator("email")
    @classmethod
    def validate_email_format(cls, v: str) -> str:
        trimmed = v.strip() if isinstance(v, str) else ""
        if not re.match(r"^[^@\s]+@[^@\s]+\.[^@\s]+$", trimmed):
            raise ValueError("Invalid email format")
        return trimmed

    @field_validator("name", "comments")
    @classmethod
    def check_not_blank(cls, v: str) -> str:
        if not v or not v.strip():
            raise ValueError("Field cannot be empty or whitespace only")
        return v.strip()

class VisitorFeedbackOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    email: str
    rating: int
    visit_purpose: Optional[str] = None
    destination_visited: Optional[str] = None
    comments: str
    created_at: datetime
