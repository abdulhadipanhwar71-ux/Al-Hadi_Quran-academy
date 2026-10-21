import { useEffect, useState } from 'react';
import { Star, ShieldCheck, BookOpen, Volume2 } from 'lucide-react';
import { api } from '../services/api';
import { Kalima } from '../types';

export const SixKalimas = () => {
  const [kalimas, setKalimas] = useState<Kalima[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getKalimas()
      .then(setKalimas)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 space-y-12">
      {/* Page Header */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-widest text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
          Foundations of Faith
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          The Six Kalimas (شش کلمے)
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          The six foundational declarations of Islamic faith with authentic Arabic text, Urdu explanation, and English translation.
        </p>
      </div>

      {/* Kalimas Cards */}
      <div className="space-y-8">
        {loading ? (
          <div className="text-center py-16 text-slate-400">Loading Kalimas...</div>
        ) : (
          kalimas.map((kalima) => (
            <div
              key={kalima.id}
              className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-100 shadow-sm hover:shadow-md transition-all space-y-6 text-left"
            >
              {/* Header Badge */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <span className="w-10 h-10 rounded-xl bg-emerald-800 text-amber-300 font-bold flex items-center justify-center text-sm shadow-xs">
                    {kalima.number}
                  </span>
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">
                      {kalima.name_english}
                    </h2>
                    <p className="text-sm font-arabic font-bold text-amber-700">
                      {kalima.name_urdu} ({kalima.name_arabic})
                    </p>
                  </div>
                </div>

                {kalima.reference && (
                  <span className="text-xs text-slate-500 bg-slate-50 px-3 py-1 rounded-full border border-slate-200">
                    Source: {kalima.reference}
                  </span>
                )}
              </div>

              {/* Arabic Text (Centered, Large Uthmani) */}
              <div
                dir="rtl"
                className="bg-emerald-50/60 p-6 sm:p-8 rounded-2xl border border-emerald-100 text-center text-2xl sm:text-3xl font-arabic text-emerald-950 leading-[2.4] tracking-wide"
              >
                {kalima.text_arabic}
              </div>

              {/* Translations Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Urdu Translation */}
                <div dir="rtl" className="bg-amber-50/50 p-4 rounded-xl border border-amber-200/60 space-y-1 text-right">
                  <span className="text-xs font-bold text-amber-800 block">اردو ترجمہ:</span>
                  <p className="font-urdu text-base sm:text-lg text-slate-800 leading-[2.2]">
                    {kalima.text_urdu}
                  </p>
                </div>

                {/* English Translation */}
                <div dir="ltr" className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1 text-left">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wide block">English Translation:</span>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    {kalima.text_english}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Attribution */}
      <div className="p-4 rounded-2xl bg-emerald-950 text-emerald-200 text-xs text-center border border-amber-500/30">
        Verified against classical Islamic educational texts and authentic Hadith collections.
      </div>
    </div>
  );
};
