import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';

const ShopContext = createContext(null);

export function ShopProvider({ children }) {
  const [settings, setSettings] = useState(null);
  const [categories, setCategories] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchShopData = useCallback(async () => {
    try {
      const [settingsRes, categoriesRes, servicesRes] = await Promise.all([
        api.getShopSettings().catch(() => ({ data: null })),
        api.getCategories().catch(() => ({ data: [] })),
        api.getServices().catch(() => ({ data: [] })),
      ]);

      if (settingsRes?.data) setSettings(settingsRes.data);
      if (categoriesRes?.data) setCategories(categoriesRes.data);
      if (servicesRes?.data) setServices(servicesRes.data);
    } catch (err) {
      console.error('Failed to load shop settings:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchShopData();
  }, [fetchShopData]);

  return (
    <ShopContext.Provider
      value={{
        settings,
        categories,
        services,
        loading,
        refreshShopData: fetchShopData,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
}

export function useShop() {
  const ctx = useContext(ShopContext);
  if (!ctx) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return ctx;
}
