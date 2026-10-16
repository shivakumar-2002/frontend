import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Upload,
  Plus,
  Trash2,
  Image as ImageIcon,
  Save,
  Loader2,
  AlertCircle,
  CheckCircle,
  Sparkles,
} from 'lucide-react';
import { api } from '../../services/api';
import { useShop } from '../../context/ShopContext';
import { validateText, validatePositiveNumber, validateStrictlyPositiveNumber } from '../../utils/validators';
import { getImageUrl, handleImageError, DEFAULT_JEWELLERY_IMAGE } from '../../utils/imageUrl';

export function AdminProductForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { categories, refreshShopData } = useShop();
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [categoryText, setCategoryText] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    categoryId: '',
    categoryName: '',
    description: '',
    metalType: 'GOLD',
    purity: '22K (91.6 KDM)',
    weight: '',
    price: '',
    availabilityStatus: 'IN_STOCK',
    publicationStatus: 'PUBLISHED',
    isFeatured: false,
    isNewArrival: false,
  });

  const [fieldErrors, setFieldErrors] = useState({});
  const [images, setImages] = useState([]); // [{ imageUrl, publicId, altText, sortOrder }]
  const [newImageUrl, setNewImageUrl] = useState('');
  const [uploadingImages, setUploadingImages] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [pageLoading, setPageLoading] = useState(isEdit);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // If edit mode, load product details
  useEffect(() => {
    async function loadProduct() {
      if (!isEdit) return;
      try {
        setPageLoading(true);
        const res = await api.getAdminProductById(id);
        if (res.success && res.data) {
          const p = res.data;
          setFormData({
            name: p.name || '',
            categoryId: p.categoryId || '',
            description: p.description || '',
            metalType: p.metalType || (p.purity?.toLowerCase().includes('silver') ? 'SILVER' : 'GOLD'),
            purity: p.purity || '22K (91.6 KDM)',
            weight: p.weight !== null && p.weight !== undefined ? p.weight : '',
            price: p.price !== null && p.price !== undefined ? p.price : '',
            availabilityStatus: p.availabilityStatus || 'IN_STOCK',
            publicationStatus: p.publicationStatus || 'PUBLISHED',
            isFeatured: Boolean(p.isFeatured),
            isNewArrival: Boolean(p.isNewArrival),
          });
          if (p.category?.name) {
            setCategoryText(p.category.name);
          }
          setImages(p.images || []);
        }
      } catch (err) {
        console.error('Failed to load product for edit:', err);
        setError('Failed to fetch product details.');
      } finally {
        setPageLoading(false);
      }
    }
    loadProduct();
  }, [id, isEdit]);

  // Set default categoryId if not set and categories exist
  useEffect(() => {
    if (!isEdit && !isCustomCategory && !formData.categoryId && categories.length > 0) {
      setFormData((prev) => ({ ...prev, categoryId: categories[0].id, categoryName: categories[0].name }));
      setCategoryText(categories[0].name);
    }
  }, [categories, isEdit, formData.categoryId, isCustomCategory]);

  // Handle file uploads (Cloudinary or local storage)
  const handleFileUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      setUploadingImages(true);
      setError(null);

      const uploadData = new FormData();
      Array.from(files).forEach((file) => {
        uploadData.append('images', file);
      });

      const res = await api.uploadImages(uploadData);
      if (res.success && res.images) {
        const uploadedItems = res.images.map((img, idx) => ({
          imageUrl: img.imageUrl,
          publicId: img.publicId,
          altText: formData.name || 'Jewellery Design',
          sortOrder: images.length + idx,
        }));
        setImages((prev) => [...prev, ...uploadedItems]);
        if (fieldErrors.images) setFieldErrors(prev => ({ ...prev, images: null }));
      }
    } catch (err) {
      setError(err.message || 'Image upload failed.');
    } finally {
      setUploadingImages(false);
      e.target.value = '';
    }
  };

  const handleAddImageUrl = (e) => {
    e.preventDefault();
    if (!newImageUrl.trim()) return;
    setImages((prev) => [
      ...prev,
      {
        imageUrl: newImageUrl.trim(),
        altText: formData.name || 'Jewellery Design',
        sortOrder: prev.length,
      },
    ]);
    setNewImageUrl('');
    if (fieldErrors.images) setFieldErrors(prev => ({ ...prev, images: null }));
  };

  const handleRemoveImage = (index) => {
    setImages((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    const errors = {};
    const nameErr = validateText(formData.name, 'Product title', 3, 150);
    if (nameErr) errors.name = nameErr;

    const rawCategory = isCustomCategory ? categoryText.trim() : formData.categoryId;
    if (!rawCategory) {
      errors.category = 'Please select or write a valid jewellery category.';
    } else if (isCustomCategory) {
      const catErr = validateText(rawCategory, 'Category name', 2, 60);
      if (catErr) errors.category = catErr;
    }

    if (formData.weight !== '' && formData.weight !== null && formData.weight !== undefined) {
      const weightErr = validateStrictlyPositiveNumber(formData.weight, 'Weight', false);
      if (weightErr) errors.weight = weightErr;
    }

    if (formData.price !== '' && formData.price !== null && formData.price !== undefined) {
      const priceErr = validatePositiveNumber(formData.price, 'Price', false);
      if (priceErr) errors.price = priceErr;
    }

    if (images.length === 0) {
      errors.images = 'Please provide at least one product photo (upload or enter URL).';
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setError('Please check and correct the highlighted fields before saving.');
      return;
    }

    setFieldErrors({});

    try {
      setSubmitting(true);

      let finalCategoryId = rawCategory;

      if (isCustomCategory && categoryText.trim()) {
        const typedName = categoryText.trim();
        const matched = categories.find(
          (c) => c.name.toLowerCase() === typedName.toLowerCase() || c.id === typedName
        );
        if (matched) {
          finalCategoryId = matched.id;
        } else {
          try {
            const catRes = await api.createCategory({ name: typedName });
            if (catRes?.success && catRes?.data?.id) {
              finalCategoryId = catRes.data.id;
            }
          } catch (createCatErr) {
            console.warn('Auto createCategory error, passing typed name to backend:', createCatErr);
          }
        }
      }

      const payload = {
        ...formData,
        categoryId: finalCategoryId,
        categoryName: isCustomCategory ? categoryText.trim() : (formData.categoryName || undefined),
        images: images.map((img, idx) => ({
          ...img,
          sortOrder: idx,
        })),
      };

      if (isEdit) {
        await api.updateProduct(id, payload);
        setSuccessMsg('Product updated successfully!');
      } else {
        await api.createProduct(payload);
        setSuccessMsg('New jewellery product created successfully!');
      }

      if (typeof refreshShopData === 'function') {
        refreshShopData();
      }

      setTimeout(() => {
        navigate('/admin/products');
      }, 800);
    } catch (err) {
      setError(err.message || 'Failed to save jewellery design.');
    } finally {
      setSubmitting(false);
    }
  };

  if (pageLoading) {
    return (
      <div className="py-16 text-center text-xs text-stone-400 animate-pulse">
        Loading design details...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <Link
          to="/admin/products"
          className="flex items-center gap-1.5 text-xs text-stone-400 hover:text-amber-300 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Product Catalogue</span>
        </Link>
      </div>

      <div className="bg-stone-900 rounded-2xl border border-stone-800 p-6 sm:p-8 space-y-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-serif text-amber-200">
            {isEdit ? 'Edit Jewellery Design' : 'Add New Jewellery Design'}
          </h1>
          <p className="text-xs text-stone-400 mt-1">
            Fill in the ornament specifications, upload photography, and set catalogue visibility.
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-red-950/60 border border-red-800/60 flex items-center gap-2.5 text-xs text-red-200">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-800/60 flex items-center gap-2.5 text-xs text-emerald-200">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 text-xs">
          {/* Section 1: Basic Information */}
          <div className="space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-amber-400 border-b border-stone-800 pb-2">
              1. Basic Information
            </h2>

            <div>
              <label className="block font-semibold text-stone-300 mb-1">
                Product Title / Ornament Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. 91.6 KDM Royal Bridal Gold Choker & Long Haar Set"
                value={formData.name}
                onChange={(e) => {
                  setFormData({ ...formData, name: e.target.value });
                  if (fieldErrors.name) setFieldErrors(prev => ({ ...prev, name: null }));
                }}
                className={`w-full px-3.5 py-2.5 rounded-lg bg-stone-950 border text-stone-100 focus:outline-none focus:border-amber-500 text-xs transition-colors ${
                  fieldErrors.name ? 'border-red-500 ring-1 ring-red-500/30' : 'border-stone-700'
                }`}
              />
              {fieldErrors.name && (
                <p className="text-red-400 text-[11px] mt-1 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {fieldErrors.name}
                </p>
              )}
            </div>

            {/* Metal Filter Type Selector */}
            <div className="bg-stone-900/80 p-3.5 rounded-xl border border-amber-500/30 space-y-2">
              <label className="block font-bold text-amber-300 text-xs">
                Metal Type * <span className="text-stone-400 font-normal">(Controls whether this item appears under GOLD or SILVER in Customer Portal)</span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      metalType: 'GOLD',
                      purity: prev.purity && prev.purity.toLowerCase().includes('silver') ? '22K (91.6 KDM)' : prev.purity,
                    }))
                  }
                  className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border font-bold text-xs transition-all cursor-pointer ${
                    formData.metalType === 'GOLD'
                      ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white border-amber-400 shadow-md ring-2 ring-amber-400/50'
                      : 'bg-stone-950 text-stone-300 border-stone-700 hover:border-amber-400/50'
                  }`}
                >
                  <span className="text-base">🟡</span>
                  <span>GOLD Ornament</span>
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      metalType: 'SILVER',
                      purity: prev.purity && prev.purity.toLowerCase().includes('91.6') ? '92.5 Pure Silver' : prev.purity,
                    }))
                  }
                  className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border font-bold text-xs transition-all cursor-pointer ${
                    formData.metalType === 'SILVER'
                      ? 'bg-gradient-to-r from-slate-600 to-slate-700 text-white border-slate-300 shadow-md ring-2 ring-slate-400/50'
                      : 'bg-stone-950 text-stone-300 border-stone-700 hover:border-slate-400/50'
                  }`}
                >
                  <span className="text-base">⚪</span>
                  <span>SILVER Article</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block font-semibold text-stone-300 text-xs">
                    Category *
                  </label>
                  <div className="flex items-center gap-1 bg-stone-900 border border-stone-700/80 rounded-md p-0.5">
                    <button
                      type="button"
                      onClick={() => setIsCustomCategory(false)}
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-colors cursor-pointer ${
                        !isCustomCategory
                          ? 'bg-amber-600 text-white shadow-xs'
                          : 'text-stone-400 hover:text-stone-200'
                      }`}
                      title="Select from existing categories dropdown"
                    >
                      📋 Select List
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsCustomCategory(true)}
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-colors cursor-pointer flex items-center gap-1 ${
                        isCustomCategory
                          ? 'bg-amber-600 text-white shadow-xs'
                          : 'text-stone-400 hover:text-stone-200'
                      }`}
                      title="Type or write custom category name"
                    >
                      <span>✍️</span> Type / Write
                    </button>
                  </div>
                </div>

                {isCustomCategory ? (
                  <div className="space-y-1.5">
                    <div className="relative">
                      <input
                        type="text"
                        required
                        list="category-suggestions-list"
                        placeholder="Write / type category (e.g. Silver Mettalu, Baby Bangles, Haram)..."
                        value={categoryText}
                        onChange={(e) => {
                          const val = e.target.value;
                          setCategoryText(val);
                          setFormData((prev) => ({
                            ...prev,
                            categoryId: val,
                            categoryName: val,
                          }));
                          if (fieldErrors.category) setFieldErrors(prev => ({ ...prev, category: null }));
                        }}
                        className={`w-full px-3.5 py-2.5 rounded-lg bg-stone-950 border text-stone-100 placeholder:text-stone-500 focus:outline-none focus:ring-2 text-xs font-medium ${
                          fieldErrors.category
                            ? 'border-red-500 ring-1 ring-red-500/40'
                            : 'border-amber-500/80 focus:ring-amber-500/40'
                        }`}
                      />
                      <datalist id="category-suggestions-list">
                        {categories.map((c) => (
                          <option key={c.id} value={c.name} />
                        ))}
                      </datalist>
                    </div>

                    {/* Quick clickable existing category badges */}
                    {categories.length > 0 && (
                      <div className="flex items-center gap-1.5 flex-wrap text-[11px] text-stone-400 pt-0.5">
                        <span className="text-[10px] text-stone-500">Quick options:</span>
                        {categories.slice(0, 6).map((c) => (
                          <button
                            key={c.id}
                            type="button"
                            onClick={() => {
                              setCategoryText(c.name);
                              setFormData((prev) => ({
                                ...prev,
                                categoryId: c.id,
                                categoryName: c.name,
                              }));
                              if (fieldErrors.category) setFieldErrors(prev => ({ ...prev, category: null }));
                            }}
                            className="px-2 py-0.5 rounded bg-stone-900 border border-stone-700 hover:border-amber-400 text-stone-300 hover:text-amber-200 text-[10px] transition-colors cursor-pointer"
                          >
                            {c.name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <select
                    required
                    value={formData.categoryId}
                    onChange={(e) => {
                      if (e.target.value === '__NEW__') {
                        setIsCustomCategory(true);
                        setCategoryText('');
                      } else {
                        const sel = categories.find((c) => c.id === e.target.value);
                        setFormData({
                          ...formData,
                          categoryId: e.target.value,
                          categoryName: sel ? sel.name : '',
                        });
                        if (sel) setCategoryText(sel.name);
                      }
                      if (fieldErrors.category) setFieldErrors(prev => ({ ...prev, category: null }));
                    }}
                    className={`w-full px-3.5 py-2.5 rounded-lg bg-stone-950 border text-stone-100 focus:outline-none focus:border-amber-500 text-xs cursor-pointer ${
                      fieldErrors.category ? 'border-red-500 ring-1 ring-red-500/40' : 'border-stone-700'
                    }`}
                  >
                    <option value="">Select Category...</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                    <option value="__NEW__" className="text-amber-400 font-bold">
                      ✍️ + Type / Write Custom Category...
                    </option>
                  </select>
                )}
                {fieldErrors.category && (
                  <p className="text-red-400 text-[11px] mt-1 flex items-center gap-1 font-medium">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {fieldErrors.category}
                  </p>
                )}
              </div>

              <div>
                <label className="block font-semibold text-stone-300 mb-1">
                  Metal Purity / Hallmarking Stamp
                </label>
                <input
                  type="text"
                  placeholder="e.g. 22K (91.6 KDM), 18K, 925 Pure Silver"
                  value={formData.purity}
                  onChange={(e) => setFormData({ ...formData, purity: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-stone-950 border border-stone-700 text-stone-100 focus:outline-none focus:border-amber-500 text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-stone-300 mb-1">
                Description / Craftsmanship Details
              </label>
              <textarea
                rows="3"
                placeholder="Describe nakshi work, gemstones, motif details, clasps..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-lg bg-stone-950 border border-stone-700 text-stone-100 focus:outline-none focus:border-amber-500 text-xs resize-none"
              ></textarea>
            </div>
          </div>

          {/* Section 2: Specifications & Pricing */}
          <div className="space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-amber-400 border-b border-stone-800 pb-2">
              2. Weight, Availability & Pricing
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-semibold text-stone-300 mb-1">
                  Approx. Gross Weight (Grams)
                </label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="e.g. 48.50"
                  value={formData.weight}
                  onChange={(e) => {
                    setFormData({ ...formData, weight: e.target.value });
                    if (fieldErrors.weight) setFieldErrors(prev => ({ ...prev, weight: null }));
                  }}
                  className={`w-full px-3.5 py-2.5 rounded-lg bg-stone-950 border text-stone-100 focus:outline-none focus:border-amber-500 text-xs transition-colors ${
                    fieldErrors.weight ? 'border-red-500 ring-1 ring-red-500/30' : 'border-stone-700'
                  }`}
                />
                {fieldErrors.weight && (
                  <p className="text-red-400 text-[11px] mt-1 flex items-center gap-1 font-medium">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {fieldErrors.weight}
                  </p>
                )}
              </div>

              <div>
                <label className="block font-semibold text-stone-300 mb-1">
                  Display Price (₹ Optional)
                </label>
                <input
                  type="number"
                  step="1"
                  placeholder="Leave empty for Market Rate"
                  value={formData.price}
                  onChange={(e) => {
                    setFormData({ ...formData, price: e.target.value });
                    if (fieldErrors.price) setFieldErrors(prev => ({ ...prev, price: null }));
                  }}
                  className={`w-full px-3.5 py-2.5 rounded-lg bg-stone-950 border text-stone-100 focus:outline-none focus:border-amber-500 text-xs transition-colors ${
                    fieldErrors.price ? 'border-red-500 ring-1 ring-red-500/30' : 'border-stone-700'
                  }`}
                />
                {fieldErrors.price && (
                  <p className="text-red-400 text-[11px] mt-1 flex items-center gap-1 font-medium">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {fieldErrors.price}
                  </p>
                )}
              </div>

              <div>
                <label className="block font-semibold text-stone-300 mb-1">
                  Showroom Availability
                </label>
                <select
                  value={formData.availabilityStatus}
                  onChange={(e) => setFormData({ ...formData, availabilityStatus: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-stone-950 border border-stone-700 text-stone-100 focus:outline-none focus:border-amber-500 text-xs"
                >
                  <option value="IN_STOCK">Ready in Showroom</option>
                  <option value="MADE_TO_ORDER">Custom Made to Order</option>
                  <option value="OUT_OF_STOCK">Temporarily Out of Stock</option>
                </select>
              </div>
            </div>

            {/* Visibility & Tags */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div>
                <label className="block font-semibold text-stone-300 mb-1">
                  Catalogue Publication Status *
                </label>
                <select
                  value={formData.publicationStatus}
                  onChange={(e) => setFormData({ ...formData, publicationStatus: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-stone-950 border border-stone-700 text-stone-100 focus:outline-none focus:border-amber-500 text-xs"
                >
                  <option value="PUBLISHED">Published (Visible to Customers)</option>
                  <option value="DRAFT">Draft (Admin View Only)</option>
                </select>
              </div>

              <div className="flex items-center gap-2 pt-6">
                <input
                  type="checkbox"
                  id="isFeatured"
                  checked={formData.isFeatured}
                  onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                  className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 bg-stone-950 border-stone-700"
                />
                <label htmlFor="isFeatured" className="font-semibold text-stone-300 cursor-pointer">
                  Featured on Homepage
                </label>
              </div>

              <div className="flex items-center gap-2 pt-6">
                <input
                  type="checkbox"
                  id="isNewArrival"
                  checked={formData.isNewArrival}
                  onChange={(e) => setFormData({ ...formData, isNewArrival: e.target.checked })}
                  className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 bg-stone-950 border-stone-700"
                />
                <label htmlFor="isNewArrival" className="font-semibold text-stone-300 cursor-pointer">
                  Tag as New Arrival
                </label>
              </div>
            </div>

            <p className="text-[11px] text-amber-300/80 pt-1">
              ✨ All published products are automatically visible across customer collections and category pages (Bridal Sets, Bangles, etc.). Ticking these boxes gives top priority highlights on the Homepage.
            </p>
          </div>

          {/* Section 3: Product Photography */}
          <div className="space-y-4">
            <div className="border-b border-stone-800 pb-2 flex items-center justify-between">
              <h2 className="text-xs font-bold uppercase tracking-wider text-amber-400">
                3. Product Photography ({images.length} Images Added)
              </h2>
              {fieldErrors.images && (
                <span className="text-red-400 text-[11px] font-medium flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> At least 1 image is required
                </span>
              )}
            </div>

            {/* Upload Area */}
            <div className={`p-5 border-2 border-dashed rounded-xl bg-stone-950/60 text-center space-y-3 transition-colors ${
              fieldErrors.images ? 'border-red-500/80 bg-red-950/10' : 'border-stone-700'
            }`}>
              <Upload className="w-8 h-8 text-amber-500 mx-auto" />
              <div>
                <label className="inline-block px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg font-semibold text-xs cursor-pointer shadow-md transition-colors">
                  {uploadingImages ? 'Uploading Images...' : 'Select Photos to Upload'}
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileUpload}
                    disabled={uploadingImages}
                    className="hidden"
                  />
                </label>
                <p className="text-[11px] text-stone-400 mt-2">
                  Supports JPG, PNG, WEBP (stored in Cloudinary / Server Storage)
                </p>
              </div>

              {/* Or paste external image URL */}
              <div className="pt-3 border-t border-stone-800 max-w-md mx-auto flex flex-col sm:flex-row gap-2">
                <input
                  type="url"
                  placeholder="Or paste external image URL..."
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  className="flex-1 px-3 py-2 min-h-[42px] rounded-lg bg-stone-900 border border-stone-700 text-stone-200 text-xs"
                />
                <button
                  type="button"
                  onClick={handleAddImageUrl}
                  className="px-4 py-2 min-h-[42px] bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-lg text-xs font-semibold cursor-pointer shrink-0"
                >
                  Add URL
                </button>
              </div>
            </div>

            {/* Thumbnails Grid */}
            {images.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
                {images.map((img, idx) => (
                  <div
                    key={idx}
                    className="relative group rounded-xl overflow-hidden aspect-square bg-stone-950 border border-stone-800 shadow-sm"
                  >
                    <img
                      src={getImageUrl(img.imageUrl)}
                      alt={img.altText || `Product Image ${idx + 1}`}
                      className="w-full h-full object-cover"
                      onError={handleImageError}
                    />

                    {/* Primary badge */}
                    {idx === 0 && (
                      <span className="absolute top-2 left-2 bg-amber-500 text-stone-950 text-[9px] font-black px-1.5 py-0.5 rounded shadow-xs">
                        COVER
                      </span>
                    )}

                    {/* Remove button - visible by default on mobile/touch, hover on desktop */}
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="absolute top-2 right-2 min-w-[36px] min-h-[36px] p-2 bg-red-950/90 hover:bg-red-900 text-red-200 rounded-lg opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer shadow-md"
                      title="Remove image"
                      aria-label="Remove image"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="pt-6 border-t border-stone-800 flex items-center justify-end gap-3">
            <Link
              to="/admin/products"
              className="px-5 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 font-semibold text-xs transition-colors"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 hover:from-amber-500 hover:to-amber-700 text-white font-bold text-xs shadow-lg transition-all cursor-pointer disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving to Database...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>{isEdit ? 'Update Jewellery Design' : 'Publish to Catalogue'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
