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
  const [lastSubmitted, setLastSubmitted] = useState<{
    name: string;
    courseName: string;
    country: string;
    phone: string;
    type: string;
  } | null>(null);

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
      const selectedCourse = courses.find(c => c.id === courseId);
      const submissionInfo = {
        name: studentName,
        courseName: selectedCourse ? (language === 'ur' ? selectedCourse.title_ur : selectedCourse.title_en) : 'Quran Course',
        country,
        phone: contactPhone || 'Not provided',
        type: applicationType
      };

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
      setLastSubmitted(submissionInfo);

      // Automated WhatsApp dispatch
      const waUrl = `https://wa.me/923282885660?text=${encodeURIComponent(
        `السلام علیکم ورحمۃ اللہ، میں نے الحادی آن لائن قرآن اکیڈمی کی ویب سائٹ پر ایڈمیشن فارم جمع کرایا ہے۔\n` +
        `طالب علم: ${studentName}\n` +
        `عمر: ${studentAge} سال\n` +
        `کورس: ${submissionInfo.courseName}\n` +
        `ملک: ${country}\n` +
        `رابطہ نمبر: ${contactPhone}\n` +
        `ای میل: ${contactEmail}`
      )}`;
      
      try {
        window.open(waUrl, '_blank');
      } catch (_) {}

      // Backup email notification to teacher Abdul Hadi
      try {
        fetch('https://formsubmit.co/ajax/abdulhadipanhwar71@gmail.com', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({
            _subject: `New Quran Academy Admission: ${studentName} (${submissionInfo.courseName})`,
            StudentName: studentName,
            Age: studentAge,
            Course: submissionInfo.courseName,
            Country: country,
            Phone: contactPhone,
            Email: contactEmail,
            Days: preferredDays,
            Time: preferredTime
          })
        }).catch(() => {});
      } catch (_) {}

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

      {/* Error Alert */}
      {errorMessage && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 flex items-start gap-3 text-xs sm:text-sm">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* When Submitted: Display Dedicated In-Place Success Card */}
      {lastSubmitted ? (
        <div className="bg-white rounded-3xl p-8 sm:p-12 border-2 border-emerald-500/40 shadow-xl text-center space-y-6 max-w-2xl mx-auto animate-fade-in">
          <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-12 h-12" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              {language === 'ur' ? 'کامیاب رجسٹریشن' : 'Official Submission Confirmed'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {language === 'ur' ? 'آپ کی درخواست موصول ہو گئی ہے!' : 'Application Received Successfully!'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
              {language === 'ur'
                ? 'معلم عبد الہادی پنوہر کو آپ کی درخواست موصول ہو گئی ہے۔ کلاس کا وقت اور ٹائم ٹیبل فائنل کرنے کے لیے نیچے دیے گئے بٹن پر کلک کر کے واٹس ایپ پر تصدیق بھیجیں۔'
                : 'Teacher Abdul Hadi has received your application. Click below to confirm your schedule directly via WhatsApp.'}
            </p>
          </div>

          {/* Application Details Summary */}
          <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-5 text-left text-xs sm:text-sm space-y-3">
            <div className="flex justify-between border-b border-emerald-200/60 pb-2">
              <span className="text-slate-600 font-medium">{language === 'ur' ? 'طالب علم کا نام:' : 'Student Name:'}</span>
              <span className="font-bold text-slate-900">{lastSubmitted.name}</span>
            </div>
            <div className="flex justify-between border-b border-emerald-200/60 pb-2">
              <span className="text-slate-600 font-medium">{language === 'ur' ? 'منتخب کورس:' : 'Selected Course:'}</span>
              <span className="font-bold text-emerald-900">{lastSubmitted.courseName}</span>
            </div>
            <div className="flex justify-between border-b border-emerald-200/60 pb-2">
              <span className="text-slate-600 font-medium">{language === 'ur' ? 'درخواست کی نوعیت:' : 'Application Type:'}</span>
              <span className="font-bold text-emerald-800">{lastSubmitted.type}</span>
            </div>
            <div className="flex justify-between border-b border-emerald-200/60 pb-2">
              <span className="text-slate-600 font-medium">{language === 'ur' ? 'ملک:' : 'Country:'}</span>
              <span className="font-bold text-slate-900">{lastSubmitted.country}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600 font-medium">{language === 'ur' ? 'رابطہ نمبر:' : 'Contact Phone:'}</span>
              <span className="font-bold text-slate-900">{lastSubmitted.phone}</span>
            </div>
          </div>

          {/* Large Primary WhatsApp Confirmation Button */}
          <div className="pt-2 space-y-3">
            <a
              href={`https://wa.me/923282885660?text=${encodeURIComponent(
                `السلام علیکم ورحمۃ اللہ، میں نے الحادی آن لائن قرآن اکیڈمی کی ویب سائٹ پر ایڈمیشن فارم جمع کرایا ہے۔\n` +
                `طالب علم: ${lastSubmitted.name}\n` +
                `درخواست کی نوعیت: ${lastSubmitted.type}\n` +
                `کورس: ${lastSubmitted.courseName}\n` +
                `ملک: ${lastSubmitted.country}\n` +
                `رابطہ نمبر: ${lastSubmitted.phone}`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2.5 w-full py-4 px-6 rounded-2xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-base shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all"
            >
              <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              <span>{language === 'ur' ? 'معلم عبد الہادی کو واٹس ایپ پر تفصیلات بھیجیں' : 'Send Details to Teacher Abdul Hadi via WhatsApp'}</span>
            </a>

            <div>
              <button
                type="button"
                onClick={() => {
                  setSuccessMessage(null);
                  setLastSubmitted(null);
                }}
                className="text-xs font-semibold text-slate-500 hover:text-emerald-800 underline underline-offset-4 transition-colors pt-2"
              >
                {language === 'ur' ? 'نئی درخواست جمع کریں / Submit Another Application' : 'Submit Another Application'}
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Main Form Container */
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
      )}
    </div>
  );
};
