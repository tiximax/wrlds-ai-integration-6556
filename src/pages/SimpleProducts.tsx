import React, { useState, useMemo, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSearchParams } from 'react-router-dom';
import { SimpleProduct } from '@/types/simple';
import { simpleProducts } from '@/data/simpleProducts';
import SimpleProductCard from '@/components/SimpleProductCard';
import { EnhancedButton } from '@/components/ui/enhanced-button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, Grid, List, AlertCircle, RotateCcw } from 'lucide-react';
import PageLayout from '@/components/PageLayout';
import { ProductCardSkeleton } from '@/components/skeletons';
import { useLoadingState } from '@/hooks/useLoadingState';

const SimpleProducts: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // State
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedOrigin, setSelectedOrigin] = useState(searchParams.get('origin') || 'all');
  const [selectedStatus, setSelectedStatus] = useState(searchParams.get('status') || 'all');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'name');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  
  // Loading state with retry logic
  const { isLoading, error, load, retry } = useLoadingState({
    timeout: 8000,
    autoRetry: true,
    maxRetries: 3,
  });
  
  const ITEMS_PER_PAGE = 12;

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = simpleProducts.filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesOrigin = selectedOrigin === 'all' || product.origin === selectedOrigin;
      const matchesStatus = selectedStatus === 'all' || product.status === selectedStatus;
      
      return matchesSearch && matchesOrigin && matchesStatus;
    });

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.sellingPrice - b.sellingPrice;
        case 'price-high':
          return b.sellingPrice - a.sellingPrice;
        case 'rating':
          return b.rating.average - a.rating.average;
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'name':
        default:
          return a.name.localeCompare(b.name);
      }
    });

    return filtered;
  }, [searchTerm, selectedOrigin, selectedStatus, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = filteredAndSortedProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Update URL params
  const updateUrlParams = () => {
    const params = new URLSearchParams();
    if (searchTerm) params.set('search', searchTerm);
    if (selectedOrigin !== 'all') params.set('origin', selectedOrigin);
    if (selectedStatus !== 'all') params.set('status', selectedStatus);
    if (sortBy !== 'name') params.set('sort', sortBy);
    setSearchParams(params);
  };

  React.useEffect(() => {
    updateUrlParams();
  }, [searchTerm, selectedOrigin, selectedStatus, sortBy]);

  // Initialize loading with products
  useEffect(() => {
    load(async () => {
      // Simulate loading products (replace with real API call if needed)
      return simpleProducts;
    });
  }, [load]);
  // eslint-disable-next-line react-hooks/exhaustive-deps

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const getUniqueOrigins = () => {
    const origins = Array.from(new Set(simpleProducts.map(p => p.origin)));
    return origins.map(origin => ({
      value: origin,
      label: origin.charAt(0).toUpperCase() + origin.slice(1)
    }));
  };

  return (
    <PageLayout>
      <Helmet>
        <title>Products - Global Shopping Assistant</title>
        <meta name="description" content="Browse our collection of premium products from Japan, Korea, USA, and Europe." />
      </Helmet>

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Products</h1>
          <p className="text-gray-600">
            Discover amazing products from around the world
          </p>
        </div>

        {/* Filters and Search */}
        <div className="mb-8 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filters Row */}
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-4">
              {/* Origin Filter */}
              <Select value={selectedOrigin} onValueChange={setSelectedOrigin}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Origin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Origins</SelectItem>
                  {getUniqueOrigins().map(origin => (
                    <SelectItem key={origin.value} value={origin.value}>
                      {origin.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Status Filter */}
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="preorder">Pre-order</SelectItem>
                  <SelectItem value="out_of_stock">Out of Stock</SelectItem>
                </SelectContent>
              </Select>

              {/* Sort */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* View Mode Toggle */}
            <div className="flex gap-2">
              <EnhancedButton
                variant={viewMode === 'grid' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="w-4 h-4" />
              </EnhancedButton>
              <EnhancedButton
                variant={viewMode === 'list' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="w-4 h-4" />
              </EnhancedButton>
            </div>
          </div>

          {/* Active Filters */}
          <div className="flex flex-wrap gap-2">
            {searchTerm && (
              <Badge variant="secondary" className="gap-1">
                Search: {searchTerm}
                <button onClick={() => setSearchTerm('')} className="ml-1 hover:text-red-500">×</button>
              </Badge>
            )}
            {selectedOrigin !== 'all' && (
              <Badge variant="secondary" className="gap-1">
                Origin: {selectedOrigin}
                <button onClick={() => setSelectedOrigin('all')} className="ml-1 hover:text-red-500">×</button>
              </Badge>
            )}
            {selectedStatus !== 'all' && (
              <Badge variant="secondary" className="gap-1">
                Status: {selectedStatus}
                <button onClick={() => setSelectedStatus('all')} className="ml-1 hover:text-red-500">×</button>
              </Badge>
            )}
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {paginatedProducts.length} of {filteredAndSortedProducts.length} products
          </p>
        </div>

        {/* Error State */}
        {error && paginatedProducts.length === 0 && (
          <div className="mb-8 p-6 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start gap-4">
              <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-red-900 mb-2">
                  Failed to Load Products
                </h3>
                <p className="text-red-700 mb-4">
                  {error.message || 'An error occurred while loading products. Please try again.'}
                </p>
                <button
                  onClick={retry}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  Retry
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Products Grid */}
        {isLoading && paginatedProducts.length === 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {Array.from({ length: 12 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : paginatedProducts.length > 0 ? (
          <div className={`mb-8 ${
            viewMode === 'grid' 
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
              : 'space-y-4'
          }`}>
            {paginatedProducts.map((product) => (
              <SimpleProductCard
                key={product.id}
                product={product}
                className={viewMode === 'list' ? 'flex' : ''}
                highlightQuery={searchTerm}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg mb-4">No products found</p>
            <p className="text-gray-400">Try adjusting your search criteria</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2">
            <EnhancedButton
              variant="outline"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </EnhancedButton>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <EnhancedButton
                key={page}
                variant={currentPage === page ? 'primary' : 'outline'}
                onClick={() => setCurrentPage(page)}
                className="w-10"
              >
                {page}
              </EnhancedButton>
            ))}
            
            <EnhancedButton
              variant="outline"
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </EnhancedButton>
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default SimpleProducts;