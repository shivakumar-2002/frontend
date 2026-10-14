import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, MessageCircle, Clock, ShieldCheck, Award, ExternalLink } from 'lucide-react';
import { HariHaraLogo } from './HariHaraLogo';
import { useShop } from '../context/ShopContext';

export function Footer() {
  const { settings, categories } = useShop();

  const phone = settings?.phone || '+91 98485 43615 / +91 93946 47299';
  const whatsappNum = settings?.whatsappNumber?.replace(/\D/g, '') || '919848543615';
  const address = settings?.address || 'S.No. 18-7-466/2/B/42, Near Uppuguda Railway Station, Ambica Nagar, Uppuguda, Hyderabad, Telangana - 500053';
  const openingHours = settings?.openingHours || 'Mon - Sat: 10:00 AM - 09:00 PM | Sun: 10:30 AM - 03:00 PM';
  const mapUrl = settings?.mapUrl || 'https://www.google.com/maps/search/?api=1&query=Hari+Hara+Jewellery+Works+Uppuguda+Hyderabad';

  return (
    <footer className="bg-[#181614] text-stone-300 border-t-2 border-amber-500/40">
      {/* Hallmark & Trust Strip - Compact & Well-proportioned */}
      <div className="bg-[#12100E] border-b border-stone-800/80 py-4 sm:py-5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {/* Box 1: 100% 91.6 KDM Hallmark */}
          <div className="bg-gradient-to-br from-[#FFFDF9] via-[#FAF5EC] to-[#F4ECDA] rounded-xl p-3 sm:p-3.5 border border-amber-400/90 shadow-md hover:shadow-lg hover:border-amber-500 transition-all duration-200 flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-lg bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-800 shrink-0 shadow-xs group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h4 className="text-xs sm:text-[13px] font-bold text-stone-900 font-serif leading-tight truncate">100% 91.6 KDM Hallmark</h4>
              <p className="text-[11px] text-stone-600 mt-0.5 leading-tight">Guaranteed 22K pure gold</p>
            </div>
          </div>

          {/* Box 2: 25+ Years Legacy */}
          <div className="bg-gradient-to-br from-[#FFFDF9] via-[#FAF5EC] to-[#F4ECDA] rounded-xl p-3 sm:p-3.5 border border-amber-400/90 shadow-md hover:shadow-lg hover:border-amber-500 transition-all duration-200 flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-lg bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-800 shrink-0 shadow-xs group-hover:scale-105 transition-transform">
              <Award className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h4 className="text-xs sm:text-[13px] font-bold text-stone-900 font-serif leading-tight truncate">25+ Years Legacy</h4>
              <p className="text-[11px] text-stone-600 mt-0.5 leading-tight">Serving Hyderabad since 2001</p>
            </div>
          </div>

          {/* Box 3: Bespoke Custom Orders */}
          <div className="bg-gradient-to-br from-[#FFFDF9] via-[#FAF5EC] to-[#F4ECDA] rounded-xl p-3 sm:p-3.5 border border-amber-400/90 shadow-md hover:shadow-lg hover:border-amber-500 transition-all duration-200 flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-lg bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-800 shrink-0 shadow-xs group-hover:scale-105 transition-transform">
              <Clock className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h4 className="text-xs sm:text-[13px] font-bold text-stone-900 font-serif leading-tight truncate">Bespoke Custom Orders</h4>
              <p className="text-[11px] text-stone-600 mt-0.5 leading-tight">Handcrafted to your grams</p>
            </div>
          </div>

          {/* Box 4: Old Gold Exchange */}
          <div className="bg-gradient-to-br from-[#FFFDF9] via-[#FAF5EC] to-[#F4ECDA] rounded-xl p-3 sm:p-3.5 border border-amber-400/90 shadow-md hover:shadow-lg hover:border-amber-500 transition-all duration-200 flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-lg bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-800 shrink-0 shadow-xs group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h4 className="text-xs sm:text-[13px] font-bold text-stone-900 font-serif leading-tight truncate">Old Gold Exchange</h4>
              <p className="text-[11px] text-stone-600 mt-0.5 leading-tight">Fair computerized valuation</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content - Compressed & Balanced */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 lg:gap-8">
          {/* Brand & Proprietor Info */}
          <div className="lg:col-span-2 space-y-3">
            <div className="bg-stone-900/90 p-2 sm:p-2.5 rounded-xl inline-block border border-amber-500/30 shadow-sm">
              <HariHaraLogo variant="default" size="small" />
            </div>
            <p className="text-xs text-stone-300 leading-relaxed max-w-sm line-clamp-3">
              {settings?.aboutText
                ? `${settings.aboutText.substring(0, 150)}...`
                : 'Master jewellery crafting in Uppuguda, Hyderabad since 2001 by Prop. L. Srinivasa Chary. Specializing in 91.6 KDM hallmarked gold ornaments with 100% purity guarantee.'}
            </p>
            <div className="pt-1">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-amber-400 block mb-1">
                Visiting Showroom Address
              </span>
              <a
                href={mapUrl}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-stone-300 hover:text-amber-300 flex items-start gap-1.5 group transition-colors leading-snug"
                aria-label="Showroom address on Google Maps"
              >
                <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                <span className="line-clamp-2">{address}</span>
              </a>
            </div>
          </div>

          {/* Quick Categories */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-300 mb-2.5 font-serif">
              Our Collections
            </h3>
            <ul className="space-y-1.5 text-xs">
              {categories.slice(0, 5).map((cat) => (
                <li key={cat.id}>
                  <Link
                    to={`/collections/${cat.slug}`}
                    className="hover:text-amber-300 transition-colors flex items-center gap-1.5 text-stone-300 py-0.5 truncate"
                  >
                    <span className="text-amber-400">•</span> {cat.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link to="/collections" className="text-amber-400 hover:text-amber-300 hover:underline font-semibold block pt-1 py-0.5 text-xs">
                  View Full Catalogue →
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-300 mb-2.5 font-serif">
              Shop & Services
            </h3>
            <ul className="space-y-1.5 text-xs">
              <li>
                <Link to="/services" className="hover:text-amber-300 text-stone-300 transition-colors block py-0.5">
                  Old Gold & Silver Exchange
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-amber-300 text-stone-300 transition-colors block py-0.5">
                  Custom Ornament Making
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-amber-300 text-stone-300 transition-colors block py-0.5">
                  Jewellery Polishing & Repairs
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-amber-300 text-stone-300 transition-colors block py-0.5">
                  Proprietor & Heritage Story
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-amber-300 text-stone-300 transition-colors block py-0.5">
                  Store Timings & Map
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Hours */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-300 mb-2.5 font-serif">
              Store Timings & Contact
            </h3>
            <div className="space-y-2.5 text-xs">
              <div>
                <p className="text-stone-400 flex items-center gap-1 text-[11px] mb-0.5 font-medium">
                  <Clock className="w-3 h-3 text-amber-400" /> Showroom Hours:
                </p>
                <p className="text-stone-100 font-semibold text-[11px] leading-snug">{openingHours}</p>
              </div>

              <div>
                <p className="text-stone-400 flex items-center gap-1 text-[11px] mb-0.5 font-medium">
                  <Phone className="w-3 h-3 text-amber-400" /> Phone Contacts:
                </p>
                <div className="flex flex-wrap gap-1.5 text-stone-100 font-semibold text-[11px]">
                  <a href="tel:+919848543615" className="hover:text-amber-300 transition-colors">+91 98485 43615</a>
                  <span className="text-stone-500">/</span>
                  <a href="tel:+919394647299" className="hover:text-amber-300 transition-colors">+91 93946 47299</a>
                </div>
              </div>

              <div className="pt-1 flex flex-col gap-1.5">
                <a
                  href={`https://wa.me/${whatsappNum}?text=${encodeURIComponent('Namaste L. Srinivasa Chary garu! I would like to inquire about jewellery.')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-2 px-3 rounded-lg text-xs transition-colors shadow-xs active:scale-98"
                  aria-label="Chat on WhatsApp"
                >
                  <MessageCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>Chat on WhatsApp</span>
                </a>

                <a
                  href={mapUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-1.5 border border-amber-500/40 hover:border-amber-400 bg-stone-850 hover:bg-stone-800 text-amber-200 hover:text-amber-100 py-2 px-3 rounded-lg text-xs transition-colors shadow-xs active:scale-98"
                  aria-label="Get Google Maps Directions"
                >
                  <ExternalLink className="w-3 h-3 text-amber-400 shrink-0" />
                  <span>Get Directions</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="border-t border-stone-800 mt-8 pt-4 flex flex-col sm:flex-row items-center justify-between text-[11px] text-stone-400 gap-2">
          <p>
            © {new Date().getFullYear()} <strong className="text-amber-300">HARI HARA Jewellery Works</strong>. All rights reserved. Prop. L. Srinivasa Chary.
          </p>
          <div className="flex items-center gap-3">
            <span className="text-amber-400 font-semibold">91.6 KDM Hall Marke With 100% Purity Guarantee</span>
            <span>•</span>
            <Link to="/contact" className="hover:text-amber-300 text-stone-300 font-medium">Enquire</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
