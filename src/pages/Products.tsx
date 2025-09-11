import React, { useState, useMemo, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import FilterBar from '../components/products/FilterBar';
import ProductGrid from '../components/ProductGrid';
import { mockProducts } from '../data/products';
import { Product } from '@/types/product';
import { applyFilters, FilterState, defaultFilters } from '@/utils/productFilters';
import { applySorting, SortOption } from '@/utils/productSorting';

const Products: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Initialize filters from URL or defaults
  const [filters, setFilters] = useState<FilterState>(() => {
    const urlSearch = searchParams.get('search') || '';
    const urlOrigins = searchParams.get('origins')?.split(',').filter(Boolean) || [];
    const urlStatus = searchParams.get('status')?.split(',').filter(Boolean) || [];
    const urlTypes = searchParams.get('types')?.split(',').filter(Boolean) || [];
    const urlBrands = searchParams.get('brands')?.split(',').filter(Boolean) || [];
    const urlMinPrice = parseInt(searchParams.get('minPrice') || '0');
    const urlMaxPrice = parseInt(searchParams.get('maxPrice') || '100000000');
    const urlQuickFilter = searchParams.get('quickFilter') || '';
    
    return {
      search: urlSearch,
      origins: urlOrigins,
      status: urlStatus,
      types: urlTypes,
      brands: urlBrands,
      priceRange: [urlMinPrice, urlMaxPrice] as [number, number],
      quickFilter: urlQuickFilter,
    };
  });

  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || 'newest');
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page') || '1'));
  const [isLoading, setIsLoading] = useState(false);

  // Update URL when filters change
  useEffect(() => {
    const newSearchParams = new URLSearchParams();
    
    if (filters.search) newSearchParams.set('search', filters.search);
    if (filters.origins.length) newSearchParams.set('origins', filters.origins.join(','));
    if (filters.status.length) newSearchParams.set('status', filters.status.join(','));
    if (filters.types.length) newSearchParams.set('types', filters.types.join(','));
    if (filters.brands.length) newSearchParams.set('brands', filters.brands.join(','));
    if (filters.priceRange[0] !== defaultFilters.priceRange[0]) newSearchParams.set('minPrice', filters.priceRange[0].toString());
    if (filters.priceRange[1] !== defaultFilters.priceRange[1]) newSearchParams.set('maxPrice', filters.priceRange[1].toString());
    if (filters.quickFilter) newSearchParams.set('quickFilter', filters.quickFilter);
    if (sortBy !== 'newest') newSearchParams.set('sortBy', sortBy);
    if (currentPage !== 1) newSearchParams.set('page', currentPage.toString());

    setSearchParams(newSearchParams);
  }, [filters, sortBy, currentPage, setSearchParams]);

  // Filter and sort products using utility functions
  const filteredProducts = useMemo(() => {
    // First apply all filters
    const filtered = applyFilters(mockProducts, filters);
    
    // Then apply sorting
    const sorted = applySorting(filtered, sortBy as SortOption);
    
    return sorted;
  }, [filters, sortBy]);

  const handleFiltersChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handleSortChange = (newSortBy: string) => {
    setSortBy(newSortBy);
    setCurrentPage(1); // Reset to first page when sorting changes
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Generate SEO metadata
  const pageTitle = `${t('products.title')} | Global Shopping Assistant`;
  const pageDescription = t('products.meta.description');
  const canonicalUrl = `${window.location.origin}/products`;

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta name="keywords" content={t('products.meta.keywords')} />
        <link rel="canonical" href={canonicalUrl} />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:image" content="/og-products.jpg" />
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={canonicalUrl} />
        <meta property="twitter:title" content={pageTitle} />
        <meta property="twitter:description" content={pageDescription} />
        <meta property="twitter:image" content="/og-products.jpg" />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": t('products.title'),
            "description": pageDescription,
            "url": canonicalUrl,
            "mainEntity": {
              "@type": "ItemList",
              "numberOfItems": filteredProducts.length,
              "itemListElement": filteredProducts.slice(0, 10).map((product, index) => ({
                "@type": "Product",
                "position": index + 1,
                "name": product.name,
                "description": product.description,
                "image": product.images?.[0]?.url || '',
                "brand": {
                  "@type": "Brand",
                  "name": product.brand?.name || 'Unknown'
                },
                "offers": {
                  "@type": "Offer",
                  "price": product.sellingPrice,
                  "priceCurrency": "VND",
                  "availability": product.status === 'available' ? "https://schema.org/InStock" : "https://schema.org/PreOrder"
                }
              }))
            }
          })}
        </script>
        
        {/* Alternate language versions */}
        <link rel="alternate" hrefLang="vi" href={`${canonicalUrl}?lang=vi`} />
        <link rel="alternate" hrefLang="en" href={`${canonicalUrl}?lang=en`} />
        <link rel="alternate" hrefLang="x-default" href={canonicalUrl} />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Header Section */}
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Breadcrumbs */}
            <nav className="mb-4">
              <ol className="flex items-center space-x-2 text-sm text-gray-500">
                <li>
                  <a href="/" className="hover:text-gsa-primary transition-colors">
                    {t('common.home')}
                  </a>
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 mx-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-900 font-medium">{t('products.title')}</span>
                </li>
              </ol>
            </nav>

            {/* Page Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {t('products.title')}
                </h1>
                <p className="text-lg text-gray-600 max-w-2xl">
                  {t('products.subtitle')}
                </p>
              </div>
              
              {/* Results Count */}
              <div className="mt-4 lg:mt-0">
                <div className="bg-gsa-primary/10 text-gsa-primary px-4 py-2 rounded-lg inline-block">
                  <span className="font-semibold">
                    {filteredProducts.length} {t('products.resultsFound')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="lg:grid lg:grid-cols-4 lg:gap-8">
            {/* Filter Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-8">
                <FilterBar
                  filters={filters}
                  onFiltersChange={handleFiltersChange}
                  totalResults={filteredProducts.length}
                  isLoading={isLoading}
                />
              </div>
            </div>

            {/* Product Grid */}
            <div className="lg:col-span-3 mt-8 lg:mt-0">
              <ProductGrid
                products={filteredProducts}
                sortBy={sortBy}
                onSortChange={handleSortChange}
                currentPage={currentPage}
                onPageChange={handlePageChange}
                isLoading={isLoading}
                totalResults={filteredProducts.length}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Products;
