import { Product } from '@/types/product';
import { getCategoryById, getDescendants } from './categoryUtils';

export interface FilterState {
  search: string;
  categories: string[]; // Category IDs or slugs
  origins: string[];
  status: string[];
  types: string[];
  brands: string[];
  priceRange: [number, number];
  quickFilter: string;
}

export const defaultFilters: FilterState = {
  search: '',
  categories: [],
  origins: [],
  status: [],
  types: [],
  brands: [],
  priceRange: [0, 100000000], // Increased to cover all test products
  quickFilter: '',
};

// Search filter
export const filterBySearch = (products: Product[], searchTerm: string): Product[] => {
  if (!searchTerm.trim()) return products;
  
  const searchLower = searchTerm.toLowerCase();
  return products.filter(product => 
    product.name.toLowerCase().includes(searchLower) ||
    product.description.toLowerCase().includes(searchLower) ||
    product.brand?.name.toLowerCase().includes(searchLower) ||
    product.tags.some(tag => tag.toLowerCase().includes(searchLower))
  );
};

// Category filter
export const filterByCategories = (products: Product[], categoryIds: string[]): Product[] => {
  if (!categoryIds || categoryIds.length === 0) return products;
  
  // Get all descendant category IDs for each selected category
  const allCategoryIds = new Set(categoryIds);
  
  categoryIds.forEach(categoryId => {
    const category = getCategoryById(categoryId);
    if (category) {
      // Include all descendants of this category
      const descendants = getDescendants(category);
      descendants.forEach(descendant => {
        allCategoryIds.add(descendant.id);
      });
    }
  });
  
  return products.filter(product => {
    if (!product.category?.id) return false;
    return allCategoryIds.has(product.category.id);
  });
};

// Origin filter
export const filterByOrigins = (products: Product[], origins: string[]): Product[] => {
  if (origins.length === 0) return products;
  return products.filter(product => origins.includes(product.origin));
};

// Status filter
export const filterByStatus = (products: Product[], statuses: string[]): Product[] => {
  if (statuses.length === 0) return products;
  return products.filter(product => statuses.includes(product.status));
};

// Type filter
export const filterByTypes = (products: Product[], types: string[]): Product[] => {
  if (types.length === 0) return products;
  return products.filter(product => types.includes(product.type));
};

// Brand filter
export const filterByBrands = (products: Product[], brands: string[]): Product[] => {
  if (brands.length === 0) return products;
  return products.filter(product => product.brand && brands.includes(product.brand.name));
};

// Price range filter
export const filterByPriceRange = (products: Product[], priceRange: [number, number]): Product[] => {
  const [minPrice, maxPrice] = priceRange;
  return products.filter(product => 
    product.sellingPrice >= minPrice && product.sellingPrice <= maxPrice
  );
};

// Quick filters
export const filterByQuickFilter = (products: Product[], quickFilter: string): Product[] => {
  switch (quickFilter) {
    case 'in-stock':
      return products.filter(product => product.status === 'available');
    case 'trending':
      return products.filter(product => product.trending);
    case 'featured':
      return products.filter(product => product.featured);
    case 'flash-deal':
      return products.filter(product => product.type === 'flash_deal');
    case 'all':
    case '':
    default:
      return products;
  }
};

// Apply all filters
export const applyFilters = (products: Product[], filters: FilterState): Product[] => {
  let filteredProducts = [...products];

  // Apply each filter in sequence
  filteredProducts = filterBySearch(filteredProducts, filters.search);
  filteredProducts = filterByCategories(filteredProducts, filters.categories);
  filteredProducts = filterByOrigins(filteredProducts, filters.origins);
  filteredProducts = filterByStatus(filteredProducts, filters.status);
  filteredProducts = filterByTypes(filteredProducts, filters.types);
  filteredProducts = filterByBrands(filteredProducts, filters.brands);
  filteredProducts = filterByPriceRange(filteredProducts, filters.priceRange);
  filteredProducts = filterByQuickFilter(filteredProducts, filters.quickFilter);

  return filteredProducts;
};
