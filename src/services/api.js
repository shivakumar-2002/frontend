const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

/**
 * Universal API fetch helper
 */
async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  
  // Retrieve token from localStorage fallback for authorization header
  const token = localStorage.getItem('hh_admin_token');
  
  const headers = {
    ...options.headers,
  };

  if (token && !headers['Authorization']) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // If body is NOT FormData, set JSON content-type
  if (!(options.body instanceof FormData) && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  const response = await fetch(url, {
    ...options,
    headers,
    credentials: 'include', // Sends HTTP-Only cookies
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(data.message || `Request failed with status ${response.status}`);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

// ==========================================
// PUBLIC CUSTOMER API
// ==========================================

export const api = {
  // Products
  getProducts: (params = {}) => {
    const query = new URLSearchParams();
    if (params.category) query.append('category', params.category);
    if (params.search) query.append('search', params.search);
    if (params.purity) query.append('purity', params.purity);
    if (params.featured) query.append('featured', 'true');
    if (params.newArrival) query.append('newArrival', 'true');
    if (params.sort) query.append('sort', params.sort);
    const qs = query.toString();
    return request(`/products${qs ? `?${qs}` : ''}`);
  },

  getProductById: (id) => request(`/products/${id}`),

  // Categories
  getCategories: () => request('/categories'),
  getCategoryProducts: (slug) => request(`/categories/${slug}/products`),

  // Shop Settings & Services
  getShopSettings: () => request('/shop-settings'),
  getServices: () => request('/services'),

  // Customer Enquiry Submission
  submitEnquiry: (payload) => {
    const isFormData = typeof FormData !== 'undefined' && payload instanceof FormData;
    return request('/enquiries', {
      method: 'POST',
      body: isFormData ? payload : JSON.stringify(payload),
    });
  },

  // ==========================================
  // AUTHENTICATION API
  // ==========================================

  login: async (credentials) => {
    const res = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    if (res.token) {
      localStorage.setItem('hh_admin_token', res.token);
    }
    return res;
  },

  logout: async () => {
    try {
      await request('/auth/logout', { method: 'POST' });
    } finally {
      localStorage.removeItem('hh_admin_token');
    }
  },

  getMe: () => request('/auth/me'),

  // ==========================================
  // PROTECTED ADMIN API
  // ==========================================

  // Dashboard Statistics
  getAdminStats: () => request('/admin/stats'),

  // Admin Products
  getAdminProducts: (params = {}) => {
    const query = new URLSearchParams();
    if (params.search) query.append('search', params.search);
    if (params.category) query.append('category', params.category);
    if (params.status) query.append('status', params.status);
    if (params.page) query.append('page', params.page);
    const qs = query.toString();
    return request(`/admin/products${qs ? `?${qs}` : ''}`);
  },

  getAdminProductById: (id) => request(`/admin/products/${id}`),

  createProduct: (payload) =>
    request('/admin/products', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  updateProduct: (id, payload) =>
    request(`/admin/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),

  deleteProduct: (id) =>
    request(`/admin/products/${id}`, {
      method: 'DELETE',
    }),

  updateProductStatus: (id, publicationStatus) =>
    request(`/admin/products/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ publicationStatus }),
    }),

  // Admin Categories
  getAdminCategories: () => request('/admin/categories'),

  createCategory: (payload) =>
    request('/admin/categories', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  updateCategory: (id, payload) =>
    request(`/admin/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),

  deleteCategory: (id) =>
    request(`/admin/categories/${id}`, {
      method: 'DELETE',
    }),

  // Admin Image Uploads
  uploadImages: (formData) =>
    request('/admin/upload', {
      method: 'POST',
      body: formData,
    }),

  deleteImage: (publicId) =>
    request(`/admin/images/${encodeURIComponent(publicId)}`, {
      method: 'DELETE',
    }),

  // Admin Enquiries
  getAdminEnquiries: (params = {}) => {
    const query = new URLSearchParams();
    if (params.status) query.append('status', params.status);
    if (params.search) query.append('search', params.search);
    if (params.page) query.append('page', params.page);
    const qs = query.toString();
    return request(`/admin/enquiries${qs ? `?${qs}` : ''}`);
  },

  getAdminEnquiryById: (id) => request(`/admin/enquiries/${id}`),

  updateEnquiryStatus: (id, status) =>
    request(`/admin/enquiries/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),

  updateEnquiryNotes: (id, internalNotes) =>
    request(`/admin/enquiries/${id}/notes`, {
      method: 'PATCH',
      body: JSON.stringify({ internalNotes }),
    }),

  // Admin Shop Settings
  getAdminShopSettings: () => request('/admin/shop-settings'),

  updateShopSettings: (payload) =>
    request('/admin/shop-settings', {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),

  // Admin Shop Services
  getAdminServices: () => request('/admin/services'),

  createService: (payload) =>
    request('/admin/services', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  updateService: (id, payload) =>
    request(`/admin/services/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),

  deleteService: (id) =>
    request(`/admin/services/${id}`, {
      method: 'DELETE',
    }),

  updateServiceStatus: (id, isPublished) =>
    request(`/admin/services/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ isPublished }),
    }),
};
