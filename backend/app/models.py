from sqlalchemy import (
    Column, Integer, String, Text, Boolean, DateTime, Time, ForeignKey, func
)
from sqlalchemy.orm import relationship
from .database import Base

class Admin(Base):
    __tablename__ = "admins"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(60), unique=True, nullable=False, index=True)
    email = Column(String(150), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    full_name = Column(String(150), nullable=False)
    role = Column(String(50), default="admin", nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, server_default=func.now(), nullable=False)
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

class Course(Base):
    __tablename__ = "courses"

    id = Column(Integer, primary_key=True, index=True)
    code = Column(String(50), unique=True, nullable=False, index=True)
    title_en = Column(String(150), nullable=False)
    title_ur = Column(String(150), nullable=False)
    description_en = Column(Text, nullable=False)
    description_ur = Column(Text, nullable=False)
    level_en = Column(String(80), nullable=False)
    level_ur = Column(String(80), nullable=False)
    target_audience_en = Column(String(150), nullable=False)
    target_audience_ur = Column(String(150), nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    display_order = Column(Integer, default=0, nullable=False)
    created_at = Column(DateTime, server_default=func.now(), nullable=False)
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

    applications = relationship("Application", back_populates="course")
    classes = relationship("ClassSchedule", back_populates="course")

class Application(Base):
    __tablename__ = "applications"

    id = Column(Integer, primary_key=True, index=True)
    student_name = Column(String(150), nullable=False)
    student_age = Column(Integer, nullable=False)
    is_child = Column(Boolean, default=False, nullable=False)
    guardian_name = Column(String(150), nullable=True)
    guardian_relation = Column(String(80), nullable=True)
    country = Column(String(100), nullable=False)
    timezone = Column(String(80), nullable=False)
    course_id = Column(Integer, ForeignKey("courses.id"), nullable=False)
    preferred_days = Column(String(150), nullable=False)
    preferred_time = Column(String(100), nullable=False)
    contact_phone = Column(String(50), nullable=False)
    contact_email = Column(String(150), nullable=False)
    preferred_language = Column(String(20), default="English", nullable=False)
    # Store exact ENUM literal strings matching MySQL enum schema
    application_type = Column(String(50), default="Admission", nullable=False)
    application_status = Column(String(50), default="Pending Review", nullable=False)
    trial_status = Column(String(50), default="Not Applicable", nullable=False)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, server_default=func.now(), nullable=False)
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

    course = relationship("Course", back_populates="applications")
    student = relationship("Student", back_populates="application", uselist=False)

class Student(Base):
    __tablename__ = "students"

    id = Column(Integer, primary_key=True, index=True)
    application_id = Column(Integer, ForeignKey("applications.id"), unique=True, nullable=True)
    full_name = Column(String(150), nullable=False)
    age = Column(Integer, nullable=False)
    is_child = Column(Boolean, default=False, nullable=False)
    guardian_name = Column(String(150), nullable=True)
    country = Column(String(100), nullable=False)
    timezone = Column(String(80), nullable=False)
    contact_phone = Column(String(50), nullable=False)
    contact_email = Column(String(150), nullable=False)
    preferred_language = Column(String(20), default="English", nullable=False)
    status = Column(String(50), default="Active", nullable=False)
    notes = Column(Text, nullable=True)
    enrolled_at = Column(DateTime, server_default=func.now(), nullable=False)
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

    application = relationship("Application", back_populates="student")

class ClassSchedule(Base):
    __tablename__ = "classes"

    id = Column(Integer, primary_key=True, index=True)
    course_id = Column(Integer, ForeignKey("courses.id"), nullable=False)
    title = Column(String(150), nullable=False)
    class_type = Column(String(50), default="One-to-One", nullable=False)
    start_time_utc = Column(DateTime, nullable=False)
    duration_minutes = Column(Integer, default=30, nullable=False)
    is_recurring = Column(Boolean, default=False, nullable=False)
    recurring_day_of_week = Column(Integer, nullable=True) # 0=Monday, 6=Sunday
    recurring_time_utc = Column(Time, nullable=True)
    timezone = Column(String(80), default="UTC", nullable=False)
    meeting_link = Column(String(500), nullable=True)
    status = Column(String(50), default="Scheduled", nullable=False)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, server_default=func.now(), nullable=False)
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

    course = relationship("Course", back_populates="classes")

class QuranSurah(Base):
    __tablename__ = "quran_surahs"

    surah_number = Column(Integer, primary_key=True)
    name_arabic = Column(String(100), nullable=False)
    name_english = Column(String(100), nullable=False)
    english_meaning = Column(String(150), nullable=False)
    total_ayahs = Column(Integer, nullable=False)
    revelation_type = Column(String(20), nullable=False)

    ayahs = relationship("QuranAyah", back_populates="surah")

class QuranAyah(Base):
    __tablename__ = "quran_ayahs"

    id = Column(Integer, primary_key=True, index=True)
    surah_number = Column(Integer, ForeignKey("quran_surahs.surah_number"), nullable=False, index=True)
    ayah_number_in_surah = Column(Integer, nullable=False)
    global_ayah_number = Column(Integer, nullable=False)
    juz = Column(Integer, nullable=False)
    manzil = Column(Integer, nullable=False)
    page = Column(Integer, nullable=False)
    ruku = Column(Integer, nullable=False)
    sajda = Column(Boolean, default=False, nullable=False)
    text_arabic = Column(Text, nullable=False)
    text_urdu = Column(Text, nullable=False)
    text_english = Column(Text, nullable=False)
    audio_url = Column(String(255), nullable=True)

    surah = relationship("QuranSurah", back_populates="ayahs")

class Kalima(Base):
    __tablename__ = "kalimas"

    id = Column(Integer, primary_key=True)
    number = Column(Integer, unique=True, nullable=False)
    name_arabic = Column(String(100), nullable=False)
    name_english = Column(String(150), nullable=False)
    name_urdu = Column(String(150), nullable=False)
    text_arabic = Column(Text, nullable=False)
    text_urdu = Column(Text, nullable=False)
    text_english = Column(Text, nullable=False)
    reference = Column(String(150), nullable=True)

class MasnoonDua(Base):
    __tablename__ = "masnoon_duas"

    id = Column(Integer, primary_key=True)
    category_en = Column(String(100), nullable=False, index=True)
    category_ur = Column(String(100), nullable=False)
    title_arabic = Column(String(150), nullable=False)
    title_urdu = Column(String(150), nullable=False)
    title_english = Column(String(150), nullable=False)
    text_arabic = Column(Text, nullable=False)
    text_urdu = Column(Text, nullable=False)
    text_english = Column(Text, nullable=False)
    reference = Column(String(150), nullable=True)

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    admin_id = Column(Integer, nullable=True)
    action = Column(String(100), nullable=False)
    entity_type = Column(String(50), nullable=False)
    entity_id = Column(Integer, nullable=True)
    details = Column(Text, nullable=True)
    ip_address = Column(String(45), nullable=True)
    created_at = Column(DateTime, server_default=func.now(), nullable=False)
