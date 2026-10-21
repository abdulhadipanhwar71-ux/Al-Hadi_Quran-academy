import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, BookOpen, GraduationCap, Phone, Languages, UserCheck } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { TimezoneClock } from './TimezoneClock';
import { IslamicDateBadge } from './IslamicDateBadge';

export const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { language, toggleLanguage, t } = useLanguage();

  const navLinks = [
    { to: '/', label: t('navHome') },
    { to: '/about', label: t('navAbout') },
    { to: '/courses', label: t('navCourses') },
    { to: '/quran', label: t('navQuran') },
    { to: '/quran-translation', label: t('navTranslation') },
    { to: '/six-kalimas', label: t('navKalimas') },
    { to: '/masnoon-duas', label: t('navDuas') },
    { to: '/teaching-method', label: t('navMethod') },
    { to: '/contact', label: t('navContact') },
  ];

  const handleNavClick = () => {
    // Immediately close mobile menu on selection
    setMobileMenuOpen(false);
  };

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-emerald-900/10 shadow-sm transition-all">
      {/* Top Utility Bar: Islamic Date & International Time Clock */}
      <div className="bg-emerald-950 text-emerald-100 text-[11px] sm:text-xs py-1 px-4 sm:px-6 border-b border-emerald-900/40">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-2 flex-shrink-0">
            <IslamicDateBadge />
            <span className="hidden lg:inline-block text-emerald-700">|</span>
            <span className="hidden lg:inline-block text-emerald-300 font-medium">
              Teacher: Abdul Hadi Panhwar
            </span>
          </div>

          <div className="flex items-center gap-2.5 ml-auto flex-shrink-0">
            <TimezoneClock />
            {/* Language Switcher */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1 bg-emerald-800 hover:bg-emerald-700 text-white px-2 py-0.5 rounded-full text-[11px] font-medium transition-colors border border-emerald-600/40 flex-shrink-0"
              title="Toggle Language / زبان تبدیل کریں"
            >
              <Languages className="w-3 h-3" />
              <span>{language === 'en' ? 'اردو' : 'English'}</span>
            </button>
            {/* Admin Login Link */}
            <Link
              to="/admin/login"
              className="flex items-center gap-1 text-emerald-300 hover:text-white transition-colors text-[11px] font-medium flex-shrink-0"
              title="Administrator Portal"
            >
              <UserCheck className="w-3 h-3" />
              <span>Admin</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Header Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Brand Title */}
          <Link
            to="/"
            onClick={handleNavClick}
            className="flex items-center gap-3.5 focus:outline-none focus:ring-2 focus:ring-emerald-600 rounded-lg p-1"
          >
            <img
              src="/logo.jpg"
              alt="Al-Hadi Online Quran Academy Logo"
              className="w-14 h-14 rounded-full object-cover border-2 border-amber-500/70 shadow-sm flex-shrink-0"
            />
            <div>
              <span className="block font-bold text-lg sm:text-xl text-emerald-950 tracking-tight leading-tight">
                Al-Hadi Online Quran Academy
              </span>
              <span className="block text-xs font-medium text-amber-700/90 font-arabic tracking-wide">
                الھادی آن لائن اکیڈمی • تعلیم القرآن والسنۃ
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden xl:flex items-center gap-1.5" aria-label="Main Navigation">
            {navLinks.map((link) => {
              const active = isActive(link.to);
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={handleNavClick}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors no-lag-transition ${
                    active
                      ? 'bg-emerald-800 text-white font-semibold shadow-xs'
                      : 'text-slate-700 hover:text-emerald-900 hover:bg-emerald-50'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Call to Action Buttons */}
          <div className="hidden sm:flex items-center gap-2.5">
            <a
              href="https://wa.me/923282885660"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 bg-[#25D366] hover:bg-[#20ba59] text-white px-3.5 py-2 rounded-lg text-sm font-semibold shadow-xs transition-all"
              title="Chat on WhatsApp: 03282885660"
            >
              <Phone className="w-3.5 h-3.5 fill-white" />
              <span>03282885660</span>
            </a>

            <Link
              to="/admission"
              onClick={handleNavClick}
              className="flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-sm hover:shadow transition-all"
            >
              <GraduationCap className="w-4 h-4" />
              <span>{t('btnApplyAdmission')}</span>
            </Link>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex xl:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-700 hover:text-emerald-900 hover:bg-emerald-50 focus:outline-none focus:ring-2 focus:ring-emerald-700"
              aria-label="Toggle Navigation Menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-white border-t border-emerald-100 shadow-xl px-4 pt-3 pb-6 space-y-1">
          {navLinks.map((link) => {
            const active = isActive(link.to);
            return (
              <Link
                key={link.to}
                to={link.to}
                onClick={handleNavClick}
                className={`block px-3 py-2.5 rounded-lg text-base font-medium transition-colors ${
                  active
                    ? 'bg-emerald-800 text-white font-semibold'
                    : 'text-slate-700 hover:bg-emerald-50 hover:text-emerald-900'
                }`}
              >
                {link.label}
              </Link>
            );
          })}

          <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
            <Link
              to="/admission"
              onClick={handleNavClick}
              className="flex items-center justify-center gap-2 w-full bg-emerald-700 text-white py-3 rounded-lg font-semibold shadow-sm"
            >
              <GraduationCap className="w-4 h-4" />
              <span>{t('btnApplyAdmission')}</span>
            </Link>
            <Link
              to="/admin/login"
              onClick={handleNavClick}
              className="flex items-center justify-center gap-2 w-full bg-slate-100 text-slate-700 py-2.5 rounded-lg text-sm font-medium hover:bg-slate-200"
            >
              <UserCheck className="w-4 h-4" />
              <span>{t('navAdmin')}</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
