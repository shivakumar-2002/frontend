import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  ShieldCheck,
  Award,
  Clock,
  ArrowRight,
  Phone,
  MessageCircle,
  Scale,
  RefreshCw,
  Palette,
  MapPin,
  CheckCircle2,
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { EnquiryModal } from '../../components/EnquiryModal';
import { HallmarkGuaranteeCard } from '../../components/HallmarkGuaranteeCard';
import { getImageUrl, handleImageError, DEFAULT_JEWELLERY_IMAGE } from '../../utils/imageUrl';

export function Home() {
  const { settings, categories, services } = useShop();
  const [enquiryModalOpen, setEnquiryModalOpen] = useState(false);

  const heroTitle = settings?.heroTitle || 'Sacred Craftsmanship in 91.6 Hallmarked Gold & Silver';
  const heroDescription = settings?.heroDescription || 'Over 25 years of master jewellery artistry in Uppuguda, Hyderabad by Prop. L. Srinivasa Chary. Specializing in royal bridal sets, temple kasu harams, and bespoke gold ornaments.';
  const heroImage = getImageUrl(
    settings?.heroImageUrl && !settings.heroImageUrl.includes('photo-1599643478518')
      ? settings.heroImageUrl
      : '/luxury-hero-banner.jpg'
  );
  const whatsappNum = settings?.whatsappNumber?.replace(/\D/g, '') || '919848543615';

  const SIX_HOME_SLOTS = [
    {
      key: 'rings',
      name: 'Gold Designer Rings',
      slug: 'rings',
      photo: '/category-gold-rings.jpg',
      tag: '91.6 KDM Pure Gold',
      keywords: ['ring', 'rings', 'ఉంగరాలు'],
    },
    {
      key: 'kammalbuttas',
      name: 'Kammalbuttas & Jhumkas',
      slug: 'kammalbuttas',
      photo: '/category-kammalbuttas.jpg',
      tag: 'Temple & Royal Bells',
      keywords: ['kammal', 'jhumka', 'butta', 'బుట్టలు', 'earring'],
    },
    {
      key: 'ear-tops',
      name: 'Gold Ear Tops & Pogulu',
      slug: 'ear-tops',
      photo: '/category-ear-tops.jpg',
      tag: 'Baby Pogulu & Tops',
      keywords: ['top', 'pogulu', 'tops', 'పోగులు', 'ear-top'],
    },
    {
      key: 'chains-lockets',
      name: 'Gold Chains & Lockets',
      slug: 'chains-lockets',
      photo: '/category-chains-lockets.jpg',
      tag: 'Daily & Bridal Chains',
      keywords: ['chain', 'chains', 'locket', 'lockets', 'గొలుసులు', 'లాకెట్'],
    },
    {
      key: 'bangles-kadas',
      name: 'Bangles & Kadas',
      slug: 'bangles',
      photo: '/category-bangles-kadas.jpg',
      tag: 'Solid & Nakshi Kadas',
      keywords: ['bangle', 'bangles', 'kada', 'kadas', 'గాజులు', 'కడియాలు'],
    },
    {
      key: 'necklaces-harams',
      name: 'Royal Necklaces & Harams',
      slug: 'necklaces',
      photo: '/category-necklaces-harams.jpg',
      tag: 'Bridal & Antique Harams',
      keywords: ['necklace', 'necklaces', 'necklas', 'necklasw', 'necklase', 'haram', 'harams', 'bride', 'bridal', 'నెక్లెస్', 'హారాలు'],
    },
  ];

  // Dynamically resolve exactly 6 showcase slots for Home page
  const homeDisplayCategories = SIX_HOME_SLOTS.map((slot) => {
    // 1. Try to find a matching category from backend categories
    const matchedCategory = categories.find((c) => {
      const s = (c.slug || '').toLowerCase();
      const n = (c.name || '').toLowerCase();
      return slot.keywords.some((kw) => s.includes(kw) || n.includes(kw));
    });

    if (matchedCategory) {
      const customPhoto = (matchedCategory.imageUrl && !matchedCategory.imageUrl.includes('unsplash.com'))
        ? getImageUrl(matchedCategory.imageUrl)
        : slot.photo;

      return {
        id: matchedCategory.id,
        name: matchedCategory.name || slot.name,
        slug: matchedCategory.slug || slot.slug,
        imageUrl: customPhoto,
        tag: slot.tag,
        productCount: matchedCategory.productCount ?? matchedCategory._count?.products ?? null,
      };
    }

    // 2. Default slot with authentic previous picture
    return {
      id: slot.key,
      name: slot.name,
      slug: slot.slug,
      imageUrl: slot.photo,
      tag: slot.tag,
      productCount: null,
    };
  });

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* 1. Hero Section - Neat, Clean & Classy Luxury Layout */}
      <section className="relative bg-[#0C0A09] text-white overflow-hidden min-h-[480px] sm:min-h-[540px] lg:min-h-[600px] flex items-start lg:items-center border-b border-amber-950/60">
        {/* Luxury Background Image Anchored to Right */}
        <div className="absolute inset-0 z-0">
          <img
            src={heroImage}
            alt="Ultra-Luxury Indian Gold Jewellery"
            className="w-full h-full object-cover object-right lg:object-[82%_center] opacity-90 brightness-95"
            onError={handleImageError}
          />

          {/* Clean Left-Side Half-White Fade - High Contrast on Mobile & Desktop */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#FFFDF9]/95 via-[#FFFDF9]/85 to-[#FAF8F5]/90 sm:bg-gradient-to-r sm:from-[#FFFDF9] sm:via-[#FFFDF9]/95 md:via-[#FFFDF9]/80 lg:via-[#FFFDF9]/65 to-transparent"></div>

          {/* Subtle Golden Ambient Warmth */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_30%,rgba(217,119,6,0.1),transparent_60%)]"></div>
        </div>

        {/* Hero Content - Moved Left & Upper Side */}
        <div className="relative z-10 w-full max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 pt-6 sm:pt-10 lg:pt-12 pb-12 sm:pb-16 lg:pb-20">
          <div className="max-w-xl lg:max-w-2xl space-y-4 sm:space-y-6">
            {/* Elegant Subtitle Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-100/90 border border-amber-300 text-amber-900 text-[11px] sm:text-xs font-bold tracking-wide shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-pulse"></span>
              <span>100% 91.6 KDM Hallmarked Gold • Est. 2001 (25+ Yrs)</span>
            </div>

            {/* Classy Serif Headline - Upper & Left Positioned */}
            <h1 className="text-2xl sm:text-4xl lg:text-[48px] font-serif font-bold leading-[1.2] text-stone-900 tracking-tight">
              Sacred Craftsmanship in <span className="italic font-bold text-amber-800">91.6 Hallmarked Gold</span> & Silver
            </h1>

            {/* Clean, Refined Description */}
            <p className="text-stone-700 text-xs sm:text-sm lg:text-[15px] leading-relaxed font-normal max-w-lg">
              Over 25 years of master goldsmith artistry by <strong>Prop. L. Srinivasa Chary</strong> in Uppuguda, Hyderabad. Bespoke royal bridal chokers, temple kasu harams, and pure ornaments crafted to exact weight.
            </p>

            {/* Action Buttons - Easy Touch on Mobile */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <Link
                to="/collections"
                className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-700 via-amber-800 to-amber-900 hover:from-amber-600 hover:to-amber-800 text-white font-bold text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5 cursor-pointer text-center min-h-[44px]"
              >
                <span>GOLD & SILVER Collections</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <button
                onClick={() => setEnquiryModalOpen(true)}
                className="px-6 py-3.5 rounded-xl bg-white/90 hover:bg-amber-50 border border-amber-300 text-stone-800 font-semibold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs text-center min-h-[44px]"
              >
                <Sparkles className="w-4 h-4 text-amber-700" />
                <span>Custom Order Consultation</span>
              </button>
            </div>

            {/* Refined Stats Strip - Perfectly Aligned for Mobile & Desktop */}
            <div className="pt-4 sm:pt-6 border-t border-amber-200/80 flex items-center justify-between sm:justify-start gap-2 sm:gap-8 text-stone-700 text-xs">
              <div>
                <div className="text-lg sm:text-2xl font-bold font-serif text-amber-800">25+ Yrs</div>
                <div className="text-[10px] sm:text-[11px] text-stone-500 mt-0.5 font-medium">Showroom Legacy</div>
              </div>
              <div className="w-px h-6 sm:h-8 bg-amber-200"></div>
              <div>
                <div className="text-lg sm:text-2xl font-bold font-serif text-amber-800">100%</div>
                <div className="text-[10px] sm:text-[11px] text-stone-500 mt-0.5 font-medium">91.6 Hallmarked</div>
              </div>
              <div className="w-px h-6 sm:h-8 bg-amber-200"></div>
              <div>
                <div className="text-lg sm:text-2xl font-bold font-serif text-amber-800">Bespoke</div>
                <div className="text-[10px] sm:text-[11px] text-stone-500 mt-0.5 font-medium">Custom Weighing</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Trust Pillars Strip */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 sm:-mt-12 relative z-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white/85 backdrop-blur-md rounded-xl p-5 shadow-lg border border-amber-200/80 hover:border-amber-400 flex items-start gap-3.5 hover:shadow-xl transition-all">
            <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-700 shrink-0 border border-amber-200">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-amber-950 font-serif">100% 91.6 KDM Hallmark</h3>
              <p className="text-xs text-stone-600 mt-0.5 leading-snug">
                Official hallmark certification guaranteeing genuine 22K caratage on every gold ornament.
              </p>
            </div>
          </div>

          <div className="bg-white/85 backdrop-blur-md rounded-xl p-5 shadow-lg border border-amber-200/80 hover:border-amber-400 flex items-start gap-3.5 hover:shadow-xl transition-all">
            <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-700 shrink-0 border border-amber-200">
              <Scale className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-amber-950 font-serif">Exact Computerized Weight</h3>
              <p className="text-xs text-stone-600 mt-0.5 leading-snug">
                Zero estimation guesswork. Transparent digital scales and clear making charge structure.
              </p>
            </div>
          </div>

          <div className="bg-white/85 backdrop-blur-md rounded-xl p-5 shadow-lg border border-amber-200/80 hover:border-amber-400 flex items-start gap-3.5 hover:shadow-xl transition-all">
            <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-700 shrink-0 border border-amber-200">
              <Palette className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-amber-950 font-serif">Custom Made-To-Order</h3>
              <p className="text-xs text-stone-600 mt-0.5 leading-snug">
                Bring any photo, sketch, or heirloom idea. Handcrafted to your preferred weight and budget.
              </p>
            </div>
          </div>

          <div className="bg-white/85 backdrop-blur-md rounded-xl p-5 shadow-lg border border-amber-200/80 hover:border-amber-400 flex items-start gap-3.5 hover:shadow-xl transition-all">
            <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-700 shrink-0 border border-amber-200">
              <RefreshCw className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-amber-950 font-serif">Old Gold Exchange</h3>
              <p className="text-xs text-stone-600 mt-0.5 leading-snug">
                Exchange old gold or silver ornaments with fair market rates and minimal transparent wastage.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Pure Gold Categories Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-2 mb-10 bg-[#FFFDF9]/85 backdrop-blur-md p-5 sm:p-6 rounded-3xl border border-amber-300/80 shadow-md">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-800">
            100% Pure 22K Gold Collections
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold font-serif text-stone-900">
            Pure Gold Jewellery Designs
          </h2>
          <p className="text-xs sm:text-sm text-stone-700">
            Handcrafted 91.6 KDM hallmarked gold ornaments — designer rings, traditional kammalbuttas, ear tops, and chains with temple lockets.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6">
          {homeDisplayCategories.map((cat) => (
            <Link
              key={cat.id}
              to={`/collections/${cat.slug}`}
              className="group relative rounded-2xl overflow-hidden aspect-square bg-stone-100 border border-amber-200/80 shadow-md hover:border-amber-400 hover:shadow-2xl transition-all duration-300"
            >
              <img
                src={cat.imageUrl}
                alt={cat.name}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                onError={handleImageError}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-950/30 to-transparent"></div>

              <div className="absolute inset-x-0 bottom-0 p-3 sm:p-5 text-white">
                <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-wider text-amber-300 block mb-0.5">
                  {cat.tag || '91.6 KDM Pure Gold'}
                </span>
                <h3 className="text-xs sm:text-base font-bold font-serif text-amber-100 group-hover:text-white transition-colors">
                  {cat.name}
                </h3>
                <div className="flex items-center justify-between text-[10px] sm:text-[11px] text-stone-300 mt-0.5 sm:mt-1">
                  <span>{cat.productCount ? `${cat.productCount} Designs` : 'View Catalogue'}</span>
                  <span className="text-amber-300 font-bold group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. Master Craftsman & Heritage Story */}
      <section className="bg-white/85 backdrop-blur-md border-y border-amber-200/80 text-stone-800 py-16 sm:py-20 relative overflow-hidden shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold border border-amber-300">
              <Award className="w-3.5 h-3.5 text-amber-700" /> Over 25 Years of Craftsmanship
            </div>

            <h2 className="text-2xl sm:text-4xl font-bold font-serif text-stone-900 leading-tight">
              A Legacy of Purity & Devotion to Goldsmith Artistry
            </h2>

            <p className="text-stone-700 text-sm leading-relaxed">
              Founded in 2001 in Ambica Nagar, Uppuguda, Hyderabad by master artisan <strong><br></br>Prop. L. Srinivasa Chary</strong>, <strong className="text-amber-900 font-bold">HARI HARA Jewellery Works</strong> has been the trusted destination for generations of South Indian families.
            </p>

            <div className="space-y-3 text-xs sm:text-sm text-stone-700 font-medium">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <span>Specialists in traditional Temple Nakshi work and sacred Lakshmi Harams.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <span>Strict adherence to 91.6 KDM Hallmarking with computerized purity testing.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <span>Direct craftsman consultation without retail middleman markups.</span>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <Link
                to="/about"
                className="px-5 py-3 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-bold text-xs sm:text-sm transition-colors shadow-md text-center min-h-[44px] flex items-center justify-center"
              >
                Read Heritage Story
              </Link>
              <Link
                to="/contact"
                className="px-5 py-3 rounded-xl border border-amber-300 hover:border-amber-500 bg-white text-stone-800 hover:text-amber-900 text-xs sm:text-sm transition-colors shadow-xs text-center min-h-[44px] flex items-center justify-center"
              >
                Showroom Location
              </Link>
            </div>
          </div>

          {/* Workshop Showcase Card */}
          <div className="relative rounded-2xl overflow-hidden border-2 border-amber-300 shadow-xl bg-white p-2">
            <img
              src="/goldsmith-hands-crafting.jpg"
              alt="Artisanal Jewellery Workshop - Master Goldsmith Handcrafted Ornaments"
              className="w-full h-80 sm:h-96 object-cover rounded-xl"
            />
            <div className="p-4 bg-white/95 rounded-b-xl border-t border-amber-200 flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-stone-900">Workshop & Showroom: Uppuguda</h4>
                <p className="text-xs text-stone-500">Near Uppuguda Railway Station, Ambica Nagar</p>
              </div>
              <a
                href={`https://wa.me/${whatsappNum}?text=${encodeURIComponent('Namaste! I would like to schedule a visit to your Uppuguda jewellery workshop.')}`}
                target="_blank"
                rel="noreferrer"
                className="bg-emerald-700 hover:bg-emerald-600 text-white px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                Visit Us
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Official 91.6 Hallmark Guarantee Card & 90% Return Policy */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <HallmarkGuaranteeCard />
      </section>

      {/* 6. Signature Services Strip */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto space-y-2 mb-10 bg-[#FFFDF9]/85 backdrop-blur-md p-5 sm:p-6 rounded-3xl border border-amber-300/80 shadow-md">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-800">
            Showroom & Workshop Services
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold font-serif text-stone-900">
            Specialized Jewellery Solutions
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {services.slice(0, 3).map((srv) => (
            <div
              key={srv.id}
              className="bg-white/85 backdrop-blur-md rounded-xl p-6 border border-amber-200/80 hover:border-amber-400 shadow-md hover:shadow-xl transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center font-bold">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-stone-900 font-serif">{srv.title}</h3>
                <p className="text-xs text-stone-600 leading-relaxed font-normal">{srv.description}</p>
              </div>

              <div className="pt-6 border-t border-amber-100 mt-4">
                <Link
                  to="/services"
                  className="text-xs font-bold text-amber-800 hover:text-amber-950 flex items-center gap-1"
                >
                  Learn More <span>→</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. Showroom Location & Contact CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-gradient-to-r from-amber-100/90 via-amber-50 to-amber-100/90 text-stone-900 p-8 sm:p-12 shadow-xl border border-amber-300 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl text-center lg:text-left">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-800">
              Personalized Guidance
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-serif text-stone-900">
              Planning Wedding Ornaments or Custom Jewellery?
            </h2>
            <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-medium">
              Speak directly with master craftsman L. Srinivasa Chary. We offer free consultation on weight estimation, gold caratage, and transparent making rates.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto shrink-0">
            <a
              href={`https://wa.me/${whatsappNum}?text=${encodeURIComponent('Namaste L. Srinivasa Chary garu! I would like to consult with you regarding jewellery designs.')}`}
              target="_blank"
              rel="noreferrer"
              className="px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md min-h-[44px] text-center"
            >
              <MessageCircle className="w-4 h-4" />
              Chat on WhatsApp
            </a>

            <button
              onClick={() => setEnquiryModalOpen(true)}
              className="px-6 py-3.5 rounded-xl bg-white hover:bg-amber-50 text-stone-900 font-semibold text-sm border border-amber-300 flex items-center justify-center gap-2 cursor-pointer shadow-xs min-h-[44px] text-center"
            >
              <Sparkles className="w-4 h-4 text-amber-700" />
              Send Direct Enquiry
            </button>
          </div>
        </div>
      </section>

      {/* Enquiry Modal */}
      <EnquiryModal
        isOpen={enquiryModalOpen}
        onClose={() => setEnquiryModalOpen(false)}
      />
    </div>
  );
}
