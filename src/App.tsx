import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useState, useEffect, lazy, Suspense } from "react";
import { SimpleCartProvider } from "@/contexts/SimpleCartContext";
import { WishlistProvider } from "@/contexts/WishlistContext";
import { CompareProvider } from "@/contexts/CompareContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { addResourceHints, preloadCriticalResources } from "@/utils/performance";
import { LoadingAnimation } from "@/components/LoadingAnimation";
import { AnalyticsProvider, useAnalytics } from "@/contexts/AnalyticsContext";

// Lazy load pages for better performance
const Index = lazy(() => import("./pages/Index"));
const NotFound = lazy(() => import("./pages/NotFound"));
const FireCatProject = lazy(() => import("./pages/FireCatProject"));
const SportRetailProject = lazy(() => import("./pages/SportRetailProject"));
const WorkwearProject = lazy(() => import("./pages/WorkwearProject"));
const HockeyProject = lazy(() => import("./pages/HockeyProject"));
const PetProject = lazy(() => import("./pages/PetProject"));
const TechDetails = lazy(() => import("./pages/TechDetails"));
const DevelopmentProcess = lazy(() => import("./pages/DevelopmentProcess"));
const About = lazy(() => import("./pages/About"));
const Careers = lazy(() => import("./pages/Careers"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogPostDetail = lazy(() => import("./pages/BlogPostDetail"));
const SimpleProducts = lazy(() => import("./pages/SimpleProducts"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const CategoryPage = lazy(() => import("./pages/CategoryPage"));
const SearchResults = lazy(() => import("./pages/SearchResults"));
const Wishlist = lazy(() => import("./pages/Wishlist"));
const Checkout = lazy(() => import("./pages/Checkout"));
const VectorDB = lazy(() => import("./pages/VectorDB"));

const PageViewTracker = () => {
  const { track } = useAnalytics();
  const loc = useLocation();
  useEffect(() => {
    try {
      track('page_view', {
        path: loc.pathname,
        search: loc.search,
        title: document.title,
        referrer: document.referrer || ''
      });
    } catch {}
  }, [loc.pathname, loc.search]);
  return null;
};

const App = () => {
  const [queryClient] = useState(() => new QueryClient());

  useEffect(() => {
    // Add performance optimizations
    addResourceHints();
    preloadCriticalResources();

    // Web Vitals
    try {
      const { initWebVitals } = require('@/utils/webVitals') as typeof import('@/utils/webVitals');
      initWebVitals();
    } catch {}

    // Service Worker (runtime cache for assets/images)
    try {
      if ('serviceWorker' in navigator) {
        // Ưu tiên Dev SW nếu được bật qua env (áp dụng cả dev và preview)
        const enableDevSw = (import.meta as any).env?.VITE_ENABLE_DEV_SW;
        const usePwa = (import.meta as any).env?.PROD || (import.meta as any).env?.VITE_ENABLE_PWA;
        // VitePWA mặc định tạo file '/sw.js' khi bật generateSW
        const swUrl = enableDevSw ? '/dev-sw.js' : (usePwa ? '/sw.js' : null);
        if (swUrl) {
          navigator.serviceWorker.register(swUrl).catch(() => {});
        }
      }
    } catch {}
  }, []);

  return (
    <LanguageProvider>
      <AnalyticsProvider>
      <SimpleCartProvider>
        <WishlistProvider>
          <CompareProvider>
          <QueryClientProvider client={queryClient}>
          <TooltipProvider>
          <Toaster />
          <Sonner />
        <BrowserRouter>
          <PageViewTracker />
          <Suspense fallback={
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-white">
              <div className="text-center space-y-4">
                <LoadingAnimation variant="wave" size="lg" />
                <p className="text-gray-600 text-sm font-medium">Loading...</p>
              </div>
            </div>
          }>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/projects/firecat" element={<FireCatProject />} />
            <Route path="/projects/sport-retail" element={<SportRetailProject />} />
            <Route path="/projects/workwear" element={<WorkwearProject />} />
            <Route path="/projects/hockey" element={<HockeyProject />} />
            <Route path="/projects/pet-tracker" element={<PetProject />} />
            <Route path="/tech-details" element={<TechDetails />} />
            <Route path="/development-process" element={<DevelopmentProcess />} />
            <Route path="/about" element={<About />} />
            <Route path="/careers" element={<Careers />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPostDetail />} />
            <Route path="/products" element={<SimpleProducts />} />
            <Route path="/products/:slug" element={<ProductDetail />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/category/:categorySlug" element={<CategoryPage />} />
            <Route path="/category/:categorySlug/:subcategorySlug" element={<CategoryPage />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/vector-db" element={<VectorDB />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          </Suspense>
        </BrowserRouter>
          </TooltipProvider>
          </QueryClientProvider>
          </CompareProvider>
        </WishlistProvider>
      </SimpleCartProvider>
      </AnalyticsProvider>
    </LanguageProvider>
  );
};

export default App;