import { useEffect, useRef } from 'react';
import { useAnalytics } from '@/contexts/AnalyticsContext';

function hash(str: string): number {
  let h = 0, i = 0, len = str.length;
  while (i < len) { h = ((h << 5) - h + str.charCodeAt(i++)) | 0; }
  return Math.abs(h);
}

export function assignVariant(userId: string, experimentId: string, variants: string[]): string {
  if (!variants.length) return 'control';
  const idx = hash(`${userId}:${experimentId}`) % variants.length;
  return variants[idx];
}

const EXPOSED_KEY = 'wrlds:exp:exposed';

export function useExperiment(experimentId: string, variants: string[]) {
  const { base, track } = useAnalytics();
  const assigned = assignVariant(base.userId, experimentId, variants);
  const exposedRef = useRef(false);

  useEffect(() => {
    try {
      const map = JSON.parse(localStorage.getItem(EXPOSED_KEY) || '{}');
      const key = `${experimentId}:${assigned}`;
      if (!map[key]) {
        track('experiment_exposure', { experimentId, variant: assigned });
        map[key] = Date.now();
        localStorage.setItem(EXPOSED_KEY, JSON.stringify(map));
      }
      exposedRef.current = true;
    } catch {
      // best-effort
    }
  }, [experimentId, assigned, track]);

  return { variant: assigned } as const;
}
