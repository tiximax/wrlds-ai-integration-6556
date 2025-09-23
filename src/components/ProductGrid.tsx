import React, { useState } from 'react';
import { EnhancedButton } from "@/components/ui/enhanced-button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Grid3X3, List, ChevronLeft, ChevronRight } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import ProductCard from './products/ProductCard';
import { Product } from '@/types/product';

interface ProductGridProps {
  products: Product[];
  sortBy: string;
  onSortChange: (sortBy: string) => void;
  currentPage: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
  totalResults: number;
  itemsPerPage?: number;
}

type SortOption = 'default' | 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc' | 'rating' | 'newest' | 'popular';

const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  sortBy,
  onSortChange,
  currentPage,
  onPageChange,
  isLoading = false,
  totalResults,
  itemsPerPage = 12
}) => {
  const [layout, setLayout] = useState<'grid' | 'list'>('grid');

  // Pagination
  const totalPages = Math.ceil(totalResults / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalResults);

  const goToPage = (page: number) => {
    onPageChange(page);
  };

  const getPaginationRange = () => {
    const range: (number | string)[] = [];
    const showPages = 5;
    
    if (totalPages <= showPages) {
      for (let i = 1; i <= totalPages; i++) {
        range.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          range.push(i);
        }
        range.push('...');
        range.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        range.push(1);
        range.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          range.push(i);
        }
      } else {
        range.push(1);
        range.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          range.push(i);
        }
        range.push('...');
        range.push(totalPages);
      }
    }
    
    return range;
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {/* Loading skeleton for controls */}
        <div className="flex justify-between items-center">
          <div className="w-32 h-8 bg-gray-200 animate-pulse rounded"></div>
          <div className="flex gap-2">
            <div className="w-24 h-8 bg-gray-200 animate-pulse rounded"></div>
            <div className="w-48 h-8 bg-gray-200 animate-pulse rounded"></div>
          </div>
        </div>
        
        {/* Loading skeleton for grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: itemsPerPage }).map((_, index) => (
            <Card key={index} className="overflow-hidden">
              <div className="aspect-square bg-gray-200 animate-pulse"></div>
              <CardContent className="p-4 space-y-2">
                <div className="h-4 bg-gray-200 animate-pulse rounded"></div>
                <div className="h-4 bg-gray-200 animate-pulse rounded w-2/3"></div>
                <div className="h-6 bg-gray-200 animate-pulse rounded w-1/3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <Card className="p-12 text-center">
        <div className="space-y-4">
          <div className="text-6xl opacity-20">🔍</div>
          <h3 className="text-xl font-semibold text-gray-900">Không tìm thấy sản phẩm</h3>
          <p className="text-gray-600">
            Thử thay đổi bộ lọc hoặc tìm kiếm với từ khóa khác
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Controls Row */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-lg shadow-sm border">
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="px-3 py-1">
            {totalResults} sản phẩm
          </Badge>
          <Separator orientation="vertical" className="h-6" />
          <span className="text-sm text-gray-600">
            Trang {currentPage} / {totalPages}
          </span>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Layout Toggle */}
          <div className="flex items-center gap-1 bg-gray-100 rounded-md p-1">
            <EnhancedButton
              variant={layout === 'grid' ? 'primary' : 'ghost'}
              size="icon"
              onClick={() => setLayout('grid')}
              className="w-8 h-8"
            >
              <Grid3X3 className="w-4 h-4" />
            </EnhancedButton>
            <EnhancedButton
              variant={layout === 'list' ? 'primary' : 'ghost'}
              size="icon"
              onClick={() => setLayout('list')}
              className="w-8 h-8"
            >
              <List className="w-4 h-4" />
            </EnhancedButton>
          </div>
          
          {/* Sort Dropdown */}
          <Select value={sortBy} onValueChange={onSortChange}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Sắp xếp theo..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Mới nhất</SelectItem>
              <SelectItem value="popular">Phổ biến nhất</SelectItem>
              <SelectItem value="price-low">Giá: Thấp → Cao</SelectItem>
              <SelectItem value="price-high">Giá: Cao → Thấp</SelectItem>
              <SelectItem value="name">Tên A-Z</SelectItem>
              <SelectItem value="rating">Đánh giá cao nhất</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Products Grid/List */}
      {layout === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 bg-white p-4 rounded-lg shadow-sm border">
          <EnhancedButton
            variant="outline"
            size="sm"
            disabled={currentPage === 1}
            onClick={() => goToPage(currentPage - 1)}
            leftIcon={<ChevronLeft className="w-4 h-4" />}
          >
            Trước
          </EnhancedButton>
          
          <div className="flex items-center gap-1">
            {getPaginationRange().map((page, index) => (
              page === '...' ? (
                <span key={index} className="px-3 py-1 text-gray-400">
                  ...
                </span>
              ) : (
                <EnhancedButton
                  key={index}
                  variant={currentPage === page ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => goToPage(page as number)}
                  className="w-10 h-10"
                >
                  {page}
                </EnhancedButton>
              )
            ))}
          </div>
          
          <EnhancedButton
            variant="outline"
            size="sm"
            disabled={currentPage === totalPages}
            onClick={() => goToPage(currentPage + 1)}
            rightIcon={<ChevronRight className="w-4 h-4" />}
          >
            Sau
          </EnhancedButton>
        </div>
      )}
    </div>
  );
};

export default ProductGrid;
