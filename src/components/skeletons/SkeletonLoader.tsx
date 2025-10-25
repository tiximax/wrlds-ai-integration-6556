import React from 'react';
import './SkeletonLoader.css';

/**
 * SkeletonLoader - Cơ sở loader hiển thị khi đang load dữ liệu
 * Sử dụng CSS animation để tạo pulse effect ổn định
 */
interface SkeletonLoaderProps {
  /** Width của skeleton (px hoặc %) */
  width?: string | number;
  /** Height của skeleton (px hoặc %) */
  height?: string | number;
  /** Border radius (px) */
  borderRadius?: string | number;
  /** Thêm CSS class tùy chỉnh */
  className?: string;
  /** Có hiệu ứng pulse hay không */
  animated?: boolean;
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  width = '100%',
  height = '16px',
  borderRadius = '4px',
  className = '',
  animated = true,
}) => {
  const style: React.CSSProperties = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
    borderRadius: typeof borderRadius === 'number' ? `${borderRadius}px` : borderRadius,
  };

  return (
    <div
      className={`skeleton-loader ${animated ? 'skeleton-loader--animated' : ''} ${className}`}
      style={style}
      role="status"
      aria-label="Đang tải dữ liệu..."
    />
  );
};

export default SkeletonLoader;
