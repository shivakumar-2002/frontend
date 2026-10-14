import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ShopProvider } from './context/ShopContext';

// Layouts
import { CustomerLayout } from './layouts/CustomerLayout';
import { AdminLayout } from './layouts/AdminLayout';
import { ProtectedRoute } from './components/ProtectedRoute';

// Customer Pages
import { Home } from './pages/customer/Home';
import { Collections } from './pages/customer/Collections';
import { ProductDetails } from './pages/customer/ProductDetails';
import { About } from './pages/customer/About';
import { Services } from './pages/customer/Services';
import { Contact } from './pages/customer/Contact';
import { NotFound } from './pages/customer/NotFound';

// Admin Pages
import { AdminLogin } from './pages/admin/AdminLogin';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminProducts } from './pages/admin/AdminProducts';
import { AdminProductForm } from './pages/admin/AdminProductForm';
import { AdminCategories } from './pages/admin/AdminCategories';
import { AdminEnquiries } from './pages/admin/AdminEnquiries';
import { AdminShopSettings } from './pages/admin/AdminShopSettings';
import { AdminServices } from './pages/admin/AdminServices';

export default function App() {
  return (
    <AuthProvider>
      <ShopProvider>
        <BrowserRouter>
          <Routes>
            {/* Customer Portal Public Routes */}
            <Route path="/" element={<CustomerLayout />}>
              <Route index element={<Home />} />
              <Route path="customer" element={<Home />} />
              <Route path="collections" element={<Collections />} />
              <Route path="collections/:categorySlug" element={<Collections />} />
              <Route path="product/:id" element={<ProductDetails />} />
              <Route path="about" element={<About />} />
              <Route path="services" element={<Services />} />
              <Route path="contact" element={<Contact />} />
              <Route path="*" element={<NotFound />} />
            </Route>

            {/* Admin Authentication Route */}
            <Route path="/admin/login" element={<AdminLogin />} />

            {/* Protected Admin Portal Routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="products/new" element={<AdminProductForm />} />
              <Route path="products/edit/:id" element={<AdminProductForm />} />
              <Route path="categories" element={<AdminCategories />} />
              <Route path="enquiries" element={<AdminEnquiries />} />
              <Route path="shop-settings" element={<AdminShopSettings />} />
              <Route path="services" element={<AdminServices />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ShopProvider>
    </AuthProvider>
  );
}
