import { describe, it, expect } from 'vitest';
import { generateSearchSuggestions, performAdvancedSearch, defaultSearchFilters } from '@/utils/advancedSearch';
import { simpleProducts } from '@/data/simpleProducts';

describe('enhancedSearch', () => {
  it('should generate suggestions for common query', () => {
    const query = 'japan';
    const suggestions = generateSearchSuggestions(simpleProducts as any, query);
    expect(Array.isArray(suggestions)).toBe(true);
    // Expect at least one suggestion to appear for seeded data
    expect(suggestions.length).toBeGreaterThan(0);
  });

  it('should perform advanced search and return results', () => {
    const filters = { ...defaultSearchFilters, query: 'korean' };
    const results = performAdvancedSearch(simpleProducts as any, filters);
    expect(Array.isArray(results)).toBe(true);
    expect(results.length).toBeGreaterThan(0);
  });
});
