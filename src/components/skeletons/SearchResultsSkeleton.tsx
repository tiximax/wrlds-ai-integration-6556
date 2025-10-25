import React from 'react';
import SkeletonLoader from './SkeletonLoader';
import './SearchResultsSkeleton.css';

/**
 * SearchResultsSkeleton - Skeleton cho search results page
 * Hiển thị filters sidebar + product grid
 */
interface SearchResultsSkeletonProps {
  /** Số lượng products hiển thị (default: 12) */
  productCount?: number;
  /** Có hiển thị filters sidebar không */
  showFilters?: boolean;
}

const SearchResultsSkeleton: React.FC<SearchResultsSkeletonProps> = ({
  productCount = 12,
  showFilters = true,
}) => (
  <div className="search-results-skeleton" role="status" aria-label="Đang tải kết quả tìm kiếm...">
    {/* Header/Search bar skeleton */}
    <div className="search-results-skeleton__header">
      <SkeletonLoader width="100%" height="44px" borderRadius={6} />
    </div>

    <div className="search-results-skeleton__container">
      {/* Filters sidebar */}
      {showFilters && (
        <aside className="search-results-skeleton__sidebar">
          <div className="search-results-skeleton__filter-group">
            <SkeletonLoader width="100%" height="20px" borderRadius={4} />
            <div className="search-results-skeleton__filter-items">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="search-results-skeleton__filter-item">
                  <SkeletonLoader width="16px" height="16px" borderRadius={2} />
                  <SkeletonLoader width="100px" height="16px" borderRadius={4} />
                </div>
              ))}
            </div>
          </div>

          {/* Price filter */}
          <div className="search-results-skeleton__filter-group">
            <SkeletonLoader width="100%" height="20px" borderRadius={4} />
            <div className="search-results-skeleton__price-inputs">
              <SkeletonLoader width="45%" height="36px" borderRadius={4} />
              <SkeletonLoader width="45%" height="36px" borderRadius={4} />
            </div>
          </div>

          {/* Rating filter */}
          <div className="search-results-skeleton__filter-group">
            <SkeletonLoader width="100%" height="20px" borderRadius={4} />
            {[1, 2, 3].map((i) => (
              <div key={i} className="search-results-skeleton__filter-item">
                <SkeletonLoader width="16px" height="16px" borderRadius={2} />
                <SkeletonLoader width="80px" height="16px" borderRadius={4} />
              </div>
            ))}
          </div>
        </aside>
      )}

      {/* Results grid */}
      <main className="search-results-skeleton__main">
        {/* Results info skeleton */}
        <div className="search-results-skeleton__info">
          <SkeletonLoader width="200px" height="20px" borderRadius={4} />
        </div>

        {/* Product grid */}
        <div className="search-results-skeleton__products">
          {Array.from({ length: productCount }).map((_, idx) => (
            <div key={idx} className="search-results-skeleton__product-card">
              <SkeletonLoader width="100%" height="200px" borderRadius={8} />
              <div className="search-results-skeleton__product-info">
                <SkeletonLoader width="100%" height="16px" borderRadius={4} />
                <SkeletonLoader width="80%" height="16px" borderRadius={4} />
                <SkeletonLoader width="100px" height="16px" borderRadius={4} />
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  </div>
);

export default SearchResultsSkeleton;
