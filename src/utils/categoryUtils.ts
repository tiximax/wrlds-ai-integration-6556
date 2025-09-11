import { ProductCategory, CategoryHierarchy, Breadcrumb } from '../types/product';
import { flatCategories, categoryTaxonomy } from '../data/categories';

/**
 * Get category by ID or slug
 */
export const getCategoryByIdOrSlug = (idOrSlug: string): ProductCategory | undefined => {
  return flatCategories[idOrSlug];
};

/**
 * Get category by slug specifically
 */
export const getCategoryBySlug = (slug: string): ProductCategory | undefined => {
  return Object.values(flatCategories).find(category => category.slug === slug);
};

/**
 * Get category by ID specifically
 */
export const getCategoryById = (id: string): ProductCategory | undefined => {
  return Object.values(flatCategories).find(category => category.id === id);
};

/**
 * Get parent category of a given category
 */
export const getParentCategory = (category: ProductCategory): ProductCategory | undefined => {
  if (!category.parentId) return undefined;
  return getCategoryById(category.parentId);
};

/**
 * Get all ancestor categories (from root to parent)
 */
export const getAncestors = (category: ProductCategory): ProductCategory[] => {
  const ancestors: ProductCategory[] = [];
  let current = category;
  
  while (current.parentId) {
    const parent = getCategoryById(current.parentId);
    if (parent) {
      ancestors.unshift(parent); // Add to beginning to get root-first order
      current = parent;
    } else {
      break;
    }
  }
  
  return ancestors;
};

/**
 * Get direct children of a category
 */
export const getChildren = (category: ProductCategory): ProductCategory[] => {
  return category.children || [];
};

/**
 * Get all descendant categories (recursive)
 */
export const getDescendants = (category: ProductCategory): ProductCategory[] => {
  const descendants: ProductCategory[] = [];
  
  const addChildren = (cat: ProductCategory) => {
    if (cat.children) {
      cat.children.forEach(child => {
        descendants.push(child);
        addChildren(child); // Recursive call
      });
    }
  };
  
  addChildren(category);
  return descendants;
};

/**
 * Build breadcrumbs for a category
 */
export const buildBreadcrumbs = (category: ProductCategory): Breadcrumb[] => {
  const ancestors = getAncestors(category);
  const breadcrumbs: Breadcrumb[] = [];
  
  // Add home breadcrumb
  breadcrumbs.push({
    id: 'home',
    name: 'Home',
    slug: 'home',
    url: '/'
  });
  
  // Add ancestor breadcrumbs
  ancestors.forEach(ancestor => {
    breadcrumbs.push({
      id: ancestor.id,
      name: ancestor.name,
      slug: ancestor.slug,
      url: `/category/${ancestor.slug}`
    });
  });
  
  // Add current category breadcrumb
  breadcrumbs.push({
    id: category.id,
    name: category.name,
    slug: category.slug,
    url: category.parentId 
      ? `/category/${getParentCategory(category)?.slug}/${category.slug}`
      : `/category/${category.slug}`
  });
  
  return breadcrumbs;
};

/**
 * Build complete category hierarchy for a category
 */
export const buildCategoryHierarchy = (category: ProductCategory): CategoryHierarchy => {
  return {
    category,
    parent: getParentCategory(category),
    ancestors: getAncestors(category),
    children: getChildren(category),
    breadcrumbs: buildBreadcrumbs(category)
  };
};

/**
 * Generate category URL based on hierarchy
 */
export const generateCategoryUrl = (category: ProductCategory): string => {
  const parent = getParentCategory(category);
  
  if (parent) {
    return `/category/${parent.slug}/${category.slug}`;
  } else {
    return `/category/${category.slug}`;
  }
};

/**
 * Get root categories (top-level categories)
 */
export const getRootCategories = (): ProductCategory[] => {
  return categoryTaxonomy.filter(category => !category.parentId);
};

/**
 * Get categories by parent ID
 */
export const getCategoriesByParentId = (parentId: string): ProductCategory[] => {
  return Object.values(flatCategories).filter(category => category.parentId === parentId);
};

/**
 * Check if category is ancestor of another category
 */
export const isCategoryAncestor = (potentialAncestor: ProductCategory, category: ProductCategory): boolean => {
  const ancestors = getAncestors(category);
  return ancestors.some(ancestor => ancestor.id === potentialAncestor.id);
};

/**
 * Check if category is descendant of another category
 */
export const isCategoryDescendant = (potentialDescendant: ProductCategory, category: ProductCategory): boolean => {
  const descendants = getDescendants(category);
  return descendants.some(descendant => descendant.id === potentialDescendant.id);
};

/**
 * Get category depth level (0 for root, 1 for first level children, etc.)
 */
export const getCategoryDepth = (category: ProductCategory): number => {
  return getAncestors(category).length;
};

/**
 * Search categories by name (fuzzy search)
 */
export const searchCategories = (query: string): ProductCategory[] => {
  const normalizedQuery = query.toLowerCase().trim();
  
  return Object.values(flatCategories).filter(category => 
    category.name.toLowerCase().includes(normalizedQuery) ||
    category.description?.toLowerCase().includes(normalizedQuery)
  );
};

/**
 * Get categories with active status
 */
export const getActiveCategories = (): ProductCategory[] => {
  return Object.values(flatCategories).filter(category => category.isActive);
};

/**
 * Get category tree structure for navigation menus
 */
export const getCategoryTree = (): ProductCategory[] => {
  return categoryTaxonomy;
};

/**
 * Parse category path from URL segments
 */
export const parseCategoryPath = (categorySlug: string, subcategorySlug?: string): {
  category: ProductCategory | undefined;
  subcategory?: ProductCategory | undefined;
  hierarchy: CategoryHierarchy | undefined;
} => {
  const category = getCategoryBySlug(categorySlug);
  
  if (!category) {
    return { category: undefined, hierarchy: undefined };
  }
  
  if (subcategorySlug) {
    const subcategory = category.children?.find(child => child.slug === subcategorySlug);
    if (subcategory) {
      return {
        category,
        subcategory,
        hierarchy: buildCategoryHierarchy(subcategory)
      };
    }
  }
  
  return {
    category,
    hierarchy: buildCategoryHierarchy(category)
  };
};

/**
 * Update product counts for categories (to be called after product data changes)
 */
export const updateCategoryProductCounts = (products: { category?: { id: string } }[]): void => {
  // Reset all counts
  Object.values(flatCategories).forEach(category => {
    category.productCount = 0;
  });
  
  // Count products by category
  products.forEach(product => {
    if (product.category?.id) {
      const category = getCategoryById(product.category.id);
      if (category) {
        category.productCount = (category.productCount || 0) + 1;
        
        // Also increment parent category counts
        const ancestors = getAncestors(category);
        ancestors.forEach(ancestor => {
          ancestor.productCount = (ancestor.productCount || 0) + 1;
        });
      }
    }
  });
};
