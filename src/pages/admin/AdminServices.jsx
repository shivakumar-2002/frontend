import React, { useState, useEffect } from 'react';
import {
  Wrench,
  Plus,
  Edit2,
  Trash2,
  X,
  CheckCircle,
  AlertCircle,
  Save,
  Sparkles,
} from 'lucide-react';
import { api } from '../../services/api';
import { useShop } from '../../context/ShopContext';
import { validateText } from '../../utils/validators';
import { DEFAULT_SERVICES } from '../customer/Services';

export function AdminServices() {
  const { refreshShopData } = useShop();

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    iconName: 'Sparkles',
    imageUrl: '',
    isPublished: true,
    sortOrder: 0,
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [modalError, setModalError] = useState(null);
  const [saving, setSaving] = useState(false);

  const loadServices = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.getAdminServices();
      if (res.success && res.data) {
        setServices(res.data);
      }
    } catch (err) {
      console.error('Failed to load services:', err);
      setError('Failed to fetch services list.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  const openAddModal = () => {
    setEditingService(null);
    setFormData({
      title: '',
      description: '',
      iconName: 'Sparkles',
      imageUrl: '',
      isPublished: true,
      sortOrder: services.length + 1,
    });
    setFieldErrors({});
    setModalError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (srv) => {
    setEditingService(srv);
    setFormData({
      title: srv.title,
      description: srv.description,
      iconName: srv.iconName || 'Sparkles',
      imageUrl: srv.imageUrl || '',
      isPublished: srv.isPublished,
      sortOrder: srv.sortOrder || 0,
    });
    setFieldErrors({});
    setModalError(null);
    setIsModalOpen(true);
  };

  const handleToggleStatus = async (srv) => {
    try {
      const nextStatus = !srv.isPublished;
      await api.updateServiceStatus(srv.id, nextStatus);
      setServices((prev) =>
        prev.map((s) => (s.id === srv.id ? { ...s, isPublished: nextStatus } : s))
      );
      refreshShopData();
    } catch (err) {
      alert(`Failed to update status: ${err.message}`);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setModalError(null);

    const errors = {};
    const titleErr = validateText(formData.title, 'Service title', 3, 80);
    if (titleErr) errors.title = titleErr;

    const descErr = validateText(formData.description, 'Service description', 10, 1000);
    if (descErr) errors.description = descErr;

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});

    try {
      setSaving(true);
      if (editingService) {
        await api.updateService(editingService.id, formData);
      } else {
        await api.createService(formData);
      }
      setIsModalOpen(false);
      loadServices();
      refreshShopData();
    } catch (err) {
      setModalError(`Error saving service: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (srv) => {
    if (!window.confirm(`Are you sure you want to delete service "${srv.title}"?`)) {
      return;
    }

    try {
      await api.deleteService(srv.id);
      loadServices();
      refreshShopData();
    } catch (err) {
      alert(`Failed to delete service: ${err.message}`);
    }
  };

  const handleSeedDefaultServices = async () => {
    try {
      setLoading(true);
      for (const s of DEFAULT_SERVICES) {
        await api.createService({
          title: s.title,
          description: s.description,
          iconName: s.iconName,
          imageUrl: s.imageUrl,
          isPublished: true,
          sortOrder: s.sortOrder,
        });
      }
      await loadServices();
      refreshShopData();
    } catch (err) {
      alert(`Failed to load default services: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-amber-200">
            Showroom Services Management
          </h1>
          <p className="text-xs text-stone-400 mt-1">
            Manage services displayed in the customer portal (Old Gold Exchange, Custom CAD, Repairs).
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={openAddModal}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-semibold text-xs shadow-md transition-all self-start sm:self-auto cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Service</span>
          </button>
        </div>
      </div>

      {/* Services Grid */}
      {loading ? (
        <div className="text-center py-12 text-xs text-stone-400">Loading services...</div>
      ) : error ? (
        <div className="text-center py-12 text-xs text-red-400">{error}</div>
      ) : services.length === 0 ? (
        <div className="bg-stone-900 rounded-2xl border border-stone-800 p-8 text-center space-y-4">
          <Wrench className="w-10 h-10 text-amber-500 mx-auto" />
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-stone-200">No Custom Services in Database</h3>
            <p className="text-xs text-stone-400 max-w-md mx-auto">
              The customer portal is currently active and displaying the 6 authentic master craft services (Baby Ear Pogulu, Pure Silver Mettalu, Pusthela Thadu, etc.). You can click below to store them directly into the database so you can edit or customize them.
            </p>
          </div>
          <button
            onClick={handleSeedDefaultServices}
            className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs shadow-md transition-colors cursor-pointer"
          >
            Save 6 Master Craft Services to Database
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((srv) => (
            <div
              key={srv.id}
              className="bg-stone-900 rounded-2xl border border-stone-800 p-5 space-y-4 flex flex-col justify-between shadow-lg"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-lg bg-amber-950 text-amber-400 flex items-center justify-center font-bold border border-amber-800/40">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <h3 className="font-bold text-sm text-stone-100 font-serif">{srv.title}</h3>
                  </div>

                  <button
                    onClick={() => handleToggleStatus(srv)}
                    className={`text-[9px] font-bold px-2 py-0.5 rounded cursor-pointer ${
                      srv.isPublished
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/40'
                        : 'bg-stone-800 text-stone-400'
                    }`}
                  >
                    {srv.isPublished ? '✓ Published' : 'Draft'}
                  </button>
                </div>

                <p className="text-xs text-stone-400 leading-relaxed">
                  {srv.description}
                </p>
              </div>

              <div className="pt-4 border-t border-stone-800 flex items-center justify-between text-xs">
                <span className="text-[11px] text-stone-500">
                  Icon: {srv.iconName || 'Default'}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditModal(srv)}
                    className="min-w-[36px] min-h-[36px] flex items-center justify-center p-2 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white transition-colors cursor-pointer"
                    title="Edit Service"
                    aria-label="Edit Service"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(srv)}
                    className="min-w-[36px] min-h-[36px] flex items-center justify-center p-2 rounded-lg bg-red-950/60 hover:bg-red-900 text-red-300 border border-red-800/40 transition-colors cursor-pointer"
                    title="Delete Service"
                    aria-label="Delete Service"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Service Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-stone-900 rounded-2xl max-w-md w-full p-6 border border-stone-800 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <h3 className="text-base font-bold text-amber-200 font-serif">
                {editingService ? 'Edit Service' : 'Add New Service'}
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
                  Service Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Old Gold & Silver Exchange"
                  value={formData.title}
                  onChange={(e) => {
                    setFormData({ ...formData, title: e.target.value });
                    if (fieldErrors.title) setFieldErrors(prev => ({ ...prev, title: null }));
                  }}
                  className={`w-full px-3 py-2 rounded-lg bg-stone-950 border text-stone-100 focus:outline-none focus:border-amber-500 transition-colors ${
                    fieldErrors.title ? 'border-red-500 ring-1 ring-red-500/40' : 'border-stone-700'
                  }`}
                />
                {fieldErrors.title && (
                  <p className="text-red-400 text-[11px] mt-1 flex items-center gap-1 font-medium">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {fieldErrors.title}
                  </p>
                )}
              </div>

              <div>
                <label className="block font-semibold text-stone-300 mb-1">
                  Service Description *
                </label>
                <textarea
                  rows="3"
                  required
                  placeholder="Detailed description of process, testing, and benefits..."
                  value={formData.description}
                  onChange={(e) => {
                    setFormData({ ...formData, description: e.target.value });
                    if (fieldErrors.description) setFieldErrors(prev => ({ ...prev, description: null }));
                  }}
                  className={`w-full px-3 py-2 rounded-lg bg-stone-950 border text-stone-100 focus:outline-none focus:border-amber-500 resize-none transition-colors ${
                    fieldErrors.description ? 'border-red-500 ring-1 ring-red-500/40' : 'border-stone-700'
                  }`}
                ></textarea>
                {fieldErrors.description && (
                  <p className="text-red-400 text-[11px] mt-1 flex items-center gap-1 font-medium">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {fieldErrors.description}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-300 mb-1">
                    Icon Style
                  </label>
                  <select
                    value={formData.iconName}
                    onChange={(e) => setFormData({ ...formData, iconName: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-stone-950 border border-stone-700 text-stone-100 focus:outline-none focus:border-amber-500"
                  >
                    <option value="RefreshCw">Refresh / Exchange</option>
                    <option value="Palette">Palette / Custom CAD</option>
                    <option value="Wrench">Wrench / Repair</option>
                    <option value="ShieldCheck">Shield / Hallmark</option>
                    <option value="Gift">Gift / Silver</option>
                    <option value="Sparkles">Sparkles / Default</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-stone-300 mb-1">
                    Sort Order
                  </label>
                  <input
                    type="number"
                    value={formData.sortOrder}
                    onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value, 10) || 0 })}
                    className="w-full px-3 py-2 rounded-lg bg-stone-950 border border-stone-700 text-stone-100 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-300 mb-1">
                  Image URL (Optional)
                </label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-stone-950 border border-stone-700 text-stone-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isPublishedSrv"
                  checked={formData.isPublished}
                  onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                  className="w-4 h-4 rounded text-amber-600 bg-stone-950 border-stone-700"
                />
                <label htmlFor="isPublishedSrv" className="font-semibold text-stone-300">
                  Publish to Customer Portal Immediately
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
                  {saving ? 'Saving...' : 'Save Service'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
