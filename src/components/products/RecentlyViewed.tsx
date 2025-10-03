import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { simpleProducts } from '@/data/simpleProducts';
import { getRecentlyViewedIds } from '@/utils/recentlyViewed';
import { cn } from '@/lib/utils';

interface RecentlyViewedProps {
  excludeId?: string;
  className?: string;
}

const RecentlyViewed: React.FC<RecentlyViewedProps> = ({ excludeId, className }) => {
  const [version, setVersion] = useState(0);

  useEffect(() => {
    const onUpdate = () => setVersion(v => v + 1);
    window.addEventListener('rv:update', onUpdate as EventListener);
    window.addEventListener('storage', onUpdate as EventListener);
    return () => {
      window.removeEventListener('rv:update', onUpdate as EventListener);
      window.removeEventListener('storage', onUpdate as EventListener);
    };
  }, []);

  const ids = getRecentlyViewedIds();
  const items = ids
    .filter(id => id !== excludeId)
    .map(id => simpleProducts.find(p => p.id === id))
    .filter(Boolean)
    .slice(0, 8) as typeof simpleProducts;

  if (!items.length) return null;

  return (
    <div className={cn("mt-8", className)} data-testid="recently-viewed">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Recently Viewed</h2>
      <div className="flex gap-4 overflow-x-auto pb-2 -mx-2 px-2">
        {items.map(p => (
          <Link
            key={p.id}
            to={`/products/${p.slug}`}
            className="min-w-[200px] w-[200px] bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="aspect-square overflow-hidden rounded-t-lg bg-gray-50">
              <img src={p.images[0]?.url} alt={p.images[0]?.alt || p.name} className="w-full h-full object-cover" />
            </div>
            <div className="p-3">
              <div className="text-sm font-medium text-gray-900 line-clamp-2">{p.name}</div>
              <div className="text-sm text-gray-600 mt-1">
                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(p.sellingPrice)}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RecentlyViewed;
