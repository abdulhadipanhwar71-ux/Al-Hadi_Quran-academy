import pytest
from datetime import datetime

def test_health_check(client):
    res = client.get("/api/health")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "ok"
    assert "connected" in data["database"]

def test_public_settings(client):
    res = client.get("/api/settings")
    assert res.status_code == 200
    data = res.json()
    assert data["academy_name"] == "Al-Hadi Online Quran Academy"
    assert data["admin_display_name"] == "Abdul Hadi"
    assert len(data["timezones"]) >= 8

def test_public_courses(client):
    res = client.get("/api/courses")
    assert res.status_code == 200
    courses = res.json()
    assert len(courses) == 7
    codes = [c["code"] for c in courses]
    assert "noorani-qaida" in codes
    assert "quran-reading" in codes
    assert "tajweed" in codes
    assert "masnoon-duas" in codes
    assert "basic-islamic-education" in codes
    assert "quran-translation" in codes
    assert "hadith-studies" in codes

def test_public_quran_surahs(client):
    res = client.get("/api/quran/surahs")
    assert res.status_code == 200
    surahs = res.json()
    assert len(surahs) == 114
    assert surahs[0]["surah_number"] == 1
    assert surahs[0]["name_english"] == "Al-Faatiha"
    assert surahs[113]["surah_number"] == 114

def test_public_quran_fatiha_ayahs(client):
    res = client.get("/api/quran/surahs/1?limit=10")
    assert res.status_code == 200
    data = res.json()
    assert data["total_ayahs"] == 7
    ayahs = data["ayahs"]
    assert len(ayahs) == 7
    # Verify presence of authentic Arabic, Urdu, and English
    assert "بِسْمِ" in ayahs[0]["text_arabic"]
    assert len(ayahs[0]["text_urdu"]) > 0
    assert len(ayahs[0]["text_english"]) > 0

def test_public_kalimas(client):
    res = client.get("/api/kalimas")
    assert res.status_code == 200
    kalimas = res.json()
    assert len(kalimas) == 6
    assert kalimas[0]["number"] == 1
    assert "لَا إِلٰهَ إِلَّا اللّٰهُ" in kalimas[0]["text_arabic"]

def test_public_duas(client):
    res = client.get("/api/masnoon-duas")
    assert res.status_code == 200
    duas = res.json()
    assert len(duas) >= 10

def test_public_hijri_date(client):
    res = client.get("/api/hijri-date")
    assert res.status_code == 200
    data = res.json()
    assert "hijri_year" in data
    assert "hijri_month_name_en" in data
    assert "formatted_en" in data
    assert "formatted_ur" in data
    assert "disclaimer" in data

def test_admission_submission_and_duplicate_protection(client):
    unique_email = f"applicant_{int(datetime.now().timestamp())}@test.com"
    payload = {
        "student_name": "Hamza Ali",
        "student_age": 10,
        "is_child": True,
        "guardian_name": "Tariq Ali",
        "guardian_relation": "Father",
        "country": "Pakistan",
        "timezone": "Asia/Karachi",
        "course_id": 1,
        "preferred_days": "Mon, Wed, Fri",
        "preferred_time": "5:00 PM - 6:00 PM",
        "contact_phone": "+923001234567",
        "contact_email": unique_email,
        "preferred_language": "Urdu",
        "application_type": "Free Trial"
    }

    # First submission should succeed
    res1 = client.post("/api/admission", json=payload)
    assert res1.status_code == 201
    assert res1.json()["success"] is True

    # Immediate duplicate submission should be rejected with 429
    res2 = client.post("/api/admission", json=payload)
    assert res2.status_code == 429
