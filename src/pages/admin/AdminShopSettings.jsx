import React, { useState, useEffect } from 'react';
import {
  Settings,
  Save,
  CheckCircle,
  AlertCircle,
  Loader2,
  Sparkles,
  MapPin,
  Phone,
  Clock,
  Coins,
} from 'lucide-react';
import { api } from '../../services/api';
import { useShop } from '../../context/ShopContext';
import { validatePhone, validateEmail, validateText, validateStrictlyPositiveNumber } from '../../utils/validators';

export function AdminShopSettings() {
  const { refreshShopData } = useShop();

  const [formData, setFormData] = useState({
    shopName: '',
    tagline: '',
    address: '',
    phone: '',
    whatsappNumber: '',
    email: '',
    openingHours: '',
    mapUrl: '',
    mapEmbedUrl: '',
    heroTitle: '',
    heroDescription: '',
    heroImageUrl: '',
    aboutText: '',
    footerText: '',
    hallmarkInfo: '',
    goldRate22k: 7250,
    goldRate24k: 7910,
    silverRate1g: 98,
  });

  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchSettings() {
      try {
        setLoading(true);
        const res = await api.getAdminShopSettings();
        if (res.success && res.data) {
          const s = res.data;
          setFormData({
            shopName: s.shopName || '',
            tagline: s.tagline || '',
            address: s.address || '',
            phone: s.phone || '',
            whatsappNumber: s.whatsappNumber || '',
            email: s.email || '',
            openingHours: s.openingHours || '',
            mapUrl: s.mapUrl || '',
            mapEmbedUrl: s.mapEmbedUrl || '',
            heroTitle: s.heroTitle || '',
            heroDescription: s.heroDescription || '',
            heroImageUrl: s.heroImageUrl || '',
            aboutText: s.aboutText || '',
            footerText: s.footerText || '',
            hallmarkInfo: s.hallmarkInfo || '',
            goldRate22k: s.goldRate22k || 7250,
            goldRate24k: s.goldRate24k || 7910,
            silverRate1g: s.silverRate1g || 98,
          });
        }
      } catch (err) {
        console.error('Failed to load shop settings:', err);
        setError('Failed to fetch settings from server.');
      } finally {
        setLoading(false);
      }
    }
    fetchSettings();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    const errors = {};
    const rate22kErr = validateStrictlyPositiveNumber(formData.goldRate22k, '22K Gold Rate', true);
    if (rate22kErr) errors.goldRate22k = rate22kErr;

    const rate24kErr = validateStrictlyPositiveNumber(formData.goldRate24k, '24K Gold Rate', true);
    if (rate24kErr) errors.goldRate24k = rate24kErr;

    const silverErr = validateStrictlyPositiveNumber(formData.silverRate1g, 'Silver Rate', true);
    if (silverErr) errors.silverRate1g = silverErr;

    const shopNameErr = validateText(formData.shopName, 'Shop Name', 3, 100);
    if (shopNameErr) errors.shopName = shopNameErr;

    const phoneErr = validateText(formData.phone, 'Phone number', 8, 80);
    if (phoneErr) errors.phone = phoneErr;

    const waErr = validatePhone(formData.whatsappNumber);
    if (waErr) errors.whatsappNumber = waErr;

    if (formData.email) {
      const emailErr = validateEmail(formData.email);
      if (emailErr) errors.email = emailErr;
    }

    const addrErr = validateText(formData.address, 'Showroom address', 10, 300);
    if (addrErr) errors.address = addrErr;

    const hoursErr = validateText(formData.openingHours, 'Showroom hours', 5, 200);
    if (hoursErr) errors.openingHours = hoursErr;

    const heroTitleErr = validateText(formData.heroTitle, 'Hero headline', 5, 120);
    if (heroTitleErr) errors.heroTitle = heroTitleErr;

    const heroDescErr = validateText(formData.heroDescription, 'Hero description', 10, 500);
    if (heroDescErr) errors.heroDescription = heroDescErr;

    const aboutErr = validateText(formData.aboutText, 'Workshop Heritage / About us text', 20, 3000);
    if (aboutErr) errors.aboutText = aboutErr;

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setError('Please check and correct the highlighted fields before saving.');
      return;
    }

    setFieldErrors({});
    setSaving(true);

    try {
      await api.updateShopSettings(formData);
      setSuccessMsg('Shop settings updated successfully! Customer portal updated in real-time.');
      refreshShopData();
    } catch (err) {
      setError(err.message || 'Failed to update shop settings.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-xs text-stone-400">Loading shop settings...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold font-serif text-amber-200">
          Shop Settings & Store Information
        </h1>
        <p className="text-xs text-stone-400 mt-1">
          Customize showroom details, banner imagery, live bullion rates, and contact numbers without code changes.
        </p>
      </div>

      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-800/60 flex items-center gap-3 text-xs text-emerald-200">
          <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-red-950/60 border border-red-800/60 flex items-center gap-3 text-xs text-red-200">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-stone-900 rounded-2xl border border-stone-800 p-6 sm:p-8 space-y-8 text-xs">
        {/* Section 1: Daily Gold & Silver Bullion Ticker */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b border-stone-800 pb-2 text-amber-400 font-bold uppercase tracking-wider">
            <Coins className="w-4 h-4" />
            <span>1. Daily Bullion Rates Ticker (₹ Per Gram)</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold text-stone-300 mb-1">
                22K Gold Rate (₹ / Gram) *
              </label>
              <input
                type="number"
                step="1"
                required
                value={formData.goldRate22k}
                onChange={(e) => {
                  setFormData({ ...formData, goldRate22k: e.target.value });
                  if (fieldErrors.goldRate22k) setFieldErrors(prev => ({ ...prev, goldRate22k: null }));
                }}
                className={`w-full px-3 py-2 rounded-lg bg-stone-950 border font-mono font-bold focus:outline-none focus:border-amber-500 text-xs transition-colors ${
                  fieldErrors.goldRate22k ? 'border-red-500 ring-1 ring-red-500/40 text-red-300' : 'border-stone-700 text-amber-300'
                }`}
              />
              {fieldErrors.goldRate22k && (
                <p className="text-red-400 text-[11px] mt-1 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {fieldErrors.goldRate22k}
                </p>
              )}
            </div>

            <div>
              <label className="block font-semibold text-stone-300 mb-1">
                24K Gold Rate (₹ / Gram) *
              </label>
              <input
                type="number"
                step="1"
                required
                value={formData.goldRate24k}
                onChange={(e) => {
                  setFormData({ ...formData, goldRate24k: e.target.value });
                  if (fieldErrors.goldRate24k) setFieldErrors(prev => ({ ...prev, goldRate24k: null }));
                }}
                className={`w-full px-3 py-2 rounded-lg bg-stone-950 border font-mono font-bold focus:outline-none focus:border-amber-500 text-xs transition-colors ${
                  fieldErrors.goldRate24k ? 'border-red-500 ring-1 ring-red-500/40 text-red-300' : 'border-stone-700 text-amber-300'
                }`}
              />
              {fieldErrors.goldRate24k && (
                <p className="text-red-400 text-[11px] mt-1 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {fieldErrors.goldRate24k}
                </p>
              )}
            </div>

            <div>
              <label className="block font-semibold text-stone-300 mb-1">
                Pure Silver Rate (₹ / Gram) *
              </label>
              <input
                type="number"
                step="0.1"
                required
                value={formData.silverRate1g}
                onChange={(e) => {
                  setFormData({ ...formData, silverRate1g: e.target.value });
                  if (fieldErrors.silverRate1g) setFieldErrors(prev => ({ ...prev, silverRate1g: null }));
                }}
                className={`w-full px-3 py-2 rounded-lg bg-stone-950 border font-mono font-bold focus:outline-none focus:border-amber-500 text-xs transition-colors ${
                  fieldErrors.silverRate1g ? 'border-red-500 ring-1 ring-red-500/40 text-red-300' : 'border-stone-700 text-amber-300'
                }`}
              />
              {fieldErrors.silverRate1g && (
                <p className="text-red-400 text-[11px] mt-1 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {fieldErrors.silverRate1g}
                </p>
              )}
            </div>
          </div>
          <p className="text-[11px] text-stone-500 italic">
            Rates updated here immediately display in the customer website header ticker and announcement bar.
          </p>
        </div>

        {/* Section 2: Store Identity & Contacts */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b border-stone-800 pb-2 text-amber-400 font-bold uppercase tracking-wider">
            <Phone className="w-4 h-4" />
            <span>2. Store Identity & Contact Channels</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-stone-300 mb-1">
                Official Shop Name *
              </label>
              <input
                type="text"
                required
                value={formData.shopName}
                onChange={(e) => {
                  setFormData({ ...formData, shopName: e.target.value });
                  if (fieldErrors.shopName) setFieldErrors(prev => ({ ...prev, shopName: null }));
                }}
                className={`w-full px-3 py-2 rounded-lg bg-stone-950 border text-stone-100 focus:outline-none focus:border-amber-500 text-xs transition-colors ${
                  fieldErrors.shopName ? 'border-red-500 ring-1 ring-red-500/40' : 'border-stone-700'
                }`}
              />
              {fieldErrors.shopName && (
                <p className="text-red-400 text-[11px] mt-1 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {fieldErrors.shopName}
                </p>
              )}
            </div>

            <div>
              <label className="block font-semibold text-stone-300 mb-1">
                Shop Tagline / Guarantee Statement
              </label>
              <input
                type="text"
                value={formData.tagline}
                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-stone-950 border border-stone-700 text-stone-100 focus:outline-none focus:border-amber-500 text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold text-stone-300 mb-1">
                Phone Number(s) *
              </label>
              <input
                type="text"
                required
                value={formData.phone}
                onChange={(e) => {
                  setFormData({ ...formData, phone: e.target.value });
                  if (fieldErrors.phone) setFieldErrors(prev => ({ ...prev, phone: null }));
                }}
                className={`w-full px-3 py-2 rounded-lg bg-stone-950 border text-stone-100 focus:outline-none focus:border-amber-500 text-xs transition-colors ${
                  fieldErrors.phone ? 'border-red-500 ring-1 ring-red-500/40' : 'border-stone-700'
                }`}
              />
              {fieldErrors.phone && (
                <p className="text-red-400 text-[11px] mt-1 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {fieldErrors.phone}
                </p>
              )}
            </div>

            <div>
              <label className="block font-semibold text-stone-300 mb-1">
                WhatsApp Direct Number *
              </label>
              <input
                type="text"
                required
                value={formData.whatsappNumber}
                onChange={(e) => {
                  setFormData({ ...formData, whatsappNumber: e.target.value });
                  if (fieldErrors.whatsappNumber) setFieldErrors(prev => ({ ...prev, whatsappNumber: null }));
                }}
                className={`w-full px-3 py-2 rounded-lg bg-stone-950 border text-stone-100 focus:outline-none focus:border-amber-500 text-xs transition-colors ${
                  fieldErrors.whatsappNumber ? 'border-red-500 ring-1 ring-red-500/40' : 'border-stone-700'
                }`}
              />
              {fieldErrors.whatsappNumber && (
                <p className="text-red-400 text-[11px] mt-1 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {fieldErrors.whatsappNumber}
                </p>
              )}
            </div>

            <div>
              <label className="block font-semibold text-stone-300 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => {
                  setFormData({ ...formData, email: e.target.value });
                  if (fieldErrors.email) setFieldErrors(prev => ({ ...prev, email: null }));
                }}
                className={`w-full px-3 py-2 rounded-lg bg-stone-950 border text-stone-100 focus:outline-none focus:border-amber-500 text-xs transition-colors ${
                  fieldErrors.email ? 'border-red-500 ring-1 ring-red-500/40' : 'border-stone-700'
                }`}
              />
              {fieldErrors.email && (
                <p className="text-red-400 text-[11px] mt-1 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {fieldErrors.email}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-stone-300 mb-1">
                Full Showroom Address *
              </label>
              <textarea
                rows="2"
                required
                value={formData.address}
                onChange={(e) => {
                  setFormData({ ...formData, address: e.target.value });
                  if (fieldErrors.address) setFieldErrors(prev => ({ ...prev, address: null }));
                }}
                className={`w-full px-3 py-2 rounded-lg bg-stone-950 border text-stone-100 focus:outline-none focus:border-amber-500 resize-none text-xs transition-colors ${
                  fieldErrors.address ? 'border-red-500 ring-1 ring-red-500/40' : 'border-stone-700'
                }`}
              ></textarea>
              {fieldErrors.address && (
                <p className="text-red-400 text-[11px] mt-1 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {fieldErrors.address}
                </p>
              )}
            </div>

            <div>
              <label className="block font-semibold text-stone-300 mb-1">
                Showroom Operating Hours *
              </label>
              <textarea
                rows="2"
                required
                value={formData.openingHours}
                onChange={(e) => {
                  setFormData({ ...formData, openingHours: e.target.value });
                  if (fieldErrors.openingHours) setFieldErrors(prev => ({ ...prev, openingHours: null }));
                }}
                className={`w-full px-3 py-2 rounded-lg bg-stone-950 border text-stone-100 focus:outline-none focus:border-amber-500 resize-none text-xs transition-colors ${
                  fieldErrors.openingHours ? 'border-red-500 ring-1 ring-red-500/40' : 'border-stone-700'
                }`}
              ></textarea>
              {fieldErrors.openingHours && (
                <p className="text-red-400 text-[11px] mt-1 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {fieldErrors.openingHours}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-stone-300 mb-1">
                Google Maps External Search Link
              </label>
              <input
                type="url"
                value={formData.mapUrl}
                onChange={(e) => setFormData({ ...formData, mapUrl: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-stone-950 border border-stone-700 text-stone-100 focus:outline-none focus:border-amber-500 text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-300 mb-1">
                Google Maps Embed Iframe URL
              </label>
              <input
                type="url"
                value={formData.mapEmbedUrl}
                onChange={(e) => setFormData({ ...formData, mapEmbedUrl: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-stone-950 border border-stone-700 text-stone-100 focus:outline-none focus:border-amber-500 text-xs"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Homepage Banner Content */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b border-stone-800 pb-2 text-amber-400 font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>3. Homepage Hero Banner & Story</span>
          </div>

          <div>
            <label className="block font-semibold text-stone-300 mb-1">
              Hero Headline *
            </label>
            <input
              type="text"
              required
              value={formData.heroTitle}
              onChange={(e) => {
                setFormData({ ...formData, heroTitle: e.target.value });
                if (fieldErrors.heroTitle) setFieldErrors(prev => ({ ...prev, heroTitle: null }));
              }}
              className={`w-full px-3 py-2 rounded-lg bg-stone-950 border text-stone-100 focus:outline-none focus:border-amber-500 text-xs transition-colors ${
                fieldErrors.heroTitle ? 'border-red-500 ring-1 ring-red-500/40' : 'border-stone-700'
              }`}
            />
            {fieldErrors.heroTitle && (
              <p className="text-red-400 text-[11px] mt-1 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {fieldErrors.heroTitle}
              </p>
            )}
          </div>

          <div>
            <label className="block font-semibold text-stone-300 mb-1">
              Hero Description Text *
            </label>
            <textarea
              rows="3"
              required
              value={formData.heroDescription}
              onChange={(e) => {
                setFormData({ ...formData, heroDescription: e.target.value });
                if (fieldErrors.heroDescription) setFieldErrors(prev => ({ ...prev, heroDescription: null }));
              }}
              className={`w-full px-3 py-2 rounded-lg bg-stone-950 border text-stone-100 focus:outline-none focus:border-amber-500 resize-none text-xs transition-colors ${
                fieldErrors.heroDescription ? 'border-red-500 ring-1 ring-red-500/40' : 'border-stone-700'
              }`}
            ></textarea>
            {fieldErrors.heroDescription && (
              <p className="text-red-400 text-[11px] mt-1 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {fieldErrors.heroDescription}
              </p>
            )}
          </div>

          <div>
            <label className="block font-semibold text-stone-300 mb-1">
              Hero Banner Background Image URL
            </label>
            <input
              type="url"
              value={formData.heroImageUrl}
              onChange={(e) => setFormData({ ...formData, heroImageUrl: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-stone-950 border border-stone-700 text-stone-100 focus:outline-none focus:border-amber-500 text-xs"
            />
          </div>

          <div>
            <label className="block font-semibold text-stone-300 mb-1">
              Workshop Heritage / About Us Text *
            </label>
            <textarea
              rows="4"
              required
              value={formData.aboutText}
              onChange={(e) => {
                setFormData({ ...formData, aboutText: e.target.value });
                if (fieldErrors.aboutText) setFieldErrors(prev => ({ ...prev, aboutText: null }));
              }}
              className={`w-full px-3 py-2 rounded-lg bg-stone-950 border text-stone-100 focus:outline-none focus:border-amber-500 resize-none text-xs transition-colors ${
                fieldErrors.aboutText ? 'border-red-500 ring-1 ring-red-500/40' : 'border-stone-700'
              }`}
            ></textarea>
            {fieldErrors.aboutText && (
              <p className="text-red-400 text-[11px] mt-1 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {fieldErrors.aboutText}
              </p>
            )}
          </div>
        </div>

        {/* Save Button */}
        <div className="pt-4 border-t border-stone-800 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 hover:from-amber-500 hover:to-amber-700 text-white font-bold text-xs shadow-lg transition-all cursor-pointer disabled:opacity-50"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving to Database...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save All Shop Settings</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
