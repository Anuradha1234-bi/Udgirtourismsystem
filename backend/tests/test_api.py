import pytest
from fastapi.testclient import TestClient
import os
import sys

# Ensure backend root is on sys.path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.main import app
from app.core.config import settings

@pytest.fixture(scope="module")
def client():
    with TestClient(app) as test_client:
        yield test_client

def test_health_check(client):
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "Explore Udgir" in data["service"]

def test_get_categories(client):
    response = client.get("/api/categories")
    assert response.status_code == 200
    categories = response.json()
    assert len(categories) >= 4
    slugs = [c["slug"] for c in categories]
    assert "historical" in slugs
    assert "nature" in slugs
    assert "religious" in slugs

def test_get_places(client):
    response = client.get("/api/places")
    assert response.status_code == 200
    places = response.json()
    assert len(places) > 0
    slugs = [p["slug"] for p in places]
    assert "udgir-fort" in slugs
    assert "hattibet-devarjan" in slugs
    assert "vishwashanti-buddha-vihar" in slugs

def test_get_place_detail_udgir_fort(client):
    response = client.get("/api/places/udgir-fort")
    assert response.status_code == 200
    place = response.json()
    assert place["name_en"] == "Udgir Fort"
    assert place["name_mr"] == "उदगीर किल्ला"
    assert place["verification_status"] == "officially_verified"
    assert "1760" in place["history_en"]
    assert "सदाशिवराव" in place["history_mr"]
    assert len(place["source_references"]) > 0

def test_get_place_detail_buddha_vihar(client):
    response = client.get("/api/places/vishwashanti-buddha-vihar")
    assert response.status_code == 200
    place = response.json()
    assert "Droupadi Murmu" in place["description_en"]
    assert "सांची" in place["description_mr"]

def test_filter_places_by_category(client):
    response = client.get("/api/places?category=historical")
    assert response.status_code == 200
    places = response.json()
    assert all(p["category"]["slug"] == "historical" for p in places if p["category"])

def test_search_places(client):
    response = client.get("/api/places?search=Buddha")
    assert response.status_code == 200
    places = response.json()
    assert len(places) >= 1
    assert "Buddha" in places[0]["name_en"]

def test_get_nearby_attractions(client):
    response = client.get("/api/places/nearby")
    assert response.status_code == 200
    nearby = response.json()
    assert len(nearby) >= 2
    slugs = [p["slug"] for p in nearby]
    assert "ausa-fort" in slugs
    assert "kharosa-caves" in slugs

def test_get_hotels(client):
    response = client.get("/api/hotels")
    assert response.status_code == 200
    hotels = response.json()
    assert len(hotels) >= 2
    names = [h["name_en"] for h in hotels]
    assert any("Shivprasad" in n for n in names)

def test_get_restaurants(client):
    response = client.get("/api/restaurants")
    assert response.status_code == 200
    restaurants = response.json()
    assert len(restaurants) >= 3
    # Test pure veg filter
    veg_response = client.get("/api/restaurants?is_pure_veg=true")
    assert veg_response.status_code == 200
    veg_places = veg_response.json()
    assert all(r["is_pure_veg"] is True for r in veg_places)

def test_get_itineraries(client):
    response = client.get("/api/itineraries")
    assert response.status_code == 200
    itineraries = response.json()
    assert len(itineraries) >= 2
    slugs = [it["slug"] for it in itineraries]
    assert "one-day-udgir-express" in slugs

def test_get_gallery(client):
    response = client.get("/api/gallery")
    assert response.status_code == 200
    gallery = response.json()
    assert len(gallery) >= 3

def test_submit_contact_form(client):
    payload = {
        "name": "Rohan Deshmukh",
        "email": "rohan.deshmukh@example.com",
        "phone": "+91 9876543210",
        "subject": "Inquiry regarding Udgir Fort Tour Guide",
        "message": "Hello, I am visiting Udgir next weekend and would like information about local guide availability."
    }
    response = client.post("/api/contact", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["email"] == "rohan.deshmukh@example.com"
    assert data["is_read"] is False

def test_submit_visitor_feedback(client):
    payload = {
        "name": "Pooja Patil",
        "email": "pooja.patil@example.com",
        "rating": 5,
        "visit_purpose": "Family",
        "destination_visited": "Vishwashanti Buddha Vihar",
        "comments": "The Buddha Vihar is extraordinarily peaceful and well-maintained. A proud landmark for Udgir!"
    }
    response = client.post("/api/feedback", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["rating"] == 5

def test_admin_authentication_and_stats(client):
    # Test invalid login
    bad_login = client.post("/api/admin/login", json={"username": settings.ADMIN_USERNAME, "password": "wrongpassword"})
    assert bad_login.status_code == 401

    # Test valid login
    good_login = client.post("/api/admin/login", json={
        "username": settings.ADMIN_USERNAME,
        "password": settings.ADMIN_PASSWORD
    })
    assert good_login.status_code == 200
    token_data = good_login.json()
    assert "access_token" in token_data
    token = token_data["access_token"]

    # Test access protected stats endpoint
    headers = {"Authorization": f"Bearer {token}"}
    stats_response = client.get("/api/admin/stats", headers=headers)
    assert stats_response.status_code == 200
    stats = stats_response.json()
    assert stats["total_places"] > 0
    assert stats["verified_places"] > 0
    assert stats["total_messages"] >= 1

def test_nonexistent_place_404(client):
    response = client.get("/api/places/non-existent-destination-xyz")
    assert response.status_code == 404

def test_restaurant_directory_all_16(client):
    response = client.get("/api/restaurants")
    assert response.status_code == 200
    restaurants = response.json()
    assert len(restaurants) == 16
    names = [r["name_en"] for r in restaurants]
    expected_sample = [
        "New Broadway", "Mazaika Kitchen", "Ketki Pure Veg",
        "Sadhana Pure Veg", "Naik's Fine Dine", "Tulsi Pure Veg",
        "Naadbramha Idli", "Cafe7", "Naivedyam Resto",
        "Pandu Dhaba", "Sai Pure Veg", "Redchilliz Biryani House",
        "Aroma Lawn & Restaurant", "Pawar's Cafe", "One Bite", "Hotel Saikrupa"
    ]
    for exp in expected_sample:
        assert exp in names, f"Missing expected restaurant: {exp}"
    
    # Check that ratings, review counts, and safe google maps URLs are present
    for r in restaurants:
        assert r["rating"] is not None and r["rating"] > 0
        assert r["review_count"] is not None and r["review_count"] > 0
        assert "maps/search" in r["google_maps_url"]
        assert "Needs verification" in r["rating_source"] or "User-supplied" in r["rating_source"]

def test_hotel_directory_candidates(client):
    response = client.get("/api/hotels")
    assert response.status_code == 200
    hotels = response.json()
    assert len(hotels) >= 4
    names = [h["name_en"] for h in hotels]
    assert "Hotel Shivprasad Grand" in names
    assert "Maharaja Lodging" in names
    assert "Hotel Isha Continental" in names

def test_priority_destinations_genuine_images(client):
    for slug in ["udgir-fort", "hattibet-devarjan", "vishwashanti-buddha-vihar"]:
        res = client.get(f"/api/places/{slug}")
        assert res.status_code == 200
        place = res.json()
        assert place["hero_image"].startswith("/assets/destinations/") or "s3waas.gov.in" in place["hero_image"] or "rashtrapatibhavan.gov.in" in place["hero_image"]
        assert "unsplash.com" not in place["hero_image"], f"{slug} must not use generic unsplash image"

