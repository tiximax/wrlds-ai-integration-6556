import React from 'react';
import SkeletonLoader from './SkeletonLoader';
import './CartSummarySkeleton.css';

/**
 * CartSummarySkeleton - Skeleton cho CartSummary component
 * Hiển thị subtotal, discount, tax, total, và shipping info
 */
const CartSummarySkeleton: React.FC = () => (
  <div className="cart-summary-skeleton" role="status" aria-label="Đang tải thông tin giỏ hàng...">
    <div className="cart-summary-skeleton__header">
      <SkeletonLoader width="120px" height="24px" borderRadius={4} />
    </div>

    <div className="cart-summary-skeleton__items">
      {/* Line item 1 - Subtotal */}
      <div className="cart-summary-skeleton__row">
        <SkeletonLoader width="80px" height="16px" borderRadius={4} />
        <SkeletonLoader width="100px" height="16px" borderRadius={4} />
      </div>

      {/* Line item 2 - Discount */}
      <div className="cart-summary-skeleton__row">
        <SkeletonLoader width="80px" height="16px" borderRadius={4} />
        <SkeletonLoader width="100px" height="16px" borderRadius={4} />
      </div>

      {/* Line item 3 - Tax */}
      <div className="cart-summary-skeleton__row">
        <SkeletonLoader width="80px" height="16px" borderRadius={4} />
        <SkeletonLoader width="100px" height="16px" borderRadius={4} />
      </div>

      {/* Line item 4 - Shipping */}
      <div className="cart-summary-skeleton__row">
        <SkeletonLoader width="80px" height="16px" borderRadius={4} />
        <SkeletonLoader width="100px" height="16px" borderRadius={4} />
      </div>
    </div>

    {/* Total - Bold và lớn hơn */}
    <div className="cart-summary-skeleton__divider" />
    <div className="cart-summary-skeleton__total">
      <SkeletonLoader width="100px" height="20px" borderRadius={4} />
      <SkeletonLoader width="120px" height="20px" borderRadius={4} />
    </div>

    {/* Checkout button skeleton */}
    <div className="cart-summary-skeleton__button">
      <SkeletonLoader width="100%" height="44px" borderRadius={6} />
    </div>

    {/* Continue shopping link skeleton */}
    <div className="cart-summary-skeleton__link">
      <SkeletonLoader width="150px" height="16px" borderRadius={4} />
    </div>
  </div>
);

export default CartSummarySkeleton;
