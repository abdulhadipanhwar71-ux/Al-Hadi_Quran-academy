import pytest
from datetime import datetime, timezone, timedelta

def test_admin_auth_and_protected_me(client, admin_token):
    headers = {"Authorization": f"Bearer {admin_token}"}
    res = client.get("/api/admin/me", headers=headers)
    assert res.status_code == 200
    data = res.json()
    assert data["username"] == "abdulhadi"
    assert data["role"] == "admin"

def test_unauthorized_access_rejected(client):
    res = client.get("/api/admin/me")
    assert res.status_code == 401

def test_admin_dashboard_stats(client, admin_token):
    headers = {"Authorization": f"Bearer {admin_token}"}
    res = client.get("/api/admin/dashboard", headers=headers)
    assert res.status_code == 200
    stats = res.json()
    assert "total_applications" in stats
    assert "active_students" in stats
    assert "trial_requests" in stats

def test_application_approval_workflow(client, admin_token):
    # Create application
    email = f"student_wf_{int(datetime.now().timestamp())}@test.com"
    app_payload = {
        "student_name": "Zayd Tariq",
        "student_age": 12,
        "is_child": True,
        "guardian_name": "Tariq Mahmood",
        "guardian_relation": "Father",
        "country": "United Kingdom",
        "timezone": "Europe/London",
        "course_id": 2,
        "preferred_days": "Saturday, Sunday",
        "preferred_time": "10:00 AM",
        "contact_phone": "+447911123456",
        "contact_email": email,
        "preferred_language": "English",
        "application_type": "Admission"
    }
    create_res = client.post("/api/admission", json=app_payload)
    assert create_res.status_code == 201

    headers = {"Authorization": f"Bearer {admin_token}"}
    # List applications and find our newly created application
    list_res = client.get(f"/api/admin/applications?search={email}", headers=headers)
    assert list_res.status_code == 200
    apps = list_res.json()
    assert len(apps) >= 1
    target_app = apps[0]

    # Approve application
    approve_res = client.patch(
        f"/api/admin/applications/{target_app['id']}/status",
        json={"application_status": "Approved", "notes": "Approved for weekend Nazra Quran"},
        headers=headers
    )
    assert approve_res.status_code == 200

    # Verify student record was created
    students_res = client.get(f"/api/admin/students?search={email}", headers=headers)
    assert students_res.status_code == 200
    students = students_res.json()
    assert len(students) == 1
    assert students[0]["full_name"] == "Zayd Tariq"
    assert students[0]["status"] == "Active"

def test_scheduling_and_meeting_link_security(client, admin_token):
    headers = {"Authorization": f"Bearer {admin_token}"}
    class_time = (datetime.now(timezone.utc) + timedelta(days=2)).isoformat()
    payload = {
        "course_id": 2,
        "title": "Nazra Quran Weekly Lesson",
        "class_type": "One-to-One",
        "start_time_utc": class_time,
        "duration_minutes": 45,
        "is_recurring": True,
        "recurring_day_of_week": 5, # Saturday
        "timezone": "Europe/London",
        "meeting_link": "https://meet.google.com/private-test-code",
        "notes": "Private lesson with teacher Abdul Hadi Panhwar"
    }

    create_res = client.post("/api/admin/schedules", json=payload, headers=headers)
    assert create_res.status_code == 201

    # Verify list shows schedule
    list_res = client.get("/api/admin/schedules", headers=headers)
    assert list_res.status_code == 200
    schedules = list_res.json()
    assert len(schedules) >= 1
    assert any("private-test-code" in (s.get("meeting_link") or "") for s in schedules)
