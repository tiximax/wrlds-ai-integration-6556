import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import PageLayout from '@/components/PageLayout';
import ProductGrid from '@/components/ProductGrid';
import FilterBar from '@/components/products/FilterBar';
import { mockProducts } from '@/data/products';
import { updateCategoryProductCounts, parseCategoryPath, getCategoryById, getChildren } from '@/utils/categoryUtils';
import { applyFilters, defaultFilters, FilterState } from '@/utils/productFilters';
import { applySorting } from '@/utils/productSorting';
import { ProductSort, ProductCategory } from '@/types/product';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Breadcrumb, 
  BreadcrumbList, 
  BreadcrumbItem, 
  BreadcrumbLink, 
  BreadcrumbSeparator, 
  BreadcrumbPage 
} from '@/components/ui/breadcrumb';
import { ChevronRight, Grid3X3, Package, TrendingUp } from 'lucide-react';

const CategoryPage: React.FC = () => {
  const { categorySlug, subcategorySlug } = useParams<{
    categorySlug: string;
    subcategorySlug?: string;
  }>();
  const navigate = useNavigate();
  const { t } = useLanguage();

  // State
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [sortBy, setSortBy] = useState<string>('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // Parse category path
  const categoryInfo = useMemo(() => {
    if (!categorySlug) return { category: undefined, hierarchy: undefined };
    return parseCategoryPath(categorySlug, subcategorySlug);
  }, [categorySlug, subcategorySlug]);

  const { category, subcategory, hierarchy } = categoryInfo;

  // Update product counts
  useEffect(() => {
    updateCategoryProductCounts(mockProducts);
  }, []);

  // Filter products by category
  const categoryFilteredProducts = useMemo(() => {
    const targetCategory = subcategory || category;
    if (!targetCategory) return [];

    return mockProducts.filter(product => {
      // Check if product belongs to this category or any descendant
      const productCategory = product.category;
      if (!productCategory) return false;

      // Direct match
      if (productCategory.id === targetCategory.id) return true;

      // Check if product category is a descendant of target category
      let current = getCategoryById(productCategory.parentId || '');
      while (current) {
        if (current.id === targetCategory.id) return true;
        current = getCategoryById(current.parentId || '');
      }
      
      return false;
    });
  }, [category, subcategory]);

  // Apply filters and sorting
  const filteredAndSortedProducts = useMemo(() => {
    const results = applyFilters(categoryFilteredProducts, filters);
    
    const sortOption: ProductSort = {
      field: sortBy.includes('price') ? 'price' : 
             sortBy.includes('name') ? 'name' :
             sortBy.includes('rating') ? 'rating' :
             sortBy === 'newest' ? 'createdAt' : 'popularity',
      direction: sortBy.includes('desc') || sortBy.includes('high') ? 'desc' : 'asc'
    };
    
    return applySorting(results, sortOption);
  }, [categoryFilteredProducts, filters, sortBy]);

  // Pagination
  const itemsPerPage = 12;
  const totalResults = filteredAndSortedProducts.length;
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedProducts.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAndSortedProducts, currentPage]);

  // Handle filter changes
  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page
  };

  // Handle sort changes
  const handleSortChange = (newSortBy: string) => {
    setSortBy(newSortBy);
    setCurrentPage(1); // Reset to first page
  };

  // Handle page changes
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Get subcategories for navigation
  const subcategories = useMemo(() => {
    if (subcategory) return []; // Don't show subcategories if already in a subcategory
    return getChildren(category || { children: [] } as ProductCategory);
  }, [category, subcategory]);

  // Error handling
  if (!categorySlug || !category) {
    return (
      <PageLayout>
        <div className="container mx-auto px-4 py-8">
          <Card className="p-12 text-center">
            <div className="space-y-4">
              <div className="text-6xl opacity-20">❌</div>
              <h1 className="text-2xl font-bold text-gray-900">Danh mục không tồn tại</h1>
              <p className="text-gray-600">
                Danh mục bạn tìm kiếm không tồn tại hoặc đã bị xóa.
              </p>
              <Button onClick={() => navigate('/products')} className="mt-4">
                Xem tất cả sản phẩm
              </Button>
            </div>
          </Card>
        </div>
      </PageLayout>
    );
  }

  const activeCategory = subcategory || category;
  const seoTitle = activeCategory.seoTitle || `${activeCategory.name} - Global Shopping Assistant`;
  const seoDescription = activeCategory.seoDescription || activeCategory.description;

  return (
    <>
      <Helmet>
        <title>{seoTitle}</title>
        <meta name="description" content={seoDescription} />
        <meta property="og:title" content={seoTitle} />
        <meta property="og:description" content={seoDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${window.location.origin}/category/${categorySlug}${subcategorySlug ? `/${subcategorySlug}` : ''}`} />
        {activeCategory.image && <meta property="og:image" content={activeCategory.image} />}
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": activeCategory.name,
            "description": activeCategory.description,
            "url": `${window.location.origin}/category/${categorySlug}${subcategorySlug ? `/${subcategorySlug}` : ''}`,
            "breadcrumb": {
              "@type": "BreadcrumbList",
              "itemListElement": hierarchy?.breadcrumbs.map((crumb, index) => ({
                "@type": "ListItem",
                "position": index + 1,
                "name": crumb.name,
                "item": `${window.location.origin}${crumb.url}`
              }))
            },
            "mainEntity": {
              "@type": "ItemList",
              "numberOfItems": totalResults,
              "itemListElement": paginatedProducts.map((product, index) => ({
                "@type": "Product",
                "position": index + 1,
                "name": product.name,
                "description": product.shortDescription || product.description,
                "image": product.images[0]?.url,
                "url": `${window.location.origin}/products/${product.slug}`,
                "offers": {
                  "@type": "Offer",
                  "price": product.sellingPrice,
                  "priceCurrency": "VND",
                  "availability": product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
                }
              }))
            }
          })}
        </script>
      </Helmet>

      <PageLayout>
        <div className="container mx-auto px-4 py-6">
          {/* Breadcrumbs */}
          {hierarchy?.breadcrumbs && (
            <Breadcrumb className="mb-6">
              <BreadcrumbList>
                {hierarchy.breadcrumbs.map((crumb, index) => (
                  <React.Fragment key={crumb.id}>
                    <BreadcrumbItem>
                      {index === hierarchy.breadcrumbs.length - 1 ? (
                        <BreadcrumbPage>{crumb.name}</BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink asChild>
                          <Link to={crumb.url}>{crumb.name}</Link>
                        </BreadcrumbLink>
                      )}
                    </BreadcrumbItem>
                    {index < hierarchy.breadcrumbs.length - 1 && <BreadcrumbSeparator />}
                  </React.Fragment>
                ))}
              </BreadcrumbList>
            </Breadcrumb>
          )}

          {/* Category Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Grid3X3 className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{activeCategory.name}</h1>
                <p className="text-lg text-gray-600 mt-1">{activeCategory.description}</p>
              </div>
            </div>

            {/* Category Stats */}
            <div className="flex flex-wrap gap-4 mb-6">
              <Badge variant="outline" className="flex items-center gap-2 px-3 py-2">
                <Package className="w-4 h-4" />
                {totalResults} sản phẩm
              </Badge>
              {activeCategory.productCount && (
                <Badge variant="outline" className="flex items-center gap-2 px-3 py-2">
                  <TrendingUp className="w-4 h-4" />
                  {activeCategory.productCount} tổng số sản phẩm
                </Badge>
              )}
            </div>
          </div>

          {/* Subcategories Navigation */}
          {subcategories.length > 0 && (
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Danh mục con</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                {subcategories.map((subcat) => (
                  <Link
                    key={subcat.id}
                    to={`/category/${categorySlug}/${subcat.slug}`}
                    className="group"
                  >
                    <Card className="h-full transition-all duration-200 hover:shadow-md hover:scale-105">
                      <CardContent className="p-4 text-center">
                        {subcat.image && (
                          <img
                            src={subcat.image}
                            alt={subcat.name}
                            className="w-12 h-12 mx-auto mb-3 rounded-lg object-cover"
                          />
                        )}
                        <h3 className="font-medium text-sm text-gray-900 group-hover:text-blue-600 transition-colors">
                          {subcat.name}
                        </h3>
                        {subcat.productCount && (
                          <p className="text-xs text-gray-500 mt-1">
                            {subcat.productCount} sản phẩm
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Products Section */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Filters Sidebar */}
            <div className="lg:col-span-1">
              <FilterBar
                filters={filters}
                onFiltersChange={handleFilterChange}
                className="sticky top-6"
              />
            </div>

            {/* Products Grid */}
            <div className="lg:col-span-3">
              <ProductGrid
                products={paginatedProducts}
                sortBy={sortBy}
                onSortChange={handleSortChange}
                currentPage={currentPage}
                onPageChange={handlePageChange}
                isLoading={isLoading}
                totalResults={totalResults}
                itemsPerPage={itemsPerPage}
              />
            </div>
          </div>
        </div>
      </PageLayout>
    </>
  );
};

export default CategoryPage;
