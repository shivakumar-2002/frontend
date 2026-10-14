import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Phone, MessageCircle, Menu, X, ShieldCheck, ChevronDown } from 'lucide-react';
import { HariHaraLogo } from './HariHaraLogo';
import { useShop } from '../context/ShopContext';

export function Header() {
  const { settings, categories } = useShop();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoriesDropdownOpen, setCategoriesDropdownOpen] = useState(false);

  const phone = settings?.phone || '+91 98485 43615';
  const whatsappNum = settings?.whatsappNumber?.replace(/\D/g, '') || '919848543615';

  const handleWhatsAppClick = () => {
    const text = encodeURIComponent(
      `Namaste HARI HARA Jewellery Works! I would like to inquire about gold & silver ornaments.`
    );
    window.open(`https://wa.me/${whatsappNum}?text=${text}`, '_blank');
  };

  const handleNavLinkClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FFFDF9]/95 backdrop-blur-md border-b border-amber-200/80 shadow-md shadow-amber-950/5">
      {/* Top Disclaimer & Guarantee Ticker */}
      <div className="bg-amber-100/70 text-amber-950 text-xs py-1.5 border-b border-amber-200/60 overflow-hidden">
        <div className="w-full max-w-[1800px] mx-auto px-3 sm:px-6 lg:px-8 flex items-center justify-between gap-2 text-[11px] sm:text-xs">
          <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto py-0.5 no-scrollbar whitespace-nowrap touch-pan-x flex-1">
            <span className="flex items-center gap-1 text-amber-900 font-bold shrink-0">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
              100% 91.6 KDM Hallmarked Gold & Silver Ornaments
            </span>
            <span className="text-amber-400 hidden sm:inline">•</span>
            <span className="shrink-0 text-stone-700 font-medium">
              ✨ Present Gold cost depends on day & market time (Live bullion rates apply)
            </span>
            <span className="text-amber-400 hidden sm:inline">•</span>
            <span className="shrink-0 text-amber-900 font-semibold">
              Gold prices may vary with market rates. Contact us for latest pricing.
            </span>
          </div>

          <div className="hidden lg:flex items-center gap-3 text-stone-600 text-[11px] shrink-0 font-medium ml-4">
            <span>Uppuguda, Hyderabad</span>
            <span className="text-amber-400">•</span>
            <span className="text-amber-800 font-bold">Est. 2001 (25+ Yrs)</span>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="w-full max-w-[1800px] mx-auto px-3 sm:px-6 lg:px-8 py-2.5 sm:py-3 flex items-center justify-between gap-2 sm:gap-6">
        {/* Brand Logo */}
        <Link to="/" className="shrink-0 mr-1 sm:mr-3 xl:mr-6" onClick={handleNavLinkClick}>
          <HariHaraLogo variant="light" />
        </Link>

        {/* Desktop Menu - Centered with Generous Luxury Spacing */}
        <nav className="hidden lg:flex items-center justify-center gap-6 xl:gap-8 text-sm font-semibold text-stone-700 flex-1 px-2">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `transition-colors hover:text-amber-800 py-1 ${
                isActive ? 'text-amber-800 font-bold border-b-2 border-amber-600' : 'text-stone-700'
              }`
            }
          >
            Home
          </NavLink>

          {/* Collections Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setCategoriesDropdownOpen(true)}
            onMouseLeave={() => setCategoriesDropdownOpen(false)}
          >
            <NavLink
              to="/collections"
              className={({ isActive }) =>
                `flex items-center gap-1 transition-colors hover:text-amber-800 py-1 ${
                  isActive ? 'text-amber-800 font-bold border-b-2 border-amber-600' : 'text-stone-700'
                }`
              }
            >
              Collections
              <ChevronDown className="w-3.5 h-3.5" />
            </NavLink>

            {categoriesDropdownOpen && (
              <div className="absolute top-full left-0 w-64 bg-white/98 backdrop-blur-md rounded-xl shadow-2xl border border-amber-300/80 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <Link
                  to="/collections"
                  onClick={() => setCategoriesDropdownOpen(false)}
                  className="block px-4 py-2.5 text-xs font-bold text-amber-900 bg-amber-50 hover:bg-amber-100 transition-colors"
                >
                  ✨ View All Jewellery Designs
                </Link>
                <div className="border-t border-amber-100 my-1"></div>
                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    to={`/collections/${cat.slug}`}
                    onClick={() => setCategoriesDropdownOpen(false)}
                    className="flex items-center justify-between px-4 py-2.5 text-xs text-stone-700 hover:bg-amber-50 hover:text-amber-900 transition-colors"
                  >
                    <span>{cat.name}</span>
                    {cat.productCount > 0 && (
                      <span className="text-[10px] bg-amber-100 text-amber-900 border border-amber-300 px-1.5 py-0.5 rounded-full font-semibold">
                        {cat.productCount}
                      </span>
                    )}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <NavLink
            to="/services"
            className={({ isActive }) =>
              `transition-colors hover:text-amber-800 py-1 ${
                isActive ? 'text-amber-800 font-bold border-b-2 border-amber-600' : 'text-stone-700'
              }`
            }
          >
            Services & Repairs
          </NavLink>

          <NavLink
            to="/about"
            className={({ isActive }) =>
              `transition-colors hover:text-amber-800 py-1 ${
                isActive ? 'text-amber-800 font-bold border-b-2 border-amber-600' : 'text-stone-700'
              }`
            }
          >
            About Workshop
          </NavLink>

          <NavLink
            to="/contact"
            className={({ isActive }) =>
              `transition-colors hover:text-amber-800 py-1 ${
                isActive ? 'text-amber-800 font-bold border-b-2 border-amber-600' : 'text-stone-700'
              }`
            }
          >
            Visit Showroom
          </NavLink>
        </nav>

        {/* Quick Contact CTAs for Desktop & Tablets (>= 640px) */}
        <div className="hidden sm:flex items-center gap-2.5 sm:gap-3 shrink-0 ml-auto lg:ml-0">
          {/* Cell Number Call Button - Transparent Ash Black, Gold Border, Red Emblem & Gold Text */}
          <a
            href={`tel:${phone.split('/')[0].replace(/\s+/g, '')}`}
            className="flex items-center gap-2.5 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full bg-stone-900/75 hover:bg-stone-900/85 backdrop-blur-md border border-amber-400 shadow-sm transition-all hover:scale-[1.02] cursor-pointer min-h-[40px] group"
            title="Call HARI HARA Jewellery Works"
          >
            <div className="w-6 h-6 rounded-full bg-red-600 flex items-center justify-center text-white shadow-xs shrink-0 group-hover:scale-105 transition-transform">
              <Phone className="w-3.5 h-3.5 fill-white text-white" />
            </div>
            <span className="tracking-wide font-bold text-xs sm:text-[13px] text-amber-300">
              {phone.split('/')[0]}
            </span>
          </a>

          {/* WhatsApp Enquiry Button */}
          <button
            onClick={handleWhatsAppClick}
            className="flex items-center gap-1.5 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white text-xs font-semibold px-3.5 sm:px-4 py-2.5 rounded-full shadow-md shadow-emerald-950/20 transition-all hover:scale-[1.02] cursor-pointer min-h-[40px]"
          >
            <MessageCircle className="w-4 h-4" />
            <span>WhatsApp Enquiry</span>
          </button>
        </div>

        {/* Mobile Header Quick Actions for Small Phones (< 640px) */}
        <div className="flex sm:hidden items-center gap-1.5 shrink-0 ml-auto">
          <a
            href={`tel:${phone.split('/')[0].replace(/\s+/g, '')}`}
            className="w-10 h-10 rounded-full bg-stone-900/75 hover:bg-stone-900/85 backdrop-blur-md border border-amber-400 flex items-center justify-center shadow-xs active:scale-95 transition-transform"
            aria-label="Call Workshop"
            title="Call Workshop"
          >
            <div className="w-6 h-6 rounded-full bg-red-600 flex items-center justify-center text-white shadow-xs">
              <Phone className="w-3.5 h-3.5 fill-white text-white" />
            </div>
          </a>
          <button
            onClick={handleWhatsAppClick}
            className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center text-white shadow-xs active:scale-95 transition-transform"
            aria-label="WhatsApp Enquiry"
            title="WhatsApp Enquiry"
          >
            <MessageCircle className="w-4 h-4" />
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="w-10 h-10 rounded-lg flex items-center justify-center text-stone-800 hover:text-amber-800 focus:outline-none cursor-pointer"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Tablet Hamburger Button (sm:block lg:hidden) */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="hidden sm:flex lg:hidden w-11 h-11 items-center justify-center rounded-xl text-stone-700 hover:text-amber-800 hover:bg-amber-50 focus:outline-none cursor-pointer border border-amber-200"
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white/98 backdrop-blur-xl border-b border-amber-200 px-4 pt-3 pb-6 space-y-4 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200 max-h-[85vh] overflow-y-auto">
          <nav className="flex flex-col space-y-1 text-sm font-semibold">
            <Link
              to="/"
              onClick={handleNavLinkClick}
              className="px-3.5 py-3 rounded-xl hover:bg-amber-50 text-stone-800 active:bg-amber-100 transition-colors flex items-center justify-between"
            >
              <span>Home</span>
              <span className="text-amber-600 text-xs">→</span>
            </Link>

            <Link
              to="/collections"
              onClick={handleNavLinkClick}
              className="px-3.5 py-3 rounded-xl hover:bg-amber-50 text-stone-800 active:bg-amber-100 transition-colors flex items-center justify-between"
            >
              <span>All Jewellery Collections</span>
              <span className="text-amber-600 text-xs">View Catalogue</span>
            </Link>

            {/* Quick Categories Pills in Mobile Menu */}
            <div className="pl-3 py-1 space-y-1 border-l-2 border-amber-300 my-1">
              <span className="text-[10px] uppercase font-bold text-amber-800 tracking-wider block px-2 mb-1">
                Popular Categories:
              </span>
              <div className="flex flex-wrap gap-1.5 px-1">
                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    to={`/collections/${cat.slug}`}
                    onClick={handleNavLinkClick}
                    className="inline-block px-2.5 py-1.5 text-xs bg-amber-50/80 hover:bg-amber-100 text-stone-800 rounded-lg border border-amber-200 font-medium"
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>

            <Link
              to="/services"
              onClick={handleNavLinkClick}
              className="px-3.5 py-3 rounded-xl hover:bg-amber-50 text-stone-800 active:bg-amber-100 transition-colors flex items-center justify-between"
            >
              <span>Workshop Services & Repairs</span>
              <span className="text-amber-600 text-xs">→</span>
            </Link>

            <Link
              to="/about"
              onClick={handleNavLinkClick}
              className="px-3.5 py-3 rounded-xl hover:bg-amber-50 text-stone-800 active:bg-amber-100 transition-colors flex items-center justify-between"
            >
              <span>About Workshop & Legacy</span>
              <span className="text-amber-600 text-xs">→</span>
            </Link>

            <Link
              to="/contact"
              onClick={handleNavLinkClick}
              className="px-3.5 py-3 rounded-xl hover:bg-amber-50 text-stone-800 active:bg-amber-100 transition-colors flex items-center justify-between"
            >
              <span>Contact & Store Location</span>
              <span className="text-amber-600 text-xs">→</span>
            </Link>
          </nav>

          {/* Quick Action Buttons Inside Mobile Drawer */}
          <div className="pt-2 border-t border-amber-100 flex flex-col gap-2.5">
            <a
              href={`tel:${phone.split('/')[0].replace(/\s+/g, '')}`}
              className="w-full flex items-center justify-center gap-2.5 bg-stone-900/80 hover:bg-stone-900/90 backdrop-blur-md text-amber-300 border border-amber-400 text-sm font-bold py-3 rounded-xl shadow-sm min-h-[44px]"
            >
              <div className="w-6 h-6 rounded-full bg-red-600 flex items-center justify-center text-white shrink-0 shadow-xs">
                <Phone className="w-3.5 h-3.5 fill-white text-white" />
              </div>
              <span>Call Showroom: {phone.split('/')[0]}</span>
            </a>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                handleWhatsAppClick();
              }}
              className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold py-3 rounded-xl shadow-md min-h-[44px] cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Chat on WhatsApp (+91 98485 43615)</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
