import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ChevronRight,
  ShieldCheck,
  Scale,
  Sparkles,
  Phone,
  RefreshCw,
  Award,
  CheckCircle,
  HelpCircle,
  Share2,
} from 'lucide-react';
import { WhatsAppIcon } from '../../components/WhatsAppIcon';
import { api } from '../../services/api';
import { useShop } from '../../context/ShopContext';
import { ProductCard } from '../../components/ProductCard';
import { EnquiryModal } from '../../components/EnquiryModal';
import { getImageUrl, handleImageError, DEFAULT_JEWELLERY_IMAGE } from '../../utils/imageUrl';

export function ProductDetails() {
  const { id } = useParams();
  const { settings } = useShop();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [enquiryModalOpen, setEnquiryModalOpen] = useState(false);

  useEffect(() => {
    async function fetchProductDetails() {
      try {
        setLoading(true);
        setError(null);
        setSelectedImageIndex(0);

        const res = await api.getProductById(id);
        if (res.success && res.data) {
          setProduct(res.data);
          setRelated(res.related || []);
        } else {
          setError('Jewellery product not found or unavailable.');
        }
      } catch (err) {
        console.error('Failed to load product details:', err);
        setError('Jewellery product not found.');
      } finally {
        setLoading(false);
      }
    }

    fetchProductDetails();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  const whatsappNum = settings?.whatsappNumber?.replace(/\D/g, '') || '919848543615';

  const handleWhatsAppEnquiry = () => {
    if (!product) return;
    const weightText = product.weight ? ` (Weight: ${product.weight}g)` : '';
    const purityText = product.purity ? ` [${product.purity}]` : '';
    const text = encodeURIComponent(
      `Namaste L. Srinivasa Chary garu! I am inquiring about this ornament on your website: "${product.name}"${purityText}${weightText}. Could you please share the live gold price and making charge details?`
    );
    window.open(`https://wa.me/${whatsappNum}?text=${text}`, '_blank');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product?.name,
        text: `Check out ${product?.name} at HARI HARA Jewellery Works!`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Product link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 animate-pulse">
          <div className="h-96 bg-stone-200/70 border border-amber-200/50 rounded-2xl"></div>
          <div className="space-y-4">
            <div className="h-6 bg-stone-200/70 rounded w-1/3 border border-amber-200/40"></div>
            <div className="h-10 bg-stone-200/70 rounded w-3/4 border border-amber-200/40"></div>
            <div className="h-24 bg-stone-200/70 rounded border border-amber-200/40"></div>
            <div className="h-12 bg-stone-200/70 rounded border border-amber-200/40"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-red-50 border border-red-300 text-red-600 mx-auto flex items-center justify-center">
          <HelpCircle className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-stone-900 font-serif">Product Not Available</h2>
        <p className="text-xs text-stone-600 max-w-sm mx-auto">
          The requested jewellery design might have been updated or removed. Please explore our other collections.
        </p>
        <Link
          to="/collections"
          className="inline-block px-5 py-2.5 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white rounded-lg text-xs font-semibold shadow-lg shadow-amber-950/50"
        >
          View All Collections
        </Link>
      </div>
    );
  }

  const images = product.images && product.images.length > 0
    ? product.images
    : [{ imageUrl: '/luxury-hero-banner.jpg', altText: product.name }];

  const currentImage = images[selectedImageIndex] || images[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
      {/* Breadcrumb Navigation in Frosted Pill Box */}
      <nav className="inline-flex items-center gap-1.5 text-xs text-stone-600 flex-wrap font-medium bg-[#FFFDF9]/85 backdrop-blur-md px-4 py-2.5 rounded-xl border border-amber-300/80 shadow-xs">
        <Link to="/" className="hover:text-amber-800 transition-colors">Home</Link>
        <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
        <Link to="/collections" className="hover:text-amber-800 transition-colors">Collections</Link>
        {product.category && (
          <>
            <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
            <Link to={`/collections/${product.category.slug}`} className="hover:text-amber-800 transition-colors">
              {product.category.name}
            </Link>
          </>
        )}
        <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
        <span className="font-bold text-amber-800 truncate max-w-[200px] sm:max-w-none">{product.name}</span>
      </nav>

      {/* Main Product Details Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
        {/* Left Column: Image Gallery (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Main Selected Image */}
          <div className="relative aspect-4/3 rounded-2xl overflow-hidden bg-white border-2 border-amber-300 shadow-xl">
            <img
              src={getImageUrl(currentImage.imageUrl)}
              alt={currentImage.altText || product.name}
              className="w-full h-full object-cover object-center"
              onError={handleImageError}
            />

            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {product.isNewArrival && (
                <span className="bg-red-700 text-white text-xs font-bold px-3 py-1 rounded shadow-xs uppercase tracking-wider">
                  New Arrival
                </span>
              )}
              {product.isFeatured && (
                <span className="bg-amber-600 text-white text-xs font-bold px-3 py-1 rounded shadow-xs uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Featured Design
                </span>
              )}
            </div>

            {/* Hallmarking Tag */}
            <div className="absolute top-4 right-4">
              <span className="bg-white/95 text-amber-900 text-xs font-bold px-3 py-1.5 rounded backdrop-blur-md flex items-center gap-1.5 border border-amber-400 shadow-sm">
                <ShieldCheck className="w-4 h-4 text-amber-600" />
                {product.purity || '91.6 KDM Hallmarked'}
              </span>
            </div>
          </div>

          {/* Thumbnails Row */}
          {images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2 no-scrollbar">
              {images.map((img, idx) => (
                <button
                  key={img.id || idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 shrink-0 transition-all cursor-pointer bg-white ${
                    selectedImageIndex === idx
                      ? 'border-amber-500 ring-2 ring-amber-400/50 shadow-md'
                      : 'border-stone-200 opacity-70 hover:opacity-100 hover:border-amber-400'
                  }`}
                >
                  <img
                    src={getImageUrl(img.imageUrl)}
                    alt={img.altText || `View ${idx + 1}`}
                    className="w-full h-full object-cover"
                    onError={handleImageError}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Specifications & Actions (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#FFFDF9]/90 backdrop-blur-md p-5 rounded-2xl border border-amber-300/80 shadow-sm">
            {product.category && (
              <span className="text-xs font-bold text-amber-800 uppercase tracking-widest block mb-2">
                {product.category.name}
              </span>
            )}
            <h1 className="text-2xl sm:text-3xl font-bold font-serif text-stone-900 leading-tight">
              {product.name}
            </h1>
            <p className="text-xs text-stone-500 mt-1 font-mono font-medium">
              SKU: HH-{product.id.substring(0, 8).toUpperCase()}
            </p>
          </div>

          {/* Description */}
          {product.description && (
            <p className="text-xs sm:text-sm text-stone-700 leading-relaxed bg-white/85 backdrop-blur-md p-4 rounded-xl border border-amber-200 shadow-xs">
              {product.description}
            </p>
          )}

          {/* Specifications Table */}
          <div className="bg-white/90 backdrop-blur-md rounded-xl border border-amber-200/80 divide-y divide-stone-100 text-xs shadow-md">
            <div className="p-3.5 flex items-center justify-between">
              <span className="text-stone-600 flex items-center gap-1.5 font-medium">
                <ShieldCheck className="w-4 h-4 text-amber-700" /> Metal & Purity
              </span>
              <span className="font-bold text-amber-900 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                {product.purity || '22K (91.6 KDM Hallmarked)'}
              </span>
            </div>

            {product.weight && (
              <div className="p-3.5 flex items-center justify-between">
                <span className="text-stone-600 flex items-center gap-1.5 font-medium">
                  <Scale className="w-4 h-4 text-amber-700" /> Approximate Weight
                </span>
                <span className="font-bold text-stone-900">
                  {product.weight} Grams
                </span>
              </div>
            )}

            <div className="p-3.5 flex items-center justify-between">
              <span className="text-stone-600 font-medium">Showroom Availability</span>
              <span
                className={`font-semibold px-2 py-0.5 rounded border ${
                  product.availabilityStatus === 'IN_STOCK'
                    ? 'text-emerald-800 bg-emerald-50 border-emerald-300'
                    : 'text-amber-900 bg-amber-50 border-amber-300'
                }`}
              >
                {product.availabilityStatus === 'IN_STOCK' ? '✓ Ready in Showroom' : 'Custom Made to Order'}
              </span>
            </div>

            <div className="p-3.5 flex items-center justify-between">
              <span className="text-stone-600 font-medium">Pricing Policy</span>
              <span className="font-semibold text-stone-800 text-right">
                {product.price ? (
                  <strong className="text-sm font-black text-amber-900">
                    ₹{product.price.toLocaleString('en-IN')}*
                  </strong>
                ) : (
                  'Price on Request (Live Gold Rate)'
                )}
              </span>
            </div>
          </div>

          <p className="text-[11px] text-stone-500 italic">
            * Final gold ornament prices are calculated based on the daily live bullion rate, exact final weight in grams, and making charges.
          </p>

          {/* Action CTAs */}
          <div className="space-y-3 pt-2">
            <button
              onClick={handleWhatsAppEnquiry}
              className="w-full flex items-center justify-center gap-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-5 rounded-xl shadow-md text-sm transition-all transform hover:-translate-y-0.5 cursor-pointer min-h-[48px] text-center"
            >
              <WhatsAppIcon className="w-5 h-5 shrink-0" />
              <span>Enquire on WhatsApp with Master Craftsman</span>
            </button>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
              <button
                onClick={() => setEnquiryModalOpen(true)}
                className="flex items-center justify-center gap-1.5 bg-gradient-to-r from-amber-700 to-amber-800 hover:from-amber-600 hover:to-amber-700 text-white font-bold py-3 px-4 rounded-xl text-xs sm:text-sm transition-all shadow-sm cursor-pointer min-h-[44px]"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Submit Form Enquiry</span>
              </button>

              <button
                onClick={handleShare}
                className="flex items-center justify-center gap-1.5 border border-stone-300 hover:bg-stone-50 text-stone-700 font-semibold py-3 px-4 rounded-xl text-xs sm:text-sm transition-colors cursor-pointer bg-white min-h-[44px]"
              >
                <Share2 className="w-4 h-4 text-stone-500" />
                <span>Share Design</span>
              </button>
            </div>
          </div>

          {/* Hallmark Guarantee Box */}
          <div className="p-4 rounded-xl bg-amber-50/90 backdrop-blur-md border border-amber-300/80 space-y-2 text-xs shadow-xs">
            <div className="flex items-center gap-2 font-bold text-amber-950 font-serif">
              <Award className="w-4 h-4 text-amber-700" />
              HARI HARA Purity Guarantee
            </div>
            <ul className="space-y-1 text-stone-700 text-[11px] font-medium">
              <li>• Official 91.6 KDM hallmark stamp guaranteeing 22 Carat gold purity.</li>
              <li>• Direct customization: Adjust weight or stone setting to your preference.</li>
              <li>• Lifetime exchange and buyback facility at fair market valuation.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Related Published Products */}
      {related.length > 0 && (
        <section className="pt-12 border-t border-amber-200/80 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-bold font-serif text-stone-900">
              Related Jewellery Designs
            </h2>
            <Link
              to={product.category ? `/collections/${product.category.slug}` : '/collections'}
              className="text-xs font-bold text-amber-800 hover:text-amber-950"
            >
              View More →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {related.map((rel) => (
              <ProductCard key={rel.id} product={rel} />
            ))}
          </div>
        </section>
      )}

      {/* Enquiry Modal */}
      <EnquiryModal
        isOpen={enquiryModalOpen}
        onClose={() => setEnquiryModalOpen(false)}
        product={product}
      />
    </div>
  );
}
