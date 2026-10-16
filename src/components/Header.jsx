import React from 'react';
import { Link } from 'react-router-dom';
import {
  Menu,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { HariHaraLogo } from './HariHaraLogo';

export function Header({
  onOpenMobileSidebar,
  isSidebarCollapsed = false,
  onToggleSidebar,
}) {
  return (
    <header className="sticky top-0 z-40 bg-[#FFFDF9]/95 backdrop-blur-md border-b border-amber-200/80 shadow-md shadow-amber-950/5">
      {/* Top Disclaimer & Guarantee Ticker */}
      <div className="bg-gradient-to-r from-amber-100/90 via-amber-50 to-amber-100/90 text-amber-950 text-xs py-1.5 border-b border-amber-200/60 overflow-hidden">
        <div className="w-full max-w-[1800px] mx-auto px-3 sm:px-6 lg:px-8 flex items-center justify-between gap-2 text-[11px] sm:text-xs">
          <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto py-0.5 no-scrollbar whitespace-nowrap touch-pan-x flex-1">
            {/* Live Gold Rate Market Notice */}
            <span className="flex items-center gap-1.5 bg-amber-200/90 text-amber-950 font-bold px-2.5 py-0.5 rounded-full border border-amber-300 shrink-0 shadow-2xs">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-600 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-700"></span>
              </span>
              <span className="text-[10px] uppercase font-extrabold text-amber-900 tracking-wider">
                LIVE GOLD RATE
              </span>
              <span className="text-amber-500">•</span>
              <span className="font-medium text-stone-800 text-[11px]">
                Gold rates vary depending on the market price and the time of purchase.
              </span>
            </span>

            <span className="text-amber-400 hidden sm:inline">•</span>
            <span className="flex items-center gap-1 text-amber-900 font-bold shrink-0">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
              100% 91.6 KDM Hallmarked Gold & Silver Ornaments
            </span>
            <span className="text-amber-400 hidden sm:inline">•</span>
            <span className="shrink-0 text-stone-700 font-medium">
              ✨ Official Master Goldsmith Workshop in Uppuguda (Est. 2001)
            </span>
          </div>

          <div className="hidden lg:flex items-center gap-3 text-stone-600 text-[11px] shrink-0 font-medium ml-4">
            <span>Uppuguda, Hyderabad</span>
            <span className="text-amber-400">•</span>
            <span className="text-amber-800 font-bold">25+ Yrs Master Legacy</span>
          </div>
        </div>
      </div>

      {/* Main Top Header Bar */}
      <div className="w-full max-w-[1800px] mx-auto px-3 sm:px-6 lg:px-8 py-2 sm:py-2.5 flex items-center justify-between gap-2 sm:gap-4">
        {/* Left Side: Mobile Hamburger Button, Mobile Brand Logo & Desktop Sidebar Toggle */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Mobile Hamburger Button (< 768px) */}
          <button
            onClick={onOpenMobileSidebar}
            className="md:hidden w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl bg-white hover:bg-amber-100 text-stone-800 hover:text-amber-900 border border-amber-300 shadow-xs cursor-pointer transition-colors"
            aria-label="Open navigation sidebar"
            title="Open navigation menu"
          >
            <Menu className="w-6 h-6 text-amber-800" />
          </button>

          {/* Brand Logo only on Mobile Header (< 768px) */}
          <Link to="/" className="shrink-0 md:hidden" title="HARI HARA Jewellery Works">
            <HariHaraLogo variant="light" size="small" />
          </Link>

          {/* Desktop & Tablet Sidebar Toggle Shortcut */}
          {onToggleSidebar && (
            <button
              onClick={onToggleSidebar}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-amber-300 hover:bg-amber-50 text-stone-700 text-xs font-semibold transition-colors cursor-pointer shadow-2xs"
              title={isSidebarCollapsed ? 'Expand sidebar navigation' : 'Collapse sidebar'}
              aria-label="Toggle sidebar"
            >
              {isSidebarCollapsed ? (
                <ChevronRight className="w-4 h-4 text-amber-700" />
              ) : (
                <ChevronLeft className="w-4 h-4 text-amber-700" />
              )}
              <span className="hidden xl:inline text-[11px]">
                {isSidebarCollapsed ? 'Expand Menu' : 'Compact Menu'}
              </span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
