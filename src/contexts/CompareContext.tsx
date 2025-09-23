import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { simpleProducts } from '@/data/simpleProducts';
import type { Product } from '@/types/simple';

interface CompareContextType {
  ids: string[];
  items: Product[];
  add: (id: string) => void;
  remove: (id: string) => void;
  clear: () => void;
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);

const STORAGE_KEY = 'compare-list';

export const CompareProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [ids, setIds] = useState<string[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const arr = raw ? JSON.parse(raw) : [];
      setIds(Array.isArray(arr) ? arr : []);
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
    } catch {}
  }, [ids]);

  const add = (id: string) => setIds(prev => (prev.includes(id) ? prev : [...prev, id].slice(0, 4)));
  const remove = (id: string) => setIds(prev => prev.filter(x => x !== id));
  const clear = () => setIds([]);

  const items = useMemo(() => ids.map(id => simpleProducts.find(p => p.id === id)).filter(Boolean) as Product[], [ids]);

  const value = { ids, items, add, remove, clear };
  return <CompareContext.Provider value={value}>{children}</CompareContext.Provider>;
};

export const useCompare = (): CompareContextType => {
  const ctx = useContext(CompareContext);
  if (!ctx) throw new Error('useCompare must be used within CompareProvider');
  return ctx;
};
