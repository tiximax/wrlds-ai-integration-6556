import React from 'react';
import { Star } from 'lucide-react';

interface Props {
  average: number; // 0..5
  count: number;   // total reviews
  className?: string;
}

function computeDistribution(average: number, count: number) {
  // Simple heuristic distribution centered around average
  // Returns counts per star from 5..1
  const base = [0.4, 0.3, 0.15, 0.1, 0.05]; // sums to 1
  // Shift weights based on average (3 => center, >3 shift to high stars)
  const shift = Math.max(-2, Math.min(2, Math.round(average - 3)));
  let weights = [...base];
  for (let s = 0; s < Math.abs(shift); s++) {
    if (shift > 0) {
      // move weight from low stars to high stars
      weights[4] = Math.max(0, weights[4] - 0.05);
      weights[3] = Math.max(0, weights[3] - 0.03);
      weights[0] = Math.min(1, weights[0] + 0.05);
      weights[1] = Math.min(1, weights[1] + 0.03);
    } else {
      // move from high to low
      weights[0] = Math.max(0, weights[0] - 0.05);
      weights[1] = Math.max(0, weights[1] - 0.03);
      weights[4] = Math.min(1, weights[4] + 0.05);
      weights[3] = Math.min(1, weights[3] + 0.03);
    }
  }
  const totalWeight = weights.reduce((a, b) => a + b, 0);
  weights = weights.map(w => w / totalWeight);
  const rawCounts = weights.map(w => Math.round(w * count));
  // Adjust rounding to match total count
  let diff = count - rawCounts.reduce((a, b) => a + b, 0);
  let i = 0;
  while (diff !== 0 && i < 20) {
    const idx = diff > 0 ? (i % 5) : (4 - (i % 5));
    rawCounts[idx] += diff > 0 ? 1 : -1;
    diff = count - rawCounts.reduce((a, b) => a + b, 0);
    i++;
  }
  // Return for stars 5..1
  return rawCounts;
}

const RatingDistribution: React.FC<Props> = ({ average, count, className = '' }) => {
  const counts = React.useMemo(() => computeDistribution(average, count), [average, count]);
  const maxCount = Math.max(1, ...counts);
  const stars = [5, 4, 3, 2, 1];
  return (
    <section className={`w-full ${className}`} data-testid="rating-distribution">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Star className="w-4 h-4 text-yellow-500" />
          <span className="text-sm font-semibold text-gray-900">Ratings breakdown</span>
        </div>
        <div className="text-xs text-gray-600">Avg {average.toFixed(1)} • {count} reviews</div>
      </div>
      <div className="space-y-1.5">
        {stars.map((s, idx) => {
          const c = counts[idx] ?? 0;
          const pct = Math.round((c / maxCount) * 100);
          return (
            <div key={s} className="flex items-center gap-3">
              <div className="w-10 text-xs text-gray-700">{s}★</div>
              <div className="flex-1 h-2 bg-gray-100 rounded">
                <div className="h-2 bg-yellow-400 rounded" style={{ width: `${pct}%` }} />
              </div>
              <div className="w-12 text-right text-xs text-gray-600">{c}</div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default RatingDistribution;