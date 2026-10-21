import { useEffect, useState } from 'react';
import { Globe2, Search, BookOpen, ChevronLeft, ChevronRight, Eye, Check, ShieldCheck } from 'lucide-react';
import { api } from '../services/api';
import { QuranSurah, QuranAyah } from '../types';

export const QuranTranslation = () => {
  const [surahs, setSurahs] = useState<QuranSurah[]>([]);
  const [selectedSurah, setSelectedSurah] = useState<QuranSurah | null>(null);
  const [ayahs, setAyahs] = useState<QuranAyah[]>([]);
  const [totalAyahs, setTotalAyahs] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingAyahs, setLoadingAyahs] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [offset, setOffset] = useState(0);
  const limit = 40;

  // Translation visibility filters
  const [showUrdu, setShowUrdu] = useState(true);
  const [showEnglish, setShowEnglish] = useState(true);

  useEffect(() => {
    api.getSurahs()
      .then((data) => {
        setSurahs(data);
        if (data.length > 0) {
          loadSurah(data[0]);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const loadSurah = (surah: QuranSurah, newOffset = 0) => {
    setSelectedSurah(surah);
    setLoadingAyahs(true);
    setOffset(newOffset);
    api.getSurahDetail(surah.surah_number, newOffset, limit)
      .then((res) => {
        setAyahs(res.ayahs);
        setTotalAyahs(res.total_ayahs);
      })
      .catch(() => {})
      .finally(() => setLoadingAyahs(false));
  };

  const filteredSurahs = surahs.filter(s =>
    s.name_english.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.name_arabic.includes(searchQuery) ||
    s.surah_number.toString() === searchQuery.trim()
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Page Header */}
      <div className="bg-emerald-950 text-white rounded-3xl p-8 sm:p-10 shadow-lg border border-amber-600/30 text-center space-y-3 relative overflow-hidden">
        <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
          Quranic Study & Meaning
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
          Quran Translation & Exegesis
        </h1>
        <p className="text-sm text-emerald-200 max-w-2xl mx-auto leading-relaxed">
          Verified Urdu translation by Maulana Fateh Muhammad Jalandhry & English translation by Saheeh International.
        </p>

        {/* Translation Attribution Tag */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-900/80 border border-emerald-700/60 text-[11px] text-emerald-200 mt-2">
          <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
          <span>Authentic published translations — No machine or AI-generated religious texts</span>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Sidebar: Surah List */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-emerald-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-base text-slate-900 flex items-center gap-2">
              <Globe2 className="w-4 h-4 text-emerald-700" />
              <span>Select Surah</span>
            </h2>
            <span className="text-xs text-slate-500 font-mono">
              {filteredSurahs.length}
            </span>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search Surah (e.g. Yaseen, 36)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-700"
            />
          </div>

          <div className="max-h-[550px] overflow-y-auto space-y-1.5 pr-1 divide-y divide-slate-50">
            {loading ? (
              <p className="text-center py-6 text-xs text-slate-400">Loading index...</p>
            ) : (
              filteredSurahs.map((surah) => {
                const isSelected = selectedSurah?.surah_number === surah.surah_number;
                return (
                  <button
                    key={surah.surah_number}
                    onClick={() => loadSurah(surah, 0)}
                    className={`w-full flex items-center justify-between p-3 rounded-xl text-left transition-colors ${
                      isSelected
                        ? 'bg-emerald-800 text-white font-medium'
                        : 'hover:bg-emerald-50 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className={`w-7 h-7 rounded-lg flex items-center justify-center font-mono text-xs font-bold ${
                        isSelected ? 'bg-emerald-900 text-amber-300' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {surah.surah_number}
                      </span>
                      <span className="font-medium text-xs">
                        {surah.name_english}
                      </span>
                    </div>

                    <span className="font-arabic font-bold text-sm">
                      {surah.name_arabic}
                    </span>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right Reader Area */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 border border-emerald-100 shadow-sm space-y-6">
          {selectedSurah ? (
            <>
              {/* Surah Header & Language Toggles */}
              <div className="bg-emerald-50/70 rounded-2xl p-6 border border-emerald-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="text-xs text-emerald-800 font-medium">
                    Surah #{selectedSurah.surah_number} • {selectedSurah.total_ayahs} Verses
                  </div>
                  <h2 className="text-2xl font-bold font-arabic text-emerald-950 mt-1">
                    سُورَةُ {selectedSurah.name_arabic} — {selectedSurah.name_english}
                  </h2>
                </div>

                {/* Display Toggles */}
                <div className="flex items-center gap-2 text-xs">
                  <button
                    onClick={() => setShowUrdu(!showUrdu)}
                    className={`px-3 py-1.5 rounded-lg border font-medium flex items-center gap-1.5 transition-colors ${
                      showUrdu ? 'bg-emerald-700 text-white border-emerald-700' : 'bg-white text-slate-600 border-slate-300'
                    }`}
                  >
                    <Check className={`w-3.5 h-3.5 ${showUrdu ? 'opacity-100' : 'opacity-0'}`} />
                    <span>اردو ترجمہ</span>
                  </button>

                  <button
                    onClick={() => setShowEnglish(!showEnglish)}
                    className={`px-3 py-1.5 rounded-lg border font-medium flex items-center gap-1.5 transition-colors ${
                      showEnglish ? 'bg-emerald-700 text-white border-emerald-700' : 'bg-white text-slate-600 border-slate-300'
                    }`}
                  >
                    <Check className={`w-3.5 h-3.5 ${showEnglish ? 'opacity-100' : 'opacity-0'}`} />
                    <span>English Translation</span>
                  </button>
                </div>
              </div>

              {/* Verses with Parallel Translations */}
              {loadingAyahs ? (
                <div className="text-center py-16 text-slate-400">Loading verses and translations...</div>
              ) : (
                <div className="space-y-6 divide-y divide-slate-100">
                  {ayahs.map((ayah) => (
                    <div key={ayah.id} className="pt-6 first:pt-0 space-y-3 text-left">
                      {/* Verse Number Indicator */}
                      <div className="flex items-center justify-between text-xs text-slate-400">
                        <span className="font-mono font-bold text-emerald-900 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          Ayah {selectedSurah.surah_number}:{ayah.ayah_number_in_surah}
                        </span>
                        <span>Juz {ayah.juz} • Ruku {ayah.ruku}</span>
                      </div>

                      {/* Arabic Original */}
                      <div dir="rtl" className="font-arabic text-2xl text-slate-900 leading-[2.2] text-right pr-2">
                        {ayah.text_arabic}
                      </div>

                      {/* Urdu Translation */}
                      {showUrdu && (
                        <div dir="rtl" className="font-urdu text-base sm:text-lg text-emerald-950 bg-amber-50/60 p-3 rounded-xl border border-amber-200/60 leading-[2.2] text-right">
                          <span className="font-bold text-xs text-amber-800 ml-2">ترجمہ:</span>
                          {ayah.text_urdu}
                        </div>
                      )}

                      {/* English Translation */}
                      {showEnglish && (
                        <div dir="ltr" className="text-sm text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-200 leading-relaxed text-left">
                          <span className="font-bold text-xs text-slate-500 mr-2 uppercase tracking-wide">Saheeh Int.:</span>
                          {ayah.text_english}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Pagination */}
              {totalAyahs > limit && (
                <div className="flex items-center justify-between pt-6 border-t border-slate-100 text-xs">
                  <button
                    disabled={offset === 0 || loadingAyahs}
                    onClick={() => loadSurah(selectedSurah, Math.max(0, offset - limit))}
                    className="inline-flex items-center gap-1 px-4 py-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 disabled:opacity-40"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Previous</span>
                  </button>

                  <span className="text-slate-500 font-medium">
                    Showing {offset + 1}–{Math.min(offset + limit, totalAyahs)} of {totalAyahs}
                  </span>

                  <button
                    disabled={offset + limit >= totalAyahs || loadingAyahs}
                    onClick={() => loadSurah(selectedSurah, offset + limit)}
                    className="inline-flex items-center gap-1 px-4 py-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 disabled:opacity-40"
                  >
                    <span>Next</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-20 text-slate-400">
              Select a Surah to view translations.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
