import { Product } from '@/types/product';

export type SortOption = 'newest' | 'popular' | 'price-low' | 'price-high' | 'name' | 'rating';

// Sort by price (low to high)
export const sortByPriceLow = (products: Product[]): Product[] => {
  return [...products].sort((a, b) => a.sellingPrice - b.sellingPrice);
};

// Sort by price (high to low)
export const sortByPriceHigh = (products: Product[]): Product[] => {
  return [...products].sort((a, b) => b.sellingPrice - a.sellingPrice);
};

// Sort by name (A-Z)
export const sortByName = (products: Product[]): Product[] => {
  return [...products].sort((a, b) => a.name.localeCompare(b.name));
};

// Sort by rating (highest first)
export const sortByRating = (products: Product[]): Product[] => {
  return [...products].sort((a, b) => b.rating.average - a.rating.average);
};

// Sort by newest (most recent first)
export const sortByNewest = (products: Product[]): Product[] => {
  return [...products].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
};

// Sort by popularity (most ratings first)
export const sortByPopular = (products: Product[]): Product[] => {
  return [...products].sort((a, b) => b.rating.count - a.rating.count);
};

// Apply sorting based on sort option
export const applySorting = (products: Product[], sortBy: SortOption): Product[] => {
  switch (sortBy) {
    case 'price-low':
      return sortByPriceLow(products);
    case 'price-high':
      return sortByPriceHigh(products);
    case 'name':
      return sortByName(products);
    case 'rating':
      return sortByRating(products);
    case 'popular':
      return sortByPopular(products);
    case 'newest':
    default:
      return sortByNewest(products);
  }
};
