export interface Course {
  id: number;
  code: string;
  title_en: string;
  title_ur: string;
  description_en: string;
  description_ur: string;
  level_en: string;
  level_ur: string;
  target_audience_en: string;
  target_audience_ur: string;
  is_active: boolean;
  display_order: number;
}

export interface QuranSurah {
  surah_number: number;
  name_arabic: string;
  name_english: string;
  english_meaning: string;
  total_ayahs: number;
  revelation_type: string;
}

export interface QuranAyah {
  id: number;
  surah_number: number;
  ayah_number_in_surah: number;
  global_ayah_number: number;
  juz: number;
  manzil: number;
  page: number;
  ruku: number;
  sajda: boolean;
  text_arabic: string;
  text_urdu: string;
  text_english: string;
  audio_url?: string;
}

export interface Kalima {
  id: number;
  number: number;
  name_arabic: string;
  name_english: string;
  name_urdu: string;
  text_arabic: string;
  text_urdu: string;
  text_english: string;
  reference?: string;
}

export interface MasnoonDua {
  id: number;
  category_en: string;
  category_ur: string;
  title_arabic: string;
  title_urdu: string;
  title_english: string;
  text_arabic: string;
  text_urdu: string;
  text_english: string;
  reference?: string;
}

export interface HijriDate {
  hijri_day: number;
  hijri_month: number;
  hijri_month_name_en: string;
  hijri_month_name_ar: string;
  hijri_month_name_ur: string;
  hijri_year: number;
  gregorian_date: string;
  formatted_en: string;
  formatted_ur: string;
  formatted_ar: string;
  calculation_method: string;
  disclaimer: string;
}

export interface AcademySettings {
  academy_name: string;
  admin_display_name: string;
  contact_email: string;
  whatsapp_configured: boolean;
  whatsapp_url?: string;
  teaching_platforms: string[];
  supported_countries: string[];
  timezones: string[];
}

export interface ApplicationSubmission {
  student_name: string;
  student_age: number;
  is_child: boolean;
  guardian_name?: string;
  guardian_relation?: string;
  country: string;
  timezone: string;
  course_id: number;
  preferred_days: string;
  preferred_time: string;
  contact_phone: string;
  contact_email: string;
  preferred_language: string;
  application_type: 'Admission' | 'Free Trial';
  website_bot_trap?: string;
}

export interface ApplicationRecord {
  id: number;
  student_name: string;
  student_age: number;
  is_child: boolean;
  guardian_name?: string;
  guardian_relation?: string;
  country: string;
  timezone: string;
  course_id: number;
  course_title?: string;
  preferred_days: string;
  preferred_time: string;
  contact_phone: string;
  contact_email: string;
  preferred_language: string;
  application_type: string;
  application_status: string;
  trial_status: string;
  notes?: string;
  created_at: string;
}

export interface StudentRecord {
  id: number;
  application_id?: number;
  full_name: string;
  age: number;
  is_child: boolean;
  guardian_name?: string;
  country: string;
  timezone: string;
  contact_phone: string;
  contact_email: string;
  preferred_language: string;
  status: string;
  notes?: string;
  enrolled_at: string;
}

export interface ClassScheduleRecord {
  id: number;
  course_id: number;
  course_title?: string;
  title: string;
  class_type: string;
  start_time_utc: string;
  duration_minutes: number;
  is_recurring: boolean;
  recurring_day_of_week?: number;
  timezone: string;
  meeting_link?: string;
  status: string;
  notes?: string;
  created_at: string;
}

export interface DashboardStats {
  total_applications: number;
  pending_applications: number;
  approved_applications: number;
  active_students: number;
  upcoming_classes: number;
  trial_requests: number;
}
