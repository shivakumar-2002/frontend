// Frontend API Service for Hari Hara Jewellery Works
const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '/api').replace(/\/+$/, '');

/**
 * Universal fetch wrapper supporting JSON & FormData, credentials, and token auth.
 */
async function request(endpoint, options = {}) {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = `${API_BASE_URL}${cleanEndpoint}`;

  const headers = { ...(options.headers || {}) };

  // Attach admin bearer token if available
  const token = localStorage.getItem('hh_admin_token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  let body = options.body;
  // If body is a plain object, stringify to JSON and set Content-Type
  if (body && !(body instanceof FormData) && typeof body === 'object') {
    headers['Content-Type'] = 'application/json';
    body = JSON.stringify(body);
  }

  const response = await fetch(url, {
    ...options,
    headers,
    body,
    credentials: 'include',
  });

  const contentType = response.headers.get('content-type') || '';
  let data;
  if (contentType.includes('application/json')) {
    data = await response.json();
  } else {
    const text = await response.text();
    data = { success: response.ok, message: text };
  }

  if (!response.ok) {
    const error = new Error(data?.message || `Request failed with status ${response.status}`);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

/**
 * Helper to construct URL query strings from an object
 */
function toQueryString(params = {}) {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, value);
    }
  });
  const qs = searchParams.toString();
  return qs ? `?${qs}` : '';
}

export const api = {
  // Base config helper
  getBaseUrl: () => API_BASE_URL,

  // ==========================================
  // Authentication
  // ==========================================
  login: async (credentials) => {
    const res = await request('/auth/login', {
      method: 'POST',
      body: credentials,
    });
    if (res?.token) {
      localStorage.setItem('hh_admin_token', res.token);
    }
    return res;
  },

  logout: async () => {
    try {
      return await request('/auth/logout', { method: 'POST' });
    } finally {
      localStorage.removeItem('hh_admin_token');
    }
  },

  getMe: async () => {
    return request('/auth/me');
  },

  // ==========================================
  // Public Products
  // ==========================================
  getProducts: async (params = {}) => {
    return request(`/products${toQueryString(params)}`);
  },

  getProductById: async (id) => {
    return request(`/products/${id}`);
  },

  getProductBySlug: async (slug) => {
    return request(`/products/${slug}`);
  },

  // ==========================================
  // Admin Products
  // ==========================================
  getAdminProducts: async (params = {}) => {
    return request(`/admin/products${toQueryString(params)}`);
  },

  getAdminProductById: async (id) => {
    return request(`/admin/products/${id}`);
  },

  createProduct: async (productData) => {
    return request('/admin/products', {
      method: 'POST',
      body: productData,
    });
  },

  updateProduct: async (id, productData) => {
    return request(`/admin/products/${id}`, {
      method: 'PUT',
      body: productData,
    });
  },

  deleteProduct: async (id) => {
    return request(`/admin/products/${id}`, {
      method: 'DELETE',
    });
  },

  updateProductStatus: async (id, status) => {
    return request(`/admin/products/${id}/status`, {
      method: 'PATCH',
      body: { status },
    });
  },

  // ==========================================
  // Categories (Public & Admin)
  // ==========================================
  getCategories: async () => {
    return request('/categories');
  },

  getAdminCategories: async () => {
    return request('/admin/categories');
  },

  createCategory: async (categoryData) => {
    return request('/admin/categories', {
      method: 'POST',
      body: categoryData,
    });
  },

  updateCategory: async (id, categoryData) => {
    return request(`/admin/categories/${id}`, {
      method: 'PUT',
      body: categoryData,
    });
  },

  deleteCategory: async (id) => {
    return request(`/admin/categories/${id}`, {
      method: 'DELETE',
    });
  },

  // ==========================================
  // Services (Public & Admin)
  // ==========================================
  getServices: async () => {
    return request('/services');
  },

  getAdminServices: async () => {
    return request('/admin/services');
  },

  createService: async (serviceData) => {
    return request('/admin/services', {
      method: 'POST',
      body: serviceData,
    });
  },

  updateService: async (id, serviceData) => {
    return request(`/admin/services/${id}`, {
      method: 'PUT',
      body: serviceData,
    });
  },

  deleteService: async (id) => {
    return request(`/admin/services/${id}`, {
      method: 'DELETE',
    });
  },

  updateServiceStatus: async (id, isPublished) => {
    const payload = typeof isPublished === 'boolean' ? { isPublished } : isPublished;
    return request(`/admin/services/${id}/status`, {
      method: 'PATCH',
      body: payload,
    });
  },

  // ==========================================
  // Shop Settings (Public & Admin)
  // ==========================================
  getShopSettings: async () => {
    return request('/shop-settings');
  },

  getAdminShopSettings: async () => {
    return request('/admin/shop-settings');
  },

  updateShopSettings: async (settingsData) => {
    return request('/admin/shop-settings', {
      method: 'PUT',
      body: settingsData,
    });
  },

  // ==========================================
  // Enquiries (Public & Admin)
  // ==========================================
  submitEnquiry: async (enquiryData) => {
    return request('/enquiries', {
      method: 'POST',
      body: enquiryData,
    });
  },

  getAdminEnquiries: async (params = {}) => {
    return request(`/admin/enquiries${toQueryString(params)}`);
  },

  updateEnquiryStatus: async (id, status) => {
    return request(`/admin/enquiries/${id}/status`, {
      method: 'PATCH',
      body: { status },
    });
  },

  updateEnquiryNotes: async (id, notes) => {
    return request(`/admin/enquiries/${id}/notes`, {
      method: 'PATCH',
      body: { notes },
    });
  },

  // ==========================================
  // Admin Dashboard Statistics
  // ==========================================
  getAdminStats: async () => {
    return request('/admin/stats');
  },

  // ==========================================
  // Uploads
  // ==========================================
  uploadImages: async (formData) => {
    return request('/admin/upload', {
      method: 'POST',
      body: formData,
    });
  },

  // ==========================================
  // Authentication (Admin)
  // ==========================================
  login: async (credentials) => {
    const res = await request('/auth/login', {
      method: 'POST',
      body: credentials,
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
    return { success: true };
  },

  getMe: async () => {
    return request('/auth/me');
  },
};

export default api;
