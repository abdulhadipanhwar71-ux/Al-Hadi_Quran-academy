from pydantic import BaseModel, EmailStr, Field, field_validator, model_validator, ConfigDict
from typing import Optional, List
from datetime import datetime, time

# Generic Responses
class MessageResponse(BaseModel):
    message: str
    success: bool = True

class HealthResponse(BaseModel):
    status: str
    database: str
    version: str
    academy_name: str

# Course Schemas
class CourseBase(BaseModel):
    code: str
    title_en: str
    title_ur: str
    description_en: str
    description_ur: str
    level_en: str
    level_ur: str
    target_audience_en: str
    target_audience_ur: str
    is_active: bool = True
    display_order: int = 0

class CourseResponse(CourseBase):
    id: int
    created_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)

class CourseUpdate(BaseModel):
    title_en: Optional[str] = None
    title_ur: Optional[str] = None
    description_en: Optional[str] = None
    description_ur: Optional[str] = None
    level_en: Optional[str] = None
    level_ur: Optional[str] = None
    target_audience_en: Optional[str] = None
    target_audience_ur: Optional[str] = None
    is_active: Optional[bool] = None
    display_order: Optional[int] = None

# Application Schemas
class ApplicationCreate(BaseModel):
    student_name: str = Field(..., min_length=2, max_length=150)
    student_age: int = Field(..., ge=3, le=100)
    is_child: bool = False
    guardian_name: Optional[str] = Field(None, max_length=150)
    guardian_relation: Optional[str] = Field(None, max_length=80)
    country: str = Field(..., min_length=2, max_length=100)
    timezone: str = Field(..., min_length=2, max_length=80)
    course_id: int = Field(..., gt=0)
    preferred_days: str = Field(..., min_length=2, max_length=150)
    preferred_time: str = Field(..., min_length=2, max_length=100)
    contact_phone: str = Field(..., min_length=5, max_length=50)
    contact_email: EmailStr
    preferred_language: str = Field("English", max_length=20)
    application_type: str = Field("Admission", pattern="^(Admission|Free Trial)$")
    # Honeypot field for spam bots
    website_bot_trap: Optional[str] = None

    @model_validator(mode="after")
    def validate_child_and_guardian(self):
        if (self.student_age < 18 or self.is_child) and not self.guardian_name:
            raise ValueError("Guardian name is required for applicants under 18 or child applicants")
        return self

class ApplicationUpdateStatus(BaseModel):
    application_status: Optional[str] = Field(None, pattern="^(Pending Review|Approved|Rejected|More Information Required)$")
    trial_status: Optional[str] = Field(None, pattern="^(Not Applicable|Trial Requested|Trial Scheduled|Trial Completed|Trial Cancelled)$")
    notes: Optional[str] = None

class ApplicationResponse(BaseModel):
    id: int
    student_name: str
    student_age: int
    is_child: bool
    guardian_name: Optional[str] = None
    guardian_relation: Optional[str] = None
    country: str
    timezone: str
    course_id: int
    course_title: Optional[str] = None
    preferred_days: str
    preferred_time: str
    contact_phone: str
    contact_email: str
    preferred_language: str
    application_type: str
    application_status: str
    trial_status: str
    notes: Optional[str] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

# Student Schemas
class StudentResponse(BaseModel):
    id: int
    application_id: Optional[int] = None
    full_name: str
    age: int
    is_child: bool
    guardian_name: Optional[str] = None
    country: str
    timezone: str
    contact_phone: str
    contact_email: str
    preferred_language: str
    status: str
    notes: Optional[str] = None
    enrolled_at: datetime

    model_config = ConfigDict(from_attributes=True)

class StudentUpdate(BaseModel):
    full_name: Optional[str] = None
    guardian_name: Optional[str] = None
    contact_phone: Optional[str] = None
    contact_email: Optional[EmailStr] = None
    status: Optional[str] = Field(None, pattern="^(Active|Inactive|Suspended)$")
    notes: Optional[str] = None

# Class Schedule Schemas
class ClassScheduleCreate(BaseModel):
    course_id: int
    title: str = Field(..., min_length=2, max_length=150)
    class_type: str = Field("One-to-One", pattern="^(One-to-One|Group)$")
    start_time_utc: datetime
    duration_minutes: int = Field(30, ge=15, le=180)
    is_recurring: bool = False
    recurring_day_of_week: Optional[int] = Field(None, ge=0, le=6)
    recurring_time_utc: Optional[str] = None
    timezone: str = Field("UTC", max_length=80)
    meeting_link: Optional[str] = Field(None, max_length=500)
    notes: Optional[str] = None

class ClassScheduleUpdate(BaseModel):
    title: Optional[str] = None
    class_type: Optional[str] = None
    start_time_utc: Optional[datetime] = None
    duration_minutes: Optional[int] = None
    meeting_link: Optional[str] = None
    status: Optional[str] = Field(None, pattern="^(Scheduled|Completed|Cancelled|Rescheduled)$")
    notes: Optional[str] = None

class ClassScheduleResponse(BaseModel):
    id: int
    course_id: int
    course_title: Optional[str] = None
    title: str
    class_type: str
    start_time_utc: datetime
    duration_minutes: int
    is_recurring: bool
    recurring_day_of_week: Optional[int] = None
    timezone: str
    meeting_link: Optional[str] = None
    status: str
    notes: Optional[str] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

# Islamic Content Schemas
class QuranSurahResponse(BaseModel):
    surah_number: int
    name_arabic: str
    name_english: str
    english_meaning: str
    total_ayahs: int
    revelation_type: str

    model_config = ConfigDict(from_attributes=True)

class QuranAyahResponse(BaseModel):
    id: int
    surah_number: int
    ayah_number_in_surah: int
    global_ayah_number: int
    juz: int
    manzil: int
    page: int
    ruku: int
    sajda: bool
    text_arabic: str
    text_urdu: str
    text_english: str
    audio_url: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)

class KalimaResponse(BaseModel):
    id: int
    number: int
    name_arabic: str
    name_english: str
    name_urdu: str
    text_arabic: str
    text_urdu: str
    text_english: str
    reference: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)

class MasnoonDuaResponse(BaseModel):
    id: int
    category_en: str
    category_ur: str
    title_arabic: str
    title_urdu: str
    title_english: str
    text_arabic: str
    text_urdu: str
    text_english: str
    reference: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)

# Admin Auth Schemas
class AdminLogin(BaseModel):
    username: str
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    admin_name: str
    username: str
    role: str

class AdminProfile(BaseModel):
    id: int
    username: str
    email: str
    full_name: str
    role: str
    is_active: bool

    model_config = ConfigDict(from_attributes=True)

# Dashboard Stats
class DashboardStats(BaseModel):
    total_applications: int
    pending_applications: int
    approved_applications: int
    active_students: int
    upcoming_classes: int
    trial_requests: int

# Academy Settings Public Schema
class AcademySettingsPublic(BaseModel):
    academy_name: str
    admin_display_name: str
    contact_email: str
    whatsapp_configured: bool
    whatsapp_url: Optional[str] = None
    teaching_platforms: List[str]
    supported_countries: List[str]
    timezones: List[str]
