import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, CheckCircle, GraduationCap, ArrowRight, Phone, Clock, UserCheck } from 'lucide-react';
import { api } from '../services/api';
import { Course } from '../types';
import { useLanguage } from '../context/LanguageContext';

export const Courses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const { language } = useLanguage();

  useEffect(() => {
    api.getCourses()
      .then(setCourses)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-12">
      {/* Header */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-widest text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
          Official Academic Programs
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Structured Quran & Islamic Courses
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          We offer six focused, authentic courses taught one-to-one to help children and adults develop accurate recitation, understanding, and Islamic character.
        </p>
      </div>

      {/* Courses List */}
      <div className="space-y-8">
        {loading ? (
          <div className="text-center py-16 text-slate-500 font-medium">
            Loading courses...
          </div>
        ) : (
          courses.map((course, idx) => (
            <div
              key={course.id}
              id={course.code}
              className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-100 shadow-sm hover:shadow-md transition-all grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
            >
              <div className="lg:col-span-8 space-y-4 text-left">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-800 text-white">
                    Course {idx + 1}
                  </span>
                  <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                    Level: {course.level_en}
                  </span>
                  <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                    Target: {course.target_audience_en}
                  </span>
                </div>

                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                    {course.title_en}
                  </h2>
                  <p className="text-base font-arabic font-bold text-emerald-800 mt-0.5">
                    {course.title_ur}
                  </p>
                </div>

                <p className="text-sm text-slate-600 leading-relaxed">
                  {language === 'ur' ? course.description_ur : course.description_en}
                </p>

                <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-slate-600">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span>One-to-One Live Sessions</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span>Google Meet & Zoom</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span>Flexible Weekly Timetable</span>
                  </div>
                </div>
              </div>

              {/* Right Action Column */}
              <div className="lg:col-span-4 bg-emerald-50/70 p-6 rounded-2xl border border-emerald-200/80 text-center space-y-4">
                <div className="space-y-1">
                  <span className="text-xs uppercase tracking-wider text-slate-500 font-semibold block">
                    Tuition & Schedule
                  </span>
                  <p className="text-sm font-bold text-emerald-950">
                    Direct Inquiry with Academy
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Fees vary based on weekly frequency and student timezone. Contact us for custom fee packages.
                  </p>
                </div>

                <div className="space-y-2 pt-2">
                  <Link
                    to={`/admission?course=${course.id}`}
                    className="flex items-center justify-center gap-2 w-full bg-emerald-700 hover:bg-emerald-800 text-white py-2.5 rounded-xl font-bold text-xs shadow-sm transition-colors"
                  >
                    <GraduationCap className="w-4 h-4" />
                    <span>Enroll in this Course</span>
                  </Link>

                  <a
                    href="https://wa.me/923282885660"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full bg-[#25D366] hover:bg-[#20ba59] text-white py-2.5 rounded-xl font-bold text-xs shadow-xs transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5 fill-white" />
                    <span>WhatsApp Fee Inquiry (03282885660)</span>
                  </a>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Notice on Course Scope */}
      <div className="p-6 rounded-2xl bg-amber-50/90 border border-amber-200/80 text-amber-950 text-xs sm:text-sm leading-relaxed max-w-4xl mx-auto space-y-1">
        <span className="font-bold block text-amber-900">Academic Scope & Course Confirmation:</span>
        <p>
          Al-Hadi Online Quran Academy strictly offers the seven verified courses listed above. Courses are conducted directly under teacher Abdul Hadi. To ensure high educational quality, we do not accept unverified courses or outsource instruction.
        </p>
      </div>
    </div>
  );
};
