from fastapi import APIRouter, Depends, HTTPException, Query, Request, status
from sqlalchemy.orm import Session
from sqlalchemy import or_, func
from typing import List, Optional
from datetime import datetime, timezone

from ..database import get_db
from ..config import settings
from ..models import Admin, Course, Application, Student, ClassSchedule
from ..schemas import (
    AdminLogin, TokenResponse, AdminProfile, DashboardStats,
    ApplicationResponse, ApplicationUpdateStatus, StudentResponse, StudentUpdate,
    ClassScheduleCreate, ClassScheduleUpdate, ClassScheduleResponse,
    CourseResponse, CourseUpdate, MessageResponse
)
from ..security import verify_password, create_access_token, get_current_admin
from ..services.audit_service import log_admin_action

router = APIRouter(prefix="/api/admin", tags=["Admin Dashboard"])

# In-memory login attempt tracker for brute-force protection
FAILED_ATTEMPTS = {}

@router.post("/login", response_model=TokenResponse)
def admin_login(login_data: AdminLogin, request: Request, db: Session = Depends(get_db)):
    client_ip = request.client.host if request.client else "unknown"
    attempts = FAILED_ATTEMPTS.get(client_ip, 0)
    if attempts >= 5:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Too many failed login attempts. Please wait 15 minutes before trying again."
        )

    admin = db.query(Admin).filter(Admin.username == login_data.username).first()
    if not admin or not verify_password(login_data.password, admin.password_hash):
        FAILED_ATTEMPTS[client_ip] = attempts + 1
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid administrator credentials."
        )

    if not admin.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin account has been deactivated."
        )

    # Clear failed attempts on successful login
    if client_ip in FAILED_ATTEMPTS:
        del FAILED_ATTEMPTS[client_ip]

    access_token = create_access_token(data={"sub": admin.username, "role": admin.role})
    log_admin_action(db, admin.id, "LOGIN", "Admin", admin.id, f"Admin logged in from {client_ip}", client_ip)

    return TokenResponse(
        access_token=access_token,
        admin_name=admin.full_name,
        username=admin.username,
        role=admin.role
    )

@router.get("/me", response_model=AdminProfile)
def get_admin_profile(current_admin: Admin = Depends(get_current_admin)):
    return current_admin

@router.get("/dashboard", response_model=DashboardStats)
def get_dashboard_stats(
    current_admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    total_apps = db.query(func.count(Application.id)).scalar() or 0
    pending_apps = db.query(func.count(Application.id)).filter(Application.application_status == "Pending Review").scalar() or 0
    approved_apps = db.query(func.count(Application.id)).filter(Application.application_status == "Approved").scalar() or 0
    active_students = db.query(func.count(Student.id)).filter(Student.status == "Active").scalar() or 0
    upcoming_classes = db.query(func.count(ClassSchedule.id)).filter(ClassSchedule.status == "Scheduled").scalar() or 0
    trial_requests = db.query(func.count(Application.id)).filter(Application.trial_status == "Trial Requested").scalar() or 0

    return DashboardStats(
        total_applications=total_apps,
        pending_applications=pending_apps,
        approved_applications=approved_apps,
        active_students=active_students,
        upcoming_classes=upcoming_classes,
        trial_requests=trial_requests
    )

@router.get("/applications", response_model=List[ApplicationResponse])
def list_applications(
    status_filter: Optional[str] = Query(None),
    type_filter: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    current_admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    query = db.query(Application)

    if status_filter:
        query = query.filter(Application.application_status == status_filter)
    if type_filter:
        query = query.filter(Application.application_type == type_filter)
    if search:
        search_pattern = f"%{search.strip()}%"
        query = query.filter(
            or_(
                Application.student_name.ilike(search_pattern),
                Application.contact_email.ilike(search_pattern),
                Application.contact_phone.ilike(search_pattern),
                Application.country.ilike(search_pattern)
            )
        )

    apps = query.order_by(Application.created_at.desc()).all()
    results = []
    for app in apps:
        app_dict = ApplicationResponse.model_validate(app)
        if app.course:
            app_dict.course_title = app.course.title_en
        results.append(app_dict)
    return results

@router.get("/applications/{app_id}", response_model=ApplicationResponse)
def get_application_detail(
    app_id: int,
    current_admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    app = db.query(Application).filter(Application.id == app_id).first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")
    res = ApplicationResponse.model_validate(app)
    if app.course:
        res.course_title = app.course.title_en
    return res

@router.patch("/applications/{app_id}/status", response_model=MessageResponse)
def update_application_status(
    app_id: int,
    status_data: ApplicationUpdateStatus,
    current_admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    app = db.query(Application).filter(Application.id == app_id).first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")

    old_status = app.application_status
    if status_data.application_status:
        app.application_status = status_data.application_status
    if status_data.trial_status:
        app.trial_status = status_data.trial_status
    if status_data.notes is not None:
        app.notes = status_data.notes

    # Safe transactional Student creation when application is Approved
    if status_data.application_status == "Approved" and old_status != "Approved":
        # Check if student already exists for this application to avoid duplicate records
        existing_student = db.query(Student).filter(Student.application_id == app.id).first()
        if not existing_student:
            new_student = Student(
                application_id=app.id,
                full_name=app.student_name,
                age=app.student_age,
                is_child=app.is_child,
                guardian_name=app.guardian_name,
                country=app.country,
                timezone=app.timezone,
                contact_phone=app.contact_phone,
                contact_email=app.contact_email,
                preferred_language=app.preferred_language,
                status="Active",
                notes=f"Auto-enrolled from approved application #{app.id}"
            )
            db.add(new_student)

    db.commit()
    log_admin_action(
        db, current_admin.id, "UPDATE_APPLICATION", "Application", app.id,
        f"Status changed to {app.application_status}, Trial: {app.trial_status}"
    )

    return MessageResponse(message="Application status successfully updated.")

@router.get("/students", response_model=List[StudentResponse])
def list_students(
    search: Optional[str] = Query(None),
    status_filter: Optional[str] = Query(None),
    current_admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    query = db.query(Student)
    if status_filter:
        query = query.filter(Student.status == status_filter)
    if search:
        pattern = f"%{search.strip()}%"
        query = query.filter(
            or_(
                Student.full_name.ilike(pattern),
                Student.contact_email.ilike(pattern),
                Student.contact_phone.ilike(pattern),
                Student.country.ilike(pattern)
            )
        )
    return query.order_by(Student.enrolled_at.desc()).all()

@router.patch("/students/{student_id}", response_model=MessageResponse)
def update_student(
    student_id: int,
    update_data: StudentUpdate,
    current_admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student record not found")

    if update_data.full_name is not None:
        student.full_name = update_data.full_name.strip()
    if update_data.guardian_name is not None:
        student.guardian_name = update_data.guardian_name.strip()
    if update_data.contact_phone is not None:
        student.contact_phone = update_data.contact_phone.strip()
    if update_data.contact_email is not None:
        student.contact_email = update_data.contact_email.strip()
    if update_data.status is not None:
        student.status = update_data.status
    if update_data.notes is not None:
        student.notes = update_data.notes

    db.commit()
    log_admin_action(db, current_admin.id, "UPDATE_STUDENT", "Student", student.id, f"Updated student #{student.id}")
    return MessageResponse(message="Student record updated successfully.")

@router.get("/courses", response_model=List[CourseResponse])
def list_all_courses_admin(
    current_admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    return db.query(Course).order_by(Course.display_order.asc()).all()

@router.patch("/courses/{course_id}", response_model=MessageResponse)
def update_course_admin(
    course_id: int,
    course_data: CourseUpdate,
    current_admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")

    for field, val in course_data.model_dump(exclude_unset=True).items():
        setattr(course, field, val)

    db.commit()
    log_admin_action(db, current_admin.id, "UPDATE_COURSE", "Course", course.id, f"Updated course #{course.id}")
    return MessageResponse(message="Course updated successfully.")

@router.get("/schedules", response_model=List[ClassScheduleResponse])
def list_class_schedules(
    status_filter: Optional[str] = Query(None),
    current_admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    query = db.query(ClassSchedule)
    if status_filter:
        query = query.filter(ClassSchedule.status == status_filter)
    schedules = query.order_by(ClassSchedule.start_time_utc.asc()).all()

    res = []
    for s in schedules:
        item = ClassScheduleResponse.model_validate(s)
        if s.course:
            item.course_title = s.course.title_en
        res.append(item)
    return res

@router.post("/schedules", response_model=MessageResponse, status_code=status.HTTP_201_CREATED)
def create_class_schedule(
    schedule_data: ClassScheduleCreate,
    current_admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    course = db.query(Course).filter(Course.id == schedule_data.course_id).first()
    if not course:
        raise HTTPException(status_code=400, detail="Invalid course selected")

    new_schedule = ClassSchedule(
        course_id=schedule_data.course_id,
        title=schedule_data.title.strip(),
        class_type=schedule_data.class_type,
        start_time_utc=schedule_data.start_time_utc,
        duration_minutes=schedule_data.duration_minutes,
        is_recurring=schedule_data.is_recurring,
        recurring_day_of_week=schedule_data.recurring_day_of_week,
        timezone=schedule_data.timezone,
        meeting_link=schedule_data.meeting_link.strip() if schedule_data.meeting_link else None,
        notes=schedule_data.notes,
        status="Scheduled"
    )
    db.add(new_schedule)
    db.commit()
    db.refresh(new_schedule)

    log_admin_action(db, current_admin.id, "CREATE_SCHEDULE", "ClassSchedule", new_schedule.id, f"Created schedule #{new_schedule.id}")
    return MessageResponse(message="Class schedule created successfully.")

@router.patch("/schedules/{schedule_id}", response_model=MessageResponse)
def update_class_schedule(
    schedule_id: int,
    update_data: ClassScheduleUpdate,
    current_admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    schedule = db.query(ClassSchedule).filter(ClassSchedule.id == schedule_id).first()
    if not schedule:
        raise HTTPException(status_code=404, detail="Schedule not found")

    for field, val in update_data.model_dump(exclude_unset=True).items():
        setattr(schedule, field, val)

    db.commit()
    log_admin_action(db, current_admin.id, "UPDATE_SCHEDULE", "ClassSchedule", schedule.id, f"Updated schedule #{schedule.id}")
    return MessageResponse(message="Class schedule updated successfully.")

@router.post("/logout", response_model=MessageResponse)
def admin_logout(current_admin: Admin = Depends(get_current_admin)):
    return MessageResponse(message="Logout successful.")
