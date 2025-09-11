import { Product } from '@/types/product';

// Search configuration
export const SEARCH_CONFIG = {
  MIN_QUERY_LENGTH: 2,
  MAX_SUGGESTIONS: 8,
  MAX_SEARCH_HISTORY: 20,
  DEBOUNCE_DELAY: 300,
  WEIGHTS: {
    name: 3.0,
    brand: 2.5,
    category: 2.0,
    tags: 1.5,
    description: 1.0,
    specifications: 0.8
  }
} as const;

// Search result with relevance score
export interface SearchResult {
  product: Product;
  score: number;
  matchedFields: string[];
  highlights: Record<string, string>;
}

// Search suggestion
export interface SearchSuggestion {
  type: 'product' | 'brand' | 'category' | 'tag';
  text: string;
  count: number;
  icon?: string;
}

// Search history item
export interface SearchHistoryItem {
  query: string;
  timestamp: Date;
  resultCount: number;
}

// Advanced search filters
export interface AdvancedSearchFilters {
  query: string;
  categories: string[];
  brands: string[];
  origins: string[];
  priceRange: [number, number];
  rating: number;
  availability: 'all' | 'inStock' | 'preorder';
  sortBy: 'relevance' | 'price-low' | 'price-high' | 'rating' | 'newest';
  tags: string[];
}

// Default search filters
export const defaultSearchFilters: AdvancedSearchFilters = {
  query: '',
  categories: [],
  brands: [],
  origins: [],
  priceRange: [0, 100000000],
  rating: 0,
  availability: 'all',
  sortBy: 'relevance',
  tags: []
};

// Text processing utilities
export const normalizeText = (text: string): string => {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/[^\w\s]/g, ' ') // Replace punctuation with spaces
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();
};

export const extractKeywords = (text: string): string[] => {
  const normalized = normalizeText(text);
  return normalized.split(' ').filter(word => word.length >= 2);
};

// Calculate text similarity using Jaccard coefficient
export const calculateSimilarity = (text1: string, text2: string): number => {
  const keywords1 = new Set(extractKeywords(text1));
  const keywords2 = new Set(extractKeywords(text2));
  
  const intersection = new Set([...keywords1].filter(x => keywords2.has(x)));
  const union = new Set([...keywords1, ...keywords2]);
  
  return union.size > 0 ? intersection.size / union.size : 0;
};

// Calculate relevance score for a product against search query
export const calculateRelevanceScore = (product: Product, query: string): { score: number; matchedFields: string[] } => {
  if (!query.trim()) return { score: 0, matchedFields: [] };
  
  const normalizedQuery = normalizeText(query);
  const queryKeywords = extractKeywords(query);
  const matchedFields: string[] = [];
  let totalScore = 0;

  // Exact match bonus
  const exactMatchBonus = 2.0;

  // Search in product name
  const nameText = normalizeText(product.name);
  if (nameText.includes(normalizedQuery)) {
    totalScore += SEARCH_CONFIG.WEIGHTS.name * exactMatchBonus;
    matchedFields.push('name');
  } else {
    const nameSimilarity = calculateSimilarity(product.name, query);
    if (nameSimilarity > 0.1) {
      totalScore += SEARCH_CONFIG.WEIGHTS.name * nameSimilarity;
      matchedFields.push('name');
    }
  }

  // Search in brand
  if (product.brand?.name) {
    const brandText = normalizeText(product.brand.name);
    if (brandText.includes(normalizedQuery)) {
      totalScore += SEARCH_CONFIG.WEIGHTS.brand * exactMatchBonus;
      matchedFields.push('brand');
    } else {
      const brandSimilarity = calculateSimilarity(product.brand.name, query);
      if (brandSimilarity > 0.1) {
        totalScore += SEARCH_CONFIG.WEIGHTS.brand * brandSimilarity;
        matchedFields.push('brand');
      }
    }
  }

  // Search in category
  if (product.category?.name) {
    const categoryText = normalizeText(product.category.name);
    if (categoryText.includes(normalizedQuery)) {
      totalScore += SEARCH_CONFIG.WEIGHTS.category * exactMatchBonus;
      matchedFields.push('category');
    }
  }

  // Search in tags
  if (product.tags && product.tags.length > 0) {
    const tagMatches = product.tags.filter(tag => 
      normalizeText(tag).includes(normalizedQuery) ||
      queryKeywords.some(keyword => normalizeText(tag).includes(keyword))
    );
    if (tagMatches.length > 0) {
      totalScore += SEARCH_CONFIG.WEIGHTS.tags * tagMatches.length * 0.5;
      matchedFields.push('tags');
    }
  }

  // Search in description
  if (product.description) {
    const descriptionSimilarity = calculateSimilarity(product.description, query);
    if (descriptionSimilarity > 0.05) {
      totalScore += SEARCH_CONFIG.WEIGHTS.description * descriptionSimilarity;
      matchedFields.push('description');
    }
  }

  // Search in specifications
  if (product.specifications && product.specifications.length > 0) {
    const specText = product.specifications.map(spec => `${spec.label} ${spec.value}`).join(' ');
    const specSimilarity = calculateSimilarity(specText, query);
    if (specSimilarity > 0.05) {
      totalScore += SEARCH_CONFIG.WEIGHTS.specifications * specSimilarity;
      matchedFields.push('specifications');
    }
  }

  return { score: totalScore, matchedFields };
};

// Generate text highlights for search results
export const generateHighlights = (product: Product, query: string, matchedFields: string[]): Record<string, string> => {
  const highlights: Record<string, string> = {};
  const queryKeywords = extractKeywords(query);
  
  const highlightText = (text: string, keywords: string[]): string => {
    let highlighted = text;
    keywords.forEach(keyword => {
      const regex = new RegExp(`(${keyword})`, 'gi');
      highlighted = highlighted.replace(regex, '<mark>$1</mark>');
    });
    return highlighted;
  };

  if (matchedFields.includes('name')) {
    highlights.name = highlightText(product.name, queryKeywords);
  }

  if (matchedFields.includes('brand') && product.brand?.name) {
    highlights.brand = highlightText(product.brand.name, queryKeywords);
  }

  if (matchedFields.includes('description') && product.description) {
    // Show excerpt with highlights
    const words = product.description.split(' ');
    let excerpt = words.slice(0, 20).join(' ');
    if (words.length > 20) excerpt += '...';
    highlights.description = highlightText(excerpt, queryKeywords);
  }

  return highlights;
};

// Perform advanced search
export const performAdvancedSearch = (
  products: Product[], 
  filters: AdvancedSearchFilters
): SearchResult[] => {
  let results = products;

  // Apply category filter
  if (filters.categories && filters.categories.length > 0) {
    results = results.filter(product => 
      product.category && filters.categories.includes(product.category.id)
    );
  }

  // Apply brand filter
  if (filters.brands && filters.brands.length > 0) {
    results = results.filter(product => 
      product.brand && filters.brands.includes(product.brand.name)
    );
  }

  // Apply origin filter
  if (filters.origins && filters.origins.length > 0) {
    results = results.filter(product => 
      filters.origins.includes(product.origin)
    );
  }

  // Apply price range filter
  results = results.filter(product => 
    product.sellingPrice >= filters.priceRange[0] && 
    product.sellingPrice <= filters.priceRange[1]
  );

  // Apply rating filter
  if (filters.rating > 0) {
    results = results.filter(product => 
      product.rating && product.rating.average >= filters.rating
    );
  }

  // Apply availability filter
  if (filters.availability === 'inStock') {
    results = results.filter(product => 
      product.status === 'available' && product.stock > 0
    );
  } else if (filters.availability === 'preorder') {
    results = results.filter(product => 
      product.status === 'preorder'
    );
  }

  // Apply tag filter
  if (filters.tags && filters.tags.length > 0) {
    results = results.filter(product => 
      product.tags && filters.tags.some(tag => product.tags.includes(tag))
    );
  }

  // Calculate relevance scores and create search results
  const searchResults: SearchResult[] = results.map(product => {
    const { score, matchedFields } = calculateRelevanceScore(product, filters.query);
    const highlights = generateHighlights(product, filters.query, matchedFields);
    
    return {
      product,
      score,
      matchedFields,
      highlights
    };
  });

  // Sort results
  const sortedResults = sortSearchResults(searchResults, filters.sortBy);

  // Filter out results with very low relevance scores when there's a query
  if (filters.query.trim().length >= SEARCH_CONFIG.MIN_QUERY_LENGTH) {
    return sortedResults.filter(result => result.score > 0.1);
  }

  return sortedResults;
};

// Sort search results based on criteria
export const sortSearchResults = (results: SearchResult[], sortBy: AdvancedSearchFilters['sortBy']): SearchResult[] => {
  return [...results].sort((a, b) => {
    switch (sortBy) {
      case 'relevance':
        return b.score - a.score;
      case 'price-low':
        return a.product.sellingPrice - b.product.sellingPrice;
      case 'price-high':
        return b.product.sellingPrice - a.product.sellingPrice;
      case 'rating':
        return (b.product.rating?.average || 0) - (a.product.rating?.average || 0);
      case 'newest':
        return new Date(b.product.createdAt).getTime() - new Date(a.product.createdAt).getTime();
      default:
        return b.score - a.score;
    }
  });
};

// Generate search suggestions
export const generateSearchSuggestions = (products: Product[], query: string): SearchSuggestion[] => {
  if (query.length < SEARCH_CONFIG.MIN_QUERY_LENGTH) {
    return [];
  }

  const normalizedQuery = normalizeText(query);
  const suggestions: Map<string, SearchSuggestion> = new Map();

  products.forEach(product => {
    // Product name suggestions
    if (normalizeText(product.name).includes(normalizedQuery)) {
      const key = `product:${product.name}`;
      if (!suggestions.has(key)) {
        suggestions.set(key, {
          type: 'product',
          text: product.name,
          count: 1
        });
      } else {
        const existing = suggestions.get(key)!;
        existing.count++;
      }
    }

    // Brand suggestions
    if (product.brand?.name && normalizeText(product.brand.name).includes(normalizedQuery)) {
      const key = `brand:${product.brand.name}`;
      if (!suggestions.has(key)) {
        suggestions.set(key, {
          type: 'brand',
          text: product.brand.name,
          count: 1,
          icon: '🏷️'
        });
      } else {
        const existing = suggestions.get(key)!;
        existing.count++;
      }
    }

    // Category suggestions
    if (product.category?.name && normalizeText(product.category.name).includes(normalizedQuery)) {
      const key = `category:${product.category.name}`;
      if (!suggestions.has(key)) {
        suggestions.set(key, {
          type: 'category',
          text: product.category.name,
          count: 1,
          icon: '📂'
        });
      } else {
        const existing = suggestions.get(key)!;
        existing.count++;
      }
    }

    // Tag suggestions
    if (product.tags) {
      product.tags.forEach(tag => {
        if (normalizeText(tag).includes(normalizedQuery)) {
          const key = `tag:${tag}`;
          if (!suggestions.has(key)) {
            suggestions.set(key, {
              type: 'tag',
              text: tag,
              count: 1,
              icon: '#️⃣'
            });
          } else {
            const existing = suggestions.get(key)!;
            existing.count++;
          }
        }
      });
    }
  });

  return Array.from(suggestions.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, SEARCH_CONFIG.MAX_SUGGESTIONS);
};

// Search history management
const SEARCH_HISTORY_KEY = 'gsa-search-history';

export const getSearchHistory = (): SearchHistoryItem[] => {
  try {
    const stored = localStorage.getItem(SEARCH_HISTORY_KEY);
    if (stored) {
      const history = JSON.parse(stored) as SearchHistoryItem[];
      return history.map(item => ({
        ...item,
        timestamp: new Date(item.timestamp)
      }));
    }
  } catch (error) {
    console.error('Failed to load search history:', error);
  }
  return [];
};

export const addToSearchHistory = (query: string, resultCount: number): void => {
  if (query.trim().length < SEARCH_CONFIG.MIN_QUERY_LENGTH) return;

  try {
    const history = getSearchHistory();
    
    // Remove existing entry if it exists
    const filteredHistory = history.filter(item => item.query !== query.trim());
    
    // Add new entry at the beginning
    const newHistory = [
      {
        query: query.trim(),
        timestamp: new Date(),
        resultCount
      },
      ...filteredHistory
    ].slice(0, SEARCH_CONFIG.MAX_SEARCH_HISTORY);

    localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(newHistory));
  } catch (error) {
    console.error('Failed to save search history:', error);
  }
};

export const clearSearchHistory = (): void => {
  try {
    localStorage.removeItem(SEARCH_HISTORY_KEY);
  } catch (error) {
    console.error('Failed to clear search history:', error);
  }
};

export const removeFromSearchHistory = (query: string): void => {
  try {
    const history = getSearchHistory();
    const filteredHistory = history.filter(item => item.query !== query);
    localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(filteredHistory));
  } catch (error) {
    console.error('Failed to remove from search history:', error);
  }
};
