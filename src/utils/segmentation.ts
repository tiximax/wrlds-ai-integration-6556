export type Segmentation = {
  isReturning: boolean;
  visits: number;
  device: 'mobile' | 'tablet' | 'desktop';
  locale: string;
  referrerHost: string;
  source: 'direct' | 'internal' | 'external';
};

const VISITS_KEY = 'wrlds:visits';
const FIRST_SEEN_KEY = 'wrlds:firstSeen';

function getDevice(): Segmentation['device'] {
  try {
    const w = typeof window !== 'undefined' ? window.innerWidth : 1024;
    if (w < 768) return 'mobile';
    if (w < 1024) return 'tablet';
    return 'desktop';
  } catch { return 'desktop'; }
}

function getReferrer() {
  try {
    const ref = document.referrer || '';
    if (!ref) return { referrerHost: '', source: 'direct' as const };
    const url = new URL(ref);
    const same = url.host === window.location.host;
    return { referrerHost: url.host, source: same ? ('internal' as const) : ('external' as const) };
  } catch { return { referrerHost: '', source: 'direct' as const }; }
}

export function getSegmentation(): Segmentation {
  let visits = 0;
  try {
    visits = parseInt(localStorage.getItem(VISITS_KEY) || '0', 10) || 0;
    localStorage.setItem(VISITS_KEY, String(visits + 1));
  } catch {}
  try {
    if (!localStorage.getItem(FIRST_SEEN_KEY)) {
      localStorage.setItem(FIRST_SEEN_KEY, String(Date.now()));
    }
  } catch {}
  const isReturning = visits > 0;
  const device = getDevice();
  const locale = (typeof navigator !== 'undefined' && (navigator as any).language) || 'en-US';
  const { referrerHost, source } = getReferrer();
  return { isReturning, visits: visits + 1, device, locale, referrerHost, source };
}
