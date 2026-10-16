import React from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, Eye, Sparkles, ShieldCheck, Scale } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { getImageUrl, handleImageError, DEFAULT_JEWELLERY_IMAGE } from '../utils/imageUrl';

export function ProductCard({ product }) {
  const { settings } = useShop();
  const whatsappNum = settings?.whatsappNumber?.replace(/\D/g, '') || '919848543615';

  const rawImage = product.images?.[0]?.imageUrl || DEFAULT_JEWELLERY_IMAGE;
  const primaryImage = getImageUrl(rawImage);

  const handleWhatsAppEnquiry = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const weightText = product.weight ? ` (Approx: ${product.weight}g)` : '';
    const purityText = product.purity ? ` [${product.purity}]` : '';
    const message = `Namaste HARI HARA Jewellery Works! I am interested in inquiring about this jewellery design: "${product.name}"${purityText}${weightText}. Could you share more details and making charges?`;

    const url = `https://wa.me/${whatsappNum}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="group relative bg-white/90 backdrop-blur-md rounded-2xl overflow-hidden border border-amber-200/80 hover:border-amber-400 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full">
      {/* Image Container with Badges */}
      <Link to={`/product/${product.id}`} className="relative block aspect-4/3 overflow-hidden bg-stone-100">
        <img
          src={primaryImage}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          onError={handleImageError}
        />

        {/* Hover overlay sheen on desktop */}
        <div className="hidden sm:flex absolute inset-0 bg-stone-950/20 opacity-0 group-hover:opacity-100 transition-opacity items-center justify-center gap-3">
          <span className="bg-white/95 text-stone-900 border border-amber-300 text-xs font-semibold px-3.5 py-1.5 rounded-full shadow-md flex items-center gap-1 transform translate-y-2 group-hover:translate-y-0 transition-transform">
            <Eye className="w-3.5 h-3.5 text-amber-700" />
            View Details
          </span>
        </div>

        {/* Badges on Image */}
        <div className="absolute top-2 left-2 sm:top-2.5 sm:left-2.5 flex flex-col gap-1 z-10 pointer-events-none">
          {product.isNewArrival && (
            <span className="bg-red-700 text-white text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded shadow-xs uppercase tracking-wider">
              New Arrival
            </span>
          )}
          {product.isFeatured && (
            <span className="bg-amber-600 text-white text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded shadow-xs uppercase tracking-wider flex items-center gap-0.5">
              <Sparkles className="w-2.5 h-2.5" /> Featured
            </span>
          )}
        </div>

        {/* Hallmark Purity Tag on top right */}
        <div className="absolute top-2 right-2 sm:top-2.5 sm:right-2.5 z-10">
          <span className="bg-white/95 text-amber-900 text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded backdrop-blur-xs flex items-center gap-1 border border-amber-300 shadow-xs">
            <ShieldCheck className="w-3 h-3 text-amber-600" />
            {product.purity || '91.6 KDM'}
          </span>
        </div>
      </Link>

      {/* Product Content */}
      <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Category */}
          {product.category && (
            <span className="text-[10px] sm:text-[11px] font-bold text-amber-700 uppercase tracking-wider block mb-1">
              {product.category.name}
            </span>
          )}

          {/* Product Title */}
          <Link
            to={`/product/${product.id}`}
            className="block text-xs sm:text-sm font-bold text-stone-900 hover:text-amber-800 transition-colors line-clamp-2 leading-snug font-serif"
          >
            {product.name}
          </Link>

          {/* Weight & Availability Specs */}
          <div className="mt-2 flex items-center gap-2 text-xs text-stone-600 flex-wrap">
            {product.weight && (
              <span className="flex items-center gap-1 font-semibold bg-amber-50 text-stone-800 border border-amber-200 px-2 py-0.5 rounded text-[10px] sm:text-[11px]">
                <Scale className="w-3 h-3 text-amber-700" />
                Approx: {product.weight}g
              </span>
            )}

            <span
              className={`text-[10px] sm:text-[11px] font-semibold px-2 py-0.5 rounded border ${
                product.availabilityStatus === 'IN_STOCK'
                  ? 'text-emerald-800 bg-emerald-50 border-emerald-300'
                  : 'text-amber-900 bg-amber-50 border-amber-300'
              }`}
            >
              {product.availabilityStatus === 'IN_STOCK' ? 'In Showroom' : 'Made to Order'}
            </span>
          </div>

          {/* Price display */}
          <div className="mt-2.5 pt-2 border-t border-amber-100 flex items-baseline justify-between flex-wrap gap-1">
            {product.price ? (
              <div>
                <span className="text-[11px] text-stone-500">Approx: </span>
                <span className="text-xs sm:text-sm font-extrabold text-amber-900">₹{product.price.toLocaleString('en-IN')}</span>
              </div>
            ) : (
              <span className="text-[11px] text-amber-800 font-bold italic">
                Price on Request (Live Bullion Rate)
              </span>
            )}
          </div>
        </div>

        {/* Card Actions with Touch-Friendly 44px Minimum Tap Targets */}
        <div className="pt-2 grid grid-cols-2 gap-2 border-t border-stone-100">
          <Link
            to={`/product/${product.id}`}
            className="flex items-center justify-center gap-1 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 border border-stone-300 py-2.5 px-2 rounded-xl transition-colors text-center min-h-[44px]"
          >
            Details
          </Link>

          <button
            onClick={handleWhatsAppEnquiry}
            className="flex items-center justify-center gap-1 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 py-2.5 px-2 rounded-xl transition-colors cursor-pointer shadow-xs min-h-[44px]"
            title="Enquire on WhatsApp"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>Enquire</span>
          </button>
        </div>
      </div>
    </div>
  );
}
