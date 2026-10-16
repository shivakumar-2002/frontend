import React, { useState } from 'react';
import {
  ShieldCheck,
  QrCode,
  Scale,
  RotateCcw,
  BadgeCheck,
  MessageCircle,
  Sparkles,
  X,
} from 'lucide-react';
import { useShop } from '../context/ShopContext';

export function HallmarkGuaranteeCard({ className = '' }) {
  const { settings } = useShop();
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const whatsappNum = settings?.whatsappNumber?.replace(/\D/g, '') || '919848543615';

  const guaranteePoints = [
    {
      icon: <QrCode className="w-5 h-5 text-amber-400" />,
      title: 'QR Code Product Scanner',
      desc: 'Scan with any smartphone camera to instantly verify purity test results, item specs, and certificate legitimacy.',
    },
    {
      icon: <Scale className="w-5 h-5 text-amber-400" />,
      title: 'Item Photo & Precision Weight Printed',
      desc: 'Your actual gold ornament photo and exact net gram weight (down to milligrams) are printed directly on the card.',
    },
    {
      icon: <BadgeCheck className="w-5 h-5 text-amber-400" />,
      title: '91.6 KDM Hallmark & XRF Certified',
      desc: 'Certified 22K caratage (91.6% purity) verified with high-precision XRF spectrometry and BIS standards.',
    },
    {
      icon: <RotateCcw className="w-5 h-5 text-emerald-400" />,
      title: '90% Gold or Cash Return Guarantee',
      desc: 'Complete peace of mind. For any issues or future returns, we guarantee a 90% return value in Cash or Gold value at live rates!',
      highlight: true,
    },
  ];

  return (
    <section className={`relative overflow-hidden rounded-3xl bg-gradient-to-br from-white/95 via-amber-50/60 to-white/95 border border-amber-300/80 p-6 sm:p-10 lg:p-12 shadow-xl backdrop-blur-md ${className}`}>
      {/* Subtle Gold Ambient Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-300/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20"></div>

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Left Column: Clean, Neat High-Res Guarantee Card Photo */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="relative w-full max-w-md rounded-2xl overflow-hidden border-2 border-amber-300 shadow-xl group bg-white">
            <img
              src="/hallmark-guarantee-card.jpg"
              alt="HARI HARA Jewellery Works 91.6 KDM Hallmark Guarantee Card & Ring Delivery Box"
              loading="lazy"
              className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500 cursor-pointer"
              onClick={() => setImageModalOpen(true)}
            />

            {/* Bottom Card Ribbon */}
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-stone-950 via-stone-950/90 to-transparent p-4 pt-8">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-amber-300 block">
                    Official Delivery Certificate
                  </span>
                  <span className="text-xs font-serif font-bold text-white">
                    HARI HARA JEWELLERY WORKS
                  </span>
                </div>
                <span className="px-2.5 py-1 rounded-md bg-amber-500/20 text-amber-300 border border-amber-400/40 text-[10px] font-bold">
                  22K / 91.6% KDM
                </span>
              </div>
            </div>
          </div>

          <p className="text-[11px] text-stone-600 text-center mt-3 max-w-sm font-medium">
            ✨ Delivered inside our signature velvet gift box with every bespoke gold ornament order in Uppuguda.
          </p>
        </div>

        {/* Right Column: Matter, Policies & 90% Return Guarantee */}
        <div className="lg:col-span-7 space-y-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-xs font-bold uppercase tracking-wide">
              <ShieldCheck className="w-4 h-4 text-amber-700" />
              <span>Customer Protection & Trust Guarantee</span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-serif text-stone-900 leading-tight">
              Official Hallmark Guarantee Card & <span className="text-amber-800">90% Return Guarantee</span>
            </h2>

            <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
              At <strong>HARI HARA Jewellery Works</strong> (Prop. L. Srinivasa Chary), we stand with 100% devotion behind every ornament we craft.
              Every customer receives an official laminated <strong>XRF Testing Certificate & Hallmark Guarantee Card</strong> featuring their item's live photo, certified caratage, and exact digital weight upon delivery.
            </p>
          </div>

          {/* 4 Feature Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {guaranteePoints.map((pt, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-xl border transition-all ${
                  pt.highlight
                    ? 'bg-gradient-to-br from-emerald-50 via-white to-amber-50 border-emerald-300 shadow-md'
                    : 'bg-white/80 border-amber-200 hover:border-amber-400 shadow-xs'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-amber-50 border border-amber-200 shrink-0 mt-0.5">
                    {pt.icon}
                  </div>
                  <div className="space-y-1">
                    <h4 className={`text-xs sm:text-sm font-bold font-serif ${pt.highlight ? 'text-emerald-900' : 'text-amber-950'}`}>
                      {pt.title}
                    </h4>
                    <p className="text-[11px] text-stone-600 leading-relaxed font-medium">
                      {pt.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 90% Return Banner Highlight */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-amber-50 via-white to-emerald-50 border border-amber-300 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-900">
                <Sparkles className="w-4 h-4 text-amber-700" />
                <span>Our 90% Cash / Gold Return Commitment</span>
              </div>
              <p className="text-[11px] text-stone-700 leading-relaxed font-medium">
                If you ever face any issue or wish to return your ornament, we honour a guaranteed <strong>90% return value in Cash or Gold value</strong> at prevailing bullion rates. No excuses, no hidden deductions.
              </p>
            </div>

            <a
              href={`https://wa.me/${whatsappNum}?text=${encodeURIComponent('Namaste L. Srinivasa Chary garu! I would like to know more about the 91.6 Hallmark Guarantee Card and 90% return policy at HARI HARA Jewellery Works.')}`}
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto shrink-0 min-h-[44px] px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer active:scale-95"
              aria-label="Verify on WhatsApp"
            >
              <MessageCircle className="w-4 h-4 shrink-0" />
              <span>Verify on WhatsApp</span>
            </a>
          </div>
        </div>
      </div>

      {/* Modal for viewing the high-res Guarantee Card in full detail */}
      {imageModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-4"
          onClick={() => setImageModalOpen(false)}
        >
          <div
            className="relative max-w-2xl w-full bg-white/95 backdrop-blur-xl rounded-2xl border border-amber-300 p-3 sm:p-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setImageModalOpen(false)}
              className="absolute -top-3 -right-3 w-10 h-10 min-w-[40px] min-h-[40px] rounded-full bg-white border border-amber-300 text-stone-700 hover:text-stone-900 flex items-center justify-center shadow-lg cursor-pointer active:scale-95"
              title="Close modal"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src="/hallmark-guarantee-card.jpg"
              alt="HARI HARA 91.6 KDM Hallmark Guarantee Card Full Preview"
              className="w-full h-auto rounded-xl object-contain max-h-[85vh] shadow-xs"
            />
            <div className="p-3 text-center">
              <p className="text-xs font-serif font-bold text-amber-900">
                HARI HARA JEWELLERY WORKS • 91.6 KDM HALLMARK & XRF TESTING CERTIFICATE
              </p>
              <p className="text-[11px] text-stone-600 mt-0.5">
                Exact Item Photo • Computerized Net Weight (6.030g) • 22K Purity • QR Code Product Scanner
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
