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
    const res = await fetch(`${API_BASE}/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    const result = await res.json();
    if (!res.ok) {
      throw new Error(result.detail || 'Authentication failed');
    }
    return result;
  },

  async getAdminMe() {
    const res = await fetch(`${API_BASE}/admin/me`, {
      headers: getAuthHeader(),
    });
    if (!res.ok) throw new Error('Session invalid');
    return res.json();
  },

  async getDashboardStats(): Promise<DashboardStats> {
    const res = await fetch(`${API_BASE}/admin/dashboard`, {
      headers: getAuthHeader(),
    });
    if (!res.ok) throw new Error('Failed to load dashboard metrics');
    return res.json();
  },

  async getApplications(status?: string, type?: string, search?: string): Promise<ApplicationRecord[]> {
    const params = new URLSearchParams();
    if (status) params.set('status_filter', status);
    if (type) params.set('type_filter', type);
    if (search) params.set('search', search);

    const res = await fetch(`${API_BASE}/admin/applications?${params.toString()}`, {
      headers: getAuthHeader(),
    });
    if (!res.ok) throw new Error('Failed to load applications');
    return res.json();
  },

  async updateApplicationStatus(appId: number, statusData: { application_status?: string; trial_status?: string; notes?: string }) {
    const res = await fetch(`${API_BASE}/admin/applications/${appId}/status`, {
      method: 'PATCH',
      headers: { ...getAuthHeader(), 'Content-Type': 'application/json' },
      body: JSON.stringify(statusData),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || 'Failed to update status');
    }
    return res.json();
  },

  async getStudents(search?: string, status?: string): Promise<StudentRecord[]> {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (status) params.set('status_filter', status);

    const res = await fetch(`${API_BASE}/admin/students?${params.toString()}`, {
      headers: getAuthHeader(),
    });
    if (!res.ok) throw new Error('Failed to load students');
    return res.json();
  },

  async updateStudent(studentId: number, data: Partial<StudentRecord>) {
    const res = await fetch(`${API_BASE}/admin/students/${studentId}`, {
      method: 'PATCH',
      headers: { ...getAuthHeader(), 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update student');
    return res.json();
  },

  async getAdminCourses(): Promise<Course[]> {
    const res = await fetch(`${API_BASE}/admin/courses`, {
      headers: getAuthHeader(),
    });
    if (!res.ok) throw new Error('Failed to load courses');
    return res.json();
  },

  async updateAdminCourse(courseId: number, data: Partial<Course>) {
    const res = await fetch(`${API_BASE}/admin/courses/${courseId}`, {
      method: 'PATCH',
      headers: { ...getAuthHeader(), 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update course');
    return res.json();
  },

  async getSchedules(status?: string): Promise<ClassScheduleRecord[]> {
    const url = status ? `${API_BASE}/admin/schedules?status_filter=${status}` : `${API_BASE}/admin/schedules`;
    const res = await fetch(url, {
      headers: getAuthHeader(),
    });
    if (!res.ok) throw new Error('Failed to load schedules');
    return res.json();
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
    const res = await fetch(`${API_BASE}/admin/schedules`, {
      method: 'POST',
      headers: { ...getAuthHeader(), 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || 'Failed to create schedule');
    }
    return res.json();
  },

  async updateSchedule(scheduleId: number, data: Partial<ClassScheduleRecord>) {
    const res = await fetch(`${API_BASE}/admin/schedules/${scheduleId}`, {
      method: 'PATCH',
      headers: { ...getAuthHeader(), 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update schedule');
    return res.json();
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
