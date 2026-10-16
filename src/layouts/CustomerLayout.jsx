import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { WhatsAppButton } from '../components/WhatsAppButton';
import { CustomerSidebar } from '../components/CustomerSidebar';

export function CustomerLayout() {
  // Mobile drawer state (< 768px)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Tablet & Desktop sidebar collapse state (>= 768px)
  // Defaults to collapsed on tablets (768px-1023px) and expanded on desktops (>= 1024px)
  const [isCollapsed, setIsCollapsed] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 768 && window.innerWidth < 1024;
    }
    return false;
  });

  // Handle window resizing
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileSidebarOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="min-h-screen flex bg-[#FAF8F5] text-stone-800 selection:bg-amber-500 selection:text-white relative overflow-x-hidden font-sans">
      {/* Full Website Real Handmade Goldsmith Workshop Instruments Background */}
      <div
        className="fixed inset-0 z-0 pointer-events-none bg-cover bg-center bg-no-repeat bg-fixed opacity-75"
        style={{ backgroundImage: "url('/goldsmith-instruments-workbench.jpg')" }}
      >
        {/* Soft Warm Frosted Overlay - Preserves rich instrument visibility while keeping text crisp */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#FFFDF9]/60 via-[#FAF8F5]/45 to-[#FAF8F5]/65"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(30,25,20,0.2)_100%)]"></div>
      </div>

      {/* Responsive Customer Sidebar (Desktop permanent, Tablet collapsible, Mobile drawer) */}
      <CustomerSidebar
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
      />

      {/* Main Content Area (automatically expands and contracts with fixed sidebar) */}
      <div
        className={`relative z-10 flex-1 min-w-0 flex flex-col min-h-screen transition-all duration-300 ease-in-out ${
          isCollapsed ? 'md:ml-20' : 'md:ml-64 lg:ml-72'
        }`}
      >
        <Header
          onOpenMobileSidebar={() => setMobileSidebarOpen(true)}
          isSidebarCollapsed={isCollapsed}
          onToggleSidebar={() => setIsCollapsed(!isCollapsed)}
        />
        <main className="flex-1 w-full min-w-0">
          <Outlet />
        </main>
        <WhatsAppButton />
        <Footer />
      </div>
    </div>
  );
}
