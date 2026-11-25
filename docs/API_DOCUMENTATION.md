# Explore Udgir Tourism REST API Documentation

The Explore Udgir backend is powered by FastAPI, featuring auto-generated interactive OpenAPI/Swagger documentation at `/docs` and ReDoc at `/redoc`.

**Base URL:** `http://127.0.0.1:8000/api`

---

## 1. System & Health Endpoints

### `GET /api/health`
Health check status endpoint verifying server and database connectivity.
- **Response `200 OK`**:
```json
{
  "status": "healthy",
  "service": "Explore Udgir Tourism API",
  "version": "1.0.0",
  "database": "connected"
}
```

---

## 2. Tourist Destinations Endpoints

### `GET /api/places`
Retrieve a list of published tourist destinations with optional filters.
- **Query Parameters:**
  - `category` (string, optional): Filter by category slug (`historical`, `nature`, `religious`, `cultural`, `nearby`).
  - `search` (string, optional): Case-insensitive search across English and Marathi names, taglines, and descriptions.
  - `is_nearby` (boolean, optional): Set `true` for regional attractions (e.g. Ausa Fort, Kharosa Caves) or `false` for Udgir city.
  - `featured` (boolean, optional): Filter featured destinations.
  - `sort_by` (string, default `default`): `default`, `name`, or `distance`.
  - `skip` (integer, default `0`): Pagination offset.
  - `limit` (integer, default `50`): Page size limit (max 100).

### `GET /api/places/{slug}`
Retrieve full destination profile by URL slug (e.g. `udgir-fort`, `vishwashanti-buddha-vihar`).
- **Response `200 OK`**:
```json
{
  "id": 1,
  "slug": "udgir-fort",
  "name_en": "Udgir Fort",
  "name_mr": "उदगीर किल्ला",
  "tagline_en": "Historic Land Fort & Epicenter of the 1760 Battle of Udgir",
  "tagline_mr": "१७६० च्या ऐतिहासिक उदगीर लढाईचा साक्षीदार असणारा अभेद्य भुईकोट किल्ला",
  "category_id": 1,
  "address_en": "Khadkali, Udgir, Latur District, Maharashtra 413517",
  "address_mr": "खडकळी, उदगीर, लातूर जिल्हा, महाराष्ट्र ४१३५१७",
  "distance_from_udgir_km": 0.5,
  "is_nearby_attraction": false,
  "latitude": 18.3970,
  "longitude": 77.1190,
  "is_coordinates_approximate": false,
  "hero_image": "https://upload.wikimedia.org/wikipedia/commons/2/29/Udgir_Fort.jpg",
  "verification_status": "officially_verified",
  "description_en": "...",
  "description_mr": "...",
  "history_en": "...",
  "history_mr": "...",
  "opening_hours_en": "06:00 AM - 06:00 PM (Daily)",
  "entry_fee_en": "Free / Public Access (Subject to ASI guidelines)",
  "source_references": [
    {
      "source_name": "Maharashtra State Gazetteers: Latur District",
      "source_url": "https://latur.gov.in/en/tourism/",
      "source_type": "government_portal"
    }
  ]
}
```

### `GET /api/places/nearby`
Convenience endpoint returning regional attractions situated in adjacent talukas (Ausa Fort, Kharosa Caves).

---

## 3. Categories Endpoints

### `GET /api/categories`
Returns all destination taxonomy categories.

---

## 4. Hotels & Restaurants Endpoints

### `GET /api/hotels`
List hotels and lodges in Udgir.
- **Query Parameters:** `category`, `search`.

### `GET /api/restaurants`
List restaurants, bhojnalayas, and dhabas.
- **Query Parameters:** `category`, `is_pure_veg` (boolean), `search`.

---

## 5. Itineraries & Gallery Endpoints

### `GET /api/itineraries`
Retrieve curated travel schedules with ordered timeline steps.

### `GET /api/gallery`
Retrieve licensed photographs with attribution metadata.
- **Query Parameters:** `category` (`Fort`, `Nature`, `Religious`, `Culture`).

---

## 6. Feedback & Inquiries Endpoints

### `POST /api/contact`
Submit public tourism inquiry.
- **Payload:**
```json
{
  "name": "Full Name",
  "email": "user@example.com",
  "phone": "+91 9876543210",
  "subject": "Guide assistance",
  "message": "Detailed inquiry message..."
}
```

### `POST /api/feedback`
Submit visitor review and star rating.
- **Payload:**
```json
{
  "name": "Visitor Name",
  "email": "visitor@example.com",
  "rating": 5,
  "visit_purpose": "Family",
  "destination_visited": "Vishwashanti Buddha Vihar",
  "comments": "Great peaceful location."
}
```

---

## 7. Protected Administrator Endpoints

Requires `Authorization: Bearer <token>` header.

### `POST /api/admin/login`
Authenticate admin and receive bearer JWT token.
- **Body:** `{"username": "admin", "password": "..."}`

### `GET /api/admin/stats`
Returns live platform metrics: destination count, verified count, unread messages, feedback count.

### `POST /api/admin/places`
Create new destination.

### `PUT /api/admin/places/{id}`
Update existing destination attributes (e.g. toggle publication, change verification status).

### `DELETE /api/admin/places/{id}`
Permanently delete a destination.

### `GET /api/admin/contact-messages`
List all incoming contact messages.

### `PUT /api/admin/contact-messages/{id}/read`
Mark message as read.

### `GET /api/admin/feedback`
List visitor reviews.

### `DELETE /api/admin/feedback/{id}`
Delete a feedback review.
