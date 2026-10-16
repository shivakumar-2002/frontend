import React, { useState } from 'react';
import {
  X,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Upload,
  Image as ImageIcon,
  ShieldCheck,
} from 'lucide-react';
import { WhatsAppIcon } from './WhatsAppIcon';
import { api } from '../services/api';
import { useShop } from '../context/ShopContext';
import { validatePhone, validateText } from '../utils/validators';

export function EnquiryModal({ isOpen, onClose, product = null }) {
  const { settings } = useShop();
  const whatsappNum = settings?.whatsappNumber?.replace(/\D/g, '') || '919848543615';

  const [formData, setFormData] = useState({
    customerName: '',
    phone: '',
    email: '',
    queryType: product ? `Product Inquiry: ${product.name}` : 'Custom Made-to-Order',
    targetWeight: product?.weight ? `${product.weight}g` : '',
    message: product
      ? `Namaste! I would like to inquire about "${product.name}" (${product.purity || '91.6 KDM'}). Please share the live gold price and making charges.`
      : '',
    website_check: '', // honeypot
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file (JPG, PNG, WEBP).');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert('Image size exceeds 10MB limit. Please choose a smaller photo.');
      return;
    }

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = (event) => {
      setImagePreview(event.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const errors = {};
    const nameErr = validateText(formData.customerName, 'Customer name', 2, 80);
    if (nameErr) errors.customerName = nameErr;

    const phoneErr = validatePhone(formData.phone);
    if (phoneErr) errors.phone = phoneErr;

    const msgErr = validateText(formData.message, 'Enquiry requirements', 4, 2000);
    if (msgErr) errors.message = msgErr;

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setError('Please resolve the highlighted fields to continue.');
      return;
    }
    setFieldErrors({});
    setSubmitting(true);

    try {
      // 1. Build WhatsApp formatted message
      const textLines = [
        `*Namaste HARI HARA Jewellery Works!* 🙏`,
        `I would like to inquire about jewellery from your website:`,
        ``,
        `👤 *Customer Name:* ${formData.customerName}`,
        `📱 *Contact Phone:* ${formData.phone}`,
        formData.email ? `📧 *Email:* ${formData.email}` : null,
        product ? `💍 *Selected Ornament:* ${product.name} (${product.purity || '91.6 KDM'})` : null,
        `🏷️ *Query Type:* ${formData.queryType}`,
        formData.targetWeight ? `⚖️ *Weight / Budget:* ${formData.targetWeight}` : null,
        ``,
        `💬 *Enquiry / Requirements:*`,
        formData.message,
        selectedFile ? `\n📸 *Reference Design Photo:* [Attached & sharing photo with you in this chat]` : null,
      ].filter(Boolean);

      const whatsappText = textLines.join('\n');
      const waUrl = `https://wa.me/${whatsappNum}?text=${encodeURIComponent(whatsappText)}`;

      // 2. Open WhatsApp in new tab
      window.open(waUrl, '_blank');

      // 3. Save copy to backend database in parallel
      try {
        const payload = new FormData();
        payload.append('customerName', formData.customerName);
        payload.append('phone', formData.phone);
        if (formData.email) payload.append('email', formData.email);
        payload.append('queryType', formData.queryType);
        if (formData.targetWeight) payload.append('targetWeight', formData.targetWeight);
        payload.append('message', formData.message);
        if (product) payload.append('productId', product.id);
        if (selectedFile) payload.append('image', selectedFile);

        await api.submitEnquiry(payload);
      } catch (logErr) {
        console.warn('Enquiry logged to WhatsApp, server backup note:', logErr);
      }

      setSuccess(true);
    } catch (err) {
      setError(err.message || 'Failed to submit enquiry. Please call us directly.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setSuccess(false);
    setError(null);
    setFieldErrors({});
    setSelectedFile(null);
    setImagePreview(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="relative bg-white/95 backdrop-blur-xl rounded-2xl max-w-lg w-full max-h-[92vh] overflow-y-auto p-5 sm:p-8 shadow-2xl border border-amber-200/80 animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 text-stone-400 hover:text-stone-700 w-11 h-11 min-w-[44px] min-h-[44px] rounded-full hover:bg-stone-100 flex items-center justify-center transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {success ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-600 mx-auto flex items-center justify-center">
              <CheckCircle className="w-9 h-9" />
            </div>
            <h3 className="text-xl font-bold text-stone-900 font-serif">WhatsApp Opened!</h3>
            <p className="text-sm text-stone-600 max-w-sm mx-auto leading-relaxed">
              Your inquiry has been opened on WhatsApp with master craftsman <strong>L. Srinivasa Chary (+91 98485 43615)</strong>.
            </p>
            {selectedFile && (
              <p className="text-xs text-amber-800 font-medium">
                📸 Remember to hit send or attach the selected design photo in WhatsApp!
              </p>
            )}
            <div className="pt-2 flex flex-col sm:flex-row justify-center gap-2.5">
              <a
                href={`https://wa.me/${whatsappNum}`}
                target="_blank"
                rel="noreferrer"
                className="min-h-[44px] px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm active:scale-95"
              >
                <WhatsAppIcon className="w-4 h-4" /> Open Chat Again
              </a>
              <button
                onClick={handleClose}
                className="min-h-[44px] px-5 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold rounded-xl text-xs transition-colors cursor-pointer active:scale-95"
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-2 text-amber-800 text-xs font-bold uppercase tracking-wider mb-1 pr-10">
              <WhatsAppIcon className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>WhatsApp Direct Workshop Enquiry</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-stone-900 font-serif mb-1 pr-10">
              {product ? `Inquire: ${product.name}` : 'Custom Jewellery Consultation'}
            </h2>
            <p className="text-xs text-stone-600 mb-5">
              Attach design photos, state your weight or budget, and send directly to WhatsApp.
            </p>

            {error && (
              <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-300 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              {/* Honeypot field (hidden from real users) */}
              <input
                type="text"
                name="website_check"
                value={formData.website_check}
                onChange={(e) => setFormData({ ...formData, website_check: e.target.value })}
                className="hidden"
                tabIndex="-1"
                autoComplete="off"
              />

              <div>
                <label className="block font-semibold text-stone-800 mb-1">
                  Your Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Kumar / Ananya Reddy"
                  value={formData.customerName}
                  onChange={(e) => {
                    setFormData({ ...formData, customerName: e.target.value });
                    if (fieldErrors.customerName) setFieldErrors(prev => ({ ...prev, customerName: null }));
                  }}
                  className={`w-full min-h-[44px] px-3.5 py-2.5 rounded-lg bg-white border text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 text-base sm:text-sm shadow-xs transition-colors ${
                    fieldErrors.customerName
                      ? 'border-red-500 focus:ring-red-400/30 focus:border-red-500 bg-red-50/10'
                      : 'border-stone-300 focus:ring-amber-500/30 focus:border-amber-500'
                  }`}
                />
                {fieldErrors.customerName && (
                  <p className="text-red-600 text-[11px] mt-1 flex items-center gap-1 font-medium">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {fieldErrors.customerName}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-800 mb-1">
                    Phone / WhatsApp Number *
                  </label>
                  <input
                    type="tel"
                    inputMode="tel"
                    required
                    placeholder="e.g. 9848012345"
                    value={formData.phone}
                    onChange={(e) => {
                      setFormData({ ...formData, phone: e.target.value });
                      if (fieldErrors.phone) setFieldErrors(prev => ({ ...prev, phone: null }));
                    }}
                    className={`w-full min-h-[44px] px-3.5 py-2.5 rounded-lg bg-white border text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 text-base sm:text-sm shadow-xs transition-colors ${
                      fieldErrors.phone
                        ? 'border-red-500 focus:ring-red-400/30 focus:border-red-500 bg-red-50/10'
                        : 'border-stone-300 focus:ring-amber-500/30 focus:border-amber-500'
                    }`}
                  />
                  {fieldErrors.phone && (
                    <p className="text-red-600 text-[11px] mt-1 flex items-center gap-1 font-medium">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {fieldErrors.phone}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block font-semibold text-stone-800 mb-1">
                    Target Weight / Budget (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 15-20 Grams"
                    value={formData.targetWeight}
                    onChange={(e) => setFormData({ ...formData, targetWeight: e.target.value })}
                    className="w-full min-h-[44px] px-3.5 py-2.5 rounded-lg bg-white border border-stone-300 text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 text-base sm:text-sm shadow-xs"
                  />
                </div>
              </div>

              {/* Photo Upload Attachment */}
              <div>
                <label className="block font-semibold text-stone-800 mb-1 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-amber-700" />
                    Attach Design Photo / Reference (Optional)
                  </span>
                </label>

                {!imagePreview ? (
                  <label className="flex items-center justify-center gap-2 p-3 border-2 border-dashed border-amber-200 hover:border-amber-400 rounded-xl cursor-pointer bg-amber-50/40 hover:bg-amber-50/80 transition-all">
                    <Upload className="w-4 h-4 text-amber-700" />
                    <span className="text-xs text-stone-600 font-medium">Click to select jewellery photo / sketch</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                  </label>
                ) : (
                  <div className="flex items-center gap-3 p-2 rounded-xl bg-amber-50/60 border border-amber-200">
                    <img
                      src={imagePreview}
                      alt="Selected preview"
                      className="w-12 h-12 object-cover rounded-lg border border-amber-300"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-stone-900 truncate">{selectedFile.name}</p>
                      <p className="text-[10px] text-emerald-700 font-medium">Photo attached for WhatsApp</p>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="w-10 h-10 min-w-[40px] min-h-[40px] flex items-center justify-center rounded-lg bg-white hover:bg-red-50 hover:text-red-600 text-stone-500 border border-stone-200 cursor-pointer active:scale-95"
                      title="Remove picture"
                      aria-label="Remove picture"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              <div>
                <label className="block font-semibold text-stone-800 mb-1">
                  Enquiry / Custom Requirements *
                </label>
                <textarea
                  required
                  rows="3"
                  placeholder="Mention desired weight, occasion, budget, or design changes..."
                  value={formData.message}
                  onChange={(e) => {
                    setFormData({ ...formData, message: e.target.value });
                    if (fieldErrors.message) setFieldErrors(prev => ({ ...prev, message: null }));
                  }}
                  className={`w-full px-3.5 py-2.5 rounded-lg bg-white border text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 text-base sm:text-sm resize-none shadow-xs transition-colors ${
                    fieldErrors.message
                      ? 'border-red-500 focus:ring-red-400/30 focus:border-red-500 bg-red-50/10'
                      : 'border-stone-300 focus:ring-amber-500/30 focus:border-amber-500'
                  }`}
                ></textarea>
                {fieldErrors.message && (
                  <p className="text-red-600 text-[11px] mt-1 flex items-center gap-1 font-medium">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {fieldErrors.message}
                  </p>
                )}
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full min-h-[48px] flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 via-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-bold py-3 px-4 rounded-xl shadow-md transition-all active:scale-98 cursor-pointer disabled:opacity-50 text-sm border border-emerald-400/40"
                >
                  <WhatsAppIcon className="w-4 h-4 text-white shrink-0" />
                  <span>{submitting ? 'Opening WhatsApp...' : 'Send Enquiry to WhatsApp (+91 98485 43615)'}</span>
                </button>
              </div>

              <p className="text-[11px] text-stone-500 text-center">
                📲 Form opens WhatsApp directly with your message and sends a copy to the workshop.
              </p>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
