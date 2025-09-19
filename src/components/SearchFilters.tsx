import React from 'react';
import FilterBar from '@/components/products/FilterBar';
import type { FilterState } from '@/utils/productFilters';
import type { Product } from '@/types/simple';

interface SearchFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  products?: Product[];
  totalResults?: number;
  isLoading?: boolean;
  className?: string;
}

const SearchFilters: React.FC<SearchFiltersProps> = (props) => {
  return <FilterBar {...props} />;
};

export default SearchFilters;