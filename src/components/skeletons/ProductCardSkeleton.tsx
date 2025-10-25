import React from 'react';
import SkeletonLoader from './SkeletonLoader';
import './ProductCardSkeleton.css';

/**
 * ProductCardSkeleton - Skeleton của ProductCard
 * Hiển thị placeholder cho hình ảnh, tên, giá, rating
 */
interface ProductCardSkeletonProps {
  /** Số lượng cards cần hiển thị */
  count?: number;
}

const ProductCardSkeletonItem: React.FC = () => (
  <div className="product-card-skeleton" role="status" aria-label="Đang tải thông tin sản phẩm...">
    {/* Image skeleton */}
    <div className="product-card-skeleton__image-container">
      <SkeletonLoader
        width="100%"
        height="200px"
        borderRadius={8}
        className="product-card-skeleton__image"
      />
      {/* Badge skeleton */}
      <div className="product-card-skeleton__badge">
        <SkeletonLoader width="60px" height="24px" borderRadius={4} />
      </div>
    </div>

    {/* Content skeleton */}
    <div className="product-card-skeleton__content">
      {/* Title - 2 lines */}
      <div className="product-card-skeleton__title">
        <SkeletonLoader width="100%" height="16px" borderRadius={4} />
        <SkeletonLoader width="80%" height="16px" borderRadius={4} />
      </div>

      {/* Rating skeleton */}
      <div className="product-card-skeleton__rating">
        <SkeletonLoader width="100px" height="16px" borderRadius={4} />
      </div>

      {/* Price skeleton */}
      <div className="product-card-skeleton__price">
        <SkeletonLoader width="80px" height="20px" borderRadius={4} />
      </div>

      {/* Add to cart button skeleton */}
      <div className="product-card-skeleton__button">
        <SkeletonLoader width="100%" height="40px" borderRadius={6} />
      </div>
    </div>
  </div>
);

const ProductCardSkeleton: React.FC<ProductCardSkeletonProps> = ({ count = 1 }) => {
  return (
    <div className="product-card-skeleton-grid">
      {Array.from({ length: count }).map((_, idx) => (
        <ProductCardSkeletonItem key={idx} />
      ))}
    </div>
  );
};

export default ProductCardSkeleton;
