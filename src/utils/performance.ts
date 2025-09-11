// Performance optimization utilities

/**
 * Preload critical resources
 */
export const preloadResource = (href: string, as: string, type?: string): void => {
  const link = document.createElement('link');
  link.rel = 'preload';
  link.href = href;
  link.as = as;
  if (type) link.type = type;
  document.head.appendChild(link);
};

/**
 * Prefetch resources for next navigation
 */
export const prefetchResource = (href: string): void => {
  const link = document.createElement('link');
  link.rel = 'prefetch';
  link.href = href;
  document.head.appendChild(link);
};

/**
 * Preconnect to external domains
 */
export const preconnectToOrigin = (origin: string): void => {
  const link = document.createElement('link');
  link.rel = 'preconnect';
  link.href = origin;
  link.crossOrigin = 'anonymous';
  document.head.appendChild(link);
};

/**
 * Resource hints for better loading performance
 */
export const addResourceHints = (): void => {
  // Preconnect to external image services
  preconnectToOrigin('https://images.unsplash.com');
  preconnectToOrigin('https://fonts.googleapis.com');
  preconnectToOrigin('https://fonts.gstatic.com');
  
  // Prefetch important pages
  prefetchResource('/about');
  prefetchResource('/services');
};

/**
 * Critical resource preloading
 */
export const preloadCriticalResources = (): void => {
  // Preload fonts
  preloadResource('/fonts/inter-var.woff2', 'font', 'font/woff2');
  
  // Preload hero images
  preloadResource('/hero-background.webp', 'image');
  preloadResource('/logo.svg', 'image');
};
