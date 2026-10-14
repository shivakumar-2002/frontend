import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  PlusCircle,
  Search,
  Filter,
  Edit2,
  Trash2,
  Eye,
  CheckCircle,
  FileText,
  AlertTriangle,
  Sparkles,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';
import { api } from '../../services/api';
import { useShop } from '../../context/ShopContext';

export function AdminProducts() {
  const { categories } = useShop();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search & Filter
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');

  // Deletion modal state
  const [productToDelete, setProductToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.getAdminProducts({
        search: searchTerm,
        category: selectedCategory,
        status: selectedStatus,
      });
      if (res.success && res.data) {
        setProducts(res.data);
      }
    } catch (err) {
      console.error('Failed to load products:', err);
      setError('Failed to fetch jewellery products list.');
    } finally {
      setLoading(false);
    }
  }, [searchTerm, selectedCategory, selectedStatus]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const handleToggleStatus = async (product) => {
    const nextStatus = product.publicationStatus === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED';
    try {
      await api.updateProductStatus(product.id, nextStatus);
      setProducts((prev) =>
        prev.map((p) => (p.id === product.id ? { ...p, publicationStatus: nextStatus } : p))
      );
    } catch (err) {
      alert(`Failed to update status: ${err.message}`);
    }
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;
    try {
      setDeleting(true);
      await api.deleteProduct(productToDelete.id);
      setProducts((prev) => prev.filter((p) => p.id !== productToDelete.id));
      setProductToDelete(null);
    } catch (err) {
      alert(`Failed to delete product: ${err.message}`);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-amber-200">
            Jewellery Products Management
          </h1>
          <p className="text-xs text-stone-400 mt-1">
            Manage your gold and silver inventory catalogue, publication status, and specifications.
          </p>
        </div>

        <Link
          to="/admin/products/new"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-semibold text-xs shadow-md transition-all self-start sm:self-auto cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add New Design</span>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-stone-900 rounded-xl p-4 border border-stone-800 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
          <input
            type="text"
            placeholder="Search by title, purity..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-stone-950 border border-stone-700 text-stone-200 focus:outline-none focus:border-amber-500"
          />
        </div>

        <div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-stone-950 border border-stone-700 text-stone-200 focus:outline-none focus:border-amber-500"
          >
            <option value="ALL">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-stone-950 border border-stone-700 text-stone-200 focus:outline-none focus:border-amber-500"
          >
            <option value="ALL">All Publication States</option>
            <option value="PUBLISHED">Published Only</option>
            <option value="DRAFT">Drafts Only</option>
          </select>
        </div>
      </div>

      {/* Product List Table */}
      <div className="bg-stone-900 rounded-2xl border border-stone-800 overflow-hidden shadow-xl">
        {loading ? (
          <div className="p-8 text-center text-xs text-stone-400">Loading jewellery inventory...</div>
        ) : error ? (
          <div className="p-8 text-center text-xs text-red-400">{error}</div>
        ) : products.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-950 text-stone-400 font-semibold uppercase tracking-wider text-[10px] border-b border-stone-800">
                <tr>
                  <th className="py-3 px-4">Design</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Purity & Grams</th>
                  <th className="py-3 px-4">Price</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-800 text-stone-300">
                {products.map((prod) => (
                  <tr key={prod.id} className="hover:bg-stone-800/40 transition-colors">
                    {/* Design Thumbnail + Name */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={prod.images?.[0]?.imageUrl || '/luxury-hero-banner.jpg'}
                          alt={prod.name}
                          className="w-12 h-12 rounded-lg object-cover bg-stone-950 border border-stone-800 shrink-0"
                        />
                        <div className="max-w-xs">
                          <span className="font-bold text-stone-100 block line-clamp-1">{prod.name}</span>
                          <div className="flex items-center gap-2 mt-1 text-[10px] flex-wrap">
                            {prod.metalType === 'SILVER' ? (
                              <span className="px-1.5 py-0.5 rounded font-bold bg-slate-800 text-slate-200 border border-slate-600">
                                ⚪ SILVER
                              </span>
                            ) : (
                              <span className="px-1.5 py-0.5 rounded font-bold bg-amber-950 text-amber-300 border border-amber-800/60">
                                🟡 GOLD
                              </span>
                            )}
                            {prod.isFeatured && (
                              <span className="text-amber-400 font-semibold flex items-center gap-0.5">
                                <Sparkles className="w-2.5 h-2.5" /> Featured
                              </span>
                            )}
                            {prod.isNewArrival && (
                              <span className="text-red-400 font-semibold">New Arrival</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3 px-4 text-stone-400">
                      {prod.category?.name || '—'}
                    </td>

                    {/* Purity & Weight */}
                    <td className="py-3 px-4">
                      <div className="font-medium text-stone-200">{prod.purity || '91.6 KDM'}</div>
                      <div className="text-[11px] text-stone-400">
                        {prod.weight ? `${prod.weight}g` : 'Custom'}
                      </div>
                    </td>

                    {/* Price */}
                    <td className="py-3 px-4 font-mono">
                      {prod.price ? `₹${prod.price.toLocaleString('en-IN')}` : 'Market Rate'}
                    </td>

                    {/* Publication Status Toggle Button */}
                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleToggleStatus(prod)}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase transition-colors cursor-pointer ${
                          prod.publicationStatus === 'PUBLISHED'
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/60 hover:bg-emerald-900/60'
                            : 'bg-stone-800 text-stone-400 hover:bg-stone-700'
                        }`}
                        title="Click to toggle publication"
                      >
                        {prod.publicationStatus === 'PUBLISHED' ? '✓ Published' : 'Draft'}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/product/${prod.id}`}
                          target="_blank"
                          className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-white"
                          title="Preview on Public Website"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </Link>

                        <Link
                          to={`/admin/products/edit/${prod.id}`}
                          className="p-1.5 rounded-lg bg-amber-950/60 hover:bg-amber-900 text-amber-300 border border-amber-800/50"
                          title="Edit Details"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </Link>

                        <button
                          onClick={() => setProductToDelete(prod)}
                          className="p-1.5 rounded-lg bg-red-950/60 hover:bg-red-900 text-red-300 border border-red-800/50 cursor-pointer"
                          title="Delete Product"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center text-xs text-stone-500 space-y-2">
            <p>No jewellery products found matching current criteria.</p>
            <Link to="/admin/products/new" className="text-amber-400 hover:underline font-semibold block">
              + Add your first design
            </Link>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {productToDelete && (
        <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-stone-900 rounded-2xl max-w-sm w-full p-6 border border-red-800/60 shadow-2xl space-y-4 text-xs">
            <div className="w-12 h-12 rounded-full bg-red-950 text-red-400 mx-auto flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-base font-bold text-stone-100 font-serif">Confirm Deletion</h3>
              <p className="text-stone-400">
                Are you sure you want to permanently delete{' '}
                <strong className="text-amber-300">"{productToDelete.name}"</strong>? This will remove all associated images.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => setProductToDelete(null)}
                className="py-2.5 px-4 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleting}
                className="py-2.5 px-4 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold cursor-pointer disabled:opacity-50"
              >
                {deleting ? 'Deleting...' : 'Delete Design'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
