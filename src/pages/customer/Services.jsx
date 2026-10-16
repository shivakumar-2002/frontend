import React, { useState } from 'react';
import {
  Sparkles,
  RefreshCw,
  Palette,
  Wrench,
  ShieldCheck,
  Gift,
  CheckCircle2,
  Clock,
  ArrowRight,
  HeartHandshake,
  Award,
} from 'lucide-react';
import { WhatsAppIcon } from '../../components/WhatsAppIcon';
import { useShop } from '../../context/ShopContext';
import { EnquiryModal } from '../../components/EnquiryModal';
import { HallmarkGuaranteeCard } from '../../components/HallmarkGuaranteeCard';
import { getImageUrl, handleImageError, DEFAULT_JEWELLERY_IMAGE } from '../../utils/imageUrl';

export const DEFAULT_SERVICES = [
  {
    id: 'srv-baby-pogulu',
    title: 'Baby Ear Pogulu & Kids Ear Tops (పాపలకు చెవి పోగులు & హ్యాండ్ సర్వీస్)',
    description: 'Handcrafted pure 22K gold wire Pogulu (ముద్దు పోగులు) and baby screw-back tops. We provide a gentle, hygienic, and highly responsible hand-service to safely and painlessly fit or pierce ear tops for newborn babies and young children with complete care.',
    iconName: 'HeartHandshake',
    imageUrl: '/service-baby-pogulu-ear-tops.jpg',
    pictureTag: '📸 Baby Ear Pogulu Gentle Hand Fitting',
    sortOrder: 1,
  },
  {
    id: 'srv-silver-mettalu',
    title: 'Pure Silver Mettalu (వెండి మట్టెలు - Silver Leg Rings for Women)',
    description: 'Handcrafted pure silver Mettalu (toe rings) and silver leg chains (pattilu) for married women and brides. Hand-carved with traditional ethnic patterns, carefully sized and hand-fitted to feet with responsibility for perfect comfort and purity.',
    iconName: 'Gift',
    imageUrl: '/service-silver-mettalu-toe-rings.jpg',
    pictureTag: '📸 Pure Silver Mettalu & Toe Fitting',
    sortOrder: 2,
  },
  {
    id: 'srv-pusthela-thadu',
    title: 'Pusthela Thadu Chuttudu (పుస్తెల తాడు చుట్టుడు - Mangalasuthram)',
    description: 'Sacred manual gold wire wrapping and threading of women’s Mangalasuthram. Master goldsmith carefully strings the twin Pusthelu (bottu cups), natural coral beads, and black beads with pure 22K gold wire for sacred strength and lifetime durability.',
    iconName: 'Sparkles',
    imageUrl: '/service-pusthela-thadu-chuttudu.jpg',
    pictureTag: '📸 Pusthela Thadu Gold Wire Wrapping',
    sortOrder: 3,
  },
  {
    id: 'srv-exchange',
    title: 'Old Gold & Silver Exchange (పాత బంగారం & వెండి మార్పిడి)',
    description: 'Exchange your old or inherited gold and silver ornaments at fair live bullion market rates. Computerized purity analysis, live crucible melting, and digital weighing right in front of your eyes with zero hidden deduction.',
    iconName: 'RefreshCw',
    imageUrl: '/service-gold-melting-testing.jpg',
    pictureTag: '📸 Genuine Gold Melting & Scale Assay',
    sortOrder: 4,
  },
  {
    id: 'srv-custom',
    title: 'Custom 22K Gold Ornaments & Nakshi Harams (కస్టమ్ నగల తయారీ)',
    description: 'Bring any photo, sketch, or heirloom idea. Master craftsman L. Srinivasa Chary custom-crafts 91.6 KDM hallmarked royal bridal chokers, temple Kasu Harams, and bangles to your desired grams and budget.',
    iconName: 'Palette',
    imageUrl: '/service-custom-making.jpg',
    pictureTag: '📸 22K Temple Gold Nakshi Handcrafting',
    sortOrder: 5,
  },
  {
    id: 'srv-repair',
    title: 'Jewellery Repair, Sizing & Polishing (నగల మరమ్మతులు & సైజింగ్)',
    description: 'Quick in-house repair services including gold chain soldering, ring & bangle reshaping on steel mandrels with jeweler loupe, stone resetting, lock replacements, and ultrasonic gold electro-polishing.',
    iconName: 'Wrench',
    imageUrl: '/service-jewellery-repair-sizing.jpg',
    pictureTag: '📸 Mandrel Sizing & Workshop Solder',
    sortOrder: 6,
  },
];

export function Services() {
  const { services, settings } = useShop();
  const [enquiryModalOpen, setEnquiryModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  const whatsappNum = settings?.whatsappNumber?.replace(/\D/g, '') || '919848543615';

  const handleInquireService = (serviceTitle) => {
    const text = encodeURIComponent(
      `Namaste L. Srinivasa Chary garu! I am inquiring about your "${serviceTitle}" service at HARI HARA Jewellery Works.`
    );
    window.open(`https://wa.me/${whatsappNum}?text=${text}`, '_blank');
  };

  const getIcon = (iconName) => {
    switch (iconName) {
      case 'RefreshCw':
        return <RefreshCw className="w-6 h-6 text-amber-400" />;
      case 'Palette':
        return <Palette className="w-6 h-6 text-amber-400" />;
      case 'Wrench':
        return <Wrench className="w-6 h-6 text-amber-400" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-6 h-6 text-amber-400" />;
      case 'Gift':
        return <Gift className="w-6 h-6 text-amber-400" />;
      case 'HeartHandshake':
        return <HeartHandshake className="w-6 h-6 text-amber-400" />;
      default:
        return <Sparkles className="w-6 h-6 text-amber-400" />;
    }
  };

  const getServicePhoto = (srv) => {
    const title = (srv.title || '').toLowerCase();
    if (title.includes('pogulu') || title.includes('baby') || title.includes('kids') || title.includes('పాపలకు') || title.includes('పోగులు')) {
      return '/service-baby-pogulu-ear-tops.jpg';
    }
    if (title.includes('mettalu') || title.includes('mettelu') || title.includes('toe ring') || title.includes('వెండి మట్టెలు') || title.includes('మట్టెలు')) {
      return '/service-silver-mettalu-toe-rings.jpg';
    }
    if (title.includes('pusthela') || title.includes('mangalasuthram') || title.includes('chuttudu') || title.includes('పుస్తెల')) {
      return '/service-pusthela-thadu-chuttudu.jpg';
    }
    if (title.includes('exchange') || title.includes('మార్పిడి') || title.includes('melting')) {
      return '/service-gold-melting-testing.jpg';
    }
    if (title.includes('custom') || title.includes('నగల తయారీ') || title.includes('nakshi')) {
      return '/service-custom-making.jpg';
    }
    if (title.includes('repair') || title.includes('sizing') || title.includes('మరమ్మతులు')) {
      return '/service-jewellery-repair-sizing.jpg';
    }
    if (srv.imageUrl && !srv.imageUrl.includes('unsplash.com')) {
      return getImageUrl(srv.imageUrl);
    }
    return '/service-pusthela-thadu-chuttudu.jpg';
  };

  const getPictureTag = (srv) => {
    const title = (srv.title || '').toLowerCase();
    if (title.includes('pogulu') || title.includes('baby') || title.includes('kids') || title.includes('పోగులు')) {
      return '📸 Baby Ear Pogulu Gentle Hand Fitting';
    }
    if (title.includes('mettalu') || title.includes('toe ring') || title.includes('మట్టెలు')) {
      return '📸 Hand-Carved Pure Silver Mettalu';
    }
    if (title.includes('pusthela') || title.includes('mangalasuthram') || title.includes('chuttudu')) {
      return '📸 Pusthela Thadu Gold Wire Wrapping';
    }
    if (title.includes('exchange')) {
      return '📸 Genuine Gold Melting & Scale Assay';
    }
    if (title.includes('custom')) {
      return '📸 22K Temple Gold Nakshi Handcrafting';
    }
    if (title.includes('repair')) {
      return '📸 Mandrel Sizing & Workshop Solder';
    }
    return srv.pictureTag || '📸 Genuine Workshop Craftsmanship';
  };

  // Display services: use backend services or fallback to rich default services
  const displayServices = (services && services.length > 0)
    ? services.map((srv) => ({
        ...srv,
        imageUrl: getServicePhoto(srv),
        pictureTag: getPictureTag(srv),
      }))
    : DEFAULT_SERVICES;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-16">
      {/* Page Header in Compressed Frosted Glass Box */}
      <div className="text-center max-w-2xl mx-auto space-y-2.5 bg-[#FFFDF9]/90 backdrop-blur-md p-4 sm:p-6 rounded-2xl border border-amber-300/80 shadow-md">
        <span className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-amber-800 flex items-center justify-center gap-1.5">
          <Award className="w-3.5 h-3.5 text-amber-700" /> Sacred Workshop Craftsmanship & Traditional Hand-Services
        </span>
        <h1 className="text-xl sm:text-3xl font-bold font-serif text-stone-900 leading-snug">
          Our Specialist
          <span className="block font-serif font-black tracking-wide bg-gradient-to-r from-amber-700 via-amber-800 to-amber-900 bg-clip-text text-transparent">
            HARI HARA Jewellery Services
          </span>
        </h1>
        <div className="flex items-center justify-center gap-2 pt-0.5">
          <div className="h-px w-8 sm:w-16 bg-gradient-to-r from-transparent via-amber-400/60 to-amber-400"></div>
          <Sparkles className="w-3.5 h-3.5 text-amber-700 animate-pulse" />
          <div className="h-px w-8 sm:w-16 bg-gradient-to-l from-transparent via-amber-400/60 to-amber-400"></div>
        </div>
        <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-normal max-w-lg mx-auto">
          Over 25 years of master goldsmith devotion by Prop. L. Srinivasa Chary in Uppuguda, Hyderabad.
          Specializing in authentic hand-services with deep responsibility, care, and pure gold & silver craftsmanship.
        </p>
      </div>

      {/* Services Grid with 6 Distinct Practical Photos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {displayServices.map((srv) => (
          <div
            key={srv.id}
            className="bg-white/85 backdrop-blur-md rounded-2xl border border-amber-200/80 hover:border-amber-400 p-6 sm:p-8 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
          >
            <div className="space-y-4">
              {/* Photo with Identification Tag */}
              <div className="aspect-16/9 rounded-xl overflow-hidden mb-4 bg-stone-100 border border-amber-200/80 relative group">
                <img
                  src={srv.imageUrl || getServicePhoto(srv)}
                  alt={srv.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={handleImageError}
                />
                <span className="absolute bottom-2 left-2 px-2.5 py-1 rounded-md bg-white/95 text-[11px] text-amber-900 font-bold backdrop-blur-md border border-amber-300 shadow-md">
                  {srv.pictureTag || getPictureTag(srv)}
                </span>
              </div>

              <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center">
                {getIcon(srv.iconName)}
              </div>

              <h3 className="text-lg font-bold font-serif text-stone-900 leading-snug">
                {srv.title}
              </h3>

              <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-normal">
                {srv.description}
              </p>
            </div>

            <div className="pt-5 border-t border-amber-100 mt-6 flex flex-wrap items-center justify-between gap-2.5">
              <button
                onClick={() => handleInquireService(srv.title)}
                className="min-h-[44px] px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/80 flex items-center gap-2 text-xs font-bold text-emerald-850 transition-colors cursor-pointer active:scale-95"
                aria-label={`WhatsApp Query for ${srv.title}`}
              >
                <WhatsAppIcon className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>WhatsApp Query</span>
              </button>

              <button
                onClick={() => {
                  setSelectedService(srv.title);
                  setEnquiryModalOpen(true);
                }}
                className="min-h-[44px] px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200/80 text-xs font-bold text-amber-900 flex items-center gap-1.5 transition-colors cursor-pointer active:scale-95"
                aria-label={`Book Service for ${srv.title}`}
              >
                <span>Book Service</span>
                <ArrowRight className="w-3.5 h-3.5 text-amber-700 shrink-0" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Real-Time Practical Workshop Craftsmanship */}
      <section className="bg-white/85 backdrop-blur-md rounded-2xl border border-amber-200/80 p-6 sm:p-10 space-y-8 shadow-lg">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
            Real-Time Handmade Workshop Craftsmanship
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold font-serif text-stone-900">
            Live Practical Goldsmith Work at our Workshop
          </h2>
          <p className="text-xs sm:text-sm text-stone-600">
            Real-time manual goldsmith work in our own workshop — from intricate Nakshi wax setting and hand-sawing to traditional coal bhatti melting and precision torch soldering.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* 1. Nakshi Wax Setting */}
          <div className="relative rounded-xl overflow-hidden border border-amber-200 bg-white flex flex-col justify-between group hover:border-amber-400 transition-colors shadow-xs">
            <div className="aspect-4/3 overflow-hidden relative">
              <img
                src="/workshop-nakshi-wax-setting.png"
                alt="Manual Nakshi Detailing on Wax Bed"
                loading="lazy"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
              />
              <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/85 backdrop-blur-sm text-[10px] font-bold text-amber-300 border border-amber-500/40">
                Live Nakshi Work
              </span>
            </div>
            <div className="p-4 bg-white/95 border-t border-amber-100 flex-1">
              <h4 className="text-sm font-bold text-stone-900 font-serif">Manual Nakshi & Wax Detailing</h4>
              <p className="text-[11px] text-stone-600 mt-1 leading-relaxed">
                Handcrafting intricate gold pendant petals and micro-bead setting on traditional lac/wax board with artisan tweezers for flawless symmetry and temple finish.
              </p>
            </div>
          </div>

          {/* 2. Hand-Sawing Ring Sizing */}
          <div className="relative rounded-xl overflow-hidden border border-amber-200 bg-white flex flex-col justify-between group hover:border-amber-400 transition-colors shadow-xs">
            <div className="aspect-4/3 overflow-hidden relative">
              <img
                src="/workshop-bench-sawing-ring.png"
                alt="Jeweler Piercing Saw Ring Work"
                loading="lazy"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
              />
              <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/85 backdrop-blur-sm text-[10px] font-bold text-amber-300 border border-amber-500/40">
                Bench Peg Work
              </span>
            </div>
            <div className="p-4 bg-white/95 border-t border-amber-100 flex-1">
              <h4 className="text-sm font-bold text-stone-900 font-serif">Jeweler's Piercing Saw Sizing</h4>
              <p className="text-[11px] text-stone-600 mt-1 leading-relaxed">
                Precision manual sawing and sizing on the wooden bench pin peg. Expert goldsmiths cutting and calibrating gold rings without losing gold weight.
              </p>
            </div>
          </div>

          {/* 3. Traditional Coal Bhatti & Blower */}
          <div className="relative rounded-xl overflow-hidden border border-amber-200 bg-white flex flex-col justify-between group hover:border-amber-400 transition-colors shadow-xs">
            <div className="aspect-4/3 overflow-hidden relative">
              <img
                src="/workshop-coal-bhatti-blower.png"
                alt="Traditional Coal Bhatti and Blower Hearth"
                loading="lazy"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
              />
              <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/85 backdrop-blur-sm text-[10px] font-bold text-amber-300 border border-amber-500/40">
                Coal Bhatti Hearth
              </span>
            </div>
            <div className="p-4 bg-white/95 border-t border-amber-100 flex-1">
              <h4 className="text-sm font-bold text-stone-900 font-serif">Traditional Bhatti & Rotary Blower</h4>
              <p className="text-[11px] text-stone-600 mt-1 leading-relaxed">
                High-heat furnace melting of pure gold & silver ingots using classic mechanical hand-blower hearth for authentic metal purification and ingot casting.
              </p>
            </div>
          </div>

          {/* 4. Live Flame Soldering & Annealing */}
          <div className="relative rounded-xl overflow-hidden border border-amber-200 bg-white flex flex-col justify-between group hover:border-amber-400 transition-colors shadow-xs">
            <div className="aspect-4/3 overflow-hidden relative">
              <img
                src="/workshop-torch-flame-soldering.png"
                alt="Live Gas Torch Soldering and Annealing"
                loading="lazy"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
              />
              <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/85 backdrop-blur-sm text-[10px] font-bold text-amber-300 border border-amber-500/40">
                Flame Soldering
              </span>
            </div>
            <div className="p-4 bg-white/95 border-t border-amber-100 flex-1">
              <h4 className="text-sm font-bold text-stone-900 font-serif">Torch Flame Soldering & Annealing</h4>
              <p className="text-[11px] text-stone-600 mt-1 leading-relaxed">
                Precision gas blowtorch flame annealing on charcoal block. Flawless joint fusing, wire softening, and chemical pickle bath cleansing for lasting strength.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Official 91.6 Hallmark Guarantee Card & 90% Return Guarantee */}
      <HallmarkGuaranteeCard />

      <EnquiryModal
        isOpen={enquiryModalOpen}
        onClose={() => setEnquiryModalOpen(false)}
      />
    </div>
  );
}
