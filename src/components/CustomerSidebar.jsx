import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import {
  Home,
  Gem,
  Sparkles,
  Wrench,
  Award,
  MapPin,
  Phone,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  X,
  ShieldCheck,
  Scale,
} from 'lucide-react';
import { WhatsAppIcon } from './WhatsAppIcon';
import { HariHaraLogo } from './HariHaraLogo';
import { useShop } from '../context/ShopContext';

export function CustomerSidebar({
  mobileOpen = false,
  onCloseMobile,
  isCollapsed = false,
  onToggleCollapse,
}) {
  const { settings, categories } = useShop();
  const location = useLocation();
  const [categoriesExpanded, setCategoriesExpanded] = useState(true);

  const phone = settings?.phone || '+91 98485 43615';
  const whatsappNum = settings?.whatsappNumber?.replace(/\D/g, '') || '919848543615';

  // Close mobile drawer on route change
  useEffect(() => {
    if (mobileOpen && onCloseMobile) {
      onCloseMobile();
    }
  }, [location.pathname]);

  // Close mobile drawer on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && mobileOpen && onCloseMobile) {
        onCloseMobile();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileOpen, onCloseMobile]);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  const navLinks = [
    { name: 'Home', path: '/', icon: Home, exact: true },
    { name: 'All Collections', path: '/collections', icon: Gem, isCollections: true },
    { name: 'Services & Repairs', path: '/services', icon: Wrench },
    { name: 'About Workshop', path: '/about', icon: Award },
    { name: 'Visit Showroom', path: '/contact', icon: MapPin },
  ];

  return (
    <>
      {/* ======================================================== */}
      {/* 1. DESKTOP & TABLET SIDEBAR (>= 768px)                     */}
      {/* ======================================================== */}
      <aside
        className={`hidden md:flex flex-col bg-[#FFFDF9]/95 backdrop-blur-md border-r border-amber-300/80 fixed top-0 left-0 bottom-0 h-screen transition-all duration-300 ease-in-out z-30 shadow-md ${
          isCollapsed ? 'w-20' : 'w-64 lg:w-72'
        }`}
        aria-label="Customer Navigation Sidebar"
      >
        {/* Sidebar Header with Brand Logo & Collapse Toggle */}
        {isCollapsed ? (
          <div className="p-3 border-b border-amber-200/80 bg-amber-50/60 flex flex-col items-center gap-3">
            <Link
              to="/"
              title="HARI HARA Jewellery Works"
              className="relative group transition-transform hover:scale-105"
            >
              <div className="w-10 h-10 rounded-full p-[2px] bg-gradient-to-tr from-amber-600 via-yellow-300 to-amber-700 shadow-md">
                <div className="w-full h-full rounded-full overflow-hidden bg-stone-950 border border-amber-300/80">
                  <img
                    src="/lord-shiva-logo.png"
                    alt="Lord Shiva - HARI HARA"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </Link>

            <button
              onClick={onToggleCollapse}
              className="w-9 h-9 min-w-[36px] min-h-[36px] flex items-center justify-center rounded-lg bg-white hover:bg-amber-100 text-amber-900 border border-amber-300 transition-colors cursor-pointer shadow-xs"
              title="Expand sidebar (Show full menu and category list)"
              aria-label="Expand sidebar"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="p-4 border-b border-amber-200/80 bg-amber-50/70 flex items-center justify-between gap-2">
            <Link to="/" className="block min-w-0" title="HARI HARA Jewellery Works">
              <HariHaraLogo variant="light" size="small" showSubtitle={false} />
              <span className="block text-[10px] font-bold uppercase tracking-wider text-amber-800 mt-1 pl-1">
                91.6 KDM Hallmarked Gold
              </span>
            </Link>

            <button
              onClick={onToggleCollapse}
              className="w-9 h-9 min-w-[36px] min-h-[36px] flex items-center justify-center rounded-lg bg-white/90 hover:bg-amber-100 text-stone-600 hover:text-amber-900 border border-amber-300 transition-colors cursor-pointer shrink-0 shadow-xs"
              title="Collapse sidebar into compact icon mode"
              aria-label="Collapse sidebar"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Scrollable Navigation Links */}
        <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto no-scrollbar">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isCollActive = item.isCollections && location.pathname.startsWith('/collections');

            if (isCollapsed) {
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.exact}
                  title={item.name}
                  className={({ isActive }) =>
                    `flex items-center justify-center w-full h-11 min-h-[44px] rounded-xl transition-all relative group ${
                      isActive || isCollActive
                        ? 'bg-gradient-to-r from-amber-700 to-amber-800 text-white shadow-md'
                        : 'text-stone-700 hover:text-amber-900 hover:bg-amber-100/70'
                    }`
                  }
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  {/* Floating tooltip label on hover in collapsed mode */}
                  <span className="absolute left-full ml-3 px-2.5 py-1.5 bg-stone-900 text-amber-100 text-xs font-semibold rounded-lg shadow-2xl whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 border border-amber-500/40">
                    {item.name}
                  </span>
                </NavLink>
              );
            }

            return (
              <div key={item.path} className="space-y-1">
                <NavLink
                  to={item.path}
                  end={item.exact}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold min-h-[44px] transition-all ${
                      isActive || isCollActive
                        ? 'bg-gradient-to-r from-amber-700 to-amber-800 text-white shadow-md'
                        : 'text-stone-700 hover:text-amber-900 hover:bg-amber-100/70'
                    }`
                  }
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon className="w-4 h-4 shrink-0 text-amber-600 group-hover:text-amber-900" />
                    <span className="truncate">{item.name}</span>
                  </div>

                  {item.isCollections && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setCategoriesExpanded(!categoriesExpanded);
                      }}
                      className="p-1 rounded hover:bg-white/20 text-current transition-colors"
                      aria-label="Toggle categories submenu"
                    >
                      <ChevronDown
                        className={`w-3.5 h-3.5 transition-transform duration-200 ${
                          categoriesExpanded ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                  )}
                </NavLink>

                {/* Nested Category Sub-items under Collections */}
                {item.isCollections && categoriesExpanded && categories.length > 0 && (
                  <div className="pl-6 pr-1 py-1 space-y-0.5 border-l-2 border-amber-300 ml-3">
                    <NavLink
                      to="/collections"
                      end
                      className={({ isActive }) =>
                        `flex items-center justify-between px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-colors ${
                          isActive && location.pathname === '/collections'
                            ? 'text-amber-900 font-bold bg-amber-100/80'
                            : 'text-stone-600 hover:text-amber-900 hover:bg-amber-50'
                        }`
                      }
                    >
                      <span>✨ All Jewellery</span>
                    </NavLink>

                    {categories.slice(0, 7).map((cat) => (
                      <NavLink
                        key={cat.id}
                        to={`/collections/${cat.slug}`}
                        className={({ isActive }) =>
                          `flex items-center justify-between px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-colors ${
                            isActive
                              ? 'text-amber-900 font-bold bg-amber-100/80'
                              : 'text-stone-600 hover:text-amber-900 hover:bg-amber-50'
                          }`
                        }
                      >
                        <span className="truncate">{cat.name}</span>
                        {cat.productCount > 0 && (
                          <span className="text-[9px] px-1.5 py-0.2 bg-amber-200/80 text-amber-900 rounded-full font-bold">
                            {cat.productCount}
                          </span>
                        )}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>        {/* Sidebar Footer with Quick Contacts */}
        {isCollapsed ? (
          <div className="p-3 border-t border-amber-200/80 bg-amber-50/70 flex flex-col items-center gap-2">
            <a
              href={`tel:${phone.split('/')[0].replace(/\s+/g, '')}`}
              className="w-10 h-10 min-w-[40px] min-h-[40px] flex items-center justify-center bg-stone-900 hover:bg-stone-800 text-amber-300 rounded-xl transition-colors shadow-xs border border-amber-400"
              title={`Call: ${phone}`}
              aria-label="Call Workshop"
            >
              <Phone className="w-4 h-4 text-red-500 fill-red-500" />
            </a>

            <a
              href={`https://wa.me/${whatsappNum}?text=${encodeURIComponent('Namaste HARI HARA Jewellery Works! I would like to inquire about gold & silver ornaments.')}`}
              target="_blank"
              rel="noreferrer"
              className="w-10 h-10 min-w-[40px] min-h-[40px] flex items-center justify-center bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-colors shadow-xs"
              title="WhatsApp Enquiry"
              aria-label="WhatsApp Enquiry"
            >
              <WhatsAppIcon className="w-4 h-4" />
            </a>
          </div>
        ) : (
          <div className="p-3.5 border-t border-amber-200/80 bg-amber-50/60">
            {/* Quick Contact CTAs */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <a
                href={`tel:${phone.split('/')[0].replace(/\s+/g, '')}`}
                className="min-h-[40px] flex items-center justify-center gap-1.5 py-2 px-2 bg-stone-900 hover:bg-stone-800 text-amber-300 rounded-xl text-xs font-bold transition-colors border border-amber-400 shadow-xs"
                title="Call HARI HARA Jewellery Works"
              >
                <Phone className="w-3.5 h-3.5 text-red-500 fill-red-500" />
                <span>Call Now</span>
              </a>

              <a
                href={`https://wa.me/${whatsappNum}?text=${encodeURIComponent('Namaste HARI HARA Jewellery Works! I would like to inquire about gold & silver ornaments.')}`}
                target="_blank"
                rel="noreferrer"
                className="min-h-[40px] flex items-center justify-center gap-1.5 py-2 px-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
                title="WhatsApp Enquiry"
              >
                <WhatsAppIcon className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>
        )}
      </aside>

      {/* ======================================================== */}
      {/* 2. MOBILE SLIDE-IN SIDEBAR DRAWER (< 768px)               */}
      {/* ======================================================== */}
      {/* Backdrop Overlay */}
      <div
        onClick={onCloseMobile}
        className={`fixed inset-0 bg-stone-950/80 backdrop-blur-xs z-50 md:hidden transition-opacity duration-300 ${
          mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        aria-hidden="true"
      />

      {/* Slide-in Drawer Container */}
      <aside
        className={`fixed inset-y-0 left-0 w-80 max-w-[85vw] bg-[#FFFDF9]/98 backdrop-blur-xl border-r border-amber-300 shadow-2xl flex flex-col z-50 md:hidden transform transition-transform duration-300 ease-in-out ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        aria-label="Customer Mobile Navigation Sidebar"
      >
        {/* Drawer Header with Brand & Close Button */}
        <div className="p-4 border-b border-amber-200/80 bg-amber-50/70 flex items-center justify-between gap-3">
          <Link to="/" onClick={onCloseMobile} className="block min-w-0">
            <HariHaraLogo variant="light" size="small" showSubtitle={false} />
            <span className="block text-[10px] font-bold uppercase tracking-wider text-amber-800 mt-1 pl-1">
              91.6 KDM Gold & Silver
            </span>
          </Link>

          <button
            onClick={onCloseMobile}
            className="w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl bg-white hover:bg-amber-100 text-stone-700 hover:text-amber-900 transition-colors border border-amber-300 shadow-xs cursor-pointer"
            aria-label="Close sidebar navigation"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Scrollable Navigation */}
        <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isCollActive = item.isCollections && location.pathname.startsWith('/collections');

            return (
              <div key={item.path} className="space-y-1">
                <NavLink
                  to={item.path}
                  end={item.exact}
                  onClick={onCloseMobile}
                  className={({ isActive }) =>
                    `min-h-[46px] flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                      isActive || isCollActive
                        ? 'bg-gradient-to-r from-amber-700 to-amber-800 text-white shadow-md'
                        : 'text-stone-800 hover:text-amber-900 hover:bg-amber-100/70'
                    }`
                  }
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5 text-amber-600 shrink-0" />
                    <span className="text-[13px]">{item.name}</span>
                  </div>

                  <span className="text-xs opacity-60">→</span>
                </NavLink>

                {/* Subcategories list for collections */}
                {item.isCollections && categories.length > 0 && (
                  <div className="pl-6 pr-1 py-1 space-y-1 border-l-2 border-amber-300 ml-4">
                    <NavLink
                      to="/collections"
                      end
                      onClick={onCloseMobile}
                      className={({ isActive }) =>
                        `flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                          isActive && location.pathname === '/collections'
                            ? 'text-amber-900 font-bold bg-amber-100/80'
                            : 'text-stone-700 hover:text-amber-900 hover:bg-amber-50'
                        }`
                      }
                    >
                      <span>✨ View All Jewellery Catalogue</span>
                    </NavLink>

                    {categories.map((cat) => (
                      <NavLink
                        key={cat.id}
                        to={`/collections/${cat.slug}`}
                        onClick={onCloseMobile}
                        className={({ isActive }) =>
                          `flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                            isActive
                              ? 'text-amber-900 font-bold bg-amber-100/80'
                              : 'text-stone-700 hover:text-amber-900 hover:bg-amber-50'
                          }`
                        }
                      >
                        <span>{cat.name}</span>
                        {cat.productCount > 0 && (
                          <span className="text-[10px] px-2 py-0.5 bg-amber-200 text-amber-900 rounded-full font-bold">
                            {cat.productCount}
                          </span>
                        )}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Drawer Footer with Direct Calls */}
        <div className="p-4 border-t border-amber-200/80 bg-amber-50/70">
          {/* Quick Call & WhatsApp Buttons */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <a
              href={`tel:${phone.split('/')[0].replace(/\s+/g, '')}`}
              className="min-h-[44px] flex items-center justify-center gap-1.5 py-2.5 px-3 bg-stone-900 hover:bg-stone-800 text-amber-300 rounded-xl font-bold transition-colors border border-amber-400 shadow-sm"
            >
              <Phone className="w-3.5 h-3.5 text-red-500 fill-red-500" />
              <span>Call Now</span>
            </a>

            <a
              href={`https://wa.me/${whatsappNum}?text=${encodeURIComponent('Namaste HARI HARA Jewellery Works! I would like to inquire about gold & silver ornaments.')}`}
              target="_blank"
              rel="noreferrer"
              className="min-h-[44px] flex items-center justify-center gap-1.5 py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition-colors shadow-sm"
            >
              <WhatsAppIcon className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>
      </aside>
    </>
  );
}
