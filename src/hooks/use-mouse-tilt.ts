import { useRef, useCallback, useState, useEffect } from 'react';

interface TiltConfig {
  maxTilt?: number;
  perspective?: number;
  scale?: number;
  speed?: number;
  disableAxis?: 'x' | 'y';
  reverse?: boolean;
}

interface TiltValues {
  x: number;
  y: number;
  scale: number;
}

export const useMouseTilt = (config: TiltConfig = {}) => {
  const {
    maxTilt = 20,
    perspective = 1000,
    scale = 1.05,
    speed = 0.15,
    disableAxis,
    reverse = false
  } = config;

  const ref = useRef<HTMLElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [tilt, setTilt] = useState<TiltValues>({ x: 0, y: 0, scale: 1 });
  const animationRef = useRef<number>();

  const handleMouseMove = useCallback((event: MouseEvent) => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = (event.clientX - centerX) / (rect.width / 2);
    const deltaY = (event.clientY - centerY) / (rect.height / 2);

    const tiltX = deltaY * maxTilt * (reverse ? -1 : 1);
    const tiltY = deltaX * maxTilt * (reverse ? 1 : -1);

    const newTilt = {
      x: disableAxis === 'x' ? 0 : tiltX,
      y: disableAxis === 'y' ? 0 : tiltY,
      scale: isHovered ? scale : 1
    };

    // Smooth interpolation
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    const animate = () => {
      setTilt(current => ({
        x: current.x + (newTilt.x - current.x) * speed,
        y: current.y + (newTilt.y - current.y) * speed,
        scale: current.scale + (newTilt.scale - current.scale) * speed
      }));
    };

    animationRef.current = requestAnimationFrame(animate);
  }, [maxTilt, scale, speed, disableAxis, reverse, isHovered]);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
    document.addEventListener('mousemove', handleMouseMove);
  }, [handleMouseMove]);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    document.removeEventListener('mousemove', handleMouseMove);
    
    // Reset tilt smoothly
    const resetTilt = () => {
      setTilt(current => {
        const newTilt = {
          x: current.x * (1 - speed),
          y: current.y * (1 - speed),
          scale: current.scale + (1 - current.scale) * speed
        };

        // Continue animation until values are close to target
        if (Math.abs(newTilt.x) > 0.1 || Math.abs(newTilt.y) > 0.1 || Math.abs(newTilt.scale - 1) > 0.001) {
          requestAnimationFrame(resetTilt);
        }

        return newTilt;
      });
    };

    resetTilt();
  }, [handleMouseMove, speed]);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    element.addEventListener('mouseenter', handleMouseEnter);
    element.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      element.removeEventListener('mouseenter', handleMouseEnter);
      element.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mousemove', handleMouseMove);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [handleMouseEnter, handleMouseLeave, handleMouseMove]);

  const tiltStyle = {
    transform: `perspective(${perspective}px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(${tilt.scale})`,
    transformStyle: 'preserve-3d' as const,
    transition: isHovered ? 'none' : 'transform 0.5s ease-out'
  };

  return { ref, tilt, tiltStyle, isHovered };
};
