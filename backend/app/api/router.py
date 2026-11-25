from fastapi import APIRouter
from app.api.endpoints import (
    places, categories, hotels, restaurants,
    itineraries, gallery, contact, feedback, admin
)

api_router = APIRouter()

api_router.include_router(places.router)
api_router.include_router(categories.router)
api_router.include_router(hotels.router)
api_router.include_router(restaurants.router)
api_router.include_router(itineraries.router)
api_router.include_router(gallery.router)
api_router.include_router(contact.router)
api_router.include_router(feedback.router)
api_router.include_router(admin.router)
