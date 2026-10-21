import { Link } from 'react-router-dom';
import { Home, Compass, BookOpen } from 'lucide-react';

export const NotFound = () => {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-emerald-100 shadow-sm text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-800 flex items-center justify-center mx-auto">
          <Compass className="w-8 h-8 animate-spin-slow" />
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold text-slate-900">404</h1>
          <h2 className="text-lg font-bold text-emerald-950">Page Not Found</h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            The page you requested does not exist or has been moved. You can return to our homepage or explore the Holy Quran.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Link
            to="/"
            className="flex-1 flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white py-2.5 rounded-xl font-bold text-xs shadow-sm transition-colors"
          >
            <Home className="w-4 h-4" />
            <span>Return Home</span>
          </Link>
          <Link
            to="/quran"
            className="flex-1 flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 py-2.5 rounded-xl font-semibold text-xs transition-colors"
          >
            <BookOpen className="w-4 h-4" />
            <span>Read Quran</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
