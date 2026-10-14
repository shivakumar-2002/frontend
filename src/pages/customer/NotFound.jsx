import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Home, ArrowLeft } from 'lucide-react';

export function NotFound() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-24 text-center space-y-6">
      <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-700 mx-auto flex items-center justify-center">
        <Sparkles className="w-8 h-8" />
      </div>
      <h1 className="text-4xl font-bold font-serif text-stone-900">404 - Page Not Found</h1>
      <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto">
        The jewellery collection or page you were looking for is unavailable or has moved.
      </p>
      <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
        <Link
          to="/"
          className="w-full sm:w-auto min-h-[44px] px-6 py-2.5 bg-amber-700 hover:bg-amber-800 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 active:scale-95 shadow-md"
        >
          <Home className="w-4 h-4 shrink-0" />
          <span>Return to Homepage</span>
        </Link>
        <Link
          to="/collections"
          className="w-full sm:w-auto min-h-[44px] px-6 py-2.5 border border-stone-300 hover:bg-stone-50 text-stone-700 rounded-xl text-xs font-semibold flex items-center justify-center active:scale-95 shadow-xs"
        >
          Browse Catalogue
        </Link>
      </div>
    </div>
  );
}
