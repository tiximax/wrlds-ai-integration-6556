import React from 'react';
import { Users, ShoppingBag, Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { simpleProducts } from '@/data/simpleProducts';

interface ActivityItem {
  id: string;
  text: string;
  timestamp: number; // ms epoch
  icon: 'view' | 'purchase';
}

const names = [
  'Nguyen T.',
  'Tran H.',
  'Le Q.',
  'Pham A.',
  'Do K.',
  'Bui N.',
  'Hoang M.',
  'Vu D.'
];

function timeAgo(ms: number) {
  const seconds = Math.max(0, Math.floor((Date.now() - ms) / 1000));
  if (seconds < 10) return 'just now';
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  return `${hours}h ago`;
}

// Generate a deterministic initial list for hydration stability
function seedActivities(limit = 6): ActivityItem[] {
  const items: ActivityItem[] = [];
  const prods = simpleProducts.slice(0, 4);
  for (let i = 0; i < limit; i++) {
    const p = prods[i % prods.length];
    const name = names[i % names.length];
    const icon: ActivityItem['icon'] = i % 3 === 0 ? 'view' : 'purchase';
    const ts = Date.now() - (i + 1) * 15_000; // each 15s apart
    items.push({
      id: `seed-${i}`,
      text:
        icon === 'purchase'
          ? `${name} purchased ${p.name}`
          : `${name} viewed ${p.name}`,
      timestamp: ts,
      icon
    });
  }
  return items;
}

const LiveActivityFeed: React.FC<{
  maxItems?: number;
  intervalMs?: number;
  className?: string;
}> = ({ maxItems = 8, intervalMs = 12000, className = '' }) => {
  const { t } = useTranslation();
  const [items, setItems] = React.useState<ActivityItem[]>(() => seedActivities(Math.min(6, maxItems)));
  const pool = React.useRef(simpleProducts.slice(0, 6));
  const namePool = React.useRef(names);

  React.useEffect(() => {
    const id = window.setInterval(() => {
      try {
        const p = pool.current[Math.floor(Math.random() * pool.current.length)];
        const who = namePool.current[Math.floor(Math.random() * namePool.current.length)];
        const icon: ActivityItem['icon'] = Math.random() < 0.5 ? 'purchase' : 'view';
        const next: ActivityItem = {
          id: `${Date.now()}`,
          text: icon === 'purchase'
            ? t('trust.liveActivity.purchased', { who, product: p.name })
            : t('trust.liveActivity.viewed', { who, product: p.name }),
          timestamp: Date.now(),
          icon
        };
        // Prepend, cap length
        setItems(prev => [next, ...prev].slice(0, maxItems));
      } catch {
        /* no-op */
      }
    }, intervalMs);
    return () => window.clearInterval(id);
  }, [intervalMs, maxItems]);

  return (
    <section className={`mt-10 ${className}`} data-testid="live-activity-feed">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-gsa-primary" />
          <h3 className="text-lg font-semibold text-gray-900">{t('trust.liveActivity.title')}</h3>
        </div>
        <div className="flex items-center text-xs text-gray-500 gap-1">
          <Clock className="w-4 h-4" />
          <span>{t('trust.liveActivity.updatesEvery', { seconds: Math.round(intervalMs / 1000) })}</span>
        </div>
      </div>
      <div className="divide-y divide-gray-200 rounded-lg border bg-white" role="list">
        {items.map((it) => (
          <div key={it.id} className="px-4 py-3 flex items-center justify-between" data-testid="live-activity-item">
            <div className="flex items-center gap-3 min-w-0">
              {it.icon === 'purchase' ? (
                <ShoppingBag className="w-4 h-4 text-emerald-600" />
              ) : (
                <Users className="w-4 h-4 text-blue-600" />
              )}
              <p className="text-sm text-gray-800 truncate" title={it.text}>{it.text}</p>
            </div>
            <span className="text-xs text-gray-500 whitespace-nowrap">{timeAgo(it.timestamp)}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default LiveActivityFeed;