import React from 'react';
import { Star } from 'lucide-react';

interface Review {
  id: string;
  author: string;
  rating: number; // 1..5
  content: string;
  date: string;
}

const sampleReviews: Review[] = [
  {
    id: 'r1',
    author: 'Nguyen T.',
    rating: 5,
    content: 'Sản phẩm tốt, giao hàng nhanh. Rất hài lòng! 👍',
    date: '2025-09-10'
  },
  {
    id: 'r2',
    author: 'Tran H.',
    rating: 4,
    content: 'Chất lượng ổn, đóng gói cẩn thận. Sẽ ủng hộ tiếp.',
    date: '2025-09-12'
  },
  {
    id: 'r3',
    author: 'Le Q.',
    rating: 5,
    content: 'Đúng mô tả, giá hợp lý. Đáng tiền!',
    date: '2025-09-15'
  }
];

const CustomerReviews: React.FC = () => {
  const average =
    sampleReviews.length > 0
      ? sampleReviews.reduce((sum, r) => sum + r.rating, 0) / sampleReviews.length
      : 0;

  return (
    <section className="mt-8" data-testid="customer-reviews">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-900">Customer Reviews</h3>
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${i < Math.round(average) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
              />
            ))}
          </div>
          <span>
            {average.toFixed(1)} / 5 ({sampleReviews.length})
          </span>
        </div>
      </div>

      <div className="space-y-3">
        {sampleReviews.map((r) => (
          <div key={r.id} className="p-3 border border-gray-200 rounded-md bg-white">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium text-gray-900">{r.author}</span>
              <span className="text-xs text-gray-500">{new Date(r.date).toLocaleDateString('vi-VN')}</span>
            </div>
            <div className="flex items-center gap-1 mb-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`w-3 h-3 ${i < r.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
              ))}
            </div>
            <p className="text-sm text-gray-700">{r.content}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CustomerReviews;
