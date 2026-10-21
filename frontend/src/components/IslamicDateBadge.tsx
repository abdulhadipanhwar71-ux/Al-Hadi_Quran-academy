import { useEffect, useState } from 'react';
import { Moon, Calendar, Info } from 'lucide-react';
import { api } from '../services/api';
import { HijriDate } from '../types';
import { useLanguage } from '../context/LanguageContext';

export const IslamicDateBadge = () => {
  const [hijri, setHijri] = useState<HijriDate | null>(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const { language } = useLanguage();

  useEffect(() => {
    let isMounted = true;
    api.getHijriDate()
      .then(data => {
        if (isMounted) setHijri(data);
      })
      .catch(() => {
        // Fallback display if network issue
      });
    return () => { isMounted = false; };
  }, []);

  if (!hijri) {
    return (
      <div className="flex items-center gap-1.5 text-xs text-emerald-800 bg-emerald-50/80 px-2.5 py-1 rounded-full border border-emerald-200/50">
        <Moon className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
        <span>Loading Islamic Date...</span>
      </div>
    );
  }

  const formattedDate = language === 'ur' ? hijri.formatted_ur : hijri.formatted_en;

  return (
    <div className="relative inline-flex items-center">
      <div
        className="flex items-center gap-2 text-xs font-medium text-emerald-950 bg-amber-50/90 hover:bg-amber-100/90 transition-colors px-3 py-1 rounded-full border border-amber-200/80 shadow-sm cursor-pointer"
        onClick={() => setShowTooltip(!showTooltip)}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        role="button"
        aria-label="Islamic Date Information"
      >
        <Moon className="w-3.5 h-3.5 text-amber-600 fill-amber-500/20" />
        <span className={language === 'ur' ? 'font-urdu font-bold text-sm' : ''}>{formattedDate}</span>
        <span className="text-slate-400">|</span>
        <Calendar className="w-3.5 h-3.5 text-slate-500" />
        <span className="text-slate-600">{hijri.gregorian_date}</span>
        <Info className="w-3 h-3 text-amber-700 ml-0.5 opacity-70" />
      </div>

      {showTooltip && (
        <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 z-50 w-72 p-3 bg-slate-900 text-slate-100 text-xs rounded-lg shadow-xl border border-slate-700 leading-relaxed pointer-events-none">
          <p className="font-semibold text-amber-400 mb-1">Calendar Calculation Notice</p>
          <p>{hijri.disclaimer}</p>
          <div className="mt-1 text-[10px] text-slate-400 border-t border-slate-800 pt-1">
            Method: {hijri.calculation_method}
          </div>
        </div>
      )}
    </div>
  );
};
