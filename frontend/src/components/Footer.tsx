import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Mail, Shield, ExternalLink, Heart, Phone } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../services/api';
import { AcademySettings } from '../types';

export const Footer = () => {
  const { t } = useLanguage();
  const [settings, setSettings] = useState<AcademySettings | null>(null);

  useEffect(() => {
    api.getSettings().then(setSettings).catch(() => {});
  }, []);

  return (
    <footer className="bg-emerald-950 text-slate-300 border-t border-amber-600/30 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Col 1: Identity & Logo */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="/logo.jpg"
                alt="Al-Hadi Online Quran Academy Logo"
                className="w-14 h-14 rounded-full object-cover border-2 border-amber-500 shadow-md"
              />
              <div>
                <h3 className="font-bold text-white text-base leading-tight">
                  Al-Hadi Online Quran Academy
                </h3>
                <p className="text-xs text-amber-400 font-arabic">
                  الھادی آن لائن اکیڈمی
                </p>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              {t('footerNotice')}
            </p>
            <div className="text-xs text-emerald-300 font-medium pt-1">
              Founder & Teacher: <span className="text-white font-semibold">Abdul Hadi Panhwar</span>
            </div>
          </div>

          {/* Col 2: Academic Programs */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-amber-400 mb-4 flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              <span>Available Courses</span>
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li>
                <Link to="/courses" className="hover:text-amber-300 transition-colors">
                  1. Noorani Qaida (نورانی قاعدہ)
                </Link>
              </li>
              <li>
                <Link to="/courses" className="hover:text-amber-300 transition-colors">
                  2. Quran Reading / Nazra Quran (ناظرہ قرآن)
                </Link>
              </li>
              <li>
                <Link to="/courses" className="hover:text-amber-300 transition-colors">
                  3. Tajweed Rules & Recitation (تجوید القرآن)
                </Link>
              </li>
              <li>
                <Link to="/courses" className="hover:text-amber-300 transition-colors">
                  4. Masnoon Duas & Daily Adhkar (مسنون دعائیں)
                </Link>
              </li>
              <li>
                <Link to="/courses" className="hover:text-amber-300 transition-colors">
                  5. Basic Islamic Education (اسلامی تعلیمات)
                </Link>
              </li>
              <li>
                <Link to="/courses" className="hover:text-amber-300 transition-colors">
                  6. Quran Translation & Understanding (ترجمۃ القرآن)
                </Link>
              </li>
              <li>
                <Link to="/courses" className="hover:text-amber-300 transition-colors">
                  7. Hadith Studies & Memorization (مطالعۂ حدیث)
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Islamic Resources & Quick Navigation */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-amber-400 mb-4">
              Islamic Studies
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li>
                <Link to="/quran" className="hover:text-amber-300 transition-colors">
                  Holy Quran (All 114 Surahs)
                </Link>
              </li>
              <li>
                <Link to="/quran-translation" className="hover:text-amber-300 transition-colors">
                  Quran Translation (Urdu & English)
                </Link>
              </li>
              <li>
                <Link to="/six-kalimas" className="hover:text-amber-300 transition-colors">
                  The Six Kalimas (شش کلمے)
                </Link>
              </li>
              <li>
                <Link to="/masnoon-duas" className="hover:text-amber-300 transition-colors">
                  Authentic Masnoon Duas
                </Link>
              </li>
              <li>
                <Link to="/teaching-method" className="hover:text-amber-300 transition-colors">
                  Online Teaching Method
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-amber-300 transition-colors">
                  Frequently Asked Questions (FAQ)
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="hover:text-amber-300 transition-colors flex items-center gap-1">
                  <Shield className="w-3 h-3 text-emerald-400" />
                  <span>Privacy Policy</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Verified Contact */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-amber-400 mb-4">
              Inquiries & Admission
            </h4>
            <div className="space-y-3 text-xs text-slate-300">
              <p>
                Inquiries regarding admission, custom schedules, and fees are handled directly by the academy administrator.
              </p>

              <div className="flex items-center gap-2 pt-1 text-slate-200">
                <Mail className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <a
                  href="mailto:abdulhadipanhwar71@gmail.com"
                  className="hover:text-amber-300 underline font-mono text-[11px]"
                >
                  abdulhadipanhwar71@gmail.com
                </a>
              </div>

              {/* Direct WhatsApp Action Button */}
              <a
                href="https://wa.me/923282885660"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white px-4 py-2.5 rounded-xl font-bold text-xs transition-colors mt-2 shadow-sm"
              >
                <Phone className="w-4 h-4 fill-white" />
                <span>WhatsApp: 03282885660</span>
                <ExternalLink className="w-3 h-3 ml-0.5 opacity-80" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 mt-8 border-t border-emerald-900/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>{t('copyright')}</p>
          <div className="flex items-center gap-4">
            <Link to="/privacy-policy" className="hover:text-slate-200">
              Privacy Policy
            </Link>
            <span>•</span>
            <Link to="/faq" className="hover:text-slate-200">
              FAQ
            </Link>
            <span>•</span>
            <Link to="/admin/login" className="hover:text-amber-300">
              Admin Login
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
