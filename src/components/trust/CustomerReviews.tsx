import React from 'react';
import { Star } from 'lucide-react';

interface Review {
  id: string;
  author: string;
  rating: number; // 1..5
  content: string;
  date: string;
  photos?: string[];
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
    date: '2025-09-12',
    photos: ['/lovable-uploads/11e92b89-ed02-453a-9888-56cd91807f2d.png']
  },
  {
    id: 'r3',
    author: 'Le Q.',
    rating: 5,
    content: 'Đúng mô tả, giá hợp lý. Đáng tiền!',
    date: '2025-09-15',
    photos: ['/lovable-uploads/078a129e-0f98-4d91-af61-873687db1a04.png','/lovable-uploads/3de85ddd-15e1-4216-9697-f91abb9a47ce.png']
  }
];

const CustomerReviews: React.FC = () => {
  const [sortBy, setSortBy] = React.useState<'latest' | 'highest' | 'lowest'>('latest');
  const [withPhotos, setWithPhotos] = React.useState(false);

  const average =
    sampleReviews.length > 0
      ? sampleReviews.reduce((sum, r) => sum + r.rating, 0) / sampleReviews.length
      : 0;

  const list = React.useMemo(() => {
    let arr = [...sampleReviews];
    if (withPhotos) arr = arr.filter(r => (r.photos && r.photos.length > 0));
    if (sortBy === 'latest') {
      arr.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    } else if (sortBy === 'highest') {
      arr.sort((a, b) => b.rating - a.rating);
    } else {
      arr.sort((a, b) => a.rating - b.rating);
    }
    return arr;
  }, [sortBy, withPhotos]);

  return (
    <section className="mt-8" data-testid="customer-reviews">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-900">Customer Reviews</h3>
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              className="accent-blue-600"
              checked={withPhotos}
              onChange={(e) => setWithPhotos(e.target.checked)}
              data-testid="review-filter-photos"
            />
            With photos
          </label>
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <span>{average.toFixed(1)} / 5 ({sampleReviews.length})</span>
            <select
              className="border rounded px-2 py-1 text-sm"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              data-testid="review-sort"
            >
              <option value="latest">Latest</option>
              <option value="highest">Highest rating</option>
              <option value="lowest">Lowest rating</option>
            </select>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {list.map((r) => (
          <div key={r.id} className="p-3 border border-gray-200 rounded-md bg-white" data-testid="review-item" data-rating={r.rating}>
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-900">{r.author}</span>
                <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-green-50 text-green-700 border border-green-200 text-[10px]" data-testid="verified-badge">Verified</span>
              </div>
              <span className="text-xs text-gray-500">{new Date(r.date).toLocaleDateString('vi-VN')}</span>
            </div>
            <div className="flex items-center gap-1 mb-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`w-3 h-3 ${i < r.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
              ))}
            </div>
            <p className="text-sm text-gray-700 mb-2">{r.content}</p>
            {r.photos && r.photos.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap">
                {r.photos.map((src, idx) => (
                  <img key={idx} src={src} alt="review" className="w-14 h-14 rounded object-cover border" data-testid="review-photo" />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default CustomerReviews;
