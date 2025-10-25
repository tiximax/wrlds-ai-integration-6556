import React from 'react';
import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import SkeletonLoader from '../SkeletonLoader';

describe('SkeletonLoader - Cơ sở skeleton component', () => {
  it('should render skeleton with default props', () => {
    const { container } = render(<SkeletonLoader />);
    const skeleton = container.querySelector('.skeleton-loader');

    expect(skeleton).toBeTruthy();
    expect(skeleton?.classList.contains('skeleton-loader--animated')).toBe(true);
  });

  it('should render with custom dimensions', () => {
    const { container } = render(<SkeletonLoader width={200} height={100} />);
    const skeleton = container.querySelector('.skeleton-loader') as HTMLElement;

    expect(skeleton?.style.width).toBe('200px');
    expect(skeleton?.style.height).toBe('100px');
  });

  it('should support string dimensions', () => {
    const { container } = render(
      <SkeletonLoader width="50%" height="80px" />
    );
    const skeleton = container.querySelector('.skeleton-loader') as HTMLElement;

    expect(skeleton?.style.width).toBe('50%');
    expect(skeleton?.style.height).toBe('80px');
  });

  it('should apply custom border radius', () => {
    const { container } = render(<SkeletonLoader borderRadius={12} />);
    const skeleton = container.querySelector('.skeleton-loader') as HTMLElement;

    expect(skeleton?.style.borderRadius).toBe('12px');
  });

  it('should disable animation when animated=false', () => {
    const { container } = render(<SkeletonLoader animated={false} />);
    const skeleton = container.querySelector('.skeleton-loader');

    expect(skeleton?.classList.contains('skeleton-loader--animated')).toBe(false);
  });

  it('should apply custom className', () => {
    const { container } = render(
      <SkeletonLoader className="custom-class" />
    );
    const skeleton = container.querySelector('.skeleton-loader');

    expect(skeleton?.classList.contains('custom-class')).toBe(true);
  });

  it('should have accessibility attributes', () => {
    const { container } = render(<SkeletonLoader />);
    const skeleton = container.querySelector('.skeleton-loader');

    expect(skeleton?.getAttribute('role')).toBe('status');
    expect(skeleton?.getAttribute('aria-label')).toBe('Đang tải dữ liệu...');
  });
});
