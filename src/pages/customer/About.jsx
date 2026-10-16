import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Award, HeartHandshake, Sparkles, Scale, MapPin, Phone } from 'lucide-react';
import { WhatsAppIcon } from '../../components/WhatsAppIcon';
import { useShop } from '../../context/ShopContext';

export function About() {
  const { settings } = useShop();

  const phone = settings?.phone || '+91 98485 43615 / +91 93946 47299';
  const whatsappNum = settings?.whatsappNumber?.replace(/\D/g, '') || '919848543615';
  const address = settings?.address || 'S.No. 18-7-466/2/B/42, Near Uppuguda Railway Station, Ambica Nagar, Uppuguda, Hyderabad, Telangana - 500053';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-16">
      {/* Hero Banner in Compressed Frosted Glass Box */}
      <div className="text-center max-w-2xl mx-auto space-y-2.5 bg-[#FFFDF9]/90 backdrop-blur-md p-4 sm:p-6 rounded-2xl border border-amber-300/80 shadow-md">
        <span className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-amber-800 flex items-center justify-center gap-1.5">
          <Award className="w-3.5 h-3.5 text-amber-700" /> Established 2001 • Over 25 Years of Service
        </span>
        <h1 className="text-xl sm:text-3xl font-bold font-serif text-stone-900 leading-snug">
          The Sacred Heritage of
          <span className="block font-serif font-black tracking-wide bg-gradient-to-r from-amber-700 via-amber-800 to-amber-900 bg-clip-text text-transparent">
            HARI HARA Jewellery Works
          </span>
        </h1>
        <div className="flex items-center justify-center gap-2 pt-0.5">
          <div className="h-px w-8 sm:w-16 bg-gradient-to-r from-transparent via-amber-400/60 to-amber-400"></div>
          <Sparkles className="w-3.5 h-3.5 text-amber-700 animate-pulse" />
          <div className="h-px w-8 sm:w-16 bg-gradient-to-l from-transparent via-amber-400/60 to-amber-400"></div>
        </div>
        <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-normal max-w-lg mx-auto">
          Devoted to creating timeless 91.6 KDM hallmarked gold ornaments and pure silver articles with master goldsmith precision in Hyderabad.
        </p>
      </div>

      {/* Founder & Workshop Story Split */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center bg-white/85 backdrop-blur-md p-6 sm:p-10 rounded-2xl border border-amber-200/80 shadow-xl">
        <div className="space-y-5">
          <div className="inline-block px-3 py-1 bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold rounded">
            Master Goldsmith: Prop. L. Srinivasa Chary
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold font-serif text-stone-900">
            Crafting Devotion, Purity & Familial Trust Since 2001
          </h2>

          <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-normal">
            {settings?.aboutText ||
              `HARI HARA Jewellery Works was founded in 2001 under the dedicated leadership of master artisan L. Srinivasa Chary in Ambica Nagar, Uppuguda, Hyderabad. With over two and a half decades of uncompromised goldsmith craftsmanship, we have earned the sacred trust of thousands of families for their weddings, auspicious festivals, and family celebrations.`}
          </p>

          <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-normal">
            Unlike commercial retail showrooms with inflated overheads and hidden melting deductions, we operate a genuine master workshop where customers speak directly with the craftsman who hand-shapes their gold. Every gram is weighed on certified digital balances and stamped with authentic 91.6 KDM hallmarking.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <Link
              to="/collections"
              className="min-h-[44px] px-5 py-2.5 bg-amber-700 hover:bg-amber-800 text-white rounded-xl text-xs font-bold shadow-md transition-colors flex items-center justify-center text-center active:scale-95"
            >
              Explore Our Creations
            </Link>
            <Link
              to="/contact"
              className="min-h-[44px] px-5 py-2.5 border border-amber-300 hover:border-amber-500 bg-white text-stone-850 hover:text-amber-900 rounded-xl text-xs font-semibold transition-colors shadow-xs flex items-center justify-center text-center active:scale-95"
            >
              Visit Showroom
            </Link>
          </div>
        </div>

        <div className="relative rounded-2xl overflow-hidden aspect-4/3 sm:aspect-square border-2 border-amber-300 shadow-xl bg-white">
          <img
            src="/goldsmith-hands-crafting.jpg"
            alt="Jewellery Crafting Workshop by Master Goldsmith"
            loading="lazy"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/85 via-transparent to-transparent flex items-end p-6">
            <div className="text-white">
              <p className="text-xs font-semibold text-amber-300 uppercase tracking-wider">Showroom & Workshop</p>
              <h3 className="text-lg font-bold font-serif">S.No. 18-7-466/2/B/42, Uppuguda, Hyderabad</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Core Values / Craftsmanship Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/85 backdrop-blur-md p-6 rounded-2xl border border-amber-200/80 space-y-3 shadow-md">
          <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold font-serif text-stone-900">100% 91.6 KDM Hallmark Guarantee</h3>
          <p className="text-xs text-stone-600 leading-relaxed font-normal">
            Every gold ornament crafted in our workshop is marked with official 91.6 KDM hallmarking, certifying standard 22 Carat purity with complete transparency.
          </p>
        </div>

        <div className="bg-white/85 backdrop-blur-md p-6 rounded-2xl border border-amber-200/80 space-y-3 shadow-md">
          <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center">
            <Scale className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold font-serif text-stone-900">Accurate Weighing & Fair Pricing</h3>
          <p className="text-xs text-stone-600 leading-relaxed font-normal">
            We employ precision computerized digital scales. No guesswork, no exaggerated wastage, and honest making charges directly from the craftsman.
          </p>
        </div>

        <div className="bg-white/85 backdrop-blur-md p-6 rounded-2xl border border-amber-200/80 space-y-3 shadow-md">
          <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold font-serif text-stone-900">Custom CAD & Traditional Nakshi</h3>
          <p className="text-xs text-stone-600 leading-relaxed font-normal">
            From intricate heritage temple deities and Guttapusalu necklaces to modern minimalist everyday jewellery, we customize every ornament to your exact grams.
          </p>
        </div>
      </div>

      {/* Contact Callout */}
      <div className="bg-gradient-to-r from-amber-100/90 via-white to-amber-100/90 text-stone-900 p-8 sm:p-12 rounded-2xl border border-amber-300 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md">
        <div className="space-y-2 text-center sm:text-left">
          <h3 className="text-xl sm:text-2xl font-bold font-serif text-stone-900">
            Meet Master Craftsman L. Srinivasa Chary
          </h3>
          <p className="text-xs text-stone-700 max-w-lg font-medium">
            Schedule a showroom consultation in Uppuguda or send your jewellery inspiration photo on WhatsApp.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto shrink-0">
          <a
            href={`https://wa.me/${whatsappNum}?text=${encodeURIComponent('Namaste L. Srinivasa Chary garu! I would like to visit your workshop.')}`}
            target="_blank"
            rel="noreferrer"
            className="min-h-[48px] px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md active:scale-95"
            aria-label="Send WhatsApp message to master craftsman"
          >
            <WhatsAppIcon className="w-4 h-4 shrink-0" />
            <span>WhatsApp Message</span>
          </a>
        </div>
      </div>
    </div>
  );
}
