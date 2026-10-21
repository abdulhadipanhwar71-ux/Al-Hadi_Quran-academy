from fastapi import APIRouter, Depends, HTTPException, Query, Request, status
from sqlalchemy.orm import Session
from sqlalchemy import text
from typing import List, Optional
from datetime import datetime, timezone, timedelta

from ..database import get_db
from ..config import settings
from ..models import (
    Course, Application, QuranSurah, QuranAyah, Kalima, MasnoonDua
)
from ..schemas import (
    HealthResponse, CourseResponse, ApplicationCreate, ApplicationResponse,
    MessageResponse, QuranSurahResponse, QuranAyahResponse, KalimaResponse,
    MasnoonDuaResponse, AcademySettingsPublic
)
from ..services.quran_service import get_all_surahs, get_surah_by_number, get_ayahs_by_surah, search_quran_text
from ..services.hijri_service import gregorian_to_hijri

router = APIRouter(prefix="/api", tags=["Public"])

SUPPORTED_TIMEZONES = [
    {"tz": "Asia/Karachi", "label": "Karachi, Pakistan (PKT)"},
    {"tz": "Europe/London", "label": "London, UK (GMT/BST)"},
    {"tz": "America/New_York", "label": "USA - Eastern (New York, EST/EDT)"},
    {"tz": "America/Chicago", "label": "USA - Central (Chicago, CST/CDT)"},
    {"tz": "America/Denver", "label": "USA - Mountain (Denver, MST/MDT)"},
    {"tz": "America/Los_Angeles", "label": "USA - Pacific (Los Angeles, PST/PDT)"},
    {"tz": "America/Toronto", "label": "Canada - Eastern (Toronto, EST/EDT)"},
    {"tz": "America/Winnipeg", "label": "Canada - Central (Winnipeg, CST/CDT)"},
    {"tz": "America/Edmonton", "label": "Canada - Mountain (Edmonton, MST/MDT)"},
    {"tz": "America/Vancouver", "label": "Canada - Pacific (Vancouver, PST/PDT)"},
    {"tz": "Asia/Dubai", "label": "Dubai / UAE (GST)"},
    {"tz": "Asia/Qatar", "label": "Doha, Qatar (AST)"},
    {"tz": "Asia/Kuwait", "label": "Kuwait City, Kuwait (AST)"},
    {"tz": "Asia/Muscat", "label": "Muscat, Oman (GST)"},
    {"tz": "Asia/Riyadh", "label": "Riyadh, Saudi Arabia (AST)"},
    {"tz": "Europe/Berlin", "label": "Western Europe (CET/CEST)"},
]

@router.get("/health", response_model=HealthResponse)
def health_check(db: Session = Depends(get_db)):
    db_status = "connected"
    try:
        db.execute(text("SELECT 1"))
    except Exception as e:
        db_status = f"unhealthy: {str(e)}"

    return HealthResponse(
        status="ok",
        database=db_status,
        version="1.0.0",
        academy_name=settings.APP_NAME
    )

@router.get("/settings", response_model=AcademySettingsPublic)
def get_public_settings():
    whatsapp_url = None
    if settings.WHATSAPP_NUMBER and settings.WHATSAPP_NUMBER.strip():
        clean_num = "".join(filter(str.isdigit, settings.WHATSAPP_NUMBER))
        if clean_num:
            whatsapp_url = f"https://wa.me/{clean_num}"

    return AcademySettingsPublic(
        academy_name=settings.APP_NAME,
        admin_display_name=settings.ADMIN_DISPLAY_NAME,
        contact_email=settings.CONTACT_EMAIL,
        whatsapp_configured=bool(whatsapp_url),
        whatsapp_url=whatsapp_url,
        teaching_platforms=["Google Meet", "Zoom"],
        supported_countries=[
            "Pakistan", "United Kingdom", "United States", "Canada",
            "United Arab Emirates", "Qatar", "Kuwait", "Oman", "Saudi Arabia", "Worldwide"
        ],
        timezones=[tz["tz"] for tz in SUPPORTED_TIMEZONES]
    )

@router.get("/timezones")
def get_timezones():
    return SUPPORTED_TIMEZONES

@router.get("/hijri-date")
def get_hijri_date():
    return gregorian_to_hijri()

@router.get("/courses", response_model=List[CourseResponse])
def get_courses(db: Session = Depends(get_db)):
    return db.query(Course).filter(Course.is_active == True).order_by(Course.display_order.asc()).all()

@router.get("/courses/{code}", response_model=CourseResponse)
def get_course_by_code(code: str, db: Session = Depends(get_db)):
    course = db.query(Course).filter(Course.code == code, Course.is_active == True).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    return course

@router.get("/quran/surahs", response_model=List[QuranSurahResponse])
def get_surahs_list(db: Session = Depends(get_db)):
    return get_all_surahs(db)

@router.get("/quran/surahs/{surah_number}")
def get_surah_detail(
    surah_number: int,
    offset: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=286),
    db: Session = Depends(get_db)
):
    surah = get_surah_by_number(db, surah_number)
    if not surah:
        raise HTTPException(status_code=404, detail=f"Surah #{surah_number} not found")

    ayahs, total_count = get_ayahs_by_surah(db, surah_number, offset=offset, limit=limit)
    return {
        "surah": QuranSurahResponse.model_validate(surah),
        "total_ayahs": total_count,
        "offset": offset,
        "limit": limit,
        "ayahs": [QuranAyahResponse.model_validate(a) for a in ayahs]
    }

@router.get("/quran/search", response_model=List[QuranAyahResponse])
def search_quran(q: str = Query(..., min_length=2), db: Session = Depends(get_db)):
    return search_quran_text(db, q)

@router.get("/kalimas", response_model=List[KalimaResponse])
def get_kalimas(db: Session = Depends(get_db)):
    return db.query(Kalima).order_by(Kalima.number.asc()).all()

@router.get("/masnoon-duas", response_model=List[MasnoonDuaResponse])
def get_duas(category: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(MasnoonDua)
    if category:
        query = query.filter(MasnoonDua.category_en == category)
    return query.order_by(MasnoonDua.id.asc()).all()

@router.post("/admission", response_model=MessageResponse, status_code=status.HTTP_201_CREATED)
def submit_admission(application_data: ApplicationCreate, request: Request, db: Session = Depends(get_db)):
    # 1. Honeypot check for spam bots
    if application_data.website_bot_trap:
        # Silently succeed to fool bots without saving spam into database
        return MessageResponse(
            message="Your application has been received. Our administration will contact you manually after review.",
            success=True
        )

    # 2. Verify course exists and is active
    course = db.query(Course).filter(Course.id == application_data.course_id, Course.is_active == True).first()
    if not course:
        raise HTTPException(status_code=400, detail="The selected course is invalid or currently unavailable.")

    # 3. Duplicate submission prevention (same email and course within 10 minutes)
    ten_minutes_ago = datetime.now(timezone.utc) - timedelta(minutes=10)
    existing = db.query(Application).filter(
        Application.contact_email == application_data.contact_email,
        Application.course_id == application_data.course_id,
        Application.created_at >= ten_minutes_ago
    ).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="A recent application with this email and course was already received. Please allow time for administrative review."
        )

    # 4. Determine application and trial status
    app_type = "Free Trial" if application_data.application_type == "Free Trial" else "Admission"
    trial_status = "Trial Requested" if app_type == "Free Trial" else "Not Applicable"

    new_app = Application(
        student_name=application_data.student_name.strip(),
        student_age=application_data.student_age,
        is_child=application_data.is_child or (application_data.student_age < 18),
        guardian_name=application_data.guardian_name.strip() if application_data.guardian_name else None,
        guardian_relation=application_data.guardian_relation.strip() if application_data.guardian_relation else None,
        country=application_data.country.strip(),
        timezone=application_data.timezone.strip(),
        course_id=application_data.course_id,
        preferred_days=application_data.preferred_days.strip(),
        preferred_time=application_data.preferred_time.strip(),
        contact_phone=application_data.contact_phone.strip(),
        contact_email=application_data.contact_email.lower().strip(),
        preferred_language=application_data.preferred_language,
        application_type=app_type,
        application_status="Pending Review",
        trial_status=trial_status
    )

    db.add(new_app)
    db.commit()
    db.refresh(new_app)

    return MessageResponse(
        message="Application submitted successfully. Note: Submitting an application does not guarantee admission. Administrator Abdul Hadi Panhwar will review your request and contact you directly.",
        success=True
    )
