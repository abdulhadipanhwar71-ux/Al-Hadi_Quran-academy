import {
  Course, QuranSurah, QuranAyah, Kalima, MasnoonDua, HijriDate,
  AcademySettings, ApplicationSubmission, ApplicationRecord,
  StudentRecord, ClassScheduleRecord, DashboardStats
} from '../types';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem('alhadi_admin_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export const api = {
  // Public Endpoints
  async getHealth() {
    const res = await fetch(`${API_BASE}/health`);
    if (!res.ok) throw new Error('Backend health check failed');
    return res.json();
  },

  async getSettings(): Promise<AcademySettings> {
    const res = await fetch(`${API_BASE}/settings`);
    if (!res.ok) throw new Error('Failed to load settings');
    return res.json();
  },

  async getTimezones(): Promise<{ tz: string; label: string }[]> {
    const res = await fetch(`${API_BASE}/timezones`);
    if (!res.ok) throw new Error('Failed to load timezones');
    return res.json();
  },

  async getHijriDate(): Promise<HijriDate> {
    const res = await fetch(`${API_BASE}/hijri-date`);
    if (!res.ok) throw new Error('Failed to load Hijri date');
    return res.json();
  },

  async getCourses(): Promise<Course[]> {
    const res = await fetch(`${API_BASE}/courses`);
    if (!res.ok) throw new Error('Failed to load courses');
    return res.json();
  },

  async getCourseByCode(code: string): Promise<Course> {
    const res = await fetch(`${API_BASE}/courses/${code}`);
    if (!res.ok) throw new Error('Course not found');
    return res.json();
  },

  async getSurahs(): Promise<QuranSurah[]> {
    const res = await fetch(`${API_BASE}/quran/surahs`);
    if (!res.ok) throw new Error('Failed to load Surahs');
    return res.json();
  },

  async getSurahDetail(surahNumber: number, offset = 0, limit = 50): Promise<{
    surah: QuranSurah;
    total_ayahs: number;
    offset: number;
    limit: number;
    ayahs: QuranAyah[];
  }> {
    const res = await fetch(`${API_BASE}/quran/surahs/${surahNumber}?offset=${offset}&limit=${limit}`);
    if (!res.ok) throw new Error(`Failed to load Surah #${surahNumber}`);
    return res.json();
  },

  async searchQuran(query: string): Promise<QuranAyah[]> {
    const res = await fetch(`${API_BASE}/quran/search?q=${encodeURIComponent(query)}`);
    if (!res.ok) throw new Error('Search failed');
    return res.json();
  },

  async getKalimas(): Promise<Kalima[]> {
    const res = await fetch(`${API_BASE}/kalimas`);
    if (!res.ok) throw new Error('Failed to load Kalimas');
    return res.json();
  },

  async getMasnoonDuas(category?: string): Promise<MasnoonDua[]> {
    const url = category ? `${API_BASE}/masnoon-duas?category=${encodeURIComponent(category)}` : `${API_BASE}/masnoon-duas`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to load Duas');
    return res.json();
  },

  async submitAdmission(data: ApplicationSubmission): Promise<{ message: string; success: boolean }> {
    const res = await fetch(`${API_BASE}/admission`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok) {
      throw new Error(result.detail || 'Failed to submit application');
    }
    return result;
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
