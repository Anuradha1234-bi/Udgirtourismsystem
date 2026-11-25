# EXPLORE UDGIR (एक्सप्लोर उदगीर)

> **Discover History. Explore Nature. Experience Udgir.**  
> *उदगीरचा ऐतिहासिक आणि सांस्कृतिक वारसा अनुभवा.*

[![Tests](https://img.shields.io/badge/tests-19%20passed-brightgreen.svg)]()
[![FastAPI](https://img.shields.io/badge/backend-FastAPI%200.110+-teal.svg)]()
[![React](https://img.shields.io/badge/frontend-React%2018%20%2B%20Vite-blue.svg)]()
[![Bilingual](https://img.shields.io/badge/language-English%20%7C%20मराठी-gold.svg)]()
[![License](https://img.shields.io/badge/license-CC--BY--SA-orange.svg)]()

Explore Udgir is a full-stack, responsive, and bilingual (English and Marathi) digital tourism guide for the historic city of **Udgir, Latur District, Maharashtra, India**. 

Built with **React, Vite, Leaflet, and FastAPI**, this platform provides tourists, history enthusiasts, students, and residents with verified information on ancient Deccan forts, rock-cut caves, eco-tourism plateaus, sacred vihars, traditional cuisine, hotels, and travel itineraries—adhering strictly to a **zero-fabrication fact-checking policy**.

---

## 🏛️ Key Features

- **🌐 Complete Marathi-English Bilingual System**: Instant client-side language toggle with persistent storage, full Unicode Marathi typography, and dual-language database models.
- **🏰 Verified Destination Discovery & Real Photos**: Genuine photographs of Udgir Fort (District Administration & Wikimedia), Hattibet-Devarjan (Zilla Parishad Latur), and Vishwashanti Buddha Vihar (Rashtrapati Bhavan Digital Library). Authentic coming-soon placeholders for unphotographed sites.
- **👩‍💼 Visitor Assistance & Guide Profile**: Managed by **Anuradha Biradar** with direct WhatsApp chat, click-to-call phone (`+91 9021964018`), and email assistance, with transparent non-governmental disclosure.
- **🍽️ Comprehensive 16-Restaurant Dining Directory**: Searchable, filterable by cuisine/category, pure-veg toggle, sortable by rating (★), review counts, and safe Google Maps directions.
- **🏨 Candidate Accommodation Directory**: Verified lodging options (Hotel Shivprasad Grand, Maharaja Lodging, Hotel Isha Continental, Rajeshwari Lodge, ShivSagar Lodge, V2 Hotel) with facilities and maps.
- **🗺️ Interactive Leaflet Map**: OpenStreetMap integration with category-coded markers, rich preview popups, Google Maps turn-by-turn directions links, and privacy-respecting GPS geolocation.
- **📜 Documented History & Heritage**: Objective historiography covering the 1760 Battle of Udgir (Sadashivrao Bhau vs Nizam), fort construction dating debates (12th c. Yadava origins vs 14th c. Bahmani expansions), and the 1948 Hyderabad Mukti Sangram.
- **🍲 Authentic Food & Living Culture**: Realistic culinary guides to Jowar Bhakri, Pithla, Zunka, garlic thecha, and Puran Poli, alongside border-region Marathi-Kannada cultural traditions.
- **📅 Curated Travel Itineraries**: 1-Day Express, 2-Day Comprehensive Tour, and Nature Eco-Trails with suggested timelines and practical tips.
- **📷 Licensed Photo Gallery**: Filterable photo showcase featuring licensed and public-domain photography with full source attributions and lightbox modal.
- **🔒 Secure Administrator Portal**: Role-based JWT authentication, dashboard analytics, destination CRUD operations, publication toggles, verification status management, and message auditing.
- **🛡️ Strict Fact-Checking & Source Audit**: Every destination links to verified sources (Latur District Collectorate, ZP Latur, President of India Secretariat, ASI).

---

## 🎨 Visual Identity & Palette

- **Forest Green**: `#173F35` (Primary branding)
- **Deep Green**: `#102F29` (Navigation, footer & high-contrast elements)
- **Warm Cream**: `#F7F3E9` (Background canvas)
- **Golden Accent**: `#C6A15B` (Badges, accents & call-to-action highlights)
- **White**: `#FFFFFF` (Surface cards)
- **Soft Grey**: `#EAE8E1` (Borders & dividers)

---

## 📂 Project Structure

```
udgirtourisms/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   ├── endpoints/
│   │   │   │   ├── admin.py          # Admin auth, dashboard metrics & CRUD
│   │   │   │   ├── categories.py     # Taxonomy classification endpoints
│   │   │   │   ├── contact.py        # Public contact inquiry submissions
│   │   │   │   ├── feedback.py       # Visitor feedback submissions
│   │   │   │   ├── gallery.py        # Licensed photo gallery
│   │   │   │   ├── hotels.py         # Verified accommodations
│   │   │   │   ├── itineraries.py    # Curated travel itineraries
│   │   │   │   ├── places.py         # Destinations listing, search & slug detail
│   │   │   │   └── restaurants.py    # Local dining & bhojnalayas
│   │   │   └── router.py             # Consolidated master API router
│   │   ├── core/
│   │   │   ├── config.py             # Settings & environment variables
│   │   │   └── security.py           # Bcrypt hashing & JWT token handling
│   │   ├── database/
│   │   │   ├── init_db.py            # Database initializer & auto-migration
│   │   │   ├── seed_data.py          # Verified initial tourism data seeder
│   │   │   └── session.py            # SQLAlchemy database engine & session
│   │   ├── models/
│   │   │   └── models.py             # SQLAlchemy entities with bilingual columns
│   │   ├── schemas/
│   │   │   └── schemas.py            # Pydantic V2 input/output models
│   │   └── main.py                   # FastAPI app entrypoint with CORS & lifespan
│   ├── tests/
│   │   └── test_api.py               # Automated pytest suite (16 test cases)
│   ├── requirements.txt              # Backend Python dependencies
│   └── run.py                        # Uvicorn server launcher
├── frontend/
│   ├── public/
│   │   └── favicon.svg               # Brand vector favicon
│   ├── src/
│   │   ├── components/
│   │   │   ├── Footer.jsx            # Disclaimer & emergency helplines
│   │   │   ├── InteractiveMap.jsx    # Leaflet map with category pins
│   │   │   ├── Navbar.jsx            # Bilingual sticky navigation & mobile drawer
│   │   │   ├── PlaceCard.jsx         # Card with status badge & distance
│   │   │   └── VerificationBadge.jsx # Visual audit badge
│   │   ├── context/
│   │   │   ├── AuthContext.jsx       # Admin session management
│   │   │   └── LanguageContext.jsx   # English/Marathi persistence
│   │   ├── pages/
│   │   │   ├── AboutContactPage.jsx  # Disclaimer, helplines & working forms
│   │   │   ├── AdminDashboardPage.jsx# Admin metrics, places CRUD & feedback
│   │   │   ├── AdminLoginPage.jsx    # Secure admin login form
│   │   │   ├── FoodCulturePage.jsx   # Culinary history & traditions
│   │   │   ├── GalleryPage.jsx       # Lightbox photo gallery
│   │   │   ├── HistoryPage.jsx       # Battle of 1760 & Mukti Sangram
│   │   │   ├── HomePage.jsx          # Hero, featured places & overview
│   │   │   ├── HotelsPage.jsx        # Lodging & dining directory
│   │   │   ├── ItinerariesPage.jsx   # 1-day, 2-day & nature trails
│   │   │   ├── MapPage.jsx           # Full-screen interactive map
│   │   │   ├── NotFoundPage.jsx      # Custom 404 page
│   │   │   ├── PlaceDetailPage.jsx   # Comprehensive destination dossier
│   │   │   └── PlacesPage.jsx        # Filterable destination discovery
│   │   ├── services/
│   │   │   └── api.js                # REST API client
│   │   ├── styles/
│   │   │   └── theme.css             # Brand styling & responsive grids
│   │   ├── translations/
│   │   │   ├── en.js                 # English dictionary
│   │   │   └── mr.js                 # Authentic Marathi dictionary
│   │   ├── App.jsx                   # React Router root
│   │   └── main.jsx                  # Client entrypoint
│   ├── package.json
│   └── vite.config.js
├── research/
│   ├── destination-research.md       # Fact-checking dossier
│   ├── source-register.md            # Reference registry & audit trail
│   └── verification-status.md        # Explicit verification status log
├── docs/
│   ├── API_DOCUMENTATION.md          # REST API specifications
│   ├── DATABASE_SCHEMA.md            # Entity relational schema
│   ├── SETUP_GUIDE.md                # Running & deployment manual
│   └── UNVERIFIED_INFORMATION.md     # Limitations & unconfirmed data audit
├── .env.example
├── .gitignore
└── README.md
```

---

## ⚡ Quick Start

### 1. Start the Backend API

```bash
cd backend
python -m pip install -r requirements.txt
python run.py
```
- API will start at: `http://127.0.0.1:8000`
- Swagger Documentation: `http://127.0.0.1:8000/docs`
- Health check: `http://127.0.0.1:8000/api/health`
- *Note: On initial launch, the database automatically initializes and populates with verified Udgir tourism data.*

### 2. Start the Frontend Application

```bash
cd frontend
npm install
npm run dev
```
- Visit `http://localhost:5173` in your browser.
- Language switcher in the navbar toggles between **EN** (English) and **मराठी** (Marathi).

### 3. Administrator Access

- URL: `http://localhost:5173/admin/login`
- Default Username: `admin`
- Default Password: `UdgirAdmin#2025`

---

## 🧪 Automated Testing

Execute the backend automated test suite:

```bash
cd backend
python -m pytest tests/test_api.py -v
```

Execute frontend production build verification:

```bash
cd frontend
npm run build
```

---

## 📜 Documentation Links

- [REST API Documentation](docs/API_DOCUMENTATION.md)
- [Database Schema & ER Design](docs/DATABASE_SCHEMA.md)
- [Comprehensive Setup Guide](docs/SETUP_GUIDE.md)
- [Register of Unverified Information & Limitations](docs/UNVERIFIED_INFORMATION.md)
- [Destination Research Dossier](research/destination-research.md)
- [Source Register & Audit Trail](research/source-register.md)
- [Verification Status Registry](research/verification-status.md)

---

## ⚖️ Non-Governmental Tourism Disclaimer

Explore Udgir is an independent digital tourism initiative created for educational and visitor guidance purposes. It is **not** an official agency of the Government of Maharashtra, Latur District Administration, or the Archaeological Survey of India.
