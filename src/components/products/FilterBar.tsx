import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, SlidersHorizontal, Grid3X3, List, ChevronDown, X } from 'lucide-react';
import { Product } from '@/types/product';
import { FilterState, defaultFilters } from '@/utils/productFilters';
import { getRootCategories, getCategoryById, getChildren } from '@/utils/categoryUtils';
import { Input } from '@/components/ui/input';
import { EnhancedButton } from '@/components/ui/enhanced-button';
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
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerFooter,
  DrawerClose,
} from '@/components/ui/drawer';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';


interface FilterBarProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  products?: Product[];
  totalResults?: number;
  isLoading?: boolean;
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
  products = [],
  totalResults = 0,
  isLoading = false,
  className = ''
}) => {
  const { t } = useTranslation();

  // Get unique values for filter options
  const filterOptions = useMemo(() => {
    if (!products || products.length === 0) {
      return {
        categories: getRootCategories(),
        origins: [],
        status: [],
        types: [],
        brands: [],
        minPrice: 0,
        maxPrice: 100000000
      };
    }

    const categories = getRootCategories();
    const origins = [...new Set(products.map(p => p.origin))];
    const status = [...new Set(products.map(p => p.status))];
    const types = [...new Set(products.map(p => p.type))];
    const brands = [...new Set(products.filter(p => p.brand).map(p => p.brand!.name))];
    const prices = products.map(p => p.sellingPrice);
    const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
    const maxPrice = prices.length > 0 ? Math.max(...prices) : 100000000;

    return { categories, origins, status, types, brands, minPrice, maxPrice };
  }, [products]);

  // Count active filters
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.search) count++;
    if (filters.categories.length > 0) count++;
    if (filters.origins.length > 0) count++;
    if (filters.status.length > 0) count++;
    if (filters.types.length > 0) count++;
    if (filters.brands.length > 0) count++;
    if (filters.priceRange[0] > filterOptions.minPrice || filters.priceRange[1] < filterOptions.maxPrice) count++;
    if (filters.quickFilter) count++;
    return count;
  }, [filters, filterOptions]);

  const updateFilter = (key: keyof FilterState, value: FilterState[keyof FilterState]) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const toggleArrayFilter = (key: 'categories' | 'origins' | 'status' | 'types' | 'brands', value: string) => {
    const current = filters[key];
    const updated = current.includes(value)
      ? current.filter(item => item !== value)
      : [...current, value];
    updateFilter(key, updated);
  };

  const clearFilters = () => {
    onFiltersChange({
      ...defaultFilters,
      priceRange: [filterOptions.minPrice, filterOptions.maxPrice],
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
      <FilterSection title={t('searchFilters.search')}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder={t('searchFilters.searchPlaceholder') || '...'}
            value={filters.search}
            onChange={(e) => updateFilter('search', e.target.value)}
            className="pl-10"
          />
        </div>
      </FilterSection>

      {/* Categories */}
      <FilterSection title={t('searchFilters.categories')}>
        <div className="space-y-2">
          {filterOptions.categories.map(category => (
            <div key={category.id} className="space-y-1">
              <label className="flex items-center space-x-2 cursor-pointer font-medium">
                <Checkbox
                  checked={filters.categories.includes(category.id)}
                  onCheckedChange={() => toggleArrayFilter('categories', category.id)}
                />
                <span className="text-sm">{category.name}</span>
                {category.productCount && (
                  <span className="text-xs text-gray-500">({category.productCount})</span>
                )}
              </label>
              {/* Subcategories */}
              {category.children && category.children.length > 0 && (
                <div className="ml-6 space-y-1">
                  {category.children.map(subcategory => (
                    <label key={subcategory.id} className="flex items-center space-x-2 cursor-pointer">
                      <Checkbox
                        checked={filters.categories.includes(subcategory.id)}
                        onCheckedChange={() => toggleArrayFilter('categories', subcategory.id)}
                      />
                      <span className="text-xs text-gray-600">{subcategory.name}</span>
                      {subcategory.productCount && (
                        <span className="text-xs text-gray-400">({subcategory.productCount})</span>
                      )}
                    </label>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </FilterSection>

      {/* Origin */}
      <FilterSection title={t('searchFilters.origin')}>
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
      <FilterSection title={t('searchFilters.status')}>
        <div className="space-y-2">
          {filterOptions.status.map(status => (
            <label key={status} className="flex items-center space-x-2 cursor-pointer">
              <Checkbox
                checked={filters.status.includes(status)}
                onCheckedChange={() => toggleArrayFilter('status', status)}
              />
              <span className="text-sm">{getStatusLabel(status)}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Type */}
      <FilterSection title={t('searchFilters.type')}>
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
        <FilterSection title={t('searchFilters.brands')}>
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
      <FilterSection title={t('searchFilters.priceRange')}>
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
      <FilterSection title={t('searchFilters.quickFilters')}>
        <div className="space-y-2">
          <Select value={filters.quickFilter || 'all'} onValueChange={(value) => updateFilter('quickFilter', value)}>
            <SelectTrigger>
              <SelectValue placeholder={t('searchFilters.quickFilters')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('searchFilters.quickOptions.all')}</SelectItem>
              <SelectItem value="in-stock">{t('searchFilters.quickOptions.inStock')}</SelectItem>
              <SelectItem value="trending">{t('searchFilters.quickOptions.trending')}</SelectItem>
              <SelectItem value="featured">{t('searchFilters.quickOptions.featured')}</SelectItem>
              <SelectItem value="flash-deal">{t('searchFilters.quickOptions.flashDeal')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </FilterSection>

      {/* Clear Filters */}
      {activeFiltersCount > 0 && (
        <div className="pt-4 border-t">
          <EnhancedButton
            variant="outline"
            size="md"
            onClick={clearFilters}
            className="w-full min-h-[44px]"
          >
            <X className="w-4 h-4 mr-2" />
            {t('searchFilters.clearWithCount', { count: activeFiltersCount })}
          </EnhancedButton>
        </div>
      )}
    </div>
  );

  return (
    <div className={className}>
      {/* Desktop Filter Sidebar */}
      <div className="hidden lg:block w-64 bg-white border border-gray-200 rounded-lg p-4 h-fit sticky top-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">{t('searchFilters.filters')}</h3>
          {activeFiltersCount > 0 && (
            <Badge variant="secondary">{activeFiltersCount}</Badge>
          )}
        </div>
        <FilterContent />
      </div>

      {/* Mobile Filter Bottom Sheet */}
      <div className="lg:hidden">
        <Drawer>
          <DrawerTrigger asChild>
            <EnhancedButton 
              variant="outline" 
              size="md" 
              className="relative min-h-[44px]"
              data-testid="mobile-filters-button"
            >
              <SlidersHorizontal className="w-4 h-4 mr-2" />
              {t('searchFilters.filtersButton')}
              {activeFiltersCount > 0 && (
                <Badge variant="destructive" className="absolute -top-2 -right-2 min-w-5 h-5 text-xs p-0 flex items-center justify-center">
                  {activeFiltersCount}
                </Badge>
              )}
            </EnhancedButton>
          </DrawerTrigger>
          <DrawerContent className="max-h-[80vh] overflow-y-auto" data-testid="mobile-filters-drawer">
            <DrawerHeader>
              <DrawerTitle>{t('searchFilters.productFiltersTitle')}</DrawerTitle>
              <DrawerDescription>{t('searchFilters.productFiltersDesc')}</DrawerDescription>
            </DrawerHeader>
            <div className="px-4 pb-2">
              <FilterContent />
            </div>
            <DrawerFooter>
              <DrawerClose asChild>
                <EnhancedButton variant="primary" size="lg" className="min-h-[44px]" data-testid="apply-filters-button">
                  {t('searchFilters.apply')}
                </EnhancedButton>
              </DrawerClose>
              {activeFiltersCount > 0 && (
                <EnhancedButton variant="ghost" size="lg" className="min-h-[44px]" onClick={clearFilters} data-testid="reset-filters-button">
                  {t('searchFilters.clearWithCount', { count: activeFiltersCount })}
                </EnhancedButton>
              )}
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </div>
    </div>
  );
};

export default FilterBar;
