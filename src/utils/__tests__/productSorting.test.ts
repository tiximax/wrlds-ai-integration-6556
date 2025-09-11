import { describe, it, expect } from 'vitest';
import {
  sortByPriceLow,
  sortByPriceHigh,
  sortByName,
  sortByRating,
  sortByNewest,
  sortByPopular,
  applySorting
} from '../productSorting';
import { mockProductList } from '../../test/fixtures/mockProducts';

describe('Product Sorting Utils', () => {
  describe('sortByPriceLow', () => {
    it('should sort products by price from low to high', () => {
      const result = sortByPriceLow(mockProductList);
      
      for (let i = 0; i < result.length - 1; i++) {
        expect(result[i].sellingPrice).toBeLessThanOrEqual(result[i + 1].sellingPrice);
      }
    });

    it('should not mutate the original array', () => {
      const originalLength = mockProductList.length;
      const originalFirst = mockProductList[0];
      
      sortByPriceLow(mockProductList);
      
      expect(mockProductList.length).toBe(originalLength);
      expect(mockProductList[0]).toBe(originalFirst);
    });

    it('should handle empty array', () => {
      const result = sortByPriceLow([]);
      expect(result).toHaveLength(0);
    });

    it('should handle single product', () => {
      const singleProduct = [mockProductList[0]];
      const result = sortByPriceLow(singleProduct);
      expect(result).toHaveLength(1);
      expect(result[0]).toBe(singleProduct[0]);
    });
  });

  describe('sortByPriceHigh', () => {
    it('should sort products by price from high to low', () => {
      const result = sortByPriceHigh(mockProductList);
      
      for (let i = 0; i < result.length - 1; i++) {
        expect(result[i].sellingPrice).toBeGreaterThanOrEqual(result[i + 1].sellingPrice);
      }
    });

    it('should not mutate the original array', () => {
      const originalLength = mockProductList.length;
      const originalFirst = mockProductList[0];
      
      sortByPriceHigh(mockProductList);
      
      expect(mockProductList.length).toBe(originalLength);
      expect(mockProductList[0]).toBe(originalFirst);
    });
  });

  describe('sortByName', () => {
    it('should sort products by name alphabetically', () => {
      const result = sortByName(mockProductList);
      
      for (let i = 0; i < result.length - 1; i++) {
        expect(result[i].name.localeCompare(result[i + 1].name)).toBeLessThanOrEqual(0);
      }
    });

    it('should handle case insensitive sorting', () => {
      const productsWithMixedCase = [
        { ...mockProductList[0], name: 'apple iPhone' },
        { ...mockProductList[1], name: 'Samsung Galaxy' },
        { ...mockProductList[2], name: 'ASUS Laptop' }
      ];
      
      const result = sortByName(productsWithMixedCase);
      expect(result[0].name).toBe('apple iPhone');
      expect(result[1].name).toBe('ASUS Laptop');
      expect(result[2].name).toBe('Samsung Galaxy');
    });

    it('should not mutate the original array', () => {
      const originalLength = mockProductList.length;
      const originalFirst = mockProductList[0];
      
      sortByName(mockProductList);
      
      expect(mockProductList.length).toBe(originalLength);
      expect(mockProductList[0]).toBe(originalFirst);
    });
  });

  describe('sortByRating', () => {
    it('should sort products by rating from highest to lowest', () => {
      const result = sortByRating(mockProductList);
      
      for (let i = 0; i < result.length - 1; i++) {
        expect(result[i].rating.average).toBeGreaterThanOrEqual(result[i + 1].rating.average);
      }
    });

    it('should handle products with same rating', () => {
      const productsWithSameRating = [
        { ...mockProductList[0], rating: { average: 4.5, count: 100 } },
        { ...mockProductList[1], rating: { average: 4.5, count: 200 } },
        { ...mockProductList[2], rating: { average: 4.8, count: 150 } }
      ];
      
      const result = sortByRating(productsWithSameRating);
      expect(result[0].rating.average).toBe(4.8);
      expect(result[1].rating.average).toBe(4.5);
      expect(result[2].rating.average).toBe(4.5);
    });

    it('should not mutate the original array', () => {
      const originalLength = mockProductList.length;
      const originalFirst = mockProductList[0];
      
      sortByRating(mockProductList);
      
      expect(mockProductList.length).toBe(originalLength);
      expect(mockProductList[0]).toBe(originalFirst);
    });
  });

  describe('sortByNewest', () => {
    it('should sort products by creation date from newest to oldest', () => {
      const result = sortByNewest(mockProductList);
      
      for (let i = 0; i < result.length - 1; i++) {
        const currentDate = new Date(result[i].createdAt).getTime();
        const nextDate = new Date(result[i + 1].createdAt).getTime();
        expect(currentDate).toBeGreaterThanOrEqual(nextDate);
      }
    });

    it('should handle products with same creation date', () => {
      const sameDate = new Date('2024-01-15');
      const productsWithSameDate = [
        { ...mockProductList[0], createdAt: sameDate },
        { ...mockProductList[1], createdAt: sameDate },
        { ...mockProductList[2], createdAt: new Date('2024-01-16') }
      ];
      
      const result = sortByNewest(productsWithSameDate);
      expect(new Date(result[0].createdAt).getTime()).toBeGreaterThanOrEqual(new Date(result[1].createdAt).getTime());
    });

    it('should not mutate the original array', () => {
      const originalLength = mockProductList.length;
      const originalFirst = mockProductList[0];
      
      sortByNewest(mockProductList);
      
      expect(mockProductList.length).toBe(originalLength);
      expect(mockProductList[0]).toBe(originalFirst);
    });
  });

  describe('sortByPopular', () => {
    it('should sort products by rating count from highest to lowest', () => {
      const result = sortByPopular(mockProductList);
      
      for (let i = 0; i < result.length - 1; i++) {
        expect(result[i].rating.count).toBeGreaterThanOrEqual(result[i + 1].rating.count);
      }
    });

    it('should handle products with zero rating count', () => {
      const productsWithZeroRating = [
        { ...mockProductList[0], rating: { average: 4.5, count: 0 } },
        { ...mockProductList[1], rating: { average: 4.2, count: 100 } },
        { ...mockProductList[2], rating: { average: 4.8, count: 0 } }
      ];
      
      const result = sortByPopular(productsWithZeroRating);
      expect(result[0].rating.count).toBe(100);
      expect(result[1].rating.count).toBe(0);
      expect(result[2].rating.count).toBe(0);
    });

    it('should not mutate the original array', () => {
      const originalLength = mockProductList.length;
      const originalFirst = mockProductList[0];
      
      sortByPopular(mockProductList);
      
      expect(mockProductList.length).toBe(originalLength);
      expect(mockProductList[0]).toBe(originalFirst);
    });
  });

  describe('applySorting', () => {
    it('should apply price-low sorting', () => {
      const result = applySorting(mockProductList, 'price-low');
      const expected = sortByPriceLow(mockProductList);
      
      expect(result).toEqual(expected);
    });

    it('should apply price-high sorting', () => {
      const result = applySorting(mockProductList, 'price-high');
      const expected = sortByPriceHigh(mockProductList);
      
      expect(result).toEqual(expected);
    });

    it('should apply name sorting', () => {
      const result = applySorting(mockProductList, 'name');
      const expected = sortByName(mockProductList);
      
      expect(result).toEqual(expected);
    });

    it('should apply rating sorting', () => {
      const result = applySorting(mockProductList, 'rating');
      const expected = sortByRating(mockProductList);
      
      expect(result).toEqual(expected);
    });

    it('should apply popular sorting', () => {
      const result = applySorting(mockProductList, 'popular');
      const expected = sortByPopular(mockProductList);
      
      expect(result).toEqual(expected);
    });

    it('should apply newest sorting by default', () => {
      const result = applySorting(mockProductList, 'newest');
      const expected = sortByNewest(mockProductList);
      
      expect(result).toEqual(expected);
    });

    it('should default to newest sorting for unknown sort options', () => {
      const result = applySorting(mockProductList, 'unknown' as never);
      const expected = sortByNewest(mockProductList);
      
      expect(result).toEqual(expected);
    });

    it('should not mutate the original array', () => {
      const originalLength = mockProductList.length;
      const originalFirst = mockProductList[0];
      
      applySorting(mockProductList, 'price-low');
      
      expect(mockProductList.length).toBe(originalLength);
      expect(mockProductList[0]).toBe(originalFirst);
    });

    it('should handle empty array', () => {
      const result = applySorting([], 'price-low');
      expect(result).toHaveLength(0);
    });

    it('should handle single product array', () => {
      const singleProduct = [mockProductList[0]];
      const result = applySorting(singleProduct, 'price-low');
      
      expect(result).toHaveLength(1);
      expect(result[0]).toBe(singleProduct[0]);
    });
  });

  describe('Sorting stability and performance', () => {
    it('should maintain relative order for equal elements', () => {
      // Create products with same price but different IDs to test stable sort
      const productsWithSamePrice = [
        { ...mockProductList[0], id: 'a', sellingPrice: 5000000 },
        { ...mockProductList[1], id: 'b', sellingPrice: 5000000 },
        { ...mockProductList[2], id: 'c', sellingPrice: 5000000 }
      ];
      
      const result = sortByPriceLow(productsWithSamePrice);
      
      // Since all prices are the same, original order should be maintained
      expect(result[0].id).toBe('a');
      expect(result[1].id).toBe('b');
      expect(result[2].id).toBe('c');
    });

    it('should handle large arrays efficiently', () => {
      // Create a larger array for performance testing
      const largeArray = Array.from({ length: 1000 }, (_, index) => ({
        ...mockProductList[0],
        id: `product-${index}`,
        sellingPrice: Math.floor(Math.random() * 1000000),
        name: `Product ${index}`,
        rating: { average: Math.random() * 5, count: Math.floor(Math.random() * 1000) },
        createdAt: new Date(2024, 0, Math.floor(Math.random() * 30) + 1)
      }));

      const startTime = Date.now();
      const result = applySorting(largeArray, 'price-low');
      const endTime = Date.now();

      expect(result).toHaveLength(1000);
      expect(endTime - startTime).toBeLessThan(100); // Should complete in under 100ms
      
      // Verify sorting is correct
      for (let i = 0; i < result.length - 1; i++) {
        expect(result[i].sellingPrice).toBeLessThanOrEqual(result[i + 1].sellingPrice);
      }
    });
  });
});
