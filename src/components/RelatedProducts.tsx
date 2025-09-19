import React from 'react';
import { simpleProducts } from '@/data/simpleProducts';
import { Product } from '@/types/simple';
import SimpleProductCard from '@/components/SimpleProductCard';

interface RelatedProductsProps {
  current: Product;
}

const RelatedProducts: React.FC<RelatedProductsProps> = ({ current }) => {
  const related = simpleProducts
    .filter(p => p.category.slug === current.category.slug && p.id !== current.id)
    .slice(0, 4);

  if (related.length === 0) return null;

  return (
    <div className="mt-12">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">Related Products</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {related.map((product) => (
          <SimpleProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;