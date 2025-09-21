import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect, lazy, Suspense } from "react";
import { SimpleCartProvider } from "@/contexts/SimpleCartContext";
import { WishlistProvider } from "@/contexts/WishlistContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { addResourceHints, preloadCriticalResources } from "@/utils/performance";
import { LoadingAnimation } from "@/components/LoadingAnimation";

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

const App = () => {
  const [queryClient] = useState(() => new QueryClient());

  useEffect(() => {
    // Add performance optimizations
    addResourceHints();
    preloadCriticalResources();
  }, []);

  return (
    <LanguageProvider>
      <SimpleCartProvider>
        <WishlistProvider>
          <QueryClientProvider client={queryClient}>
          <TooltipProvider>
          <Toaster />
          <Sonner />
        <BrowserRouter>
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
            <Route path="*" element={<NotFound />} />
          </Routes>
          </Suspense>
        </BrowserRouter>
          </TooltipProvider>
          </QueryClientProvider>
        </WishlistProvider>
      </SimpleCartProvider>
    </LanguageProvider>
  );
};

export default App;