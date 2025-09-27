import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { trackEvent, flushQueue } from '@/utils/analytics';
import { getSegmentation } from '@/utils/segmentation';

export type AnalyticsBase = {
  sessionId: string;
  userId: string;
  segmentation: Record<string, any>;
};

export type AnalyticsContextValue = {
  base: AnalyticsBase;
  track: (name: string, props?: Record<string, any>) => void;
  identify: (userId: string) => void;
  setUserProperties: (props: Record<string, any>) => void;
};

const AnalyticsContext = createContext<AnalyticsContextValue | null>(null);

function genId() {
  try {
    // @ts-ignore
    if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  } catch {}
  return 'uid-' + Math.random().toString(36).slice(2) + Date.now().toString(36);
}

const UID_KEY = 'wrlds:uid';
const UPROPS_KEY = 'wrlds:uproperties';

export const AnalyticsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const sessionRef = useRef<string>(genId());
  const [userId, setUserId] = useState<string>(() => {
    try {
      const v = localStorage.getItem(UID_KEY);
      if (v) return v;
      const n = genId();
      localStorage.setItem(UID_KEY, n);
      return n;
    } catch { return genId(); }
  });
  const [userProps, setUserProps] = useState<Record<string, any>>(() => {
    try { return JSON.parse(localStorage.getItem(UPROPS_KEY) || '{}'); } catch { return {}; }
  });
  const [segmentation, setSegmentation] = useState<Record<string, any>>({});

  useEffect(() => {
    setSegmentation(getSegmentation());
  }, []);

  useEffect(() => {
    const onHide = () => { try { flushQueue(); } catch {} };
    window.addEventListener('pagehide', onHide);
    return () => window.removeEventListener('pagehide', onHide);
  }, []);

  const base = useMemo<AnalyticsBase>(() => ({
    sessionId: sessionRef.current,
    userId,
    segmentation,
  }), [userId, segmentation]);

  const track = (name: string, props?: Record<string, any>) => {
    const merged = { ...userProps, ...props, sessionId: base.sessionId, userId: base.userId, seg: base.segmentation };
    trackEvent(name, merged);
  };

  const identify = (nextId: string) => {
    try { localStorage.setItem(UID_KEY, nextId); } catch {}
    setUserId(nextId);
  };

  const setUserProperties = (props: Record<string, any>) => {
    try { localStorage.setItem(UPROPS_KEY, JSON.stringify({ ...userProps, ...props })); } catch {}
    setUserProps(p => ({ ...p, ...props }));
  };

  const value: AnalyticsContextValue = { base, track, identify, setUserProperties };
  return <AnalyticsContext.Provider value={value}>{children}</AnalyticsContext.Provider>;
};

export function useAnalytics() {
  const ctx = useContext(AnalyticsContext);
  if (!ctx) throw new Error('useAnalytics must be used within AnalyticsProvider');
  return ctx;
}
