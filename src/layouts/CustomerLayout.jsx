import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { WhatsAppButton } from '../components/WhatsAppButton';

export function CustomerLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-stone-800 selection:bg-amber-500 selection:text-white relative overflow-x-hidden">
      {/* Full Website Real Handmade Goldsmith Workshop Instruments Background */}
      <div
        className="fixed inset-0 z-0 pointer-events-none bg-cover bg-center bg-no-repeat bg-fixed opacity-75"
        style={{ backgroundImage: "url('/goldsmith-instruments-workbench.jpg')" }}
      >
        {/* Soft Warm Frosted Overlay - Preserves rich instrument visibility while keeping text crisp */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#FFFDF9]/60 via-[#FAF8F5]/45 to-[#FAF8F5]/65"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(30,25,20,0.2)_100%)]"></div>
      </div>

      <div className="relative z-10 flex flex-col min-h-screen w-full overflow-x-hidden">
        <Header />
        <main className="flex-1 w-full">
          <Outlet />
        </main>
        <WhatsAppButton />
        <Footer />
      </div>
    </div>
  );
}
