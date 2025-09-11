import { describe, it, expect } from 'vitest';
import {
  filterBySearch,
  filterByOrigins,
  filterByStatus,
  filterByTypes,
  filterByBrands,
  filterByPriceRange,
  filterByQuickFilter,
  applyFilters,
  defaultFilters,
  FilterState
} from '../productFilters';
import { mockProductList } from '../../test/fixtures/mockProducts';

describe('Product Filtering Utils', () => {
  describe('filterBySearch', () => {
    it('should return all products when search term is empty', () => {
      const result = filterBySearch(mockProductList, '');
      expect(result).toHaveLength(mockProductList.length);
    });

    it('should return all products when search term is only whitespace', () => {
      const result = filterBySearch(mockProductList, '   ');
      expect(result).toHaveLength(mockProductList.length);
    });

    it('should filter by product name (case insensitive)', () => {
      const result = filterBySearch(mockProductList, 'iphone');
      expect(result).toHaveLength(2); // iPhone 15 Pro và iPhone 16 Pro Max
      expect(result.every(p => p.name.toLowerCase().includes('iphone'))).toBe(true);
    });

    it('should filter by brand name', () => {
      const result = filterBySearch(mockProductList, 'sony');
      expect(result).toHaveLength(2); // Sony WH-1000XM5 và Sony PlayStation 5
      expect(result.every(p => p.brand?.name.toLowerCase().includes('sony'))).toBe(true);
    });

    it('should filter by product description', () => {
      const result = filterBySearch(mockProductList, 'wireless');
      expect(result.length).toBeGreaterThan(0);
      expect(result.some(p => p.description.toLowerCase().includes('wireless'))).toBe(true);
    });

    it('should filter by product tags', () => {
      const result = filterBySearch(mockProductList, 'smartphone');
      expect(result.length).toBeGreaterThan(0);
      expect(result.every(p => p.tags.some(tag => tag.toLowerCase().includes('smartphone')))).toBe(true);
    });

    it('should return empty array when no matches found', () => {
      const result = filterBySearch(mockProductList, 'nonexistentproduct');
      expect(result).toHaveLength(0);
    });
  });

  describe('filterByOrigins', () => {
    it('should return all products when origins array is empty', () => {
      const result = filterByOrigins(mockProductList, []);
      expect(result).toHaveLength(mockProductList.length);
    });

    it('should filter by single origin', () => {
      const result = filterByOrigins(mockProductList, ['usa']);
      const usaProducts = mockProductList.filter(p => p.origin === 'usa');
      expect(result).toHaveLength(usaProducts.length);
      expect(result.every(p => p.origin === 'usa')).toBe(true);
    });

    it('should filter by multiple origins', () => {
      const result = filterByOrigins(mockProductList, ['usa', 'japan']);
      expect(result.every(p => ['usa', 'japan'].includes(p.origin))).toBe(true);
      expect(result.length).toBeGreaterThan(0);
    });

    it('should return empty array when no products match origins', () => {
      const result = filterByOrigins(mockProductList, ['europe']);
      expect(result).toHaveLength(0);
    });
  });

  describe('filterByStatus', () => {
    it('should return all products when status array is empty', () => {
      const result = filterByStatus(mockProductList, []);
      expect(result).toHaveLength(mockProductList.length);
    });

    it('should filter by available status', () => {
      const result = filterByStatus(mockProductList, ['available']);
      expect(result.every(p => p.status === 'available')).toBe(true);
      expect(result.length).toBeGreaterThan(0);
    });

    it('should filter by multiple statuses', () => {
      const result = filterByStatus(mockProductList, ['available', 'preorder']);
      expect(result.every(p => ['available', 'preorder'].includes(p.status))).toBe(true);
    });

    it('should filter out of stock products', () => {
      const result = filterByStatus(mockProductList, ['out_of_stock']);
      expect(result.every(p => p.status === 'out_of_stock')).toBe(true);
      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe('filterByTypes', () => {
    it('should return all products when types array is empty', () => {
      const result = filterByTypes(mockProductList, []);
      expect(result).toHaveLength(mockProductList.length);
    });

    it('should filter by ready stock type', () => {
      const result = filterByTypes(mockProductList, ['ready_stock']);
      expect(result.every(p => p.type === 'ready_stock')).toBe(true);
      expect(result.length).toBeGreaterThan(0);
    });

    it('should filter by multiple types', () => {
      const result = filterByTypes(mockProductList, ['ready_stock', 'flash_deal']);
      expect(result.every(p => ['ready_stock', 'flash_deal'].includes(p.type))).toBe(true);
    });

    it('should filter pre-order products', () => {
      const result = filterByTypes(mockProductList, ['pre_order']);
      expect(result.every(p => p.type === 'pre_order')).toBe(true);
      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe('filterByBrands', () => {
    it('should return all products when brands array is empty', () => {
      const result = filterByBrands(mockProductList, []);
      expect(result).toHaveLength(mockProductList.length);
    });

    it('should filter by single brand', () => {
      const result = filterByBrands(mockProductList, ['Apple']);
      expect(result.every(p => p.brand?.name === 'Apple')).toBe(true);
      expect(result.length).toBeGreaterThan(0);
    });

    it('should filter by multiple brands', () => {
      const result = filterByBrands(mockProductList, ['Apple', 'Samsung']);
      expect(result.every(p => p.brand && ['Apple', 'Samsung'].includes(p.brand.name))).toBe(true);
    });

    it('should handle products without brands', () => {
      const productsWithoutBrand = [
        ...mockProductList,
        {
          ...mockProductList[0],
          id: 'no-brand',
          brand: undefined
        }
      ];
      const result = filterByBrands(productsWithoutBrand, ['Apple']);
      expect(result.every(p => p.brand?.name === 'Apple')).toBe(true);
    });
  });

  describe('filterByPriceRange', () => {
    it('should return all products when price range covers all prices', () => {
      const result = filterByPriceRange(mockProductList, [0, 100000000]);
      expect(result).toHaveLength(mockProductList.length);
    });

    it('should filter by price range', () => {
      const result = filterByPriceRange(mockProductList, [5000000, 15000000]);
      expect(result.every(p => p.sellingPrice >= 5000000 && p.sellingPrice <= 15000000)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
    });

    it('should filter expensive products', () => {
      const result = filterByPriceRange(mockProductList, [20000000, 50000000]);
      expect(result.every(p => p.sellingPrice >= 20000000)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
    });

    it('should return empty array when no products in range', () => {
      const result = filterByPriceRange(mockProductList, [100000000, 200000000]);
      expect(result).toHaveLength(0);
    });
  });

  describe('filterByQuickFilter', () => {
    it('should return all products when quickFilter is empty', () => {
      const result = filterByQuickFilter(mockProductList, '');
      expect(result).toHaveLength(mockProductList.length);
    });

    it('should filter in-stock products', () => {
      const result = filterByQuickFilter(mockProductList, 'in-stock');
      expect(result.every(p => p.status === 'available')).toBe(true);
      expect(result.length).toBeGreaterThan(0);
    });

    it('should filter trending products', () => {
      const result = filterByQuickFilter(mockProductList, 'trending');
      expect(result.every(p => p.trending === true)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
    });

    it('should filter featured products', () => {
      const result = filterByQuickFilter(mockProductList, 'featured');
      expect(result.every(p => p.featured === true)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
    });

    it('should filter flash deal products', () => {
      const result = filterByQuickFilter(mockProductList, 'flash-deal');
      expect(result.every(p => p.type === 'flash_deal')).toBe(true);
      expect(result.length).toBeGreaterThan(0);
    });

    it('should handle unknown quick filter', () => {
      const result = filterByQuickFilter(mockProductList, 'unknown');
      expect(result).toHaveLength(mockProductList.length);
    });
  });

  describe('applyFilters', () => {
    it('should return all products with default filters', () => {
      console.log('mockProductList length:', mockProductList.length);
      
      // Test each filter step by step
      let products = [...mockProductList];
      console.log('Initial:', products.length);
      
      products = filterBySearch(products, defaultFilters.search);
      console.log('After search filter:', products.length);
      
      products = filterByOrigins(products, defaultFilters.origins);
      console.log('After origins filter:', products.length);
      
      products = filterByStatus(products, defaultFilters.status);
      console.log('After status filter:', products.length);
      
      products = filterByTypes(products, defaultFilters.types);
      console.log('After types filter:', products.length);
      
      products = filterByBrands(products, defaultFilters.brands);
      console.log('After brands filter:', products.length);
      
      products = filterByPriceRange(products, defaultFilters.priceRange);
      console.log('After price filter:', products.length, 'remaining products:', products.map(p => p.id));
      
      products = filterByQuickFilter(products, defaultFilters.quickFilter);
      console.log('After quick filter:', products.length);
      
      const result = applyFilters(mockProductList, defaultFilters);
      expect(result).toHaveLength(mockProductList.length);
    });

    it('should apply multiple filters correctly', () => {
      const filters: FilterState = {
        search: '',
        origins: ['usa'],
        status: ['available'],
        types: ['ready_stock'],
        brands: ['Apple'],
        priceRange: [0, 50000000],
        quickFilter: 'featured'
      };

      const result = applyFilters(mockProductList, filters);
      
      expect(result.every(p => 
        p.origin === 'usa' &&
        p.status === 'available' &&
        p.type === 'ready_stock' &&
        p.brand?.name === 'Apple' &&
        p.sellingPrice <= 50000000 &&
        p.featured === true
      )).toBe(true);
    });

    it('should apply search filter with other filters', () => {
      const filters: FilterState = {
        search: 'iPhone',
        origins: ['usa'],
        status: [],
        types: [],
        brands: [],
        priceRange: [0, 50000000],
        quickFilter: ''
      };

      const result = applyFilters(mockProductList, filters);
      
      expect(result.every(p => 
        p.name.toLowerCase().includes('iphone') &&
        p.origin === 'usa' &&
        p.sellingPrice <= 50000000
      )).toBe(true);
    });

    it('should return empty array when filters exclude all products', () => {
      const filters: FilterState = {
        search: '',
        origins: ['europe'], // No products from Europe in mock data
        status: [],
        types: [],
        brands: [],
        priceRange: [0, 10000000],
        quickFilter: ''
      };

      const result = applyFilters(mockProductList, filters);
      expect(result).toHaveLength(0);
    });
  });
});
