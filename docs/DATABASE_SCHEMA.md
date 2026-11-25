# Explore Udgir Database Schema

Explore Udgir utilizes SQLAlchemy ORM with support for PostgreSQL in production and SQLite as an out-of-the-box local development fallback.

---

## Entity Relationship Overview

```
[Category] 1 --- * [TouristPlace] 1 --- * [PlaceImage]
                            |
                            | --- * [SourceReference]
                            |
                            | --- * [ItineraryItem] * --- 1 [Itinerary]

[Hotel]          (Independent lodging registry)
[Restaurant]     (Independent dining registry)
[GalleryImage]   (Licensed photography registry)
[ContactMessage] (Visitor inquiries)
[VisitorFeedback](Visitor ratings & comments)
[AdminUser]      (Administrator authentication)
```

---

## 1. `tourist_places`
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | Integer | PK, Auto Increment | Primary identifier |
| `slug` | String(100) | Unique, Indexed, Not Null | URL slug |
| `name_en` | String(150) | Indexed, Not Null | English title |
| `name_mr` | String(150) | Indexed, Not Null | Marathi title in Devanagari |
| `tagline_en` | String(255) | Nullable | Short English summary |
| `tagline_mr` | String(255) | Nullable | Short Marathi summary |
| `description_en` | Text | Not Null | Detailed English overview |
| `description_mr` | Text | Not Null | Detailed Marathi overview |
| `history_en` | Text | Nullable | Historical background |
| `history_mr` | Text | Nullable | Historical background in Marathi |
| `culture_en` | Text | Nullable | Cultural & religious context |
| `culture_mr` | Text | Nullable | Cultural context in Marathi |
| `highlights_en` | Text | Nullable | Key features / attractions |
| `highlights_mr` | Text | Nullable | Key features in Marathi |
| `category_id` | Integer | FK (`categories.id`), Not Null | Category classification |
| `address_en` | String(255) | Not Null | Street & locality address |
| `address_mr` | String(255) | Not Null | Street address in Marathi |
| `distance_from_udgir_km` | Float | Default `0.0`, Not Null | Distance from Udgir center |
| `is_nearby_attraction` | Boolean | Default `False` | Distinguishes Udgir city from Ausa/Kharosa |
| `latitude` | Float | Nullable | Verified latitude |
| `longitude` | Float | Nullable | Verified longitude |
| `is_coordinates_approximate` | Boolean | Default `False` | Flags non-surveyed coordinates |
| `google_maps_url` | String(500) | Nullable | Directions link |
| `opening_hours_en` | String(150) | Nullable | Visiting hours |
| `entry_fee_en` | String(150) | Nullable | Entry charges |
| `facilities_en` | String(255) | Nullable | Available amenities |
| `accessibility_info_en` | String(255) | Nullable | Ramp / wheelchair information |
| `travel_tips_en` | Text | Nullable | Practical visitor advice |
| `hero_image` | String(500) | Not Null | Main cover photograph URL |
| `verification_status` | String(50) | Default `officially_verified` | Confidence status |
| `source_name` | String(255) | Nullable | Source publication name |
| `source_url` | String(500) | Nullable | Source document link |
| `source_type` | String(100) | Nullable | Government, academic, press |
| `last_verified_at` | String(50) | Nullable | Audit timestamp (e.g. `2024-11`) |
| `is_published` | Boolean | Default `True` | Public visibility flag |
| `is_featured` | Boolean | Default `False` | Homepage showcase flag |
| `created_at` | DateTime | Default `utcnow` | Creation timestamp |
| `updated_at` | DateTime | Default `utcnow`, OnUpdate | Modification timestamp |

---

## 2. `categories`
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | Integer | PK, Auto Increment | Category ID |
| `slug` | String(50) | Unique, Indexed, Not Null | URL slug |
| `name_en` | String(100) | Not Null | English title |
| `name_mr` | String(100) | Not Null | Marathi title |
| `description_en` | Text | Nullable | English description |
| `description_mr` | Text | Nullable | Marathi description |
| `icon_name` | String(50) | Nullable | Lucide React icon name |

---

## 3. `source_references`
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | Integer | PK, Auto Increment | Reference ID |
| `place_id` | Integer | FK (`tourist_places.id`), Not Null | Destination relation |
| `source_name` | String(255) | Not Null | Reference name |
| `source_url` | String(500) | Nullable | Online link |
| `source_type` | String(100) | Not Null | `government_portal`, `gazetteer`, etc. |
| `verification_notes` | Text | Nullable | Scope of verification |
| `verified_date` | String(50) | Nullable | Audit date |

---

## 4. `hotels` & `restaurants`
- `hotels`: Accommodations with `name_en`, `name_mr`, `category`, `address_en`, `address_mr`, `contact_number`, `facilities_en`, `price_range`, `google_maps_url`, `verification_status`.
- `restaurants`: Dining options with `name_en`, `name_mr`, `category`, `cuisine_type_en`, `is_pure_veg`, `address_en`, `popular_dishes_en`, `price_range`.

---

## 5. `itineraries` & `itinerary_items`
- `itineraries`: High level tours (`one-day-udgir-express`, `two-day-udgir-and-surrounds`, `nature-eco-tourism-itinerary`).
- `itinerary_items`: Ordered steps with `time_slot_en`, `activity_title_en`, `description_en`, `travel_tips_en`, and optional foreign key to `tourist_places`.

---

## 6. `admin_users`
- Stores hashed passwords via bcrypt and JWT authentication tokens.
