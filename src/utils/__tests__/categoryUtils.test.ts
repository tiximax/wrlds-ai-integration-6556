import { describe, it, expect, beforeEach } from 'vitest';
import {
  getCategoryByIdOrSlug,
  getCategoryBySlug,
  getCategoryById,
  getParentCategory,
  getAncestors,
  getChildren,
  getDescendants,
  buildBreadcrumbs,
  buildCategoryHierarchy,
  generateCategoryUrl,
  getRootCategories,
  getCategoriesByParentId,
  isCategoryAncestor,
  isCategoryDescendant,
  getCategoryDepth,
  searchCategories,
  getActiveCategories,
  getCategoryTree,
  parseCategoryPath,
  updateCategoryProductCounts
} from '../categoryUtils';
import { ProductCategory } from '../../types/product';

// Use real category data for testing
const mockProducts = [
  { id: '1', category: { id: 'headphones-audio', name: 'Headphones & Audio' } },
  { id: '2', category: { id: 'smartphones-tablets', name: 'Smartphones & Tablets' } },
  { id: '3', category: { id: 'clothing', name: 'Clothing' } },
  { id: '4', category: { id: 'headphones-audio', name: 'Headphones & Audio' } },
];

describe('Category Utilities', () => {
  describe('getCategoryByIdOrSlug', () => {
    it('should get category by ID', () => {
      const category = getCategoryByIdOrSlug('electronics');
      expect(category?.id).toBe('electronics');
      expect(category?.name).toBe('Electronics');
    });

    it('should return undefined for non-existent category', () => {
      const category = getCategoryByIdOrSlug('non-existent');
      expect(category).toBeUndefined();
    });
  });

  describe('getCategoryBySlug', () => {
    it('should get category by slug', () => {
      const category = getCategoryBySlug('electronics');
      expect(category?.slug).toBe('electronics');
      expect(category?.name).toBe('Electronics');
    });

    it('should return undefined for non-existent slug', () => {
      const category = getCategoryBySlug('non-existent');
      expect(category).toBeUndefined();
    });
  });

  describe('getCategoryById', () => {
    it('should get category by ID', () => {
      const category = getCategoryById('electronics');
      expect(category?.id).toBe('electronics');
    });

    it('should return undefined for non-existent ID', () => {
      const category = getCategoryById('non-existent');
      expect(category).toBeUndefined();
    });
  });

  describe('getParentCategory', () => {
    it('should get parent category for child category', () => {
      const child = getCategoryById('headphones-audio');
      const parent = getParentCategory(child!);
      expect(parent?.id).toBe('electronics');
    });

    it('should return undefined for root category', () => {
      const root = getCategoryById('electronics');
      const parent = getParentCategory(root!);
      expect(parent).toBeUndefined();
    });
  });

  describe('getAncestors', () => {
    it('should get all ancestors for nested category', () => {
      const child = getCategoryById('headphones-audio');
      const ancestors = getAncestors(child!);
      expect(ancestors).toHaveLength(1);
      expect(ancestors[0].id).toBe('electronics');
    });

    it('should return empty array for root category', () => {
      const root = getCategoryById('electronics');
      const ancestors = getAncestors(root!);
      expect(ancestors).toHaveLength(0);
    });
  });

  describe('getChildren', () => {
    it('should get children for parent category', () => {
      const parent = getCategoryById('electronics');
      const children = getChildren(parent!);
      expect(children.length).toBeGreaterThan(0);
      expect(children.map(c => c.id)).toContain('headphones-audio');
      expect(children.map(c => c.id)).toContain('smartphones-tablets');
    });

    it('should return empty array for leaf category', () => {
      const leaf = getCategoryById('headphones-audio');
      const children = getChildren(leaf!);
      expect(children).toHaveLength(0);
    });
  });

  describe('getDescendants', () => {
    it('should get all descendants for parent category', () => {
      const parent = getCategoryById('electronics');
      const descendants = getDescendants(parent!);
      expect(descendants.length).toBeGreaterThan(0);
      expect(descendants.map(d => d.id)).toContain('headphones-audio');
      expect(descendants.map(d => d.id)).toContain('smartphones-tablets');
    });

    it('should return empty array for leaf category', () => {
      const leaf = getCategoryById('headphones-audio');
      const descendants = getDescendants(leaf!);
      expect(descendants).toHaveLength(0);
    });
  });

  describe('buildBreadcrumbs', () => {
    it('should build breadcrumbs for child category', () => {
      const child = getCategoryById('headphones-audio');
      const breadcrumbs = buildBreadcrumbs(child!);
      
      expect(breadcrumbs).toHaveLength(3); // Home + Electronics + Headphones & Audio
      expect(breadcrumbs[0].name).toBe('Home');
      expect(breadcrumbs[1].name).toBe('Electronics');
      expect(breadcrumbs[2].name).toBe('Headphones & Audio');
    });

    it('should build breadcrumbs for root category', () => {
      const root = getCategoryById('electronics');
      const breadcrumbs = buildBreadcrumbs(root!);
      
      expect(breadcrumbs).toHaveLength(2); // Home + Electronics
      expect(breadcrumbs[0].name).toBe('Home');
      expect(breadcrumbs[1].name).toBe('Electronics');
    });
  });

  describe('generateCategoryUrl', () => {
    it('should generate URL for root category', () => {
      const root = getCategoryById('electronics');
      const url = generateCategoryUrl(root!);
      expect(url).toBe('/category/electronics');
    });

    it('should generate URL for child category', () => {
      const child = getCategoryById('headphones-audio');
      const url = generateCategoryUrl(child!);
      expect(url).toBe('/category/electronics/headphones-audio');
    });
  });

  describe('getRootCategories', () => {
    it('should get all root categories', () => {
      const roots = getRootCategories();
      expect(roots.length).toBeGreaterThan(0);
      expect(roots.map(r => r.id)).toContain('electronics');
      expect(roots.map(r => r.id)).toContain('fashion-beauty');
      expect(roots.map(r => r.id)).toContain('health-sports');
      expect(roots.map(r => r.id)).toContain('home-living');
    });
  });

  describe('getCategoriesByParentId', () => {
    it('should get categories by parent ID', () => {
      const children = getCategoriesByParentId('electronics');
      expect(children.length).toBeGreaterThan(0);
      expect(children.map(c => c.id)).toContain('headphones-audio');
      expect(children.map(c => c.id)).toContain('smartphones-tablets');
    });

    it('should return empty array for non-existent parent', () => {
      const children = getCategoriesByParentId('non-existent');
      expect(children).toHaveLength(0);
    });
  });

  describe('isCategoryAncestor', () => {
    it('should return true for actual ancestor', () => {
      const ancestor = getCategoryById('electronics');
      const descendant = getCategoryById('headphones-audio');
      const result = isCategoryAncestor(ancestor!, descendant!);
      expect(result).toBe(true);
    });

    it('should return false for non-ancestor', () => {
      const category1 = getCategoryById('electronics');
      const category2 = getCategoryById('fashion-beauty');
      const result = isCategoryAncestor(category1!, category2!);
      expect(result).toBe(false);
    });
  });

  describe('isCategoryDescendant', () => {
    it('should return true for actual descendant', () => {
      const descendant = getCategoryById('headphones-audio');
      const ancestor = getCategoryById('electronics');
      const result = isCategoryDescendant(descendant!, ancestor!);
      expect(result).toBe(true);
    });

    it('should return false for non-descendant', () => {
      const category1 = getCategoryById('fashion-beauty');
      const category2 = getCategoryById('electronics');
      const result = isCategoryDescendant(category1!, category2!);
      expect(result).toBe(false);
    });
  });

  describe('getCategoryDepth', () => {
    it('should return 0 for root category', () => {
      const root = getCategoryById('electronics');
      const depth = getCategoryDepth(root!);
      expect(depth).toBe(0);
    });

    it('should return 1 for first-level child', () => {
      const child = getCategoryById('headphones-audio');
      const depth = getCategoryDepth(child!);
      expect(depth).toBe(1);
    });
  });

  describe('searchCategories', () => {
    it('should find categories by name', () => {
      const results = searchCategories('Electronics');
      expect(results.length).toBeGreaterThan(0);
      expect(results[0].name).toBe('Electronics');
    });

    it('should find categories by description', () => {
      const results = searchCategories('Audio');
      expect(results.length).toBeGreaterThan(0);
      expect(results[0].name).toBe('Headphones & Audio');
    });

    it('should return empty array for no matches', () => {
      const results = searchCategories('NonExistent');
      expect(results).toHaveLength(0);
    });

    it('should be case insensitive', () => {
      const results = searchCategories('electronics');
      expect(results.length).toBeGreaterThan(0);
      expect(results[0].name).toBe('Electronics');
    });
  });

  describe('getActiveCategories', () => {
    it('should return only active categories', () => {
      const active = getActiveCategories();
      expect(active.every(cat => cat.isActive)).toBe(true);
    });
  });

  describe('getCategoryTree', () => {
    it('should return the complete category tree', () => {
      const tree = getCategoryTree();
      expect(Array.isArray(tree)).toBe(true);
      expect(tree.length).toBeGreaterThan(0);
      expect(tree.some(cat => cat.id === 'electronics')).toBe(true);
    });
  });

  describe('parseCategoryPath', () => {
    it('should parse root category path', () => {
      const result = parseCategoryPath('electronics');
      expect(result.category?.id).toBe('electronics');
      expect(result.subcategory).toBeUndefined();
      expect(result.hierarchy?.category.id).toBe('electronics');
    });

    it('should parse subcategory path', () => {
      const result = parseCategoryPath('electronics', 'headphones-audio');
      expect(result.category?.id).toBe('electronics');
      expect(result.subcategory?.id).toBe('headphones-audio');
      expect(result.hierarchy?.category.id).toBe('headphones-audio');
    });

    it('should return undefined for non-existent category', () => {
      const result = parseCategoryPath('non-existent');
      expect(result.category).toBeUndefined();
      expect(result.hierarchy).toBeUndefined();
    });
  });

  describe('updateCategoryProductCounts', () => {
    it('should update product counts correctly', () => {
      updateCategoryProductCounts(mockProducts);
      
      const headphones = getCategoryById('headphones-audio');
      const electronics = getCategoryById('electronics');
      
      expect(headphones?.productCount).toBe(2);
      expect(electronics?.productCount).toBe(3); // 2 headphones + 1 smartphone
    });
  });
});
