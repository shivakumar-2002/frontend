import React from 'react';
import { WhatsAppIcon } from './WhatsAppIcon';
import { useShop } from '../context/ShopContext';

export function WhatsAppButton({ customMessage = null }) {
  const { settings } = useShop();
  const whatsappNum = settings?.whatsappNumber?.replace(/\D/g, '') || '919848543615';

  const handleClick = () => {
    const defaultText = `Namaste L. Srinivasa Chary garu! I visited the HARI HARA Jewellery Works website and would like to inquire about gold / silver ornaments.`;
    const message = customMessage || defaultText;
    const url = `https://wa.me/${whatsappNum}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center group">
      {/* Tooltip */}
      <span className="hidden sm:inline-block mr-2 px-3 py-1.5 bg-white/95 text-stone-900 text-xs font-semibold rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap border border-amber-300 backdrop-blur-md">
        WhatsApp Enquiry with Master Craftsman
      </span>

      {/* Floating Action Button */}
      <button
        onClick={handleClick}
        className="relative flex items-center justify-center w-14 h-14 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 active:scale-95 cursor-pointer ring-4 ring-emerald-500/20"
        aria-label="Contact on WhatsApp"
      >
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-amber-400 rounded-full animate-ping"></span>
        <WhatsAppIcon className="w-7 h-7" />
      </button>
    </div>
  );
}
