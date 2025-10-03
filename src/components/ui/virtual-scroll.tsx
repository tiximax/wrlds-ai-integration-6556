import React from 'react';

interface VirtualScrollProps<T> {
  items: T[];
  itemHeight: number; // px
  height: number; // container height px
  overscan?: number; // number of extra items above/below
  renderItem: (item: T, index: number) => React.ReactNode;
  className?: string;
  'data-testid'?: string;
}

export function VirtualScroll<T>({ items, itemHeight, height, overscan = 4, renderItem, className = '', 'data-testid': testId }: VirtualScrollProps<T>) {
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const [scrollTop, setScrollTop] = React.useState(0);

  const totalHeight = items.length * itemHeight;
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const visibleCount = Math.ceil(height / itemHeight) + overscan * 2;
  const endIndex = Math.min(items.length, startIndex + visibleCount);
  const offsetY = startIndex * itemHeight;

  const onScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop((e.target as HTMLDivElement).scrollTop);
  };

  return (
    <div
      ref={containerRef}
      onScroll={onScroll}
      style={{ height, overflowY: 'auto', willChange: 'transform' }}
      className={className}
      data-testid={testId || 'virtual-scroll'}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div style={{ position: 'absolute', top: offsetY, left: 0, right: 0 }}>
          {items.slice(startIndex, endIndex).map((item, i) => (
            <div key={startIndex + i} style={{ height: itemHeight }} data-testid="vs-item">
              {renderItem(item, startIndex + i)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default VirtualScroll;