import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen, GraduationCap, Sparkles, CheckCircle2, ShieldCheck,
  Globe2, Video, Clock, ArrowRight, Heart, Star, Compass
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../services/api';
import { Course } from '../types';

export const Home = () => {
  const { t, language } = useLanguage();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getCourses()
      .then(setCourses)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-20 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-950 via-emerald-900 to-emerald-950 text-white py-16 lg:py-24 border-b border-amber-600/30">
        {/* Subtle Geometric Pattern Overlay */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-400/30 text-amber-300 text-xs font-semibold tracking-wide uppercase">
                <Sparkles className="w-3.5 h-3.5" />
                <span>One-to-One Online Quranic Instruction</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
                Learn The Holy Quran with Authentic{' '}
                <span className="text-amber-400 underline decoration-amber-500/50 underline-offset-8">
                  Tajweed & Understanding
                </span>
              </h1>

              <p className="text-base sm:text-lg text-emerald-100/90 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                {t('heroSubtitle')}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  to="/admission"
                  className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-slate-950 px-6 py-3.5 rounded-xl font-bold text-sm shadow-lg hover:shadow-amber-500/20 transition-all no-lag-transition"
                >
                  <GraduationCap className="w-4 h-4" />
                  <span>{t('btnApplyAdmission')}</span>
                </Link>

                <Link
                  to="/courses"
                  className="inline-flex items-center gap-2 bg-emerald-800/80 hover:bg-emerald-700/80 text-white border border-emerald-500/40 px-6 py-3.5 rounded-xl font-semibold text-sm transition-all no-lag-transition"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>{t('btnExploreCourses')}</span>
                </Link>

                <Link
                  to="/admission?type=trial"
                  className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-emerald-200 border border-white/20 px-5 py-3.5 rounded-xl font-medium text-sm transition-all no-lag-transition"
                >
                  <span>{t('btnFreeTrial')}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="pt-6 border-t border-emerald-800/60 grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs text-emerald-200 text-left">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  <span>1-on-1 Personal Attention</span>
                </div>
                <div className="flex items-center gap-2">
                  <Video className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  <span>Google Meet & Zoom</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  <span>Flexible Timezones</span>
                </div>
              </div>
            </div>

            {/* Right Emblem & Academy Card */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative p-6 sm:p-8 rounded-3xl bg-emerald-900/60 border border-amber-500/40 shadow-2xl backdrop-blur-md max-w-sm w-full text-center space-y-5">
                <div className="relative mx-auto w-40 h-40 rounded-full p-1 bg-gradient-to-tr from-amber-500 via-amber-300 to-amber-600 shadow-xl">
                  <img
                    src="/logo.jpg"
                    alt="Al-Hadi Online Quran Academy Emblem"
                    className="w-full h-full rounded-full object-cover shadow-inner"
                  />
                </div>

                <div className="space-y-1">
                  <h2 className="text-xl font-bold text-white tracking-wide">
                    Al-Hadi Online Quran Academy
                  </h2>
                  <p className="text-sm font-arabic text-amber-300">
                    بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ
                  </p>
                </div>

                <div className="text-xs text-emerald-200 bg-emerald-950/70 p-3.5 rounded-xl border border-emerald-800/80 leading-relaxed text-left space-y-1.5">
                  <p className="font-semibold text-amber-400">Head Teacher & Administrator:</p>
                  <p className="text-white text-sm font-medium">Abdul Hadi</p>
                  <p className="text-slate-300 text-[11px]">
                    Serving students across Pakistan, UK, USA, Canada, UAE, Qatar, Kuwait, Oman and globally.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Islamic Content Quick-Access Showcase Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-700">
            Islamic Resources
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Explore Free Quranic & Islamic Study Tools
          </h2>
          <p className="text-sm text-slate-600">
            Read and review the complete Holy Quran, authentic translations, Kalimas, and daily Duas.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: Quran Reading */}
          <Link
            to="/quran"
            className="group p-6 rounded-2xl bg-white border border-emerald-100 shadow-sm hover:shadow-md hover:border-emerald-300 transition-all flex flex-col justify-between text-left"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold group-hover:bg-emerald-700 group-hover:text-white transition-colors">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-lg group-hover:text-emerald-700 transition-colors">
                The Holy Quran
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Complete 114 Surahs with verified Arabic text, verse numbering, and easy chapter browsing.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center text-xs font-semibold text-emerald-700 group-hover:translate-x-1 transition-transform">
              <span>Read Quran</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </div>
          </Link>

          {/* Card 2: Quran Translation */}
          <Link
            to="/quran-translation"
            className="group p-6 rounded-2xl bg-white border border-emerald-100 shadow-sm hover:shadow-md hover:border-emerald-300 transition-all flex flex-col justify-between text-left"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold group-hover:bg-amber-600 group-hover:text-white transition-colors">
                <Globe2 className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-lg group-hover:text-amber-700 transition-colors">
                Quran Translation
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Trustworthy Urdu (Jalandhry) & English (Saheeh International) translations side-by-side.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center text-xs font-semibold text-amber-700 group-hover:translate-x-1 transition-transform">
              <span>Study Translations</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </div>
          </Link>

          {/* Card 3: Six Kalimas */}
          <Link
            to="/six-kalimas"
            className="group p-6 rounded-2xl bg-white border border-emerald-100 shadow-sm hover:shadow-md hover:border-emerald-300 transition-all flex flex-col justify-between text-left"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold group-hover:bg-emerald-700 group-hover:text-white transition-colors">
                <Star className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-lg group-hover:text-emerald-700 transition-colors">
                The Six Kalimas
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                All 6 foundational Kalimas with verified Arabic, Urdu, and English meanings with references.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center text-xs font-semibold text-emerald-700 group-hover:translate-x-1 transition-transform">
              <span>Learn Kalimas</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </div>
          </Link>

          {/* Card 4: Masnoon Duas */}
          <Link
            to="/masnoon-duas"
            className="group p-6 rounded-2xl bg-white border border-emerald-100 shadow-sm hover:shadow-md hover:border-emerald-300 transition-all flex flex-col justify-between text-left"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold group-hover:bg-amber-600 group-hover:text-white transition-colors">
                <Heart className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-lg group-hover:text-amber-700 transition-colors">
                Masnoon Duas
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Authentic daily supplications for waking, sleeping, eating, prayers, and knowledge.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center text-xs font-semibold text-amber-700 group-hover:translate-x-1 transition-transform">
              <span>View Duas</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </div>
          </Link>
        </div>
      </section>

      {/* Featured Courses Section */}
      <section className="bg-emerald-50/60 py-16 border-y border-emerald-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-800">
                Structured Syllabus
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
                {t('featuredCourses')}
              </h2>
              <p className="text-sm text-slate-600 mt-1">
                {t('coursesSubtitle')}
              </p>
            </div>
            <Link
              to="/courses"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-emerald-800 hover:text-emerald-950 transition-colors"
            >
              <span>View All 7 Courses</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((c) => (
              <div
                key={c.id}
                className="bg-white rounded-2xl p-6 border border-emerald-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between text-left space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold px-2.5 py-1 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                      Level: {c.level_en}
                    </span>
                    <span className="text-xs text-amber-700 font-medium">
                      {c.target_audience_en}
                    </span>
                  </div>

                  <h3 className="font-bold text-lg text-slate-900 leading-snug">
                    {language === 'ur' ? c.title_ur : c.title_en}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    {language === 'ur' ? c.description_ur : c.description_en}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <Link
                    to="/admission"
                    className="text-xs font-semibold text-emerald-700 hover:text-emerald-900 inline-flex items-center gap-1"
                  >
                    <span>Apply Now</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                  <Link
                    to="/contact"
                    className="text-xs text-slate-500 hover:text-slate-800 underline"
                  >
                    Fee Inquiries
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Teaching Method Overview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-700">
              Personalized Methodology
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 leading-tight">
              Honest, Patient, and Focused Online Learning
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              We teach one-to-one to ensure every learner receives complete attention. Whether starting from Arabic alphabets in Noorani Qaida or refining recitation with Tajweed rules, our lessons adapt to the student's individual pace.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-sm text-slate-900">For Children & Adults (Boys & Girls)</h4>
                  <p className="text-xs text-slate-500">Dedicated guidance tailored respectfully for young beginners and mature learners.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-sm text-slate-900">Google Meet & Zoom Screen Sharing</h4>
                  <p className="text-xs text-slate-500">Crystal clear digital Quran text displayed live on screen with teacher correction.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-sm text-slate-900">Mutually Agreed Flexible Timings</h4>
                  <p className="text-xs text-slate-500">Accommodates timezones across UK, USA, Canada, Middle East, and Pakistan.</p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <Link
                to="/teaching-method"
                className="inline-flex items-center gap-2 text-sm font-bold text-emerald-800 hover:text-emerald-950 underline"
              >
                <span>Read Full Teaching Approach & Guidelines</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="p-8 rounded-3xl bg-emerald-950 text-white space-y-6 shadow-xl border border-amber-600/30">
              <h3 className="text-xl font-bold text-amber-300">
                Ready to Begin Quran Learning?
              </h3>
              <p className="text-xs text-emerald-100/90 leading-relaxed">
                Submit an admission or free-trial request. Teacher Abdul Hadi will review your schedule preferences and contact you to arrange a suitable lesson time.
              </p>

              <div className="space-y-3">
                <Link
                  to="/admission"
                  className="flex items-center justify-center gap-2 w-full bg-amber-500 hover:bg-amber-600 text-slate-950 py-3 rounded-xl font-bold text-sm shadow transition-colors"
                >
                  <GraduationCap className="w-4 h-4" />
                  <span>Start Admission Application</span>
                </Link>
                <a
                  href="https://wa.me/923282885660"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full bg-[#25D366] hover:bg-[#20ba59] text-white py-3 rounded-xl font-bold text-xs shadow transition-colors"
                >
                  <span>Chat on WhatsApp (03282885660)</span>
                </a>
                <Link
                  to="/contact"
                  className="flex items-center justify-center gap-2 w-full bg-emerald-800/80 hover:bg-emerald-700/80 text-white py-3 rounded-xl font-medium text-xs border border-emerald-600/40 transition-colors"
                >
                  <span>Have questions? Contact Administration</span>
                </Link>
              </div>

              <div className="pt-4 border-t border-emerald-900 text-[11px] text-slate-400 text-center">
                Submitting an application does not guarantee admission. We review each application based on schedule compatibility.
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
