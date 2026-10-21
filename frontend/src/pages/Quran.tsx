import { useEffect, useState } from 'react';
import { BookOpen, Search, ChevronRight, ChevronLeft, Volume2, ListFilter, ArrowLeft } from 'lucide-react';
import { api } from '../services/api';
import { QuranSurah, QuranAyah } from '../types';

export const Quran = () => {
  const [surahs, setSurahs] = useState<QuranSurah[]>([]);
  const [selectedSurah, setSelectedSurah] = useState<QuranSurah | null>(null);
  const [ayahs, setAyahs] = useState<QuranAyah[]>([]);
  const [totalAyahs, setTotalAyahs] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingAyahs, setLoadingAyahs] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [offset, setOffset] = useState(0);
  const limit = 50;

  useEffect(() => {
    api.getSurahs()
      .then((data) => {
        setSurahs(data);
        if (data.length > 0) {
          // Default to Surah Al-Fatiha
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
      .finally(() => {
        setLoadingAyahs(false);
      });
  };

  const filteredSurahs = surahs.filter(s =>
    s.name_english.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.name_arabic.includes(searchQuery) ||
    s.surah_number.toString() === searchQuery.trim()
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Quran Header */}
      <div className="bg-emerald-950 text-white rounded-3xl p-8 sm:p-10 shadow-lg border border-amber-600/30 text-center space-y-3 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />
        <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
          Al-Qur'an Al-Kareem
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold font-arabic tracking-wide text-white">
          القرآن الكريم • تلاوة وتدبر
        </h1>
        <p className="text-sm text-emerald-200 max-w-2xl mx-auto leading-relaxed">
          Read all 114 Surahs of the Holy Quran with verified Arabic Uthmani text, verse references, and authentic chapter metadata.
        </p>
      </div>

      {/* Main Layout: Surah Sidebar + Ayah Reader */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Sidebar: Surah Selector */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-emerald-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-base text-slate-900 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-emerald-700" />
              <span>Surah Index (114)</span>
            </h2>
            <span className="text-xs text-slate-500 font-mono">
              {filteredSurahs.length} found
            </span>
          </div>

          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name or number (e.g. Fatiha, 1)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:border-transparent"
            />
          </div>

          {/* Surah List */}
          <div className="max-h-[600px] overflow-y-auto space-y-1.5 pr-1 divide-y divide-slate-50">
            {loading ? (
              <p className="text-center py-8 text-xs text-slate-400">Loading index...</p>
            ) : filteredSurahs.length === 0 ? (
              <p className="text-center py-8 text-xs text-slate-400">No Surahs match your query.</p>
            ) : (
              filteredSurahs.map((surah) => {
                const isSelected = selectedSurah?.surah_number === surah.surah_number;
                return (
                  <button
                    key={surah.surah_number}
                    onClick={() => loadSurah(surah, 0)}
                    className={`w-full flex items-center justify-between p-3 rounded-xl text-left transition-colors ${
                      isSelected
                        ? 'bg-emerald-800 text-white shadow-xs'
                        : 'hover:bg-emerald-50 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-mono text-xs font-bold ${
                        isSelected ? 'bg-emerald-900 text-amber-300' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {surah.surah_number}
                      </span>
                      <div>
                        <div className="font-semibold text-xs leading-tight">
                          {surah.name_english}
                        </div>
                        <div className={`text-[10px] ${isSelected ? 'text-emerald-200' : 'text-slate-500'}`}>
                          {surah.english_meaning} • {surah.total_ayahs} Ayahs
                        </div>
                      </div>
                    </div>

                    <span className="font-arabic font-bold text-base pr-1">
                      {surah.name_arabic}
                    </span>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right Content: Ayah Reader */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 border border-emerald-100 shadow-sm space-y-6">
          {selectedSurah ? (
            <>
              {/* Surah Header Banner */}
              <div className="bg-emerald-50/80 rounded-2xl p-6 border border-emerald-200/80 text-center space-y-2">
                <div className="flex items-center justify-between text-xs text-emerald-800 font-medium px-2">
                  <span>Revelation: {selectedSurah.revelation_type}</span>
                  <span>Surah #{selectedSurah.surah_number}</span>
                  <span>{selectedSurah.total_ayahs} Verses</span>
                </div>

                <h2 className="text-3xl sm:text-4xl font-bold font-arabic text-emerald-950 pt-2">
                  سُورَةُ {selectedSurah.name_arabic}
                </h2>
                <p className="text-sm font-semibold text-slate-800">
                  {selectedSurah.name_english} — {selectedSurah.english_meaning}
                </p>

                {/* Bismillah (except Surah At-Tawbah #9) */}
                {selectedSurah.surah_number !== 9 && selectedSurah.surah_number !== 1 && (
                  <div className="pt-4 text-xl sm:text-2xl font-arabic text-emerald-900 font-bold">
                    بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
                  </div>
                )}
              </div>

              {/* Ayahs Display */}
              {loadingAyahs ? (
                <div className="text-center py-16 text-slate-500 text-sm">
                  Loading verses...
                </div>
              ) : ayahs.length === 0 ? (
                <div className="text-center py-16 text-slate-500 text-sm">
                  No verses found for this Surah.
                </div>
              ) : (
                <div className="space-y-6 divide-y divide-slate-100">
                  {ayahs.map((ayah) => (
                    <div
                      key={ayah.id}
                      className="pt-6 first:pt-0 space-y-4"
                    >
                      {/* Top Info Bar */}
                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-100 font-mono font-semibold text-slate-700">
                          {selectedSurah.surah_number}:{ayah.ayah_number_in_surah}
                        </span>
                        <div className="flex items-center gap-3 text-[11px] text-slate-400">
                          <span>Juz {ayah.juz}</span>
                          <span>•</span>
                          <span>Ruku {ayah.ruku}</span>
                          <span>•</span>
                          <span>Page {ayah.page}</span>
                          {ayah.sajda && (
                            <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 font-bold text-[10px]">
                              Sajda
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Arabic Verse Text (Right to Left with Tashkeel) */}
                      <div
                        dir="rtl"
                        className="font-arabic text-2xl sm:text-3xl leading-[2.2] text-slate-900 text-right pr-2 select-text"
                      >
                        {ayah.text_arabic}
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full border border-amber-500/80 bg-amber-50 text-amber-900 font-mono text-xs mx-2 font-normal">
                          {ayah.ayah_number_in_surah}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Pagination Controls */}
              {totalAyahs > limit && (
                <div className="flex items-center justify-between pt-6 border-t border-slate-100 text-xs">
                  <button
                    disabled={offset === 0 || loadingAyahs}
                    onClick={() => loadSurah(selectedSurah, Math.max(0, offset - limit))}
                    className="inline-flex items-center gap-1 px-4 py-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 disabled:opacity-40 transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Previous Verses</span>
                  </button>

                  <span className="text-slate-500 font-medium">
                    Showing {offset + 1}–{Math.min(offset + limit, totalAyahs)} of {totalAyahs}
                  </span>

                  <button
                    disabled={offset + limit >= totalAyahs || loadingAyahs}
                    onClick={() => loadSurah(selectedSurah, offset + limit)}
                    className="inline-flex items-center gap-1 px-4 py-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 disabled:opacity-40 transition-colors"
                  >
                    <span>Next Verses</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-20 text-slate-400">
              Select a Surah from the index to begin reading.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
