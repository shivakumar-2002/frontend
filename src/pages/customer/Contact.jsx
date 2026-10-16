import React, { useState } from 'react';
import {
  MapPin,
  Phone,
  Clock,
  Mail,
  Send,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  Upload,
  Image as ImageIcon,
  X,
  Sparkles,
  Award,
} from 'lucide-react';
import { WhatsAppIcon } from '../../components/WhatsAppIcon';
import { useShop } from '../../context/ShopContext';
import { api } from '../../services/api';
import { validatePhone, validateEmail, validateText } from '../../utils/validators';

export function Contact() {
  const { settings } = useShop();

  const [formData, setFormData] = useState({
    customerName: '',
    phone: '',
    email: '',
    queryType: 'Custom Made-to-Order Ornaments',
    targetWeight: '',
    message: '',
    website_check: '', // honeypot
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const phone = settings?.phone || '+91 98485 43615 / +91 93946 47299';
  const whatsappNum = settings?.whatsappNumber?.replace(/\D/g, '') || '919848543615';
  const address = settings?.address || 'S.No. 18-7-466/2/B/42, Near Uppuguda Railway Station, Ambica Nagar, Uppuguda, Hyderabad, Telangana - 500053';
  const openingHours = settings?.openingHours || 'Mon - Sat: 10:00 AM - 09:00 PM | Sun: 10:30 AM - 03:00 PM';
  const mapUrl = settings?.mapUrl || 'https://www.google.com/maps/search/?api=1&query=Hari+Hara+Jewellery+Works+Uppuguda+Hyderabad';
  const mapEmbedUrl = settings?.mapEmbedUrl || 'https://maps.google.com/maps?q=17.3475,78.4875&hl=en&z=15&output=embed';

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

    if (formData.email) {
      const emailErr = validateEmail(formData.email);
      if (emailErr) errors.email = emailErr;
    }

    const msgErr = validateText(formData.message, 'Enquiry details', 5, 2000);
    if (msgErr) errors.message = msgErr;

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setError('Please check and correct the highlighted fields before submitting.');
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
        `🏷️ *Query Type:* ${formData.queryType}`,
        formData.targetWeight ? `⚖️ *Target Weight / Budget:* ${formData.targetWeight}` : null,
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
        if (selectedFile) payload.append('image', selectedFile);

        await api.submitEnquiry(payload);
      } catch (logErr) {
        console.warn('Enquiry logged to WhatsApp, server backup note:', logErr);
      }

      setSuccess(true);
      setFormData({
        customerName: '',
        phone: '',
        email: '',
        queryType: 'Custom Made-to-Order Ornaments',
        targetWeight: '',
        message: '',
        website_check: '',
      });
      setSelectedFile(null);
      setImagePreview(null);
      setFieldErrors({});
    } catch (err) {
      setError(err.message || 'Failed to submit enquiry. Please call us directly.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-14">
      {/* Page Title in Compressed Frosted Glass Box */}
      <div className="text-center max-w-2xl mx-auto space-y-2.5 bg-[#FFFDF9]/90 backdrop-blur-md p-4 sm:p-6 rounded-2xl border border-amber-300/80 shadow-md">
        <span className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-amber-800 flex items-center justify-center gap-1.5">
          <Award className="w-3.5 h-3.5 text-amber-700" /> Visit Our Showroom & Master Workshop
        </span>
        <h1 className="text-xl sm:text-3xl font-bold font-serif text-stone-900 leading-snug">
          Contact & Store Location of
          <span className="block font-serif font-black tracking-wide bg-gradient-to-r from-amber-700 via-amber-800 to-amber-900 bg-clip-text text-transparent">
            HARI HARA Jewellery Works
          </span>
        </h1>
        <div className="flex items-center justify-center gap-2 pt-0.5">
          <div className="h-px w-8 sm:w-16 bg-gradient-to-r from-transparent via-amber-400/60 to-amber-400"></div>
          <Sparkles className="w-3.5 h-3.5 text-amber-700 animate-pulse" />
          <div className="h-px w-8 sm:w-16 bg-gradient-to-l from-transparent via-amber-400/60 to-amber-400"></div>
        </div>
        <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-normal max-w-lg mx-auto">
          Located in Ambica Nagar, Uppuguda, Hyderabad. Meet master goldsmith L. Srinivasa Chary for bespoke designs, bridal consultations, and certified gold exchange.
        </p>
      </div>

      {/* Main Grid: Details + Contact Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Column: Store Details (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Address Box */}
          <div className="bg-white/85 backdrop-blur-md rounded-2xl p-6 sm:p-7 border border-amber-200/80 shadow-lg space-y-5">
            <h2 className="text-lg font-bold font-serif text-stone-900 border-b border-amber-100 pb-3">
              Showroom Information
            </h2>

            <div className="flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-amber-100 border border-amber-300 text-amber-800 flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div className="text-xs">
                <span className="font-bold text-stone-900 block mb-1">Store Address:</span>
                <p className="text-stone-700 leading-relaxed">{address}</p>
                <a
                  href={mapUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-amber-700 font-semibold flex items-center gap-1 mt-1 hover:text-amber-900 hover:underline"
                >
                  <span>Open in Google Maps</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-amber-100 border border-amber-300 text-amber-800 flex items-center justify-center shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div className="text-xs">
                <span className="font-bold text-stone-900 block mb-1">Direct Phone Contacts:</span>
                <div className="flex flex-wrap gap-2">
                  <a
                    href="tel:+919848543615"
                    className="text-amber-900 font-bold hover:underline py-0.5 inline-block text-sm"
                  >
                    +91 98485 43615
                  </a>
                  <span className="text-stone-400">/</span>
                  <a
                    href="tel:+919394647299"
                    className="text-amber-900 font-bold hover:underline py-0.5 inline-block text-sm"
                  >
                    +91 93946 47299
                  </a>
                </div>
                <p className="text-stone-500 text-[11px] mt-0.5">Proprietor: L. Srinivasa Chary</p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-amber-100 border border-amber-300 text-amber-800 flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div className="text-xs">
                <span className="font-bold text-stone-900 block mb-1">Showroom Timings:</span>
                <p className="text-stone-700">{openingHours}</p>
                <p className="text-stone-500 text-[11px] mt-0.5">Open 7 days a week (Sunday Morning Half-Day)</p>
              </div>
            </div>

            <div className="pt-2">
              <a
                href={`https://wa.me/${whatsappNum}?text=${encodeURIComponent('Namaste L. Srinivasa Chary garu! I would like to inquire about gold & silver ornaments.')}`}
                target="_blank"
                rel="noreferrer"
                className="w-full min-h-[44px] flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-4 rounded-xl text-xs shadow-md transition-colors cursor-pointer active:scale-98"
                aria-label="Chat on WhatsApp with proprietor"
              >
                <WhatsAppIcon className="w-4 h-4 shrink-0" />
                <span>Chat on WhatsApp (+91 98485 43615)</span>
              </a>
            </div>
          </div>

          {/* Embedded Google Maps */}
          <div className="bg-white/85 rounded-2xl overflow-hidden border border-amber-200/80 shadow-lg h-64">
            <iframe
              title="Hari Hara Jewellery Works Location Map"
              src={mapEmbedUrl}
              className="w-full h-full border-0"
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>

        {/* Right Column: Customer Enquiry Form (7 Cols) */}
        <div className="lg:col-span-7 bg-white/90 backdrop-blur-md rounded-2xl p-6 sm:p-10 border border-amber-200/80 shadow-xl space-y-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1.5">
              <WhatsAppIcon className="w-3.5 h-3.5 text-emerald-600" /> WhatsApp Direct Enquiry
            </span>
            <h2 className="text-xl sm:text-2xl font-bold font-serif text-stone-900 mt-1">
              Send Your Requirements to WhatsApp
            </h2>
            <p className="text-xs text-stone-600 mt-1">
              Attach a jewellery design picture, select your inquiry query, and send directly to master craftsman on WhatsApp.
            </p>
          </div>

          {success && (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 flex items-start gap-3 text-xs text-emerald-900">
              <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div className="space-y-1.5">
                <strong className="block text-sm font-bold text-emerald-900">WhatsApp Chat Opened Successfully!</strong>
                <p className="leading-relaxed text-stone-700">
                  Your enquiry has been prepared and opened on WhatsApp with master craftsman <strong>L. Srinivasa Chary (+91 98485 43615)</strong>.
                </p>
                <p className="text-stone-500 text-[11px]">
                  💡 If you selected a jewellery picture, remember to hit send or tap the paperclip in WhatsApp to share the photo!
                </p>
                <div className="pt-1">
                  <a
                    href={`https://wa.me/${whatsappNum}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg text-xs transition-colors"
                  >
                    <WhatsAppIcon className="w-3.5 h-3.5" />
                    Open WhatsApp Chat Again
                  </a>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-300 flex items-center gap-2.5 text-xs text-red-700">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {/* Honeypot */}
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
                className={`w-full min-h-[44px] px-3.5 py-2.5 rounded-lg border bg-white text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 text-base sm:text-sm shadow-xs transition-colors ${
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-stone-800 mb-1">
                  Phone / WhatsApp Number *
                </label>
                <input
                  type="tel"
                  inputMode="tel"
                  required
                  placeholder="e.g. 9848543615"
                  value={formData.phone}
                  onChange={(e) => {
                    setFormData({ ...formData, phone: e.target.value });
                    if (fieldErrors.phone) setFieldErrors(prev => ({ ...prev, phone: null }));
                  }}
                  className={`w-full min-h-[44px] px-3.5 py-2.5 rounded-lg border bg-white text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 text-base sm:text-sm shadow-xs transition-colors ${
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
                  Email Address (Optional)
                </label>
                <input
                  type="email"
                  inputMode="email"
                  placeholder="e.g. yourname@example.com"
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value });
                    if (fieldErrors.email) setFieldErrors(prev => ({ ...prev, email: null }));
                  }}
                  className={`w-full min-h-[44px] px-3.5 py-2.5 rounded-lg border bg-white text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 text-base sm:text-sm shadow-xs transition-colors ${
                    fieldErrors.email
                      ? 'border-red-500 focus:ring-red-400/30 focus:border-red-500 bg-red-50/10'
                      : 'border-stone-300 focus:ring-amber-500/30 focus:border-amber-500'
                  }`}
                />
                {fieldErrors.email && (
                  <p className="text-red-600 text-[11px] mt-1 flex items-center gap-1 font-medium">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {fieldErrors.email}
                  </p>
                )}
              </div>
            </div>

            {/* Query Type & Target Weight */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-stone-800 mb-1">
                  Enquiry / Query Type
                </label>
                <select
                  value={formData.queryType}
                  onChange={(e) => setFormData({ ...formData, queryType: e.target.value })}
                  className="w-full min-h-[44px] px-3.5 py-2.5 rounded-lg border border-stone-300 bg-white text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 text-base sm:text-sm shadow-xs"
                >
                  <option value="Custom Made-to-Order Ornaments">Custom Made-to-Order Ornaments</option>
                  <option value="Bridal Jewellery Set Consultation">Bridal Jewellery Set Consultation</option>
                  <option value="Old Gold Exchange Valuation">Old Gold Exchange Valuation</option>
                  <option value="Live Bullion & Making Charges Query">Live Bullion & Making Charges Query</option>
                  <option value="Ornament Repair, Sizing & Polish">Ornament Repair, Sizing & Polish</option>
                  <option value="General Workshop Enquiry">General Workshop Enquiry</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-stone-800 mb-1">
                  Target Weight / Budget (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. 20-25 Grams / ₹1.5 Lakhs"
                  value={formData.targetWeight}
                  onChange={(e) => setFormData({ ...formData, targetWeight: e.target.value })}
                  className="w-full min-h-[44px] px-3.5 py-2.5 rounded-lg border border-stone-300 bg-white text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 text-base sm:text-sm shadow-xs"
                />
              </div>
            </div>

            {/* Picture Upload / Attachment Section */}
            <div>
              <label className="block font-semibold text-stone-800 mb-1 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4 text-amber-700" />
                  Attach Jewellery Picture / Design Reference (Optional)
                </span>
                {selectedFile && (
                  <span className="text-[10px] text-amber-800 font-mono">
                    {(selectedFile.size / 1024).toFixed(0)} KB
                  </span>
                )}
              </label>

              {!imagePreview ? (
                <label className="flex flex-col items-center justify-center p-4 min-h-[70px] border-2 border-dashed border-amber-200 hover:border-amber-400 rounded-xl cursor-pointer bg-amber-50/40 hover:bg-amber-50/80 transition-all group active:bg-amber-100/50">
                  <div className="flex items-center gap-2 text-stone-600 group-hover:text-amber-900">
                    <Upload className="w-5 h-5 text-amber-700 group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-medium">Click here to add a picture or drag photo</span>
                  </div>
                  <p className="text-[10px] text-stone-500 mt-1">
                    Upload your jewellery inspiration, heirloom photo, sketch, or screenshot (JPG, PNG, WEBP)
                  </p>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </label>
              ) : (
                <div className="flex items-center gap-3 p-3 rounded-xl bg-amber-50/60 border border-amber-200">
                  <img
                    src={imagePreview}
                    alt="Selected jewellery preview"
                    className="w-14 h-14 object-cover rounded-lg border border-amber-300"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-stone-900 truncate">{selectedFile.name}</p>
                    <p className="text-[10px] text-emerald-700 mt-0.5 flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" /> Photo ready to share on WhatsApp
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="w-10 h-10 min-w-[40px] min-h-[40px] flex items-center justify-center rounded-lg bg-white hover:bg-red-50 hover:text-red-600 text-stone-500 border border-stone-200 transition-colors cursor-pointer active:scale-95"
                    title="Remove picture"
                    aria-label="Remove picture"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>

            {/* Queries & Requirements Text Area */}
            <div>
              <label className="block font-semibold text-stone-800 mb-1">
                Enquiry Details / Jewellery Requirements *
              </label>
              <textarea
                required
                rows="4"
                placeholder="Describe your design, desired purity (22K 91.6 / Silver), occasion, or questions for master craftsman..."
                value={formData.message}
                onChange={(e) => {
                  setFormData({ ...formData, message: e.target.value });
                  if (fieldErrors.message) setFieldErrors(prev => ({ ...prev, message: null }));
                }}
                className={`w-full px-3.5 py-2.5 rounded-lg border bg-white text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 text-base sm:text-sm resize-none shadow-xs transition-colors ${
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

            {/* Prominent WhatsApp Send Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="w-full min-h-[48px] flex items-center justify-center gap-2.5 bg-gradient-to-r from-emerald-600 via-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-bold py-3.5 px-6 rounded-xl shadow-md text-sm transition-all active:scale-98 cursor-pointer disabled:opacity-50 border border-emerald-400/40"
              >
                <WhatsAppIcon className="w-5 h-5 text-white shrink-0" />
                <span>
                  {submitting ? 'Opening WhatsApp...' : 'Send Enquiry to WhatsApp (+91 98485 43615)'}
                </span>
              </button>
              <p className="text-[11px] text-stone-500 text-center mt-2">
                📲 Form automatically formats your query and opens WhatsApp chat with proprietor L. Srinivasa Chary
              </p>
            </div>

            <div className="pt-3 border-t border-amber-100 flex items-center gap-2 text-[11px] text-stone-500">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Direct WhatsApp contact with master goldsmith. No middleman charges.</span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}