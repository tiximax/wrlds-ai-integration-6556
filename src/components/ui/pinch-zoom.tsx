import React, { useRef, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';

interface PinchZoomProps {
  children: React.ReactNode;
  className?: string;
  maxScale?: number;
  minScale?: number;
  doubleTapScale?: number;
  initialScale?: number;
}

// Lightweight pinch+pan+double-tap zoom wrapper
// - Uses Pointer Events for 1-finger pan and 2-finger pinch
// - Double click/tap toggles between initialScale and doubleTapScale
// - Exposes data-scale attribute for testing
export const PinchZoom: React.FC<PinchZoomProps> = ({
  children,
  className,
  maxScale = 3,
  minScale = 1,
  doubleTapScale = 2,
  initialScale = 1,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);

  const state = useRef({
    scale: initialScale,
    tx: 0,
    ty: 0,
    // pointers
    pointers: new Map<number, { x: number; y: number }>(),
    // gesture start snapshot
    start: {
      scale: initialScale,
      tx: 0,
      ty: 0,
      distance: 0,
      center: { x: 0, y: 0 },
    },
    lastTap: { time: 0, x: 0, y: 0 },
  });

  const setTransform = useCallback(() => {
    const el = contentRef.current;
    if (!el) return;
    const { scale, tx, ty } = state.current;
    el.style.transform = `translate(${tx}px, ${ty}px) scale(${scale})`;
    el.setAttribute('data-scale', scale.toFixed(3));
    if (containerRef.current) {
      containerRef.current.setAttribute('data-scale', scale.toFixed(3));
    }
  }, []);

  const getCenter = (points: { x: number; y: number }[]) => {
    const sum = points.reduce((acc, p) => ({ x: acc.x + p.x, y: acc.y + p.y }), { x: 0, y: 0 });
    return { x: sum.x / points.length, y: sum.y / points.length };
  };

  const distance = (a: { x: number; y: number }, b: { x: number; y: number }) => {
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    return Math.hypot(dx, dy);
  };

  const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

  const toLocalPoint = (clientX: number, clientY: number) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return { x: clientX, y: clientY };
    return { x: clientX - rect.left, y: clientY - rect.top };
  };

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const container = containerRef.current;
    if (!container) return;
    container.setPointerCapture?.(e.pointerId);
    const pt = toLocalPoint(e.clientX, e.clientY);
    state.current.pointers.set(e.pointerId, pt);

    // double-tap (or double-click) detection
    const now = Date.now();
    const last = state.current.lastTap;
    const dt = now - last.time;
    const dist = Math.hypot(pt.x - last.x, pt.y - last.y);
    if (dt < 500 && dist < 30) {
      // toggle
      const nextScale = Math.abs(state.current.scale - initialScale) < 0.01 ? doubleTapScale : initialScale;

      // anchor on tap point
      const { scale, tx, ty } = state.current;
      const sx = (pt.x - tx) / scale;
      const sy = (pt.y - ty) / scale;
      state.current.scale = clamp(nextScale, minScale, maxScale);
      state.current.tx = pt.x - state.current.scale * sx;
      state.current.ty = pt.y - state.current.scale * sy;
      setTransform();
      // reset last tap to avoid triple chain
      state.current.lastTap = { time: 0, x: 0, y: 0 };
      return;
    }
    // store tap for future double detection
    state.current.lastTap = { time: now, x: pt.x, y: pt.y };

    // snapshot for gesture
    state.current.start.scale = state.current.scale;
    state.current.start.tx = state.current.tx;
    state.current.start.ty = state.current.ty;

    if (state.current.pointers.size === 2) {
      const points = Array.from(state.current.pointers.values());
      const c = getCenter(points);
      state.current.start.center = c;
      state.current.start.distance = distance(points[0], points[1]);
    }
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!state.current.pointers.has(e.pointerId)) return;
    const pt = toLocalPoint(e.clientX, e.clientY);
    state.current.pointers.set(e.pointerId, pt);

    const container = containerRef.current;
    if (!container) return;

    if (state.current.pointers.size === 2) {
      // pinch
      const points = Array.from(state.current.pointers.values());
      const newDist = distance(points[0], points[1]);
      const c = getCenter(points);
      const startDist = state.current.start.distance || newDist;
      const factor = newDist / (startDist || 1);
      let nextScale = clamp(state.current.start.scale * factor, minScale, maxScale);

      // keep focal point under fingers
      const { tx: startTx, ty: startTy, scale: startScale } = state.current.start;
      const sx = (c.x - startTx) / (startScale || 1);
      const sy = (c.y - startTy) / (startScale || 1);
      state.current.scale = nextScale;
      state.current.tx = c.x - nextScale * sx;
      state.current.ty = c.y - nextScale * sy;
      setTransform();
    } else if (state.current.pointers.size === 1) {
      // pan
      const current = pt;
      const startCenter = state.current.start.center || current;
      const dx = current.x - startCenter.x;
      const dy = current.y - startCenter.y;
      state.current.tx = state.current.start.tx + dx;
      state.current.ty = state.current.start.ty + dy;
      setTransform();
    }
  };

  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    const container = containerRef.current;
    if (!container) return;
    container.releasePointerCapture?.(e.pointerId);
    state.current.pointers.delete(e.pointerId);
    // reset start center to current pointer if any
    const points = Array.from(state.current.pointers.values());
    state.current.start.tx = state.current.tx;
    state.current.start.ty = state.current.ty;
    state.current.start.scale = state.current.scale;
    state.current.start.center = points[0] || { x: 0, y: 0 };
    state.current.start.distance = points.length === 2 ? distance(points[0], points[1]) : 0;
  };

  const onWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    // zoom with ctrl+wheel or trackpad pinch (deltaY)
    e.preventDefault();
    const pt = toLocalPoint(e.clientX, e.clientY);
    const { scale, tx, ty } = state.current;
    const delta = -e.deltaY; // natural: wheel up zoom in
    const zoomIntensity = 0.0015;
    const nextScale = clamp(scale * (1 + delta * zoomIntensity), minScale, maxScale);

    const sx = (pt.x - tx) / scale;
    const sy = (pt.y - ty) / scale;

    state.current.scale = nextScale;
    state.current.tx = pt.x - nextScale * sx;
    state.current.ty = pt.y - nextScale * sy;
    setTransform();
  };

  useEffect(() => {
    setTransform();
  }, [setTransform]);

  const onDoubleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const pt = toLocalPoint(e.clientX, e.clientY);
    const nextScale = Math.abs(state.current.scale - initialScale) < 0.01 ? doubleTapScale : initialScale;
    const { scale, tx, ty } = state.current;
    const sx = (pt.x - tx) / scale;
    const sy = (pt.y - ty) / scale;
    state.current.scale = clamp(nextScale, minScale, maxScale);
    state.current.tx = pt.x - state.current.scale * sx;
    state.current.ty = pt.y - state.current.scale * sy;
    setTransform();
  };

  return (
    <div
      ref={containerRef}
      className={cn('relative overflow-hidden touch-none select-none', className)}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onWheel={onWheel}
      onDoubleClick={onDoubleClick}
      data-testid="pinch-zoom"
      role="presentation"
    >
      <div ref={contentRef} style={{ transformOrigin: '0 0' }}>
        {children}
      </div>
    </div>
  );
};
