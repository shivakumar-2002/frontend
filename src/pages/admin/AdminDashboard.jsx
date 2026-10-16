import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Gem,
  CheckCircle,
  FileText,
  FolderTree,
  MessageSquare,
  Sparkles,
  PlusCircle,
  ArrowRight,
  Clock,
  Eye,
  AlertCircle,
  Scale,
} from 'lucide-react';
import { WhatsAppIcon } from '../../components/WhatsAppIcon';
import { api } from '../../services/api';
import { getImageUrl, handleImageError, DEFAULT_JEWELLERY_IMAGE } from '../../utils/imageUrl';

export function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [recentEnquiries, setRecentEnquiries] = useState([]);
  const [recentProducts, setRecentProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadDashboard() {
      try {
        setLoading(true);
        const res = await api.getAdminStats();
        if (res.success && res.data) {
          setStats(res.data.stats);
          setRecentEnquiries(res.data.recentEnquiries || []);
          setRecentProducts(res.data.recentProducts || []);
        }
      } catch (err) {
        console.error('Failed to load dashboard:', err);
        setError('Failed to load dashboard statistics from backend API.');
      } finally {
        setLoading(false);
      }
    }
    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-stone-900 rounded w-1/4"></div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="h-24 bg-stone-900 rounded-xl"></div>
          ))}
        </div>
        <div className="h-64 bg-stone-900 rounded-xl"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 rounded-xl bg-red-950/60 border border-red-800 text-red-200 text-xs flex items-center gap-3">
        <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
        <span>{error}</span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Dashboard Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-amber-200">
            Showroom Overview & Metrics
          </h1>
          <p className="text-xs text-stone-400 mt-1">
            Real-time jewellery catalogue inventory and customer enquiry tracking from PostgreSQL.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/admin/products/new"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-semibold text-xs shadow-md transition-all cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add New Design</span>
          </Link>
        </div>
      </div>

      {/* Statistics Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <div className="bg-stone-900/90 border border-stone-800 rounded-xl p-4 space-y-1">
          <div className="flex items-center justify-between text-stone-400">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Total Designs</span>
            <Gem className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-300 font-serif">{stats?.totalProducts ?? 0}</div>
          <div className="text-[10px] text-stone-500">In Database</div>
        </div>

        <div className="bg-stone-900/90 border border-stone-800 rounded-xl p-4 space-y-1">
          <div className="flex items-center justify-between text-stone-400">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Published</span>
            <CheckCircle className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400 font-serif">{stats?.publishedProducts ?? 0}</div>
          <div className="text-[10px] text-stone-500">Live on Customer Site</div>
        </div>

        <div className="bg-stone-900/90 border border-stone-800 rounded-xl p-4 space-y-1">
          <div className="flex items-center justify-between text-stone-400">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Drafts</span>
            <FileText className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-stone-200 font-serif">{stats?.draftProducts ?? 0}</div>
          <div className="text-[10px] text-stone-500">Hidden from Public</div>
        </div>

        <div className="bg-stone-900/90 border border-stone-800 rounded-xl p-4 space-y-1">
          <div className="flex items-center justify-between text-stone-400">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Categories</span>
            <FolderTree className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-cyan-300 font-serif">{stats?.totalCategories ?? 0}</div>
          <div className="text-[10px] text-stone-500">Ornament Groups</div>
        </div>

        <div className="bg-amber-950/40 border border-amber-800/60 rounded-xl p-4 space-y-1">
          <div className="flex items-center justify-between text-amber-300">
            <span className="text-[11px] font-semibold uppercase tracking-wider">New Enquiries</span>
            <MessageSquare className="w-4 h-4 text-amber-400 animate-bounce" />
          </div>
          <div className="text-2xl font-black text-amber-300 font-serif">{stats?.newEnquiries ?? 0}</div>
          <div className="text-[10px] text-amber-400/80 font-semibold">Requires Attention</div>
        </div>

        <div className="bg-stone-900/90 border border-stone-800 rounded-xl p-4 space-y-1">
          <div className="flex items-center justify-between text-stone-400">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Total Enquiries</span>
            <Clock className="w-4 h-4 text-stone-400" />
          </div>
          <div className="text-2xl font-black text-stone-300 font-serif">{stats?.totalEnquiries ?? 0}</div>
          <div className="text-[10px] text-stone-500">All Time Submissions</div>
        </div>
      </div>

      {/* Split Section: Recent Enquiries + Recent Designs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Recent Enquiries (7 Cols) */}
        <div className="lg:col-span-7 bg-stone-900/80 rounded-2xl border border-stone-800 p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-stone-800 pb-3">
            <div>
              <h2 className="text-base font-bold font-serif text-amber-200">
                Latest Customer Enquiries
              </h2>
              <p className="text-[11px] text-stone-400">Direct requests submitted from the customer portal</p>
            </div>
            <Link
              to="/admin/enquiries"
              className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1"
            >
              <span>Manage All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {recentEnquiries.length > 0 ? (
            <div className="divide-y divide-stone-800/80">
              {recentEnquiries.map((enq) => {
                const cleanPhone = enq.phone?.replace(/\D/g, '') || '';
                return (
                  <div key={enq.id} className="py-3.5 flex items-start justify-between gap-3 text-xs">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-stone-200">{enq.customerName}</span>
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                            enq.status === 'NEW'
                              ? 'bg-amber-900/60 text-amber-300 border border-amber-600/50'
                              : enq.status === 'CONTACTED'
                              ? 'bg-blue-900/60 text-blue-300'
                              : 'bg-emerald-900/60 text-emerald-300'
                          }`}
                        >
                          {enq.status}
                        </span>
                      </div>
                      <div className="text-stone-400 font-mono text-[11px]">{enq.phone}</div>
                      <p className="text-stone-300 line-clamp-1 italic text-[11px]">"{enq.message}"</p>
                      {enq.product && (
                        <div className="text-[10px] text-amber-400/90 font-medium">
                          Design: {enq.product.name}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0 pt-1">
                      <a
                        href={`https://wa.me/91${cleanPhone}?text=${encodeURIComponent(`Namaste ${enq.customerName}! We received your enquiry regarding jewellery at HARI HARA Jewellery Works.`)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 rounded-lg bg-emerald-900/50 hover:bg-emerald-800 text-emerald-300 transition-colors"
                        title="Chat on WhatsApp"
                      >
                        <WhatsAppIcon className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-xs text-stone-500 py-6 text-center">No customer enquiries received yet.</p>
          )}
        </div>

        {/* Recently Added Designs (5 Cols) */}
        <div className="lg:col-span-5 bg-stone-900/80 rounded-2xl border border-stone-800 p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-stone-800 pb-3">
            <div>
              <h2 className="text-base font-bold font-serif text-amber-200">
                Recently Added Jewellery
              </h2>
              <p className="text-[11px] text-stone-400">Inventory catalogue updates</p>
            </div>
            <Link
              to="/admin/products"
              className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {recentProducts.length > 0 ? (
            <div className="divide-y divide-stone-800/80">
              {recentProducts.map((prod) => (
                <div key={prod.id} className="py-3 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3">
                    <img
                      src={getImageUrl(prod.images?.[0]?.imageUrl || DEFAULT_JEWELLERY_IMAGE)}
                      alt={prod.name}
                      className="w-10 h-10 rounded-lg object-cover bg-stone-800 border border-stone-700 shrink-0"
                      onError={handleImageError}
                    />
                    <div className="truncate max-w-[180px] sm:max-w-xs">
                      <div className="font-semibold text-stone-200 truncate">{prod.name}</div>
                      <div className="text-[10px] text-stone-500">
                        {prod.category?.name || 'Jewellery'} • {prod.purity || '22K'}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                        prod.publicationStatus === 'PUBLISHED'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/40'
                          : 'bg-stone-800 text-stone-400'
                      }`}
                    >
                      {prod.publicationStatus}
                    </span>
                    <Link
                      to={`/admin/products/edit/${prod.id}`}
                      className="text-stone-400 hover:text-amber-300 text-[11px] font-semibold"
                    >
                      Edit
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-stone-500 py-6 text-center">No products added yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
