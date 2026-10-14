import React, { useState, useEffect } from 'react';
import {
  FolderTree,
  Plus,
  Edit2,
  Trash2,
  X,
  Save,
  AlertCircle,
  CheckCircle,
  Gem,
  Upload,
  Image as ImageIcon,
  Loader2,
  Star,
} from 'lucide-react';
import { api } from '../../services/api';
import { useShop } from '../../context/ShopContext';
import { validateText } from '../../utils/validators';

export function AdminCategories() {
  const { refreshShopData } = useShop();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    imageUrl: '',
    isActive: true,
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [modalError, setModalError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingImage(true);
      const uploadData = new FormData();
      uploadData.append('images', file);
      const res = await api.uploadImages(uploadData);
      if (res?.success && res.images?.[0]?.imageUrl) {
        setFormData((prev) => ({ ...prev, imageUrl: res.images[0].imageUrl }));
      }
    } catch (err) {
      alert(`Failed to upload photo: ${err.message || 'Upload error'}`);
    } finally {
      setUploadingImage(false);
    }
  };

  const loadCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.getAdminCategories();
      if (res.success && res.data) {
        setCategories(res.data);
      }
    } catch (err) {
      console.error('Failed to load categories:', err);
      setError('Failed to fetch categories list.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const openAddModal = () => {
    setEditingCategory(null);
    setFormData({
      name: '',
      description: '',
      imageUrl: '',
      isActive: true,
    });
    setFieldErrors({});
    setModalError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (cat) => {
    setEditingCategory(cat);
    setFormData({
      name: cat.name,
      description: cat.description || '',
      imageUrl: cat.imageUrl || '',
      isActive: cat.isActive,
    });
    setFieldErrors({});
    setModalError(null);
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setModalError(null);

    const nameErr = validateText(formData.name, 'Category name', 2, 60);
    if (nameErr) {
      setFieldErrors({ name: nameErr });
      return;
    }
    setFieldErrors({});

    try {
      setSaving(true);
      if (editingCategory) {
        await api.updateCategory(editingCategory.id, formData);
      } else {
        await api.createCategory(formData);
      }
      setIsModalOpen(false);
      loadCategories();
      refreshShopData();
    } catch (err) {
      setModalError(`Error saving category: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (cat) => {
    if (cat.productCount > 0) {
      alert(
        `Cannot delete "${cat.name}" because ${cat.productCount} jewellery product(s) are currently assigned to it. Please reassign or delete the products first.`
      );
      return;
    }

    if (!window.confirm(`Are you sure you want to delete category "${cat.name}"?`)) {
      return;
    }

    try {
      await api.deleteCategory(cat.id);
      loadCategories();
      refreshShopData();
    } catch (err) {
      alert(`Failed to delete category: ${err.message}`);
    }
  };

  const getCategoryFallbackPhoto = (cat) => {
    if (cat?.imageUrl && !cat.imageUrl.includes('unsplash.com')) return cat.imageUrl;
    const s = (cat?.slug || '').toLowerCase();
    if (s.includes('ring')) return '/category-gold-rings.jpg';
    if (s.includes('kammal') || s.includes('jhumka')) return '/category-kammalbuttas.jpg';
    if (s.includes('top') || s.includes('pogulu')) return '/category-ear-tops.jpg';
    if (s.includes('chain') || s.includes('locket')) return '/category-chains-lockets.jpg';
    if (s.includes('bangle') || s.includes('kada')) return '/category-bangles-kadas.jpg';
    if (s.includes('necklace') || s.includes('haram')) return '/category-necklaces-harams.jpg';
    return '/category-gold-rings.jpg';
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-amber-200">
            Jewellery Categories & Home Display
          </h1>
          <p className="text-xs text-stone-400 mt-1">
            Top 6 gold categories are fixed for display on the Home page. Click Edit on any slot to upload new design photos.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-semibold text-xs shadow-md transition-all self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Category</span>
        </button>
      </div>

      {/* Info Notice about Home Display */}
      <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-500/30 text-amber-200 text-xs flex items-start gap-2.5">
        <Star className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong>Home Page 6 Display Slots:</strong> The top 6 categories marked below are displayed on the Home page. Click <strong>Edit Photo</strong> on any card to upload a new design photo directly!
        </div>
      </div>

      {/* Categories Grid */}
      {loading ? (
        <div className="text-center py-12 text-xs text-stone-400">Loading categories...</div>
      ) : error ? (
        <div className="text-center py-12 text-xs text-red-400">{error}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {categories.map((cat, idx) => {
            const isHomeSlot = idx < 6 && !cat.name?.toLowerCase().includes('silver');
            return (
              <div
                key={cat.id}
                className={`bg-stone-900 rounded-2xl border p-5 space-y-4 flex flex-col justify-between shadow-lg transition-all ${
                  isHomeSlot ? 'border-amber-500/50 ring-1 ring-amber-500/20' : 'border-stone-800'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={getCategoryFallbackPhoto(cat)}
                        alt={cat.name}
                        className="w-12 h-12 rounded-lg object-cover bg-stone-950 border border-stone-800 shrink-0"
                      />
                      <div>
                        <h3 className="font-bold text-sm text-stone-100 font-serif">{cat.name}</h3>
                        <span className="text-[10px] text-stone-500 font-mono">/collections/{cat.slug}</span>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1">
                      {isHomeSlot && (
                        <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-500/40 flex items-center gap-1">
                          <Star className="w-2.5 h-2.5 text-amber-400" /> Slot #{idx + 1}
                        </span>
                      )}
                      <span
                        className={`text-[9px] font-bold px-2 py-0.5 rounded ${
                          cat.isActive
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/40'
                            : 'bg-stone-800 text-stone-400'
                        }`}
                      >
                        {cat.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>

                {cat.description && (
                  <p className="text-xs text-stone-400 line-clamp-2 leading-relaxed">
                    {cat.description}
                  </p>
                )}
              </div>

              <div className="pt-4 border-t border-stone-800 flex items-center justify-between text-xs">
                <span className="text-stone-400 flex items-center gap-1.5 font-medium text-[11px]">
                  <Gem className="w-3.5 h-3.5 text-amber-500" />
                  {cat.productCount} Design{cat.productCount !== 1 ? 's' : ''}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditModal(cat)}
                    className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300"
                    title="Edit Category"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(cat)}
                    className="p-1.5 rounded-lg bg-red-950/60 hover:bg-red-900 text-red-300 border border-red-800/40"
                    title="Delete Category"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      )}

      {/* Add / Edit Category Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-stone-900 rounded-2xl max-w-md w-full p-6 border border-stone-800 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <h3 className="text-base font-bold text-amber-200 font-serif">
                {editingCategory ? 'Edit Category' : 'Create New Category'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-stone-400 hover:text-stone-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {modalError && (
              <div className="p-3 rounded-lg bg-red-950/60 border border-red-800/60 flex items-center gap-2 text-red-200 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                <span>{modalError}</span>
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block font-semibold text-stone-300 mb-1">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Antique Chokers / Guttapusalu"
                  value={formData.name}
                  onChange={(e) => {
                    setFormData({ ...formData, name: e.target.value });
                    if (fieldErrors.name) setFieldErrors(prev => ({ ...prev, name: null }));
                  }}
                  className={`w-full px-3 py-2 rounded-lg bg-stone-950 border text-stone-100 focus:outline-none focus:border-amber-500 transition-colors ${
                    fieldErrors.name ? 'border-red-500 ring-1 ring-red-500/40' : 'border-stone-700'
                  }`}
                />
                {fieldErrors.name && (
                  <p className="text-red-400 text-[11px] mt-1 flex items-center gap-1 font-medium">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {fieldErrors.name}
                  </p>
                )}
              </div>

              <div>
                <label className="block font-semibold text-stone-300 mb-1">
                  Description
                </label>
                <textarea
                  rows="2"
                  placeholder="Short description displayed on collections page..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-stone-950 border border-stone-700 text-stone-100 focus:outline-none focus:border-amber-500 resize-none"
                ></textarea>
              </div>

              <div>
                <label className="block font-semibold text-stone-300 mb-1">
                  Design Photo for Home & Catalogue
                </label>

                {/* Image Preview */}
                {formData.imageUrl && (
                  <div className="relative aspect-video rounded-xl overflow-hidden mb-2.5 bg-stone-950 border border-amber-500/30">
                    <img
                      src={formData.imageUrl}
                      alt="Category Preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, imageUrl: '' })}
                      className="absolute top-2 right-2 p-1.5 rounded-full bg-red-950/80 hover:bg-red-800 text-white text-xs cursor-pointer shadow-md"
                      title="Remove image"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                {/* Upload Button */}
                <label className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-amber-950/40 hover:bg-amber-900/60 text-amber-300 hover:text-amber-200 border border-amber-600/50 text-xs font-semibold cursor-pointer transition-all">
                  {uploadingImage ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                      <span>Uploading Design Photo...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 text-amber-400" />
                      <span>Upload New Photo From Computer / Phone</span>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    disabled={uploadingImage}
                    className="hidden"
                  />
                </label>

                <div className="mt-2">
                  <span className="text-[10px] text-stone-500 block mb-1">Or image path / URL:</span>
                  <input
                    type="text"
                    placeholder="e.g. /category-gold-rings.jpg or image URL"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-stone-950 border border-stone-700 text-stone-100 focus:outline-none focus:border-amber-500 text-xs"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isActiveCat"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4 rounded text-amber-600 bg-stone-950 border-stone-700"
                />
                <label htmlFor="isActiveCat" className="font-semibold text-stone-300">
                  Visible in Customer Navigation & Collections
                </label>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-stone-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="py-2.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="py-2.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-bold cursor-pointer disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
