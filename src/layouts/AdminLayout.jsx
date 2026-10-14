import React, { useState } from 'react';
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
  Shield,
  User,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { HariHaraLogo } from '../components/HariHaraLogo';

export function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

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
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-stone-900 border-r border-stone-800 shrink-0">
        {/* Brand Area */}
        <div className="p-5 border-b border-stone-800 bg-stone-950/60">
          <Link to="/admin/dashboard" className="block">
            <HariHaraLogo size="small" showSubtitle={false} />
            <span className="block text-[10px] font-bold uppercase tracking-wider text-amber-500 mt-1 pl-1">
              Admin Management Portal
            </span>
          </Link>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/admin/products'}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-amber-600/20 text-amber-300 border border-amber-500/40 shadow-xs'
                      : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/60'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0 text-amber-400" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Admin User & Bottom Actions */}
        <div className="p-4 border-t border-stone-800 bg-stone-950/40 space-y-3">
          <div className="flex items-center gap-3 px-2">
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
              className="flex items-center justify-center gap-1.5 py-1.5 px-2 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded text-[11px] font-medium transition-colors"
              title="Open Public Customer Portal"
            >
              <ExternalLink className="w-3 h-3" />
              <span>Live Site</span>
            </Link>

            <button
              onClick={handleLogout}
              className="flex items-center justify-center gap-1.5 py-1.5 px-2 bg-red-950/60 hover:bg-red-900/60 text-red-300 border border-red-800/40 rounded text-[11px] font-medium transition-colors cursor-pointer"
            >
              <LogOut className="w-3 h-3" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="md:hidden bg-stone-900 border-b border-stone-800 p-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="p-1.5 rounded-lg bg-stone-800 text-stone-300"
          >
            {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <span className="font-bold text-sm text-amber-300 font-serif">HARI HARA Admin</span>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/"
            target="_blank"
            className="p-1.5 bg-stone-800 text-stone-300 rounded hover:text-white"
          >
            <ExternalLink className="w-4 h-4" />
          </Link>
          <button
            onClick={handleLogout}
            className="p-1.5 bg-red-900/40 text-red-300 rounded border border-red-800/40"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileSidebarOpen && (
        <div className="md:hidden bg-stone-900 border-b border-stone-800 p-4 space-y-2 z-30">
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileSidebarOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold ${
                      isActive
                        ? 'bg-amber-600/20 text-amber-300 border border-amber-500/40'
                        : 'text-stone-400 hover:text-stone-200'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 text-amber-400" />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>
      )}

      {/* Main Admin Content Body */}
      <main className="flex-1 bg-stone-950 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
