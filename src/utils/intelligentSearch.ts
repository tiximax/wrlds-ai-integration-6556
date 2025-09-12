import { Product } from '@/types/product';
import { normalizeText, extractKeywords } from './advancedSearch';

// Fuzzy search configuration
export const FUZZY_CONFIG = {
  THRESHOLD: 0.6, // Minimum similarity score
  MAX_DISTANCE: 3, // Maximum Levenshtein distance
  PARTIAL_MATCH_BONUS: 0.8,
  PREFIX_MATCH_BONUS: 1.5,
  WORD_BOUNDARY_BONUS: 1.2
} as const;

// Enhanced search suggestion with intelligence
export interface IntelligentSuggestion {
  id: string;
  text: string;
  type: 'product' | 'category' | 'brand' | 'tag' | 'trending' | 'recommended';
  score: number;
  metadata: {
    count?: number;
    popularity?: number;
    recentSearches?: number;
    userPreference?: number;
    image?: string;
    price?: number;
    rating?: number;
    description?: string;
  };
  source: 'fuzzy' | 'trending' | 'personalized' | 'contextual';
  confidence: number;
}

// Search context for personalized suggestions
export interface SearchContext {
  userId?: string;
  recentSearches: string[];
  viewedCategories: string[];
  purchaseHistory: string[];
  sessionSearches: string[];
  currentLocation?: string;
  deviceType: 'mobile' | 'desktop' | 'tablet';
}

// Trending searches tracking
export interface TrendingSearch {
  query: string;
  count: number;
  velocity: number; // Growth rate
  lastUpdated: Date;
  categories: string[];
}

// Calculate Levenshtein distance for fuzzy matching
export const calculateLevenshteinDistance = (str1: string, str2: string): number => {
  const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null));

  for (let i = 0; i <= str1.length; i++) {
    matrix[0][i] = i;
  }

  for (let j = 0; j <= str2.length; j++) {
    matrix[j][0] = j;
  }

  for (let j = 1; j <= str2.length; j++) {
    for (let i = 1; i <= str1.length; i++) {
      const substitutionCost = str1[i - 1] === str2[j - 1] ? 0 : 1;
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1, // deletion
        matrix[j - 1][i] + 1, // insertion
        matrix[j - 1][i - 1] + substitutionCost // substitution
      );
    }
  }

  return matrix[str2.length][str1.length];
};

// Calculate fuzzy similarity score
export const calculateFuzzyScore = (query: string, target: string): number => {
  const normalizedQuery = normalizeText(query);
  const normalizedTarget = normalizeText(target);

  // Exact match gets highest score
  if (normalizedQuery === normalizedTarget) return 1.0;

  // Check if target contains query as substring
  if (normalizedTarget.includes(normalizedQuery)) {
    const ratio = normalizedQuery.length / normalizedTarget.length;
    return FUZZY_CONFIG.PARTIAL_MATCH_BONUS * ratio;
  }

  // Check prefix match
  if (normalizedTarget.startsWith(normalizedQuery)) {
    return FUZZY_CONFIG.PREFIX_MATCH_BONUS * (normalizedQuery.length / normalizedTarget.length);
  }

  // Calculate Levenshtein distance
  const distance = calculateLevenshteinDistance(normalizedQuery, normalizedTarget);
  const maxLength = Math.max(normalizedQuery.length, normalizedTarget.length);
  
  if (distance > FUZZY_CONFIG.MAX_DISTANCE || maxLength === 0) return 0;

  // Convert distance to similarity score
  const similarity = 1 - (distance / maxLength);
  
  return similarity >= FUZZY_CONFIG.THRESHOLD ? similarity : 0;
};

// Generate fuzzy search suggestions
export const generateFuzzySuggestions = (
  products: Product[], 
  query: string, 
  context: SearchContext
): IntelligentSuggestion[] => {
  if (query.length < 2) return [];

  const suggestions: Map<string, IntelligentSuggestion> = new Map();
  const queryWords = extractKeywords(query);

  products.forEach(product => {
    // Fuzzy match product names
    const nameScore = calculateFuzzyScore(query, product.name);
    if (nameScore > 0) {
      const suggestionId = `product:${product.id}`;
      const existing = suggestions.get(suggestionId);
      const score = nameScore * (1 + (product.rating?.average || 0) * 0.1);
      
      if (!existing || existing.score < score) {
        suggestions.set(suggestionId, {
          id: suggestionId,
          text: product.name,
          type: 'product',
          score,
          metadata: {
            count: 1,
            image: product.images?.[0]?.url,
            price: product.sellingPrice,
            rating: product.rating?.average,
            description: product.description?.slice(0, 100)
          },
          source: 'fuzzy',
          confidence: nameScore
        });
      }
    }

    // Fuzzy match brands
    if (product.brand?.name) {
      const brandScore = calculateFuzzyScore(query, product.brand.name);
      if (brandScore > 0) {
        const suggestionId = `brand:${product.brand.name}`;
        const existing = suggestions.get(suggestionId);
        
        if (!existing) {
          suggestions.set(suggestionId, {
            id: suggestionId,
            text: product.brand.name,
            type: 'brand',
            score: brandScore * 0.8,
            metadata: {
              count: 1,
              popularity: 1
            },
            source: 'fuzzy',
            confidence: brandScore
          });
        } else {
          existing.metadata.count = (existing.metadata.count || 0) + 1;
        }
      }
    }

    // Fuzzy match categories
    if (product.category?.name) {
      const categoryScore = calculateFuzzyScore(query, product.category.name);
      if (categoryScore > 0) {
        const suggestionId = `category:${product.category.id}`;
        const existing = suggestions.get(suggestionId);
        
        if (!existing) {
          suggestions.set(suggestionId, {
            id: suggestionId,
            text: product.category.name,
            type: 'category',
            score: categoryScore * 0.7,
            metadata: {
              count: 1,
              popularity: 1
            },
            source: 'fuzzy',
            confidence: categoryScore
          });
        } else {
          existing.metadata.count = (existing.metadata.count || 0) + 1;
        }
      }
    }

    // Fuzzy match tags
    if (product.tags) {
      product.tags.forEach(tag => {
        const tagScore = calculateFuzzyScore(query, tag);
        if (tagScore > 0) {
          const suggestionId = `tag:${tag}`;
          const existing = suggestions.get(suggestionId);
          
          if (!existing) {
            suggestions.set(suggestionId, {
              id: suggestionId,
              text: tag,
              type: 'tag',
              score: tagScore * 0.5,
              metadata: {
                count: 1
              },
              source: 'fuzzy',
              confidence: tagScore
            });
          } else {
            existing.metadata.count = (existing.metadata.count || 0) + 1;
          }
        }
      });
    }
  });

  return Array.from(suggestions.values())
    .sort((a, b) => b.score - a.score)
    .slice(0, 8);
};

// Generate trending suggestions based on popular searches
export const generateTrendingSuggestions = (
  trendingSearches: TrendingSearch[],
  query: string
): IntelligentSuggestion[] => {
  return trendingSearches
    .filter(trending => 
      normalizeText(trending.query).includes(normalizeText(query)) ||
      calculateFuzzyScore(query, trending.query) > 0.5
    )
    .map(trending => ({
      id: `trending:${trending.query}`,
      text: trending.query,
      type: 'trending' as const,
      score: trending.velocity * (trending.count / 100),
      metadata: {
        count: trending.count,
        popularity: trending.velocity,
        recentSearches: trending.count
      },
      source: 'trending' as const,
      confidence: 0.9
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
};

// Generate personalized suggestions based on user context
export const generatePersonalizedSuggestions = (
  products: Product[],
  query: string,
  context: SearchContext
): IntelligentSuggestion[] => {
  const suggestions: IntelligentSuggestion[] = [];

  // Suggestions based on recent searches
  context.recentSearches.forEach(recentQuery => {
    const similarity = calculateFuzzyScore(query, recentQuery);
    if (similarity > 0.3) {
      suggestions.push({
        id: `recent:${recentQuery}`,
        text: recentQuery,
        type: 'recommended',
        score: similarity * 1.2,
        metadata: {
          userPreference: 1.0,
          recentSearches: 1
        },
        source: 'personalized',
        confidence: similarity
      });
    }
  });

  // Suggestions based on viewed categories
  const categoryProducts = products.filter(product => 
    product.category && context.viewedCategories.includes(product.category.id)
  );

  categoryProducts.forEach(product => {
    const nameScore = calculateFuzzyScore(query, product.name);
    if (nameScore > 0.2) {
      suggestions.push({
        id: `personalized:${product.id}`,
        text: product.name,
        type: 'recommended',
        score: nameScore * 1.1,
        metadata: {
          userPreference: 0.8,
          image: product.images?.[0]?.url,
          price: product.sellingPrice,
          rating: product.rating?.average
        },
        source: 'personalized',
        confidence: nameScore
      });
    }
  });

  return suggestions
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);
};

// Generate contextual suggestions based on current context
export const generateContextualSuggestions = (
  products: Product[],
  query: string,
  context: SearchContext
): IntelligentSuggestion[] => {
  const suggestions: IntelligentSuggestion[] = [];

  // Time-based suggestions (seasonal, trending)
  const now = new Date();
  const month = now.getMonth();
  const seasonalKeywords = getSeasonalKeywords(month);

  seasonalKeywords.forEach(keyword => {
    if (calculateFuzzyScore(query, keyword) > 0.3) {
      suggestions.push({
        id: `contextual:${keyword}`,
        text: keyword,
        type: 'recommended',
        score: 0.8,
        metadata: {
          popularity: 0.7
        },
        source: 'contextual',
        confidence: 0.8
      });
    }
  });

  // Device-specific suggestions
  if (context.deviceType === 'mobile') {
    const mobileOptimizedProducts = products.filter(product =>
      product.tags?.includes('mobile-friendly') || 
      product.tags?.includes('portable')
    );

    mobileOptimizedProducts.forEach(product => {
      const score = calculateFuzzyScore(query, product.name);
      if (score > 0.2) {
        suggestions.push({
          id: `mobile:${product.id}`,
          text: product.name,
          type: 'recommended',
          score: score * 0.9,
          metadata: {
            image: product.images?.[0]?.url,
            price: product.sellingPrice
          },
          source: 'contextual',
          confidence: score
        });
      }
    });
  }

  return suggestions
    .sort((a, b) => b.score - a.score)
    .slice(0, 4);
};

// Helper function to get seasonal keywords
const getSeasonalKeywords = (month: number): string[] => {
  const seasons = {
    winter: [0, 1, 11], // Dec, Jan, Feb
    spring: [2, 3, 4],  // Mar, Apr, May
    summer: [5, 6, 7],  // Jun, Jul, Aug
    autumn: [8, 9, 10]  // Sep, Oct, Nov
  };

  const seasonalKeywords = {
    winter: ['winter', 'coat', 'warm', 'heating', 'holiday'],
    spring: ['spring', 'fresh', 'new', 'garden', 'outdoor'],
    summer: ['summer', 'cool', 'vacation', 'travel', 'beach'],
    autumn: ['autumn', 'fall', 'back to school', 'harvest', 'cozy']
  };

  for (const [season, months] of Object.entries(seasons)) {
    if (months.includes(month)) {
      return seasonalKeywords[season as keyof typeof seasonalKeywords];
    }
  }

  return [];
};

// Combine all suggestion types with intelligent ranking
export const generateIntelligentSuggestions = (
  products: Product[],
  query: string,
  context: SearchContext,
  trendingSearches: TrendingSearch[] = []
): IntelligentSuggestion[] => {
  if (query.length < 1) return [];

  const allSuggestions: IntelligentSuggestion[] = [
    ...generateFuzzySuggestions(products, query, context),
    ...generateTrendingSuggestions(trendingSearches, query),
    ...generatePersonalizedSuggestions(products, query, context),
    ...generateContextualSuggestions(products, query, context)
  ];

  // Remove duplicates and combine scores
  const uniqueSuggestions = new Map<string, IntelligentSuggestion>();
  
  allSuggestions.forEach(suggestion => {
    const existing = uniqueSuggestions.get(suggestion.text);
    if (!existing) {
      uniqueSuggestions.set(suggestion.text, suggestion);
    } else {
      // Combine scores with weighted average
      const combinedScore = (existing.score * 0.6) + (suggestion.score * 0.4);
      existing.score = Math.max(existing.score, combinedScore);
      existing.confidence = Math.max(existing.confidence, suggestion.confidence);
      
      // Merge metadata
      existing.metadata = {
        ...existing.metadata,
        ...suggestion.metadata,
        count: (existing.metadata.count || 0) + (suggestion.metadata.count || 0)
      };
    }
  });

  return Array.from(uniqueSuggestions.values())
    .sort((a, b) => {
      // Multi-factor sorting: score, confidence, popularity
      const scoreA = a.score * a.confidence * (1 + (a.metadata.popularity || 0) * 0.1);
      const scoreB = b.score * b.confidence * (1 + (b.metadata.popularity || 0) * 0.1);
      return scoreB - scoreA;
    })
    .slice(0, 12);
};

// Mock trending searches (in real app, this would come from analytics)
export const mockTrendingSearches: TrendingSearch[] = [
  {
    query: 'smart textiles',
    count: 1250,
    velocity: 0.8,
    lastUpdated: new Date(),
    categories: ['technology', 'textiles']
  },
  {
    query: 'firecat gear',
    count: 890,
    velocity: 1.2,
    lastUpdated: new Date(),
    categories: ['safety', 'equipment']
  },
  {
    query: 'temperature monitoring',
    count: 670,
    velocity: 0.9,
    lastUpdated: new Date(),
    categories: ['sensors', 'monitoring']
  },
  {
    query: 'sports tracking',
    count: 1100,
    velocity: 1.1,
    lastUpdated: new Date(),
    categories: ['sports', 'technology']
  }
];

// Create default search context
export const createDefaultSearchContext = (deviceType: 'mobile' | 'desktop' | 'tablet' = 'desktop'): SearchContext => ({
  recentSearches: [],
  viewedCategories: [],
  purchaseHistory: [],
  sessionSearches: [],
  deviceType
});
