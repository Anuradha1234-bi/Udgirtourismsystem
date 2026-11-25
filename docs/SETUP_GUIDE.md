# Explore Udgir Setup & Deployment Guide

This guide provides step-by-step instructions for running the Explore Udgir portal locally or in production.

---

## 1. Prerequisites
- **Node.js**: v18.0.0 or higher (v22+ verified)
- **Python**: v3.10 or higher (v3.15 verified)
- **Git**: For version control
- **PostgreSQL** (optional, recommended for production; SQLite is included as local fallback)

---

## 2. Backend Setup

1. **Navigate to the backend directory:**
```bash
cd backend
```

2. **(Optional) Create and activate a Python virtual environment:**
```bash
python -m venv venv
# On Windows:
.\venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate
```

3. **Install dependencies:**
```bash
python -m pip install -r requirements.txt
```

4. **Initialize and Seed Database:**
The database will automatically initialize and populate with verified Udgir tourism data on application startup. You can also manually trigger initialization:
```bash
python -m app.database.init_db
```

5. **Start the FastAPI backend server:**
```bash
python run.py
```
- API will run on: `http://127.0.0.1:8000`
- Interactive Swagger documentation: `http://127.0.0.1:8000/docs`
- Health check: `http://127.0.0.1:8000/api/health`

---

## 3. Frontend Setup

1. **Navigate to the frontend directory:**
```bash
cd frontend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Run the Vite development server:**
```bash
npm run dev
```
- Frontend will run on: `http://localhost:5173`
- Pre-configured proxy will forward all `/api/*` calls to the FastAPI backend (`http://127.0.0.1:8000`).

4. **Build for production:**
```bash
npm run build
```
The compiled static assets will be output to `frontend/dist/`.

---

## 4. Environment Configuration

Copy `.env.example` to `.env` in the backend directory:

```bash
cp .env.example backend/.env
```

Key environment variables:
- `DATABASE_URL`: `sqlite:///./explore_udgir.db` (Default) or `postgresql://user:password@localhost:5432/explore_udgir`
- `SECRET_KEY`: Cryptographic key for signing JWT tokens.
- `ADMIN_USERNAME`: `admin`
- `ADMIN_PASSWORD`: `UdgirAdmin#2025`

---

## 5. Running Automated Tests

Run the backend test suite:
```bash
cd backend
python -m pytest tests/test_api.py -v
```
All 16 test cases covering endpoints, categories, search, filtering, nearby attractions, contact forms, feedback, and admin authentication will execute.
