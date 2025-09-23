import React from 'react';
import { Link } from 'react-router-dom';
import { simpleProducts } from '@/data/simpleProducts';
import type { Product } from '@/types/simple';
import SimpleProductCard from '@/components/SimpleProductCard';

interface ProductRecommendationsProps {
  current: Product;
  maxItems?: number;
}

function scoreProduct(current: Product, candidate: Product): number {
  if (current.id === candidate.id) return -Infinity;
  let score = 0;
  if (candidate.category.slug === current.category.slug) score += 3;
  const tagOverlap = candidate.tags.filter(t => current.tags.includes(t)).length;
  score += tagOverlap;
  if (candidate.origin === current.origin) score += 1;
  if (candidate.trending) score += 1;
  if (candidate.featured) score += 1;
  // Closer price proximity gets small boost
  const priceDiff = Math.abs(candidate.sellingPrice - current.sellingPrice);
  score += Math.max(0, 2 - Math.min(priceDiff / 1_000_000, 2));
  return score;
}

const ProductRecommendations: React.FC<ProductRecommendationsProps> = ({ current, maxItems = 6 }) => {
  const recs = [...simpleProducts]
    .filter(p => p.id !== current.id)
    .map(p => ({ p, score: scoreProduct(current, p) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, maxItems)
    .map(x => x.p);

  if (!recs.length) return null;

  return (
    <div className="mt-12" data-testid="product-recommendations">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">Recommended for you</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
        {recs.map(product => (
          <SimpleProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default ProductRecommendations;
