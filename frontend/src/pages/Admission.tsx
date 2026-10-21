import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  GraduationCap, CheckCircle2, AlertCircle, Clock, ShieldCheck,
  User, Mail, Phone, Globe, Calendar, Send, BookOpen
} from 'lucide-react';
import { api } from '../services/api';
import { Course } from '../types';
import { useLanguage } from '../context/LanguageContext';

export const Admission = () => {
  const [searchParams] = useSearchParams();
  const initialType = searchParams.get('type') === 'trial' ? 'Free Trial' : 'Admission';
  const initialCourseId = searchParams.get('course') ? parseInt(searchParams.get('course')!) : 1;

  const { t, language } = useLanguage();
  const [courses, setCourses] = useState<Course[]>([]);
  const [timezones, setTimezones] = useState<{ tz: string; label: string }[]>([]);

  // Form State
  const [studentName, setStudentName] = useState('');
  const [studentAge, setStudentAge] = useState<number | ''>('');
  const [isChild, setIsChild] = useState(false);
  const [guardianName, setGuardianName] = useState('');
  const [guardianRelation, setGuardianRelation] = useState('');
  const [country, setCountry] = useState('Pakistan');
  const [selectedTimezone, setSelectedTimezone] = useState('Asia/Karachi');
  const [courseId, setCourseId] = useState<number>(initialCourseId);
  const [preferredDays, setPreferredDays] = useState('Monday to Friday');
  const [preferredTime, setPreferredTime] = useState('5:00 PM - 7:00 PM');
  const [contactPhone, setContactPhone] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [preferredLanguage, setPreferredLanguage] = useState('English');
  const [applicationType, setApplicationType] = useState<'Admission' | 'Free Trial'>(initialType);
  const [botTrap, setBotTrap] = useState('');

  // UI status
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    api.getCourses().then(setCourses).catch(() => {});
    api.getTimezones().then(setTimezones).catch(() => {});
  }, []);

  // Automatically mark isChild if studentAge is under 18
  const handleAgeChange = (val: string) => {
    const ageNum = parseInt(val);
    if (!isNaN(ageNum)) {
      setStudentAge(ageNum);
      if (ageNum < 18) {
        setIsChild(true);
      }
    } else {
      setStudentAge('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    // Validation
    if (!studentName.trim() || studentAge === '') {
      setErrorMessage('Please provide the student name and valid age.');
      return;
    }

    if ((Number(studentAge) < 18 || isChild) && !guardianName.trim()) {
      setErrorMessage('Guardian / Parent name is required for child applicants under 18.');
      return;
    }

    if (!contactPhone.trim() || !contactEmail.trim()) {
      setErrorMessage('Please provide both phone/WhatsApp number and contact email.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.submitAdmission({
        student_name: studentName,
        student_age: Number(studentAge),
        is_child: isChild || Number(studentAge) < 18,
        guardian_name: (isChild || Number(studentAge) < 18) ? guardianName : undefined,
        guardian_relation: (isChild || Number(studentAge) < 18) ? guardianRelation : undefined,
        country,
        timezone: selectedTimezone,
        course_id: courseId,
        preferred_days: preferredDays,
        preferred_time: preferredTime,
        contact_phone: contactPhone,
        contact_email: contactEmail,
        preferred_language: preferredLanguage,
        application_type: applicationType,
        website_bot_trap: botTrap,
      });

      setSuccessMessage(res.message);
      // Reset sensitive fields
      setStudentName('');
      setStudentAge('');
      setGuardianName('');
      setContactPhone('');
      setContactEmail('');
    } catch (err: any) {
      setErrorMessage(err.message || 'An error occurred while submitting your application.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-10">
      {/* Page Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-widest text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
          Official Academy Enrollment
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Admission & Free Trial Application
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed">
          Submit your application to study Quran with teacher Abdul Hadi. All submissions are reviewed manually based on schedule compatibility.
        </p>
      </div>

      {/* Success Notification */}
      {successMessage && (
        <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-950 space-y-3 shadow-sm animate-fade-in">
          <div className="flex items-center gap-3 font-bold text-base text-emerald-900">
            <CheckCircle2 className="w-6 h-6 text-emerald-700 flex-shrink-0" />
            <span>Application Successfully Submitted!</span>
          </div>
          <p className="text-xs sm:text-sm leading-relaxed text-emerald-900">
            {successMessage}
          </p>
          <div className="text-xs text-emerald-800 bg-white/70 p-3 rounded-xl border border-emerald-200">
            <strong>Next Step:</strong> Administrator Abdul Hadi will review your preferred timezone and timetable, and contact you via email or WhatsApp to schedule your trial or introductory lesson.
          </div>
        </div>
      )}

      {/* Error Alert */}
      {errorMessage && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 flex items-start gap-3 text-xs sm:text-sm">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Main Form Container */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-emerald-100 shadow-sm space-y-8 text-left">
        {/* Toggle: Admission vs Free Trial */}
        <div className="flex rounded-2xl bg-slate-100 p-1.5 max-w-md mx-auto">
          <button
            type="button"
            onClick={() => setApplicationType('Admission')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
              applicationType === 'Admission'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Regular Admission
          </button>
          <button
            type="button"
            onClick={() => setApplicationType('Free Trial')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
              applicationType === 'Free Trial'
                ? 'bg-amber-500 text-slate-950 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Free Trial Request
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Honeypot Spam Field (Hidden from real users) */}
          <div className="hidden" aria-hidden="true">
            <label htmlFor="website_bot_trap">Do not fill this</label>
            <input
              type="text"
              id="website_bot_trap"
              value={botTrap}
              onChange={(e) => setBotTrap(e.target.value)}
              tabIndex={-1}
              autoComplete="off"
            />
          </div>

          {/* Student Info Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-900 border-b pb-2 flex items-center gap-2">
              <User className="w-4 h-4 text-emerald-700" />
              <span>1. Student Information</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Student Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Muhammad Hamza"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Student Age (Years) *
                </label>
                <input
                  type="number"
                  min="3"
                  max="100"
                  required
                  placeholder="e.g. 10"
                  value={studentAge}
                  onChange={(e) => handleAgeChange(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700"
                />
              </div>
            </div>

            {/* Child Checkbox */}
            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="isChild"
                checked={isChild || (typeof studentAge === 'number' && studentAge < 18)}
                onChange={(e) => setIsChild(e.target.checked)}
                className="w-4 h-4 text-emerald-700 rounded border-slate-300 focus:ring-emerald-600"
              />
              <label htmlFor="isChild" className="text-xs text-slate-600 select-none cursor-pointer">
                Student is a child or applicant under 18 years of age (requires Parent/Guardian)
              </label>
            </div>

            {/* Guardian Fields (Shown if child) */}
            {(isChild || (typeof studentAge === 'number' && studentAge < 18)) && (
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-4">
                <span className="text-xs font-bold text-amber-900 block">
                  Parent / Guardian Details:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Parent / Guardian Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Tariq Mahmood"
                      value={guardianName}
                      onChange={(e) => setGuardianName(e.target.value)}
                      className="w-full px-4 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Relationship to Student
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Father, Mother, Guardian"
                      value={guardianRelation}
                      onChange={(e) => setGuardianRelation(e.target.value)}
                      className="w-full px-4 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Course & Schedule Section */}
          <div className="space-y-4 pt-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-900 border-b pb-2 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-emerald-700" />
              <span>2. Course & Timetable Preferences</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Select Desired Course *
                </label>
                <select
                  value={courseId}
                  onChange={(e) => setCourseId(parseInt(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700"
                >
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title_en} ({c.title_ur})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Instruction Language *
                </label>
                <select
                  value={preferredLanguage}
                  onChange={(e) => setPreferredLanguage(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700"
                >
                  <option value="English">English</option>
                  <option value="Urdu">Urdu (اردو)</option>
                  <option value="Bilingual">Bilingual (English + Urdu)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Preferred Days *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mon to Thu, Weekends only"
                  value={preferredDays}
                  onChange={(e) => setPreferredDays(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Preferred Time Window *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 5:00 PM - 7:00 PM"
                  value={preferredTime}
                  onChange={(e) => setPreferredTime(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700"
                />
              </div>
            </div>
          </div>

          {/* Location & Contact Section */}
          <div className="space-y-4 pt-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-900 border-b pb-2 flex items-center gap-2">
              <Mail className="w-4 h-4 text-emerald-700" />
              <span>3. Location & Contact Details</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Country of Residence *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. United Kingdom, USA, Pakistan"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Your Timezone *
                </label>
                <select
                  value={selectedTimezone}
                  onChange={(e) => setSelectedTimezone(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700"
                >
                  {timezones.map((tz) => (
                    <option key={tz.tz} value={tz.tz}>
                      {tz.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  WhatsApp / Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. +44 7911 123456"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. family@example.com"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700"
                />
              </div>
            </div>
          </div>

          {/* Privacy & Honesty Disclaimer */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1">
            <span className="font-semibold text-slate-800 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              <span>Application Disclaimer & Privacy Policy:</span>
            </span>
            <p>
              Submitting an application does not guarantee admission. We review timetable compatibility with our administrator / instructor Abdul Hadi Panhwar before confirming class placement. Your personal information is kept strictly confidential and is never shared with third parties.
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white py-3.5 rounded-xl font-bold text-sm shadow-md transition-all cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span>{submitting ? 'Submitting Application...' : 'Submit Application Now'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
