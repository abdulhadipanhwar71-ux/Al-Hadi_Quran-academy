import React from 'react';
import { Phone, MessageCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const FloatingWhatsApp: React.FC = () => {
  const { language, t } = useLanguage();
  const whatsappUrl = "https://wa.me/923282885660";

  return (
    <aside
      aria-label="WhatsApp Contact"
      className={`fixed bottom-6 z-50 flex items-center gap-2 group transition-all duration-300 ${
        language === 'ur' ? 'left-6 flex-row-reverse' : 'right-6'
      }`}
    >
      {/* Tooltip / Label Badge */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="hidden sm:flex items-center gap-2 bg-white text-slate-800 text-xs font-bold px-3.5 py-2 rounded-full shadow-lg border border-emerald-100 hover:border-emerald-300 transition-all group-hover:scale-105"
      >
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
        <span className={language === 'ur' ? 'font-urdu' : ''}>{t('btnContactWhatsApp')}</span>
        <span className="text-emerald-700 font-mono text-[11px]">(03282885660)</span>
      </a>

      {/* WhatsApp Circular Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white flex items-center justify-center shadow-2xl hover:shadow-emerald-500/50 hover:scale-110 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-emerald-300"
        title="WhatsApp: 03282885660"
        aria-label="Chat on WhatsApp: 03282885660"
      >
        <MessageCircle className="w-8 h-8 fill-white text-[#25D366]" />
      </a>
    </aside>
  );
};
