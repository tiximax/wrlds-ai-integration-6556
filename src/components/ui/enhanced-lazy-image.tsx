import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ImageOff, Loader2 } from 'lucide-react';

interface EnhancedLazyImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  onLoad?: () => void;
  onError?: () => void;
  showSkeleton?: boolean;
  aspectRatio?: 'square' | 'video' | 'portrait' | 'landscape' | string;
  blurDataURL?: string;
  sizes?: string;
  quality?: number;
  placeholder?: 'blur' | 'skeleton' | 'shimmer' | 'none';
}

// Generate blur data URL from dimensions
const generateBlurDataURL = (width: number = 40, height: number = 30) => {
  const canvas = typeof window !== 'undefined' ? document.createElement('canvas') : null;
  if (!canvas) return '';
  
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  
  if (ctx) {
    // Create a simple gradient blur placeholder
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, '#f3f4f6');
    gradient.addColorStop(0.5, '#e5e7eb');
    gradient.addColorStop(1, '#f9fafb');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
  }
  
  return canvas.toDataURL('image/jpeg', 0.1);
};

// Shimmer keyframe animation
const shimmerStyle = {
  background: 'linear-gradient(110deg, transparent 40%, rgba(255, 255, 255, 0.5) 50%, transparent 60%)',
  backgroundSize: '200% 100%',
  animation: 'shimmer 2s ease-in-out infinite'
};

const EnhancedLazyImage: React.FC<EnhancedLazyImageProps> = ({
  src,
  alt,
  className = '',
  width,
  height,
  priority = false,
  onLoad,
  onError,
  showSkeleton = true,
  aspectRatio,
  blurDataURL,
  sizes,
  quality = 75,
  placeholder = 'skeleton'
}) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [inView, setInView] = useState(priority);
  const [imageLoading, setImageLoading] = useState(false);
  
  const imgRef = useRef<HTMLImageElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Generate blur placeholder if not provided
  const blurPlaceholder = blurDataURL || (width && height ? generateBlurDataURL(width, height) : generateBlurDataURL());

  // Aspect ratio classes
  const getAspectRatioClass = () => {
    switch (aspectRatio) {
      case 'square':
        return 'aspect-square';
      case 'video':
        return 'aspect-video';
      case 'portrait':
        return 'aspect-[3/4]';
      case 'landscape':
        return 'aspect-[4/3]';
      default:
        return aspectRatio ? `aspect-[${aspectRatio}]` : '';
    }
  };

  useEffect(() => {
    if (priority) {
      setInView(true);
      return;
    }

    // Create intersection observer for lazy loading
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setInView(true);
            if (observerRef.current && containerRef.current) {
              observerRef.current.unobserve(containerRef.current);
            }
          }
        });
      },
      {
        rootMargin: '100px 0px', // Load images 100px before they come into view
        threshold: 0.1
      }
    );

    if (containerRef.current) {
      observerRef.current.observe(containerRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [priority]);

  const handleLoad = () => {
    setLoaded(true);
    setImageLoading(false);
    onLoad?.();
  };

  const handleError = () => {
    setError(true);
    setImageLoading(false);
    onError?.();
  };

  const handleLoadStart = () => {
    setImageLoading(true);
  };

  // Animation variants
  const imageVariants = {
    hidden: { 
      opacity: 0, 
      scale: 1.1,
      filter: 'blur(10px)' 
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      filter: 'blur(0px)',
      transition: { 
        duration: 0.6, 
        ease: 'easeOut' 
      }
    }
  };

  const skeletonVariants = {
    visible: { opacity: 1 },
    hidden: { 
      opacity: 0,
      transition: { delay: 0.2, duration: 0.3 }
    }
  };

  const SkeletonPlaceholder = () => (
    <motion.div
      variants={skeletonVariants}
      initial="visible"
      animate={loaded ? "hidden" : "visible"}
      className="absolute inset-0 bg-gray-200 animate-pulse"
    >
      <div className="w-full h-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-gray-400">
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      </div>
    </motion.div>
  );

  const BlurPlaceholder = () => (
    <motion.div
      variants={skeletonVariants}
      initial="visible"
      animate={loaded ? "hidden" : "visible"}
      className="absolute inset-0"
    >
      <img
        src={blurPlaceholder}
        alt=""
        className="w-full h-full object-cover filter blur-sm scale-110"
      />
    </motion.div>
  );

  const ShimmerPlaceholder = () => (
    <motion.div
      variants={skeletonVariants}
      initial="visible"
      animate={loaded ? "hidden" : "visible"}
      className="absolute inset-0 bg-gray-200"
    >
      <div 
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(110deg, #f3f4f6 40%, rgba(255, 255, 255, 0.8) 50%, #f3f4f6 60%)',
          backgroundSize: '200% 100%',
          animation: 'shimmer 2s ease-in-out infinite'
        }}
      />
      <style jsx>{`
        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
      `}</style>
    </motion.div>
  );

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative overflow-hidden bg-gray-100',
        getAspectRatioClass(),
        className
      )}
    >
      {/* Placeholder based on type */}
      {!loaded && !error && placeholder !== 'none' && (
        <>
          {placeholder === 'skeleton' && <SkeletonPlaceholder />}
          {placeholder === 'blur' && <BlurPlaceholder />}
          {placeholder === 'shimmer' && <ShimmerPlaceholder />}
        </>
      )}

      {/* Loading indicator */}
      <AnimatePresence>
        {imageLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center bg-gray-50/80 backdrop-blur-sm z-10"
          >
            <div className="flex items-center gap-2 text-gray-600">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm">Loading...</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main image */}
      <AnimatePresence>
        {inView && !error && (
          <motion.img
            ref={imgRef}
            src={src}
            alt={alt}
            width={width}
            height={height}
            sizes={sizes}
            onLoad={handleLoad}
            onError={handleError}
            onLoadStart={handleLoadStart}
            loading={priority ? 'eager' : 'lazy'}
            decoding="async"
            variants={imageVariants}
            initial="hidden"
            animate={loaded ? "visible" : "hidden"}
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
      </AnimatePresence>

      {/* Error fallback */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="absolute inset-0 w-full h-full bg-gray-100 flex flex-col items-center justify-center text-gray-400"
          >
            <motion.div
              animate={{ y: [0, -2, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <ImageOff className="w-8 h-8 mb-2" />
            </motion.div>
            <p className="text-xs font-medium">Image unavailable</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Optional overlay for additional effects */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Gradient overlay for better text readability if needed */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
    </div>
  );
};

export default EnhancedLazyImage;
