import React from 'react';
import { Product } from '@/types/simple';
import { Star } from 'lucide-react';

interface ProductReviewsProps {
  product: Product;
}

const ProductReviews: React.FC<ProductReviewsProps> = ({ product }) => {
  const rating = product.rating;
  const reviews = product.reviews || [];

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-gray-900">Reviews</h3>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`w-4 h-4 ${i < Math.floor(rating.average) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
            ))}
          </div>
          <span>
            {rating.average}/5 ({rating.count} reviews)
          </span>
        </div>
      </div>

      {reviews.length === 0 ? (
        <div className="p-4 border rounded-lg bg-gray-50 text-gray-600">
          Chưa có đánh giá.
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((r) => (
            <div key={r.id} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="font-medium">{r.userName}</div>
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-4 h-4 ${i < r.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                  ))}
                </div>
              </div>
              <div className="text-sm text-gray-800 mb-1">{r.title}</div>
              <div className="text-sm text-gray-600">{r.content}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductReviews;