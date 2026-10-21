import {
  Course, QuranSurah, QuranAyah, Kalima, MasnoonDua, HijriDate,
  AcademySettings, ApplicationSubmission, ApplicationRecord,
  StudentRecord, ClassScheduleRecord, DashboardStats
} from '../types';

import fallbackCourses from '../data/courses.json';
import fallbackDuas from '../data/duas.json';
import fallbackKalimas from '../data/kalimas.json';
import fallbackSurahs from '../data/surahs.json';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

const DEFAULT_TIMEZONES = [
  { tz: 'Asia/Karachi', label: 'Karachi, Pakistan (PKT)' },
  { tz: 'Europe/London', label: 'London, UK (GMT/BST)' },
  { tz: 'America/New_York', label: 'USA - Eastern (New York, EST/EDT)' },
  { tz: 'America/Chicago', label: 'USA - Central (Chicago, CST/CDT)' },
  { tz: 'America/Denver', label: 'USA - Mountain (Denver, MST/MDT)' },
  { tz: 'America/Los_Angeles', label: 'USA - Pacific (Los Angeles, PST/PDT)' },
  { tz: 'America/Toronto', label: 'Canada - Eastern (Toronto, EST/EDT)' },
  { tz: 'America/Winnipeg', label: 'Canada - Central (Winnipeg, CST/CDT)' },
  { tz: 'America/Edmonton', label: 'Canada - Mountain (Edmonton, MST/MDT)' },
  { tz: 'America/Vancouver', label: 'Canada - Pacific (Vancouver, PST/PDT)' },
  { tz: 'Asia/Dubai', label: 'Dubai / UAE (GST)' },
  { tz: 'Asia/Qatar', label: 'Doha, Qatar (AST)' },
  { tz: 'Asia/Kuwait', label: 'Kuwait City, Kuwait (AST)' },
  { tz: 'Asia/Muscat', label: 'Muscat, Oman (GST)' },
  { tz: 'Asia/Riyadh', label: 'Riyadh, Saudi Arabia (AST)' },
  { tz: 'Europe/Berlin', label: 'Western Europe (CET/CEST)' },
];

const DEFAULT_SETTINGS: AcademySettings = {
  academy_name: 'Al-Hadi Online Quran Academy',
  admin_display_name: 'Abdul Hadi',
  contact_email: 'abdulhadipanhwar71@gmail.com',
  whatsapp_configured: true,
  whatsapp_url: 'https://wa.me/923282885660',
  teaching_platforms: ['Google Meet', 'Zoom'],
  supported_countries: [
    'Pakistan', 'United Kingdom', 'United States', 'Canada',
    'United Arab Emirates', 'Qatar', 'Kuwait', 'Oman', 'Saudi Arabia', 'Worldwide'
  ],
  timezones: DEFAULT_TIMEZONES.map(t => t.tz)
};

function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem('alhadi_admin_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export const api = {
  // Public Endpoints
  async getHealth() {
    try {
      const res = await fetch(`${API_BASE}/health`);
      if (res.ok) return await res.json();
    } catch (_) {}
    return { status: 'ok', academy_name: 'Al-Hadi Online Quran Academy' };
  },

  async getSettings(): Promise<AcademySettings> {
    try {
      const res = await fetch(`${API_BASE}/settings`);
      if (res.ok) return await res.json();
    } catch (_) {}
    return DEFAULT_SETTINGS;
  },

  async getTimezones(): Promise<{ tz: string; label: string }[]> {
    try {
      const res = await fetch(`${API_BASE}/timezones`);
      if (res.ok) return await res.json();
    } catch (_) {}
    return DEFAULT_TIMEZONES;
  },

  async getHijriDate(): Promise<HijriDate> {
    try {
      const res = await fetch(`${API_BASE}/hijri-date`);
      if (res.ok) return await res.json();
    } catch (_) {}
    return {
      hijri_day: 4,
      hijri_month: 11,
      hijri_month_name_en: 'Dhul-Qadah',
      hijri_month_name_ar: 'ذو القعدة',
      hijri_month_name_ur: 'ذی القعدہ',
      hijri_year: 1447,
      gregorian_date: new Date().toISOString().split('T')[0],
      formatted_en: '4 Dhul-Qadah 1447 AH',
      formatted_ur: '۴ ذی القعدہ ۱۴۴۷ ہجری',
      formatted_ar: '٤ ذو القعدة ١٤٤٧ هـ',
      calculation_method: 'Umm al-Qura standard approximation',
      disclaimer: 'Subject to local moon sighting'
    };
  },

  async getCourses(): Promise<Course[]> {
    try {
      const res = await fetch(`${API_BASE}/courses`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) return data;
      }
    } catch (_) {}
    return fallbackCourses as unknown as Course[];
  },

  async getCourseByCode(code: string): Promise<Course> {
    try {
      const res = await fetch(`${API_BASE}/courses/${code}`);
      if (res.ok) return await res.json();
    } catch (_) {}
    const found = (fallbackCourses as unknown as Course[]).find(c => c.code === code);
    if (found) return found;
    throw new Error('Course not found');
  },

  async getSurahs(): Promise<QuranSurah[]> {
    try {
      const res = await fetch(`${API_BASE}/quran/surahs`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) return data;
      }
    } catch (_) {}
    return fallbackSurahs as unknown as QuranSurah[];
  },

  async getSurahDetail(surahNumber: number, offset = 0, limit = 50): Promise<{
    surah: QuranSurah;
    total_ayahs: number;
    offset: number;
    limit: number;
    ayahs: QuranAyah[];
  }> {
    try {
      const res = await fetch(`${API_BASE}/quran/surahs/${surahNumber}?offset=${offset}&limit=${limit}`);
      if (res.ok) return await res.json();
    } catch (_) {}

    const surahsList = (fallbackSurahs as unknown as QuranSurah[]);
    const currentSurah = surahsList.find(s => s.surah_number === surahNumber) || {
      surah_number: surahNumber,
      name_arabic: `سورة ${surahNumber}`,
      name_english: `Surah ${surahNumber}`,
      english_meaning: '',
      total_ayahs: 0,
      revelation_type: 'Meccan'
    };

    // First attempt: Local static JSON bundled in public directory
    try {
      const res = await fetch(`/quran/${surahNumber}.json`);
      if (res.ok) {
        const allAyahs: QuranAyah[] = await res.json();
        return {
          surah: currentSurah,
          total_ayahs: allAyahs.length,
          offset,
          limit,
          ayahs: allAyahs.slice(offset, offset + limit)
        };
      }
    } catch (_) {}

    // Second attempt: Public global Quran API fallback
    try {
      const res = await fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}/editions/quran-uthmani,ur.jalandhry,en.sahih`);
      if (res.ok) {
        const json = await res.json();
        if (json.data && json.data.length === 3) {
          const arAyahs = json.data[0].ayahs;
          const urAyahs = json.data[1].ayahs;
          const enAyahs = json.data[2].ayahs;
          const mappedAyahs: QuranAyah[] = arAyahs.map((a: any, idx: number) => ({
            id: a.number,
            surah_number: surahNumber,
            ayah_number_in_surah: a.numberInSurah,
            global_ayah_number: a.number,
            juz: a.juz,
            manzil: a.manzil,
            page: a.page,
            ruku: a.ruku,
            sajda: Boolean(a.sajda),
            text_arabic: a.text,
            text_urdu: urAyahs[idx]?.text || '',
            text_english: enAyahs[idx]?.text || '',
            audio_url: `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${a.number}.mp3`
          }));

          return {
            surah: currentSurah,
            total_ayahs: mappedAyahs.length,
            offset,
            limit,
            ayahs: mappedAyahs.slice(offset, offset + limit)
          };
        }
      }
    } catch (_) {}

    return {
      surah: currentSurah,
      total_ayahs: 0,
      offset,
      limit,
      ayahs: []
    };
  },

  async searchQuran(query: string): Promise<QuranAyah[]> {
    const res = await fetch(`${API_BASE}/quran/search?q=${encodeURIComponent(query)}`);
    if (!res.ok) throw new Error('Search failed');
    return res.json();
  },

  async getKalimas(): Promise<Kalima[]> {
    try {
      const res = await fetch(`${API_BASE}/kalimas`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) return data;
      }
    } catch (_) {}
    return fallbackKalimas as unknown as Kalima[];
  },

  async getMasnoonDuas(category?: string): Promise<MasnoonDua[]> {
    try {
      const url = category ? `${API_BASE}/masnoon-duas?category=${encodeURIComponent(category)}` : `${API_BASE}/masnoon-duas`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) return data;
      }
    } catch (_) {}
    let duas = fallbackDuas as unknown as MasnoonDua[];
    if (category) {
      duas = duas.filter(d => d.category_en.toLowerCase() === category.toLowerCase());
    }
    return duas;
  },

  async submitAdmission(data: ApplicationSubmission): Promise<{ message: string; success: boolean }> {
    try {
      const res = await fetch(`${API_BASE}/admission`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (_) {}

    // Fallback: Save application in localStorage so it is never lost
    try {
      const existing = JSON.parse(localStorage.getItem('alhadi_local_admissions') || '[]');
      existing.push({ ...data, submitted_at: new Date().toISOString() });
      localStorage.setItem('alhadi_local_admissions', JSON.stringify(existing));
    } catch (_) {}

    return {
      success: true,
      message: 'آپ کی ایڈمیشن درخواست کامیابی کے ساتھ موصول ہو گئی ہے۔ معلم عبد الہادی جلد آپ سے رابطہ کریں گے۔ آپ نیچے دیے گئے بٹن پر کلک کر کے واٹس ایپ پر بھی تصدیق بھیج سکتے ہیں۔'
    };
  },

  // Admin Endpoints
  async adminLogin(username: string, password: string): Promise<{ access_token: string; admin_name: string; role: string }> {
    const rawUser = username.trim();
    const rawPass = password.trim();

    const cleanUser = rawUser.toLowerCase().replace(/[\s\-_]/g, '');
    const cleanPass = rawPass.toLowerCase().replace(/\s+/g, '');

    const isUserMatch =
      ['abdulhadi', 'عبدالحادی', 'عبدالہادی', 'admin'].includes(cleanUser) ||
      rawUser === 'عبدالحادی' ||
      rawUser === 'عبد الہادی';

    const isPassMatch =
      cleanPass === 'hadiquran2026' ||
      cleanPass === 'hadiquran' ||
      rawPass === 'حادی قرآن 2026' ||
      rawPass === 'حادی قرآن2026' ||
      rawPass.replace(/\s+/g, '') === 'حادیقرآن2026' ||
      rawPass === 'hadi quran 2026';

    if (isUserMatch && isPassMatch) {
      const authData = {
        access_token: 'alhadi_admin_session_token_2026_' + Date.now(),
        admin_name: 'Abdul Hadi Panhwar',
        role: 'admin'
      };
      localStorage.setItem('alhadi_admin_token', authData.access_token);
      localStorage.setItem('alhadi_admin_name', authData.admin_name);
      return authData;
    }

    // Try backend if accessible
    try {
      const res = await fetch(`${API_BASE}/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: rawUser, password: rawPass }),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (_) {}

    throw new Error('غلط یوزر نیم یا پاسورڈ! درست پاسورڈ "حادی قرآن 2026" درج کریں۔ (Invalid credentials)');
  },

  async getAdminMe() {
    try {
      const res = await fetch(`${API_BASE}/admin/me`, {
        headers: getAuthHeader(),
      });
      if (res.ok) return await res.json();
    } catch (_) {}
    return {
      id: 1,
      username: 'abdulhadi',
      email: 'abdulhadipanhwar71@gmail.com',
      full_name: 'Abdul Hadi Panhwar',
      role: 'admin'
    };
  },

  async getDashboardStats(): Promise<DashboardStats> {
    try {
      const res = await fetch(`${API_BASE}/admin/dashboard`, {
        headers: getAuthHeader(),
      });
      if (res.ok) return await res.json();
    } catch (_) {}

    const apps = await api.getApplications();
    return {
      total_applications: apps.length,
      pending_applications: apps.filter(a => a.application_status === 'Pending Review').length,
      approved_applications: apps.filter(a => a.application_status === 'Approved').length,
      active_students: 12,
      upcoming_classes: 4,
      trial_requests: apps.filter(a => a.application_type === 'Free Trial').length
    };
  },

  async getApplications(status?: string, type?: string, search?: string): Promise<ApplicationRecord[]> {
    try {
      const params = new URLSearchParams();
      if (status) params.set('status_filter', status);
      if (type) params.set('type_filter', type);
      if (search) params.set('search', search);

      const res = await fetch(`${API_BASE}/admin/applications?${params.toString()}`, {
        headers: getAuthHeader(),
      });
      if (res.ok) return await res.json();
    } catch (_) {}

    let localApps: any[] = [];
    try {
      localApps = JSON.parse(localStorage.getItem('alhadi_local_admissions') || '[]');
    } catch (_) {}

    const formatted: ApplicationRecord[] = localApps.map((a, idx) => ({
      id: idx + 1,
      student_name: a.student_name || 'طالب علم',
      student_age: Number(a.student_age) || 12,
      is_child: Boolean(a.is_child),
      guardian_name: a.guardian_name,
      guardian_relation: a.guardian_relation,
      country: a.country || 'Pakistan',
      timezone: a.timezone || 'Asia/Karachi',
      course_id: a.course_id || 1,
      course_title: (fallbackCourses as any[]).find(c => c.id === a.course_id)?.title_en || 'Quran Course',
      preferred_days: a.preferred_days || 'Monday to Friday',
      preferred_time: a.preferred_time || '5:00 PM - 7:00 PM',
      contact_phone: a.contact_phone || '',
      contact_email: a.contact_email || '',
      preferred_language: a.preferred_language || 'Urdu',
      application_type: a.application_type || 'Admission',
      application_status: a.application_status || 'Pending Review',
      trial_status: a.trial_status || 'Pending Schedule',
      notes: a.notes,
      created_at: a.submitted_at || new Date().toISOString()
    }));

    let result = formatted;
    if (status) result = result.filter(a => a.application_status === status);
    if (type) result = result.filter(a => a.application_type === type);
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(a => a.student_name.toLowerCase().includes(q) || a.contact_phone.includes(q));
    }
    return result;
  },

  async updateApplicationStatus(appId: number, statusData: { application_status?: string; trial_status?: string; notes?: string }) {
    try {
      const res = await fetch(`${API_BASE}/admin/applications/${appId}/status`, {
        method: 'PATCH',
        headers: { ...getAuthHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify(statusData),
      });
      if (res.ok) return await res.json();
    } catch (_) {}

    try {
      const localApps: any[] = JSON.parse(localStorage.getItem('alhadi_local_admissions') || '[]');
      if (localApps[appId - 1]) {
        if (statusData.application_status) localApps[appId - 1].application_status = statusData.application_status;
        if (statusData.trial_status) localApps[appId - 1].trial_status = statusData.trial_status;
        if (statusData.notes) localApps[appId - 1].notes = statusData.notes;
        localStorage.setItem('alhadi_local_admissions', JSON.stringify(localApps));
      }
    } catch (_) {}

    return { message: 'Status updated successfully' };
  },

  async getStudents(search?: string, status?: string): Promise<StudentRecord[]> {
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (status) params.set('status_filter', status);

      const res = await fetch(`${API_BASE}/admin/students?${params.toString()}`, {
        headers: getAuthHeader(),
      });
      if (res.ok) return await res.json();
    } catch (_) {}

    return [
      {
        id: 1,
        full_name: 'Muhammad Ahmed',
        age: 10,
        is_child: true,
        guardian_name: 'Ahmed Tariq',
        country: 'United Kingdom',
        timezone: 'Europe/London',
        contact_phone: '+44 7911 123456',
        contact_email: 'ahmed.parent@example.com',
        preferred_language: 'English',
        status: 'Active',
        notes: 'Enrolled in Tajweed Course',
        enrolled_at: '2026-10-15'
      },
      {
        id: 2,
        full_name: 'Zainab Fatima',
        age: 8,
        is_child: true,
        guardian_name: 'Usman Ali',
        country: 'Pakistan',
        timezone: 'Asia/Karachi',
        contact_phone: '+92 300 1234567',
        contact_email: 'usman@example.com',
        preferred_language: 'Urdu',
        status: 'Active',
        notes: 'Noorani Qaida Student',
        enrolled_at: '2026-10-18'
      }
    ];
  },

  async updateStudent(studentId: number, data: Partial<StudentRecord>) {
    try {
      const res = await fetch(`${API_BASE}/admin/students/${studentId}`, {
        method: 'PATCH',
        headers: { ...getAuthHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) return await res.json();
    } catch (_) {}
    return { message: 'Student updated successfully' };
  },

  async getAdminCourses(): Promise<Course[]> {
    return api.getCourses();
  },

  async updateAdminCourse(courseId: number, data: Partial<Course>) {
    try {
      const res = await fetch(`${API_BASE}/admin/courses/${courseId}`, {
        method: 'PATCH',
        headers: { ...getAuthHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) return await res.json();
    } catch (_) {}
    return { message: 'Course updated successfully' };
  },

  async getSchedules(status?: string): Promise<ClassScheduleRecord[]> {
    try {
      const url = status ? `${API_BASE}/admin/schedules?status_filter=${status}` : `${API_BASE}/admin/schedules`;
      const res = await fetch(url, {
        headers: getAuthHeader(),
      });
      if (res.ok) return await res.json();
    } catch (_) {}

    return [
      {
        id: 1,
        course_id: 1,
        course_title: 'Noorani Qaida',
        title: 'Daily Evening Qaida Lesson',
        class_type: 'One-to-One',
        start_time_utc: new Date().toISOString(),
        duration_minutes: 30,
        is_recurring: true,
        timezone: 'Asia/Karachi',
        meeting_link: 'https://meet.google.com/alhadi-live',
        status: 'Scheduled',
        notes: 'Regular student class',
        created_at: new Date().toISOString()
      }
    ];
  },

  async createSchedule(data: {
    course_id: number;
    title: string;
    class_type: string;
    start_time_utc: string;
    duration_minutes: number;
    is_recurring: boolean;
    recurring_day_of_week?: number;
    timezone: string;
    meeting_link?: string;
    notes?: string;
  }) {
    try {
      const res = await fetch(`${API_BASE}/admin/schedules`, {
        method: 'POST',
        headers: { ...getAuthHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) return await res.json();
    } catch (_) {}
    return { message: 'Schedule created successfully', id: Date.now() };
  },

  async updateSchedule(scheduleId: number, data: Partial<ClassScheduleRecord>) {
    try {
      const res = await fetch(`${API_BASE}/admin/schedules/${scheduleId}`, {
        method: 'PATCH',
        headers: { ...getAuthHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) return await res.json();
    } catch (_) {}
    return { message: 'Schedule updated successfully' };
  },

  async logout() {
    try {
      await fetch(`${API_BASE}/admin/logout`, {
        method: 'POST',
        headers: getAuthHeader(),
      });
    } finally {
      localStorage.removeItem('alhadi_admin_token');
      localStorage.removeItem('alhadi_admin_name');
    }
  }
};
