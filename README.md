# Al-Hadi Online Quran Academy

> **Official Full-Stack Website & Management Platform**  
> **Head Administrator & Instructor:** Abdul Hadi Panhwar  
> **Project Root Directory:** `D:\Quran academy`

---

## 1. Project Purpose & Core Features

**Al-Hadi Online Quran Academy** is a complete, production-grade web application and student management system built for personalized, one-to-one online Quranic education. The platform serves kids and adult learners (boys and girls) across Pakistan, the United Kingdom, the United States, Canada, Qatar, Kuwait, Oman, and worldwide.

### Key Highlights
- **Direct, Instant Navigation (Zero Animation Lag):** Immediate page changes between Home, About, Courses, Quran, Teaching Method, Admission, and Contact without vertical scroll lag, with automatic scroll-to-top.
- **Complete Holy Quran Experience:** All 114 Surahs and 6,236 Ayahs with verified Uthmani Arabic script, verse references, Juz, Ruku, and Sajda markers.
- **Dual Authentic Translations:** Verified Urdu translation by Maulana Fateh Muhammad Jalandhry and English translation by Saheeh International. Strictly excludes machine or AI-generated religious texts.
- **Six Kalimas & Masnoon Duas:** Verified Arabic, Urdu translation, English translation, and authenticated Hadith citations with category filtering.
- **International Time & Islamic Date:** Live IANA timezone clocks covering London, New York, Toronto, Los Angeles, Qatar, Kuwait, Muscat, and Karachi, alongside an astronomical Hijri date calculator with lunar sighting caveats.
- **Automated Admission & Free Trial Portal:** Validated form handling child applicants (with parent/guardian enforcement) and adult students, honeypot anti-spam trap, duplicate submission throttle, and an honest disclaimer explaining that applications do not guarantee admission.
- **Secure Administrator Dashboard:** Protected with bcrypt password hashing and HS256 JWT tokens, featuring overview metrics, application review/approval with automatic student record creation, course management, and private Google Meet / Zoom class scheduling.

---

## 2. Technology Stack

- **Frontend:** React 18, TypeScript, Vite 5, Tailwind CSS v3 (Emerald Green `#065f46`, Gold `#d97706`, Ivory `#fcfaf7`), Lucide React Icons, React Router DOM v6.
- **Backend:** Python 3.14 / 3.12, FastAPI 0.110+, Pydantic v2 Settings, SQLAlchemy 2.0 ORM, PyMySQL, BCrypt, PyJWT.
- **Database:** MySQL 8.0 with InnoDB relational schema, foreign key constraints, indexes, and full UTF8MB4 support.
- **Testing:** Pytest & FastAPI TestClient (17 automated tests covering public APIs, Quran data, admin workflows, and SPA fallback).

---

## 3. Directory Structure

```
D:\Quran academy\
├── 421.jpg                           # Preserved official academy logo
├── photo1.jpg                        # Preserved original logo source
├── .env                              # Local environment configuration
├── .env.example                      # Template environment configuration
├── .gitignore                        # Git exclusion rules
├── README.md                         # This documentation
├── run_app.bat                       # Launch integrated full-stack server
├── run_backend.bat                   # Launch FastAPI backend with reload
├── run_frontend.bat                  # Launch Vite development server
├── run_tests.bat                     # Run automated test suite
├── assets\
│   └── logo.jpg                      # Branded academy emblem
├── database\
│   ├── schema.sql                    # Relational MySQL schema
│   ├── seed_data.sql                 # Verified 114 Surahs, 6236 Ayahs, Kalimas & Duas
│   └── alhadi_academy_db_full_backup.sql # Full pre-migration MySQL backup
├── backend\
│   ├── requirements.txt              # Python dependencies
│   ├── cli.py                        # Administrator & database management CLI
│   ├── app\
│   │   ├── config.py                 # Pydantic environment configuration
│   │   ├── database.py               # SQLAlchemy engine & session dependency
│   │   ├── models.py                 # SQLAlchemy relational ORM models
│   │   ├── schemas.py                # Pydantic v2 request/response schemas
│   │   ├── security.py               # Password hashing & JWT token verification
│   │   ├── main.py                   # FastAPI application, CORS & SPA fallback
│   │   ├── api\
│   │   │   ├── public.py             # Public API endpoints
│   │   │   └── admin.py              # Protected administrator endpoints
│   │   └── services\
│   │       ├── quran_service.py      # Surah/Ayah pagination and search
│   │       ├── hijri_service.py      # Kuwaiti astronomical calendar algorithm
│   │       └── audit_service.py      # Administrative action audit logging
│   └── tests\
│       ├── conftest.py               # Pytest fixtures & authenticated client
│       ├── test_api.py               # Public API & admission validation tests
│       ├── test_admin.py             # Protected admin & scheduling tests
│       └── test_spa.py               # Client SPA fallback & logo tests
└── frontend\
    ├── package.json
    ├── vite.config.ts
    ├── tailwind.config.js
    ├── index.html                    # SEO tags & Arabic/Urdu fonts
    ├── public\
    │   └── logo.jpg                  # Branded favicon & image asset
    ├── dist\                         # Production build distribution
    └── src\
        ├── App.tsx                   # Main router and route definitions
        ├── index.css                 # Tailwind layers & typography
        ├── components\               # Header, Footer, ScrollToTop, Timezone, Hijri
        ├── context\                  # LanguageContext (English & Urdu RTL/LTR)
        ├── services\                 # API client
        ├── types\                    # TypeScript interfaces
        └── pages\                    # Home, About, Courses, Quran, Translation, etc.
```

---

## 4. Prerequisites & Installation on Windows

### Prerequisites
1. **Node.js**: v20.18+ (`node -v` & `npm -v`)
2. **Python**: Python 3.11+ / 3.14 (`python --version`)
3. **MySQL Server 8.0**: Running on port 3306

### Quick Setup Commands
Open Command Prompt or PowerShell in `D:\Quran academy`:

```powershell
# 1. Install Backend Dependencies
pip install -r backend/requirements.txt

# 2. Install Frontend Dependencies
cd frontend
npm install
npm run build
cd ..
```

---

## 5. Database Configuration & Verification

The database configuration is managed in `D:\Quran academy\.env`:

```env
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=1234
MYSQL_DATABASE=alhadi_academy_db
```

### Check Database Content
Verify that all 114 Surahs, 6,236 Ayahs, 6 Kalimas, and 6 Courses are loaded:
```powershell
python backend/cli.py check-db
```

Output:
```
=== Database Content Status ===
Quran Surahs: 114 / 114
Quran Ayahs:  6236 / 6236
Kalimas:      6 / 6
Masnoon Duas: 12
Courses:      6 / 6
Admins:       1
```

### Initial Administrator Setup / Password Reset
Create or change the administrator password securely:
```powershell
python backend/cli.py create-admin --username abdulhadi --password "YourSecurePasswordHere!" --email "admin@alhadi-quran.com" --full-name "Abdul Hadi Panhwar"
```

---

## 6. How to Run the Website

### Option A: Integrated Full-Stack Production Server (Recommended)
Double click `run_app.bat` or run:
```powershell
python -m uvicorn backend.app.main:app --host 127.0.0.1 --port 8000
```
- **Public Website:** [http://127.0.0.1:8000](http://127.0.0.1:8000)
- **Interactive API Documentation:** [http://127.0.0.1:8000/api/docs](http://127.0.0.1:8000/api/docs)
- **Administrator Login Portal:** [http://127.0.0.1:8000/admin/login](http://127.0.0.1:8000/admin/login)

### Option B: Separate Frontend Development Server
1. Backend (Terminal 1):
   ```powershell
   python -m uvicorn backend.app.main:app --host 127.0.0.1 --port 8000 --reload
   ```
2. Frontend (Terminal 2):
   ```powershell
   cd frontend
   npm run dev
   ```
   Opens at [http://localhost:5173](http://localhost:5173).

---

## 7. Running Automated Tests

Run the full automated test suite (17 tests):
```powershell
python -m pytest backend/tests -v
```

All tests execute in ~1 second and verify:
- Health check and MySQL connectivity
- Course listings (all 6 mandatory courses confirmed)
- Complete Quran Surahs (114) and Ayah retrieval (Surah Al-Fatiha verified)
- Six Kalimas and Masnoon Duas
- Hijri astronomical calculation and moon sighting disclaimer
- Application form validation, guardian rules, honeypot, and duplicate throttling
- Admin authentication, JWT security, and unauthorized request rejection
- Administrative application approval and automated student record synchronization
- Private class scheduling and Google Meet / Zoom link protection
- Frontend SPA client-side route fallback and genuine logo image serving

---

## 8. Verified Contact & External Service Configuration

In accordance with strict integrity instructions:
- **WhatsApp Integration:** The `WHATSAPP_NUMBER` in `.env` is intentionally kept unassigned until verified by Abdul Hadi Panhwar. When left empty, the website safely displays a friendly verification notice rather than rendering a broken or fake link. Once verified, simply set `WHATSAPP_NUMBER=+92300xxxxxxx` and the WhatsApp button will activate automatically across the site.
- **Email Contact:** Set `CONTACT_EMAIL=info@alhadi-quran.com` in `.env`.
- **Teaching Platforms:** Google Meet and Zoom links are created and managed manually within the Admin Dashboard for each scheduled class.

---

## 9. Deployment Guide

### Deployment Architecture
- **Frontend:** Can be hosted on Cloudflare Pages, Vercel, or served directly by FastAPI.
- **Backend:** FastAPI hosted on any Python ASGI host (e.g., VPS, Railway, Render, Docker).
- **Database:** Managed MySQL 8.0 (e.g., PlanetScale, AWS RDS, DigitalOcean Managed Database, or self-hosted MySQL).

### Production Build Steps
```powershell
cd frontend
npm run build
```
The output is generated inside `frontend/dist`. When deployed with FastAPI, FastAPI serves `dist` directly with full client-side routing fallback.

---

## 10. Backup and Recovery

A complete MySQL dump of the verified database is preserved at:
`D:\Quran academy\database\alhadi_academy_db_full_backup.sql`

To restore the database at any time:
```powershell
mysql -u root -p alhadi_academy_db < "D:\Quran academy\database\alhadi_academy_db_full_backup.sql"
```
