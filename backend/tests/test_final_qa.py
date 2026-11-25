import pytest
from fastapi.testclient import TestClient
import os
import sys
import jwt
from datetime import datetime, timedelta, timezone

# Ensure backend root is on sys.path
sys.path.insert(0, r"c:\Users\hp\Desktop\udgirtourisms\backend")

from app.main import app
from app.core.config import settings

@pytest.fixture(scope="module")
def client():
    with TestClient(app) as test_client:
        yield test_client

@pytest.fixture(scope="module")
def admin_token(client):
    login_res = client.post("/api/admin/login", json={
        "username": settings.ADMIN_USERNAME,
        "password": settings.ADMIN_PASSWORD
    })
    assert login_res.status_code == 200, f"Admin login failed: {login_res.text}"
    return login_res.json()["access_token"]

# ==============================================================================
# SECTION 1: PUBLIC API & FUNCTIONAL TESTS
# ==============================================================================

def test_health_and_root(client):
    res = client.get("/api/health")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "healthy"
    assert data["database"] == "connected"

    root_res = client.get("/")
    assert root_res.status_code == 200
    assert "documentation" in root_res.json()

def test_categories_api(client):
    res = client.get("/api/categories")
    assert res.status_code == 200
    categories = res.json()
    assert len(categories) >= 5
    for c in categories:
        assert "id" in c
        assert "slug" in c
        assert "name_en" in c and len(c["name_en"]) > 0
        assert "name_mr" in c and len(c["name_mr"]) > 0

def test_places_sorting_and_pagination(client):
    # Default sorting
    res_def = client.get("/api/places?limit=5")
    assert res_def.status_code == 200
    places_def = res_def.json()
    assert len(places_def) <= 5

    # Sort by name
    res_name = client.get("/api/places?sort_by=name")
    assert res_name.status_code == 200
    names = [p["name_en"] for p in res_name.json()]
    assert names == sorted(names)

    # Sort by distance
    res_dist = client.get("/api/places?sort_by=distance")
    assert res_dist.status_code == 200
    distances = [p["distance_from_udgir_km"] for p in res_dist.json()]
    assert distances == sorted(distances)

def test_places_boolean_filters(client):
    # is_nearby = True
    res_nearby = client.get("/api/places?is_nearby=true")
    assert res_nearby.status_code == 200
    nearby = res_nearby.json()
    assert all(p["is_nearby_attraction"] is True for p in nearby)

    # is_nearby = False
    res_udgir = client.get("/api/places?is_nearby=false")
    assert res_udgir.status_code == 200
    udgir = res_udgir.json()
    assert all(p["is_nearby_attraction"] is False for p in udgir)

    # featured = True
    res_feat = client.get("/api/places?featured=true")
    assert res_feat.status_code == 200
    feat = res_feat.json()
    assert all(p["is_featured"] is True for p in feat)

def test_places_search_marathi_and_english(client):
    # English search
    res_en = client.get("/api/places?search=Fort")
    assert res_en.status_code == 200
    assert any("Fort" in p["name_en"] for p in res_en.json())

    # Marathi search
    res_mr = client.get("/api/places?search=किल्ला")
    assert res_mr.status_code == 200
    assert any("किल्ला" in p["name_mr"] for p in res_mr.json())

def test_hotels_and_restaurants_search(client):
    # Hotel search
    res_h = client.get("/api/hotels?search=Shivprasad")
    assert res_h.status_code == 200
    assert len(res_h.json()) >= 1

    # Restaurant pure veg filter
    res_r_veg = client.get("/api/restaurants?is_pure_veg=true")
    assert res_r_veg.status_code == 200
    assert all(r["is_pure_veg"] is True for r in res_r_veg.json())

    # Restaurant search
    res_r_search = client.get("/api/restaurants?search=Mazaika")
    assert res_r_search.status_code == 200
    assert any("Mazaika" in r["name_en"] for r in res_r_search.json())

def test_itineraries_endpoints(client):
    res = client.get("/api/itineraries")
    assert res.status_code == 200
    itineraries = res.json()
    assert len(itineraries) >= 3

    # Check detail by slug
    slug = itineraries[0]["slug"]
    res_detail = client.get(f"/api/itineraries/{slug}")
    assert res_detail.status_code == 200
    detail = res_detail.json()
    assert detail["slug"] == slug
    assert len(detail["items"]) > 0

    # Non-existent itinerary
    res_404 = client.get("/api/itineraries/non-existent-itinerary-slug")
    assert res_404.status_code == 404

def test_gallery_endpoints(client):
    res_all = client.get("/api/gallery")
    assert res_all.status_code == 200
    assert len(res_all.json()) >= 4

    res_fort = client.get("/api/gallery?category=Fort")
    assert res_fort.status_code == 200
    assert all("Fort" in img["category"] for img in res_fort.json())

# ==============================================================================
# SECTION 2: FORMS & SUBMISSIONS VALIDATION
# ==============================================================================

def test_contact_form_validation(client):
    # Valid submission
    valid_payload = {
        "name": "Sunil Shinde",
        "email": "sunil.shinde@example.com",
        "phone": "+91 9123456789",
        "subject": "Inquiry on visitor timings",
        "message": "We are a group of 15 students planning to visit Udgir Fort and Buddha Vihar."
    }
    res_valid = client.post("/api/contact", json=valid_payload)
    assert res_valid.status_code == 201
    assert res_valid.json()["email"] == "sunil.shinde@example.com"

    # Missing required message
    bad_payload = {
        "name": "Sunil",
        "email": "sunil@example.com",
        "subject": "Hi"
    }
    res_bad = client.post("/api/contact", json=bad_payload)
    assert res_bad.status_code == 422

def test_visitor_feedback_validation(client):
    # Valid feedback
    valid_fb = {
        "name": "Ananya Kulkarni",
        "email": "ananya.k@example.com",
        "rating": 5,
        "visit_purpose": "Cultural Research",
        "destination_visited": "Hattibet-Devarjan",
        "comments": "The eco-restoration and quiet mountain trails are truly inspiring."
    }
    res_valid = client.post("/api/feedback", json=valid_fb)
    assert res_valid.status_code == 201

    # Invalid rating (> 5)
    bad_rating_high = valid_fb.copy()
    bad_rating_high["rating"] = 6
    res_bad1 = client.post("/api/feedback", json=bad_rating_high)
    assert res_bad1.status_code == 422

    # Invalid rating (< 1)
    bad_rating_low = valid_fb.copy()
    bad_rating_low["rating"] = 0
    res_bad2 = client.post("/api/feedback", json=bad_rating_low)
    assert res_bad2.status_code == 422

# ==============================================================================
# SECTION 3: AUTHENTICATION & SECURITY AUDIT
# ==============================================================================

def test_admin_unauthorized_access(client):
    # Access without Authorization header
    res_stats = client.get("/api/admin/stats")
    assert res_stats.status_code == 401

    res_places = client.get("/api/admin/places")
    assert res_places.status_code == 401

    res_post = client.post("/api/admin/places", json={})
    assert res_post.status_code == 401

def test_admin_invalid_or_expired_jwt(client):
    # Malformed token
    res_malformed = client.get("/api/admin/stats", headers={"Authorization": "Bearer not-a-valid-jwt"})
    assert res_malformed.status_code == 401

    # Forged token with wrong secret
    forged_token = jwt.encode({"sub": "admin"}, "wrong_secret_key_12345", algorithm="HS256")
    res_forged = client.get("/api/admin/stats", headers={"Authorization": f"Bearer {forged_token}"})
    assert res_forged.status_code == 401

    # Expired token
    expired_token = jwt.encode(
        {"sub": "admin", "exp": datetime.now(timezone.utc) - timedelta(hours=1)},
        settings.SECRET_KEY,
        algorithm=settings.ALGORITHM
    )
    res_expired = client.get("/api/admin/stats", headers={"Authorization": f"Bearer {expired_token}"})
    assert res_expired.status_code == 401

def test_sql_injection_resilience(client):
    sql_payloads = [
        "' OR '1'='1",
        "'; DROP TABLE tourist_places; --",
        "1' UNION SELECT username, hashed_password FROM admin_users --",
        "admin'--"
    ]
    for payload in sql_payloads:
        # Search endpoint
        res = client.get(f"/api/places?search={payload}")
        assert res.status_code == 200, f"SQL injection payload triggered error: {payload}"
        
        # Slug endpoint
        res_slug = client.get(f"/api/places/{payload}")
        assert res_slug.status_code in (404, 422), f"Slug payload failed safely: {payload}"

def test_admin_login_bad_credentials(client):
    res_user = client.post("/api/admin/login", json={"username": "nonexistent_admin", "password": "password"})
    assert res_user.status_code == 401

    res_pw = client.post("/api/admin/login", json={"username": settings.ADMIN_USERNAME, "password": "wrong_password"})
    assert res_pw.status_code == 401

# ==============================================================================
# SECTION 4: FULL ADMIN CRUD WORKFLOW
# ==============================================================================

def test_full_destination_crud_lifecycle(client, admin_token):
    headers = {"Authorization": f"Bearer {admin_token}"}

    # 1. Get Categories to use a valid category_id
    cat_res = client.get("/api/categories")
    assert cat_res.status_code == 200
    category_id = cat_res.json()[0]["id"]

    # 2. CREATE a new destination
    test_slug = "qa-automated-test-destination"
    create_payload = {
        "slug": test_slug,
        "name_en": "QA Test Heritage Monument",
        "name_mr": "क्यूए चाचणी वारसा स्मारक",
        "tagline_en": "Automated End-to-End Test Destination",
        "tagline_mr": "स्वयंचलित चाचणी पर्यटन स्थळ",
        "description_en": "Detailed description of the QA test heritage site for testing CRUD lifecycle.",
        "description_mr": "चाचणी स्थळाचे मराठीतील सविस्तर वर्णन.",
        "category_id": category_id,
        "address_en": "Main Road, Udgir, Maharashtra 413517",
        "address_mr": "मुख्य रस्ता, उदगीर, महाराष्ट्र ४१३५१७",
        "distance_from_udgir_km": 1.5,
        "is_nearby_attraction": False,
        "latitude": 18.3950,
        "longitude": 77.1180,
        "is_coordinates_approximate": False,
        "hero_image": "/assets/destinations/placeholder-monument.svg",
        "gallery_images": [
            "/assets/destinations/udgir-fort.png"
        ],
        "verification_status": "officially_verified",
        "is_published": True,
        "is_featured": False
    }

    create_res = client.post("/api/admin/places", json=create_payload, headers=headers)
    assert create_res.status_code == 201, f"Create failed: {create_res.text}"
    created_place = create_res.json()
    place_id = created_place["id"]
    assert created_place["slug"] == test_slug

    # 3. VERIFY duplicate slug returns 400
    dup_res = client.post("/api/admin/places", json=create_payload, headers=headers)
    assert dup_res.status_code == 400
    assert "already exists" in dup_res.json()["detail"]

    # 4. READ via public API
    public_res = client.get(f"/api/places/{test_slug}")
    assert public_res.status_code == 200
    assert public_res.json()["name_en"] == "QA Test Heritage Monument"

    # 5. READ via admin API
    admin_detail_res = client.get(f"/api/admin/places/{place_id}", headers=headers)
    assert admin_detail_res.status_code == 200
    assert admin_detail_res.json()["id"] == place_id

    # 6. UPDATE destination
    update_payload = {
        "name_en": "QA Test Heritage Monument (Updated)",
        "is_featured": True,
        "is_published": False  # unpublish
    }
    update_res = client.put(f"/api/admin/places/{place_id}", json=update_payload, headers=headers)
    assert update_res.status_code == 200
    updated_place = update_res.json()
    assert updated_place["name_en"] == "QA Test Heritage Monument (Updated)"
    assert updated_place["is_featured"] is True
    assert updated_place["is_published"] is False

    # 7. VERIFY unpublished place is hidden from public API
    pub_check = client.get(f"/api/places/{test_slug}")
    assert pub_check.status_code == 404

    # 8. RE-PUBLISH place
    client.put(f"/api/admin/places/{place_id}", json={"is_published": True}, headers=headers)
    pub_check2 = client.get(f"/api/places/{test_slug}")
    assert pub_check2.status_code == 200

    # 9. DELETE destination
    del_res = client.delete(f"/api/admin/places/{place_id}", headers=headers)
    assert del_res.status_code == 200

    # 10. VERIFY deletion persists
    assert client.get(f"/api/places/{test_slug}").status_code == 404
    assert client.get(f"/api/admin/places/{place_id}", headers=headers).status_code == 404

def test_admin_messages_and_feedback_auditing(client, admin_token):
    headers = {"Authorization": f"Bearer {admin_token}"}

    # 1. Contact message lifecycle
    submit_msg = client.post("/api/contact", json={
        "name": "Audit Test Visitor",
        "email": "audit.test@example.com",
        "subject": "Audit Check",
        "message": "Checking admin mark read functionality."
    })
    assert submit_msg.status_code == 201
    msg_id = submit_msg.json()["id"]

    msgs_res = client.get("/api/admin/contact-messages", headers=headers)
    assert msgs_res.status_code == 200
    assert any(m["id"] == msg_id for m in msgs_res.json())

    # Mark as read
    read_res = client.put(f"/api/admin/contact-messages/{msg_id}/read", headers=headers)
    assert read_res.status_code == 200

    # 2. Feedback delete lifecycle
    submit_fb = client.post("/api/feedback", json={
        "name": "Audit FB User",
        "email": "audit.fb@example.com",
        "rating": 4,
        "comments": "Good tour experience to be audited."
    })
    assert submit_fb.status_code == 201
    fb_id = submit_fb.json()["id"]

    del_fb_res = client.delete(f"/api/admin/feedback/{fb_id}", headers=headers)
    assert del_fb_res.status_code == 200

# ==============================================================================
# SECTION 5: EDGE CASES & DEFENSIVE INTEGRITY TESTS
# ==============================================================================

def test_nonexistent_category_slug_returns_empty_list(client):
    res = client.get("/api/places?category=completely-invalid-category-xyz")
    assert res.status_code == 200
    assert res.json() == []

def test_admin_create_invalid_category_id_fails(client, admin_token):
    headers = {"Authorization": f"Bearer {admin_token}"}
    payload = {
        "slug": "invalid-cat-destination",
        "name_en": "Invalid Category Monument",
        "name_mr": "अवैध वर्ग स्मारक",
        "description_en": "Valid description text here",
        "description_mr": "वैध वर्णन मजकूर येथे",
        "category_id": 999999,
        "address_en": "Valid Address",
        "address_mr": "वैध पत्ता",
        "hero_image": "/assets/destinations/placeholder-monument.svg"
    }
    res = client.post("/api/admin/places", json=payload, headers=headers)
    assert res.status_code == 400
    assert "does not exist" in res.json()["detail"]

def test_admin_update_invalid_category_id_fails(client, admin_token):
    headers = {"Authorization": f"Bearer {admin_token}"}
    # Get a valid place id
    places = client.get("/api/places").json()
    place_id = places[0]["id"]
    res = client.put(f"/api/admin/places/{place_id}", json={"category_id": 999999}, headers=headers)
    assert res.status_code == 400
    assert "does not exist" in res.json()["detail"]

def test_whitespace_and_invalid_email_validation(client):
    # Blank name in contact
    res_blank = client.post("/api/contact", json={
        "name": "   ",
        "email": "valid@example.com",
        "subject": "Subject",
        "message": "Valid message text goes here"
    })
    assert res_blank.status_code == 422

    # Invalid email syntax in contact
    res_bad_email = client.post("/api/contact", json={
        "name": "Valid Name",
        "email": "not-an-email-address",
        "subject": "Subject",
        "message": "Valid message text goes here"
    })
    assert res_bad_email.status_code == 422

    # Blank comments in feedback
    res_blank_fb = client.post("/api/feedback", json={
        "name": "Valid Name",
        "email": "user@example.com",
        "rating": 5,
        "comments": "     "
    })
    assert res_blank_fb.status_code == 422

def test_coordinate_bounds_and_slug_validation(client, admin_token):
    headers = {"Authorization": f"Bearer {admin_token}"}
    cat_id = client.get("/api/categories").json()[0]["id"]

    # Invalid latitude > 90
    bad_lat = {
        "slug": "bad-lat-place",
        "name_en": "Bad Lat",
        "name_mr": "वाईट अक्षांश",
        "description_en": "Valid description text",
        "description_mr": "वैध वर्णन मजकूर",
        "category_id": cat_id,
        "address_en": "Valid address",
        "address_mr": "वैध पत्ता",
        "latitude": 95.0,
        "hero_image": "/assets/placeholder.svg"
    }
    assert client.post("/api/admin/places", json=bad_lat, headers=headers).status_code == 422

    # Invalid slug with spaces or uppercase
    bad_slug = {
        "slug": "Bad Slug With Spaces!",
        "name_en": "Bad Slug",
        "name_mr": "वाईट स्लग",
        "description_en": "Valid description text",
        "description_mr": "वैध वर्णन मजकूर",
        "category_id": cat_id,
        "address_en": "Valid address",
        "address_mr": "वैध पत्ता",
        "hero_image": "/assets/placeholder.svg"
    }
    assert client.post("/api/admin/places", json=bad_slug, headers=headers).status_code == 422

