import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

import { INITIAL_MEDIA, INITIAL_PRODUCTS, INITIAL_SITE_SETTINGS, INITIAL_SWAP_PROGRAM, INITIAL_USERS } from './seed';
import { AdminSession, Product, Role, SiteSettings, SwapProgramContent, UserProfile } from './types';

// Same keys as the website's localStorage demo mode.
const STORAGE_KEYS = {
  PRODUCTS: 'dr_apple_products',
  SETTINGS: 'dr_apple_settings',
  SWAP: 'dr_apple_swap',
  USERS: 'dr_apple_users',
  MEDIA: 'dr_apple_media',
  SESSION: 'dr_apple_admin_session',
};

export type NewProduct = Omit<Product, 'id' | 'created_at'>;

interface CMSContextValue {
  ready: boolean;
  products: Product[];
  settings: SiteSettings;
  swapProgram: SwapProgramContent;
  users: UserProfile[];
  media: string[];
  session: AdminSession | null;
  addProduct: (data: NewProduct) => void;
  updateProduct: (id: string, data: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  saveSiteSettings: (settings: SiteSettings) => void;
  saveSwapProgram: (content: SwapProgramContent) => void;
  updateUserRole: (userId: string, role: Role) => void;
  addMedia: (url: string) => void;
  login: (session: AdminSession) => void;
  logout: () => void;
}

const CMSContext = createContext<CMSContextValue | null>(null);

/** Reads a saved value, falling back when it is missing, unparsable or the wrong shape (e.g. after an app update). */
async function load<T>(key: string, fallback: T): Promise<T> {
  try {
    const saved = await AsyncStorage.getItem(key);
    if (!saved) return fallback;
    const parsed: unknown = JSON.parse(saved);
    if (fallback !== null) {
      const sameShape = Array.isArray(fallback)
        ? Array.isArray(parsed)
        : typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed);
      if (!sameShape) return fallback;
      // Objects: fill in fields added since the value was saved.
      if (!Array.isArray(fallback)) return { ...fallback, ...(parsed as object) } as T;
    }
    return parsed as T;
  } catch (e) {
    if (__DEV__) console.error(e);
    return fallback;
  }
}

function persist(key: string, value: unknown) {
  const write = value === null ? AsyncStorage.removeItem(key) : AsyncStorage.setItem(key, JSON.stringify(value));
  write.catch((e) => {
    if (__DEV__) console.error(e);
  });
}

export function CMSProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [settings, setSettings] = useState<SiteSettings>(INITIAL_SITE_SETTINGS);
  const [swapProgram, setSwapProgram] = useState<SwapProgramContent>(INITIAL_SWAP_PROGRAM);
  const [users, setUsers] = useState<UserProfile[]>(INITIAL_USERS);
  const [media, setMedia] = useState<string[]>(INITIAL_MEDIA);
  const [session, setSession] = useState<AdminSession | null>(null);

  useEffect(() => {
    (async () => {
      const [p, s, sw, u, m, sess] = await Promise.all([
        load(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS),
        load(STORAGE_KEYS.SETTINGS, INITIAL_SITE_SETTINGS),
        load(STORAGE_KEYS.SWAP, INITIAL_SWAP_PROGRAM),
        load(STORAGE_KEYS.USERS, INITIAL_USERS),
        load(STORAGE_KEYS.MEDIA, INITIAL_MEDIA),
        load<AdminSession | null>(STORAGE_KEYS.SESSION, null),
      ]);
      setProducts(p);
      setSettings(s);
      setSwapProgram(sw);
      setUsers(u);
      setMedia(m);
      setSession(sess);
      setReady(true);
    })();
  }, []);

  // Functional updates so two quick edits in a row never overwrite each other.
  const commitProducts = (update: (prev: Product[]) => Product[]) =>
    setProducts((prev) => {
      const next = update(prev);
      persist(STORAGE_KEYS.PRODUCTS, next);
      return next;
    });

  const value: CMSContextValue = {
    ready,
    products,
    settings,
    swapProgram,
    users,
    media,
    session,
    addProduct: (data) => {
      const product: Product = { ...data, id: `prod-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, created_at: new Date().toISOString() };
      commitProducts((prev) => [product, ...prev]);
    },
    updateProduct: (id, data) => {
      commitProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, ...data, updated_at: new Date().toISOString() } : p)),
      );
    },
    deleteProduct: (id) => commitProducts((prev) => prev.filter((p) => p.id !== id)),
    saveSiteSettings: (next) => {
      setSettings(next);
      persist(STORAGE_KEYS.SETTINGS, next);
    },
    saveSwapProgram: (next) => {
      setSwapProgram(next);
      persist(STORAGE_KEYS.SWAP, next);
    },
    updateUserRole: (userId, role) => {
      setUsers((prev) => {
        const next = prev.map((u) => (u.id === userId ? { ...u, role } : u));
        persist(STORAGE_KEYS.USERS, next);
        return next;
      });
    },
    addMedia: (url) => {
      if (!url) return;
      setMedia((prev) => {
        if (prev.includes(url)) return prev;
        const next = [url, ...prev];
        persist(STORAGE_KEYS.MEDIA, next);
        return next;
      });
    },
    login: (next) => {
      setSession(next);
      persist(STORAGE_KEYS.SESSION, next);
    },
    logout: () => {
      setSession(null);
      persist(STORAGE_KEYS.SESSION, null);
    },
  };

  return <CMSContext.Provider value={value}>{children}</CMSContext.Provider>;
}

export function useCMS(): CMSContextValue {
  const ctx = useContext(CMSContext);
  if (!ctx) throw new Error('useCMS must be used inside <CMSProvider>');
  return ctx;
}
