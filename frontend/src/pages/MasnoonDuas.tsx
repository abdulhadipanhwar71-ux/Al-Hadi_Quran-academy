import { useEffect, useState } from 'react';
import { Heart, Search, Filter, BookOpen } from 'lucide-react';
import { api } from '../services/api';
import { MasnoonDua } from '../types';

export const MasnoonDuas = () => {
  const [duas, setDuas] = useState<MasnoonDua[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getMasnoonDuas()
      .then(setDuas)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const categories = ['All', ...Array.from(new Set(duas.map(d => d.category_en)))];

  const filteredDuas = duas.filter(d => {
    const matchesCat = selectedCategory === 'All' || d.category_en === selectedCategory;
    const matchesSearch =
      d.title_english.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.title_urdu.includes(searchQuery) ||
      d.text_english.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.text_arabic.includes(searchQuery);
    return matchesCat && matchesSearch;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 space-y-12">
      {/* Page Header */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-widest text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
          Daily Sunnah Supplications
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Masnoon Duas & Daily Adhkar (مسنون دعائیں)
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          Authentic prayers from the Sunnah of the Prophet Muhammad ﷺ for everyday moments, waking, sleeping, meals, and guidance.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-6 rounded-3xl border border-emerald-100 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          {/* Search */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search Duas (e.g. sleep, meal, knowledge)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-700"
            />
          </div>

          {/* Result Count */}
          <span className="text-xs text-slate-500 font-medium">
            Showing {filteredDuas.length} Duas
          </span>
        </div>

        {/* Categories Chips */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                selectedCategory === cat
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-emerald-50 text-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Duas Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {loading ? (
          <div className="col-span-2 text-center py-16 text-slate-400">Loading Duas...</div>
        ) : filteredDuas.length === 0 ? (
          <div className="col-span-2 text-center py-16 text-slate-400">No Duas match your search.</div>
        ) : (
          filteredDuas.map((dua) => (
            <div
              key={dua.id}
              className="bg-white rounded-3xl p-6 sm:p-7 border border-emerald-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-5 text-left"
            >
              <div className="space-y-4">
                {/* Category & Title */}
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200">
                    {dua.category_en}
                  </span>
                  {dua.reference && (
                    <span className="text-[10px] text-slate-400 font-mono">
                      {dua.reference}
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="font-bold text-base text-slate-900 leading-snug">
                    {dua.title_english}
                  </h3>
                  <p className="font-arabic font-bold text-sm text-emerald-800 mt-0.5">
                    {dua.title_urdu}
                  </p>
                </div>

                {/* Arabic Text */}
                <div
                  dir="rtl"
                  className="bg-emerald-50/70 p-4 rounded-xl border border-emerald-100 font-arabic text-xl sm:text-2xl text-emerald-950 leading-[2.2] text-right"
                >
                  {dua.text_arabic}
                </div>

                {/* Urdu Translation */}
                <div dir="rtl" className="bg-amber-50/50 p-3 rounded-lg border border-amber-200/50 text-right">
                  <p className="font-urdu text-sm sm:text-base text-slate-800 leading-[2.2]">
                    <span className="font-bold text-xs text-amber-800 ml-1">ترجمہ:</span>
                    {dua.text_urdu}
                  </p>
                </div>

                {/* English Translation */}
                <div dir="ltr" className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-left">
                  <p className="text-xs text-slate-600 leading-relaxed">
                    <span className="font-bold text-[11px] text-slate-500 mr-1 uppercase">Meaning:</span>
                    {dua.text_english}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
