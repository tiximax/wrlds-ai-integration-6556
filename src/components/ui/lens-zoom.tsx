import React, { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface LensZoomProps {
  src: string;
  alt?: string;
  zoom?: number; // e.g. 2
  lensSize?: number; // px
  className?: string;
}

const LensZoom: React.FC<LensZoomProps> = ({ src, alt = '', zoom = 2, lensSize = 160, className }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [active, setActive] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.style.backgroundImage = `url(${src})`;
    el.style.backgroundRepeat = 'no-repeat';
    el.style.backgroundSize = `${zoom * 100}% auto`;
  }, [src, zoom]);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;
    x = Math.max(0, Math.min(rect.width, x));
    y = Math.max(0, Math.min(rect.height, y));
    setPos({ x, y });

    const bgX = (x / rect.width) * 100;
    const bgY = (y / rect.height) * 100;
    el.style.backgroundPosition = `${bgX}% ${bgY}%`;
  };

  const lensStyle: React.CSSProperties = {
    width: lensSize,
    height: lensSize,
    borderRadius: '50%',
    pointerEvents: 'none',
    position: 'absolute',
    left: pos.x - lensSize / 2,
    top: pos.y - lensSize / 2,
    border: '2px solid rgba(255,255,255,0.9)',
    boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
    display: active ? 'block' : 'none',
  };

  return (
    <div className={cn('relative select-none', className)}>
      <div
        ref={containerRef}
        className="relative w-full h-full overflow-hidden bg-gray-100"
        onMouseEnter={() => setActive(true)}
        onMouseLeave={() => setActive(false)}
        onMouseMove={onMove}
        data-testid="lens-zoom"
        data-active={active ? 'true' : 'false'}
        aria-label="lens-zoom-container"
      >
        <img src={src} alt={alt} className="w-full h-full object-cover" draggable={false} />
        <div style={lensStyle} />
      </div>
    </div>
  );
};

export default LensZoom;
