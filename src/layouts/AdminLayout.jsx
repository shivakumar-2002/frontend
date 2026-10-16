import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Gem,
  PlusCircle,
  FolderTree,
  MessageSquare,
  Settings,
  Wrench,
  LogOut,
  ExternalLink,
  Menu,
  X,
  User,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { HariHaraLogo } from '../components/HariHaraLogo';

export function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Mobile drawer state (< 768px)
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  // Tablet & Desktop sidebar collapse state (>= 768px)
  // Defaults to collapsed on tablets (768px-1023px) and expanded on desktops (>= 1024px)
  const [isCollapsed, setIsCollapsed] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 768 && window.innerWidth < 1024;
    }
    return false;
  });

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  // Close mobile drawer on resize to desktop / tablet
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileDrawerOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close mobile drawer on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && mobileDrawerOpen) {
        setMobileDrawerOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileDrawerOpen]);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (mobileDrawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileDrawerOpen]);

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Jewellery Products', path: '/admin/products', icon: Gem },
    { name: 'Add New Product', path: '/admin/products/new', icon: PlusCircle },
    { name: 'Categories', path: '/admin/categories', icon: FolderTree },
    { name: 'Customer Enquiries', path: '/admin/enquiries', icon: MessageSquare },
    { name: 'Shop Settings', path: '/admin/shop-settings', icon: Settings },
    { name: 'Workshop Services', path: '/admin/services', icon: Wrench },
  ];

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col md:flex-row font-sans">
      {/* ======================================================== */}
      {/* 1. DESKTOP & TABLET SIDEBAR (>= 768px)                     */}
      {/* ======================================================== */}
      <aside
        className={`hidden md:flex flex-col bg-stone-900 border-r border-stone-800 shrink-0 sticky top-0 h-screen transition-all duration-300 ease-in-out z-30 ${
          isCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        {/* Brand Area with Collapse / Expand Toggle Button */}
        {isCollapsed ? (
          <div className="p-3 border-b border-stone-800 bg-stone-950/60 flex flex-col items-center gap-3">
            <Link
              to="/admin/dashboard"
              title="HARI HARA Admin Portal"
              className="relative group transition-transform hover:scale-105"
            >
              <div className="w-10 h-10 rounded-full p-[2px] bg-gradient-to-tr from-amber-600 via-yellow-300 to-amber-700 shadow-md">
                <div className="w-full h-full rounded-full overflow-hidden bg-stone-950 border border-amber-300/80">
                  <img
                    src="/lord-shiva-logo.png"
                    alt="HARI HARA"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </Link>
            <button
              onClick={() => setIsCollapsed(false)}
              className="w-9 h-9 min-w-[36px] min-h-[36px] flex items-center justify-center rounded-lg bg-stone-800 hover:bg-stone-700 text-amber-400 hover:text-amber-200 transition-colors cursor-pointer border border-stone-700 shadow-xs"
              title="Expand sidebar (Full menu labels)"
              aria-label="Expand sidebar"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="p-4 border-b border-stone-800 bg-stone-950/60 flex items-center justify-between gap-2">
            <Link to="/admin/dashboard" className="block min-w-0">
              <HariHaraLogo size="small" showSubtitle={false} />
              <span className="block text-[10px] font-bold uppercase tracking-wider text-amber-500 mt-1 pl-1">
                Admin Management Portal
              </span>
            </Link>
            <button
              onClick={() => setIsCollapsed(true)}
              className="w-9 h-9 min-w-[36px] min-h-[36px] flex items-center justify-center rounded-lg bg-stone-800/80 hover:bg-stone-700 text-stone-400 hover:text-amber-300 transition-colors cursor-pointer shrink-0 border border-stone-700 shadow-xs"
              title="Collapse sidebar into compact icon mode"
              aria-label="Collapse sidebar"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Navigation Menu Links */}
        <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto no-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            if (isCollapsed) {
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === '/admin/products'}
                  title={item.name}
                  className={({ isActive }) =>
                    `flex items-center justify-center w-full h-11 min-h-[44px] rounded-xl transition-all relative group ${
                      isActive
                        ? 'bg-amber-600/20 text-amber-300 border border-amber-500/50 shadow-md ring-1 ring-amber-500/30'
                        : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/70'
                    }`
                  }
                >
                  <Icon className="w-5 h-5 text-amber-400 shrink-0" />
                  {/* Floating tooltip label on hover */}
                  <span className="absolute left-full ml-3 px-2.5 py-1.5 bg-stone-800 text-stone-100 text-xs font-semibold rounded-lg shadow-2xl whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 border border-stone-700">
                    {item.name}
                  </span>
                </NavLink>
              );
            }

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/admin/products'}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold min-h-[44px] transition-all ${
                    isActive
                      ? 'bg-amber-600/20 text-amber-300 border border-amber-500/40 shadow-xs'
                      : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/60'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0 text-amber-400" />
                <span className="truncate">{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Admin User Profile & Bottom Action Buttons */}
        {isCollapsed ? (
          <div className="p-3 border-t border-stone-800 bg-stone-950/40 flex flex-col items-center gap-2">
            <div
              className="w-10 h-10 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center text-xs font-bold border border-amber-500/30 cursor-default"
              title={`${user?.name || 'Administrator'} (${user?.email || ''})`}
            >
              <User className="w-4 h-4" />
            </div>

            <Link
              to="/"
              target="_blank"
              className="w-10 h-10 min-w-[40px] min-h-[40px] flex items-center justify-center bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white rounded-xl transition-colors shadow-xs"
              title="Open Public Customer Portal"
              aria-label="Open Public Customer Portal"
            >
              <ExternalLink className="w-4 h-4" />
            </Link>

            <button
              onClick={handleLogout}
              className="w-10 h-10 min-w-[40px] min-h-[40px] flex items-center justify-center bg-red-950/60 hover:bg-red-900/60 text-red-300 hover:text-red-100 rounded-xl border border-red-800/40 transition-colors cursor-pointer shadow-xs"
              title="Logout from Admin Portal"
              aria-label="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="p-4 border-t border-stone-800 bg-stone-950/40 space-y-3">
            <div className="flex items-center gap-3 px-1">
              <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center text-xs font-bold shrink-0 border border-amber-500/30">
                <User className="w-4 h-4" />
              </div>
              <div className="truncate text-xs">
                <div className="font-semibold text-stone-200 truncate">{user?.name || 'Administrator'}</div>
                <div className="text-[10px] text-stone-500 truncate">{user?.email}</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
              <Link
                to="/"
                target="_blank"
                className="min-h-[38px] flex items-center justify-center gap-1.5 py-1.5 px-2 bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white rounded-lg text-[11px] font-medium transition-colors"
                title="Open Public Customer Portal"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Live Site</span>
              </Link>

              <button
                onClick={handleLogout}
                className="min-h-[38px] flex items-center justify-center gap-1.5 py-1.5 px-2 bg-red-950/60 hover:bg-red-900/60 text-red-300 border border-red-800/40 rounded-lg text-[11px] font-medium transition-colors cursor-pointer"
                title="Logout"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        )}
      </aside>

      {/* ======================================================== */}
      {/* 2. MOBILE TOP HEADER (< 768px)                            */}
      {/* ======================================================== */}
      <header className="md:hidden bg-stone-900 border-b border-stone-800 px-4 py-3 flex items-center justify-between sticky top-0 z-40 shadow-md">
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setMobileDrawerOpen(true)}
            className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl bg-stone-800 text-stone-200 hover:text-white hover:bg-stone-700 transition-colors border border-stone-700"
            aria-label="Open admin navigation menu"
          >
            <Menu className="w-5 h-5 text-amber-400" />
          </button>
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm text-amber-300 font-serif">HARI HARA</span>
            <span className="text-[10px] uppercase font-bold text-stone-400 bg-stone-800 px-2 py-0.5 rounded border border-stone-700">Admin</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/"
            target="_blank"
            className="min-w-[44px] min-h-[44px] flex items-center justify-center bg-stone-800 text-stone-300 hover:text-white rounded-xl border border-stone-700 transition-colors"
            aria-label="Open Public Customer Portal"
            title="Open Public Customer Portal"
          >
            <ExternalLink className="w-4 h-4" />
          </Link>
          <button
            onClick={handleLogout}
            className="min-w-[44px] min-h-[44px] flex items-center justify-center bg-red-950/60 hover:bg-red-900/60 text-red-300 rounded-xl border border-red-800/40 transition-colors cursor-pointer"
            aria-label="Logout from Admin Portal"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* ======================================================== */}
      {/* 3. MOBILE SLIDE-IN DRAWER & OVERLAY (< 768px)             */}
      {/* ======================================================== */}
      {/* Backdrop Overlay */}
      <div
        onClick={() => setMobileDrawerOpen(false)}
        className={`fixed inset-0 bg-stone-950/80 backdrop-blur-xs z-50 md:hidden transition-opacity duration-300 ${
          mobileDrawerOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        aria-hidden="true"
      />

      {/* Slide-in Drawer Container */}
      <aside
        className={`fixed inset-y-0 left-0 w-72 max-w-[85vw] bg-stone-900 border-r border-stone-800 shadow-2xl flex flex-col z-50 md:hidden transform transition-transform duration-300 ease-in-out ${
          mobileDrawerOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        aria-label="Mobile Navigation Sidebar"
      >
        {/* Drawer Header with Brand & Close Button */}
        <div className="p-4 border-b border-stone-800 bg-stone-950/70 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <HariHaraLogo size="small" showSubtitle={false} />
            <span className="block text-[10px] font-bold uppercase tracking-wider text-amber-500 mt-1 pl-1">
              Admin Portal
            </span>
          </div>

          <button
            onClick={() => setMobileDrawerOpen(false)}
            className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white transition-colors border border-stone-700"
            aria-label="Close sidebar navigation"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Menu Options */}
        <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/admin/products'}
                onClick={() => setMobileDrawerOpen(false)}
                className={({ isActive }) =>
                  `min-h-[46px] flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                    isActive
                      ? 'bg-amber-600/25 text-amber-300 border border-amber-500/50 shadow-sm'
                      : 'text-stone-300 hover:text-white hover:bg-stone-800/80'
                  }`
                }
              >
                <Icon className="w-5 h-5 text-amber-400 shrink-0" />
                <span className="text-[13px]">{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Drawer Footer Actions */}
        <div className="p-4 border-t border-stone-800 bg-stone-950/60 space-y-3">
          <div className="flex items-center gap-3 px-1">
            <div className="w-9 h-9 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center text-xs font-bold shrink-0 border border-amber-500/30">
              <User className="w-4 h-4" />
            </div>
            <div className="truncate text-xs">
              <div className="font-semibold text-stone-200 truncate">{user?.name || 'Administrator'}</div>
              <div className="text-[10px] text-stone-500 truncate">{user?.email}</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
            <Link
              to="/"
              target="_blank"
              onClick={() => setMobileDrawerOpen(false)}
              className="min-h-[42px] flex items-center justify-center gap-1.5 py-2 px-3 bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white rounded-xl text-xs font-medium transition-colors border border-stone-700"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Live Site</span>
            </Link>

            <button
              onClick={() => {
                setMobileDrawerOpen(false);
                handleLogout();
              }}
              className="min-h-[42px] flex items-center justify-center gap-1.5 py-2 px-3 bg-red-950/60 hover:bg-red-900/60 text-red-300 rounded-xl border border-red-800/40 text-xs font-medium transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* ======================================================== */}
      {/* 4. MAIN ADMIN CONTENT BODY                                */}
      {/* ======================================================== */}
      <main className="flex-1 bg-stone-950 p-4 sm:p-6 lg:p-8 overflow-y-auto min-w-0">
        <Outlet />
      </main>
    </div>
  );
}
