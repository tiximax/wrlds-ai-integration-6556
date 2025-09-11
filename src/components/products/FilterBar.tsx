import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, SlidersHorizontal, Grid3X3, List, ChevronDown, X } from 'lucide-react';
import { Product } from '@/types/product';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

export interface FilterState {
  search: string;
  origins: string[];
  statuses: string[];
  types: string[];
  brands: string[];
  priceRange: [number, number];
  inStock: boolean;
  trending: boolean;
  featured: boolean;
}

interface FilterBarProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  products: Product[];
  className?: string;
}

interface FilterSectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

const FilterSection: React.FC<FilterSectionProps> = ({ 
  title, 
  children, 
  defaultOpen = true 
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger className="flex items-center justify-between w-full p-3 text-left hover:bg-gray-50 rounded-lg">
        <span className="font-medium text-gray-900">{title}</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </CollapsibleTrigger>
      <CollapsibleContent className="px-3 pb-3">
        {children}
      </CollapsibleContent>
    </Collapsible>
  );
};

const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onFiltersChange,
  products,
  className = ''
}) => {
  // Get unique values for filter options
  const filterOptions = useMemo(() => {
    const origins = [...new Set(products.map(p => p.origin))];
    const statuses = [...new Set(products.map(p => p.status))];
    const types = [...new Set(products.map(p => p.type))];
    const brands = [...new Set(products.filter(p => p.brand).map(p => p.brand!.name))];
    const prices = products.map(p => p.sellingPrice);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);

    return { origins, statuses, types, brands, minPrice, maxPrice };
  }, [products]);

  // Count active filters
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.search) count++;
    if (filters.origins.length > 0) count++;
    if (filters.statuses.length > 0) count++;
    if (filters.types.length > 0) count++;
    if (filters.brands.length > 0) count++;
    if (filters.priceRange[0] > filterOptions.minPrice || filters.priceRange[1] < filterOptions.maxPrice) count++;
    if (filters.inStock) count++;
    if (filters.trending) count++;
    if (filters.featured) count++;
    return count;
  }, [filters, filterOptions]);

  const updateFilter = (key: keyof FilterState, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const toggleArrayFilter = (key: 'origins' | 'statuses' | 'types' | 'brands', value: string) => {
    const current = filters[key];
    const updated = current.includes(value)
      ? current.filter(item => item !== value)
      : [...current, value];
    updateFilter(key, updated);
  };

  const clearFilters = () => {
    onFiltersChange({
      search: '',
      origins: [],
      statuses: [],
      types: [],
      brands: [],
      priceRange: [filterOptions.minPrice, filterOptions.maxPrice],
      inStock: false,
      trending: false,
      featured: false,
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0
    }).format(price);
  };

  const getOriginLabel = (origin: string) => {
    const labels = {
      'japan': '🇯🇵 Nhật Bản',
      'korea': '🇰🇷 Hàn Quốc',
      'usa': '🇺🇸 Mỹ',
      'europe': '🇪🇺 Châu Âu'
    };
    return labels[origin as keyof typeof labels] || origin;
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      'available': 'Có sẵn',
      'preorder': 'Preorder',
      'out_of_stock': 'Hết hàng'
    };
    return labels[status as keyof typeof labels] || status;
  };

  const getTypeLabel = (type: string) => {
    const labels = {
      'ready_stock': 'Hàng có sẵn',
      'flash_deal': 'Flash Deal',
      'group_buy': 'Mua chung'
    };
    return labels[type as keyof typeof labels] || type;
  };

  const FilterContent = () => (
    <div className="space-y-1">
      {/* Search */}
      <FilterSection title="Tìm kiếm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Tìm sản phẩm..."
            value={filters.search}
            onChange={(e) => updateFilter('search', e.target.value)}
            className="pl-10"
          />
        </div>
      </FilterSection>

      {/* Origin */}
      <FilterSection title="Xuất xứ">
        <div className="space-y-2">
          {filterOptions.origins.map(origin => (
            <label key={origin} className="flex items-center space-x-2 cursor-pointer">
              <Checkbox
                checked={filters.origins.includes(origin)}
                onCheckedChange={() => toggleArrayFilter('origins', origin)}
              />
              <span className="text-sm">{getOriginLabel(origin)}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Status */}
      <FilterSection title="Trạng thái">
        <div className="space-y-2">
          {filterOptions.statuses.map(status => (
            <label key={status} className="flex items-center space-x-2 cursor-pointer">
              <Checkbox
                checked={filters.statuses.includes(status)}
                onCheckedChange={() => toggleArrayFilter('statuses', status)}
              />
              <span className="text-sm">{getStatusLabel(status)}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Type */}
      <FilterSection title="Loại sản phẩm">
        <div className="space-y-2">
          {filterOptions.types.map(type => (
            <label key={type} className="flex items-center space-x-2 cursor-pointer">
              <Checkbox
                checked={filters.types.includes(type)}
                onCheckedChange={() => toggleArrayFilter('types', type)}
              />
              <span className="text-sm">{getTypeLabel(type)}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Brands */}
      {filterOptions.brands.length > 0 && (
        <FilterSection title="Thương hiệu">
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {filterOptions.brands.map(brand => (
              <label key={brand} className="flex items-center space-x-2 cursor-pointer">
                <Checkbox
                  checked={filters.brands.includes(brand)}
                  onCheckedChange={() => toggleArrayFilter('brands', brand)}
                />
                <span className="text-sm">{brand}</span>
              </label>
            ))}
          </div>
        </FilterSection>
      )}

      {/* Price Range */}
      <FilterSection title="Khoảng giá">
        <div className="space-y-3">
          <Slider
            value={filters.priceRange}
            onValueChange={(value) => updateFilter('priceRange', value as [number, number])}
            max={filterOptions.maxPrice}
            min={filterOptions.minPrice}
            step={50000}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-600">
            <span>{formatPrice(filters.priceRange[0])}</span>
            <span>{formatPrice(filters.priceRange[1])}</span>
          </div>
        </div>
      </FilterSection>

      {/* Quick Filters */}
      <FilterSection title="Bộ lọc nhanh">
        <div className="space-y-2">
          <label className="flex items-center space-x-2 cursor-pointer">
            <Checkbox
              checked={filters.inStock}
              onCheckedChange={(checked) => updateFilter('inStock', checked)}
            />
            <span className="text-sm">Còn hàng</span>
          </label>
          <label className="flex items-center space-x-2 cursor-pointer">
            <Checkbox
              checked={filters.trending}
              onCheckedChange={(checked) => updateFilter('trending', checked)}
            />
            <span className="text-sm">Xu hướng</span>
          </label>
          <label className="flex items-center space-x-2 cursor-pointer">
            <Checkbox
              checked={filters.featured}
              onCheckedChange={(checked) => updateFilter('featured', checked)}
            />
            <span className="text-sm">Nổi bật</span>
          </label>
        </div>
      </FilterSection>

      {/* Clear Filters */}
      {activeFiltersCount > 0 && (
        <div className="pt-4 border-t">
          <Button
            variant="outline"
            size="sm"
            onClick={clearFilters}
            className="w-full"
          >
            <X className="w-4 h-4 mr-2" />
            Xóa bộ lọc ({activeFiltersCount})
          </Button>
        </div>
      )}
    </div>
  );

  return (
    <div className={className}>
      {/* Desktop Filter Sidebar */}
      <div className="hidden lg:block w-64 bg-white border border-gray-200 rounded-lg p-4 h-fit sticky top-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">Bộ lọc</h3>
          {activeFiltersCount > 0 && (
            <Badge variant="secondary">{activeFiltersCount}</Badge>
          )}
        </div>
        <FilterContent />
      </div>

      {/* Mobile Filter Sheet */}
      <div className="lg:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm" className="relative">
              <SlidersHorizontal className="w-4 h-4 mr-2" />
              Bộ lọc
              {activeFiltersCount > 0 && (
                <Badge variant="destructive" className="absolute -top-2 -right-2 min-w-5 h-5 text-xs p-0 flex items-center justify-center">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80 overflow-y-auto">
            <SheetHeader>
              <SheetTitle>Bộ lọc sản phẩm</SheetTitle>
              <SheetDescription>
                Tùy chỉnh bộ lọc để tìm sản phẩm phù hợp
              </SheetDescription>
            </SheetHeader>
            <div className="mt-6">
              <FilterContent />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};

export default FilterBar;
