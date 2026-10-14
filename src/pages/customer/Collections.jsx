import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Search, Filter, Sparkles, RefreshCw, X, ChevronRight, ChevronLeft, Award } from 'lucide-react';
import { api } from '../../services/api';
import { useShop } from '../../context/ShopContext';
import { ProductCard } from '../../components/ProductCard';

export function Collections() {
  const { categorySlug } = useParams();
  const navigate = useNavigate();
  const { categories } = useShop();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMetal, setSelectedMetal] = useState('ALL');
  const categoryScrollRef = useRef(null);

  const scrollCategories = (direction) => {
    if (categoryScrollRef.current) {
      const scrollAmount = direction === 'left' ? -260 : 260;
      categoryScrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // Load products based on categorySlug and filters
  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        setError(null);

        const params = {
          category: categorySlug || '',
          search: searchTerm,
        };

        if (selectedMetal !== 'ALL') {
          params.metal = selectedMetal;
          params.purity = selectedMetal;
        }

        const res = await api.getProducts(params);
        if (res.success && res.data) {
          setProducts(res.data);
        } else {
          setProducts([]);
        }
      } catch (err) {
        console.error('Failed to load collections:', err);
        setError('Failed to load jewellery catalogue. Please try again.');
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [categorySlug, searchTerm, selectedMetal]);

  const activeCategory = categories.find((c) => c.slug === categorySlug);

  const handleCategoryChange = (slug) => {
    if (slug) {
      navigate(`/collections/${slug}`);
    } else {
      navigate('/collections');
    }
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedMetal('ALL');
    navigate('/collections');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Breadcrumb Header */}
      {/* Collections Header in Compressed Frosted Glass Box */}
      <div className="text-center max-w-2xl mx-auto space-y-2.5 bg-[#FFFDF9]/90 backdrop-blur-md p-4 sm:p-6 rounded-2xl border border-amber-300/80 shadow-md">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center justify-center gap-1.5 text-xs text-stone-500 font-medium">
          <Link to="/" className="hover:text-amber-800 transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3 text-stone-400" />
          <Link to="/collections" className={!categorySlug ? 'font-bold text-amber-800' : 'hover:text-amber-800'}>
            Collections
          </Link>
          {activeCategory && (
            <>
              <ChevronRight className="w-3 h-3 text-stone-400" />
              <span className="font-bold text-amber-800">{activeCategory.name}</span>
            </>
          )}
        </nav>

        {/* Top Badge */}
        <span className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-amber-800 flex items-center justify-center gap-1.5 pt-0.5">
          <Award className="w-3.5 h-3.5 text-amber-700" /> Certified 91.6 KDM Hallmarked Catalogue
        </span>

        {/* Heading */}
        <h1 className="text-xl sm:text-3xl font-bold font-serif text-stone-900 leading-snug">
          {activeCategory ? 'Pure Handcrafted' : 'All Jewellery'}
          <span className="block font-serif font-black tracking-wide bg-gradient-to-r from-amber-700 via-amber-800 to-amber-900 bg-clip-text text-transparent">
            {activeCategory ? activeCategory.name : 'Collections & Ornaments'}
          </span>
        </h1>

        {/* Sparkle Divider */}
        <div className="flex items-center justify-center gap-2 pt-0.5">
          <div className="h-px w-8 sm:w-16 bg-gradient-to-r from-transparent via-amber-400/60 to-amber-400"></div>
          <Sparkles className="w-3.5 h-3.5 text-amber-700 animate-pulse" />
          <div className="h-px w-8 sm:w-16 bg-gradient-to-l from-transparent via-amber-400/60 to-amber-400"></div>
        </div>

        {/* Description */}
        <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-normal max-w-lg mx-auto">
          {activeCategory?.description ||
            'Browse our complete catalogue of 100% 91.6 KDM hallmarked gold ornaments, bridal sets, temple necklaces, bangles, and sacred silver articles.'}
        </p>

        {/* Counter Badge */}
        <div className="text-[11px] text-stone-500 font-medium pt-0.5">
          Showing <strong className="text-amber-800 font-bold">{products.length}</strong> published designs
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="bg-white/85 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-amber-200/80 shadow-md space-y-4">
        {/* Top Controls: Search Bar */}
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          {/* Search Bar */}
          <div className="relative flex-1 max-w-lg">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              type="text"
              placeholder="Search designs (e.g. Kasu Haram, Jhumka, Bangle)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-9 py-2.5 text-base sm:text-xs rounded-xl border border-stone-300 bg-white text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 font-medium min-h-[44px]"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center text-stone-400 hover:text-stone-600 cursor-pointer"
                aria-label="Clear Search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Category Filter Pills with Scroll Controls */}
        <div className="pt-2 border-t border-stone-100">
          <div className="flex items-center gap-1.5">
            {/* Scroll Left Button */}
            <button
              type="button"
              onClick={() => scrollCategories('left')}
              className="shrink-0 w-8 h-8 rounded-full bg-white hover:bg-amber-100 text-stone-700 hover:text-amber-900 border border-amber-300 flex items-center justify-center shadow-xs transition-colors cursor-pointer"
              title="Scroll categories left"
              aria-label="Scroll Left"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Scrollable Categories List */}
            <div
              ref={categoryScrollRef}
              className="flex-1 flex items-center gap-2 overflow-x-auto pb-2 pt-0.5 category-scrollbar text-xs scroll-smooth touch-pan-x"
            >
              <button
                onClick={() => handleCategoryChange('')}
                className={`px-4 py-2 min-h-[40px] rounded-full font-semibold shrink-0 transition-colors cursor-pointer flex items-center justify-center ${
                  !categorySlug
                    ? 'bg-amber-700 text-white shadow-xs'
                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200 border border-stone-200'
                }`}
              >
                All Categories
              </button>

              {categories.map((cat) => {
                const isActive = categorySlug === cat.slug;
                return (
                  <button
                    key={cat.id}
                    onClick={() => handleCategoryChange(cat.slug)}
                    className={`px-4 py-2 min-h-[40px] rounded-full font-semibold shrink-0 transition-colors cursor-pointer flex items-center gap-1.5 ${
                      isActive
                        ? 'bg-amber-700 text-white shadow-xs'
                        : 'bg-stone-100 text-stone-700 hover:bg-stone-200 border border-stone-200'
                    }`}
                  >
                    <span>{cat.name}</span>
                    {cat.productCount > 0 && (
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                          isActive ? 'bg-amber-900 text-amber-100' : 'bg-stone-200 text-stone-700'
                        }`}
                      >
                        {cat.productCount}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Scroll Right Button */}
            <button
              type="button"
              onClick={() => scrollCategories('right')}
              className="shrink-0 w-8 h-8 rounded-full bg-white hover:bg-amber-100 text-stone-700 hover:text-amber-900 border border-amber-300 flex items-center justify-center shadow-xs transition-colors cursor-pointer"
              title="Scroll categories right"
              aria-label="Scroll Right"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Metal Filter: Only GOLD and SILVER */}
        <div className="pt-2 flex items-center gap-2 text-xs overflow-x-auto pb-1 no-scrollbar border-t border-stone-100 touch-pan-x">
          <span className="text-stone-600 font-medium shrink-0 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-amber-700" /> Filter:
          </span>
          <button
            onClick={() => setSelectedMetal('ALL')}
            className={`px-3.5 py-1.5 min-h-[36px] rounded-lg text-xs font-semibold shrink-0 cursor-pointer transition-colors flex items-center justify-center ${
              selectedMetal === 'ALL'
                ? 'bg-amber-100 text-amber-900 border border-amber-300 font-bold'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200 border border-stone-200'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setSelectedMetal(selectedMetal === 'GOLD' ? 'ALL' : 'GOLD')}
            className={`px-4 py-1.5 min-h-[36px] rounded-lg text-xs font-bold shrink-0 cursor-pointer transition-all flex items-center gap-1.5 ${
              selectedMetal === 'GOLD'
                ? 'bg-amber-700 text-white shadow-xs'
                : 'bg-amber-50 text-amber-900 hover:bg-amber-100 border border-amber-300'
            }`}
          >
            <span>GOLD</span>
          </button>
          <button
            onClick={() => setSelectedMetal(selectedMetal === 'SILVER' ? 'ALL' : 'SILVER')}
            className={`px-4 py-1.5 min-h-[36px] rounded-lg text-xs font-bold shrink-0 cursor-pointer transition-all flex items-center gap-1.5 ${
              selectedMetal === 'SILVER'
                ? 'bg-slate-700 text-white shadow-xs'
                : 'bg-slate-100 text-slate-800 hover:bg-slate-200 border border-slate-300'
            }`}
          >
            <span>SILVER</span>
          </button>

          {(searchTerm || selectedMetal !== 'ALL' || categorySlug) && (
            <button
              onClick={handleResetFilters}
              className="ml-auto text-xs text-amber-800 hover:text-amber-950 font-bold flex items-center gap-1 cursor-pointer shrink-0 min-h-[36px] px-2"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Reset
            </button>
          )}
        </div>
      </div>

      {/* Catalogue Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
            <div key={n} className="bg-white/80 rounded-xl border border-stone-200 h-80 animate-pulse p-4 space-y-4">
              <div className="h-44 bg-stone-100 rounded-lg"></div>
              <div className="h-4 bg-stone-100 rounded w-2/3"></div>
              <div className="h-3 bg-stone-100 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-16 bg-red-50 rounded-xl border border-red-200 p-8">
          <p className="text-sm font-semibold text-red-700 mb-3">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-stone-800 text-white rounded-lg text-xs font-semibold hover:bg-stone-700"
          >
            Retry Loading
          </button>
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white/85 backdrop-blur-md rounded-2xl border border-dashed border-amber-300 p-8 space-y-4 shadow-sm">
          <div className="w-14 h-14 rounded-full bg-amber-50 text-amber-700 mx-auto flex items-center justify-center border border-amber-200">
            <Sparkles className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-stone-900 font-serif">No Jewellery Designs Found</h3>
          <p className="text-xs text-stone-600 max-w-sm mx-auto">
            We couldn't find any designs matching your selected filters. Try searching for a different keyword or view all collections.
          </p>
          <button
            onClick={handleResetFilters}
            className="px-4 py-2 bg-amber-700 hover:bg-amber-800 text-white rounded-lg text-xs font-bold cursor-pointer shadow-sm"
          >
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
}
