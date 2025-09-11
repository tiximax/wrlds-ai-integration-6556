import { ProductCategory } from '../types/product';

// Category taxonomy data - hierarchical structure
export const categoryTaxonomy: ProductCategory[] = [
  {
    id: 'electronics',
    name: 'Electronics',
    slug: 'electronics',
    description: 'Latest electronics and gadgets from Japan, Korea, and USA',
    image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400',
    isActive: true,
    seoTitle: 'Electronics - Latest Gadgets from Japan, Korea, USA',
    seoDescription: 'Shop the latest electronics and gadgets with international proxy shopping service. Get authentic products from Japan, Korea, and USA.',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-12-01'),
    children: [
      {
        id: 'headphones-audio',
        name: 'Headphones & Audio',
        slug: 'headphones-audio',
        parentId: 'electronics',
        description: 'Premium headphones, speakers, and audio equipment',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
        isActive: true,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-12-01')
      },
      {
        id: 'smartphones-tablets',
        name: 'Smartphones & Tablets',
        slug: 'smartphones-tablets',
        parentId: 'electronics',
        description: 'Latest smartphones, tablets, and mobile accessories',
        image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400',
        isActive: true,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-12-01')
      },
      {
        id: 'gaming',
        name: 'Gaming',
        slug: 'gaming',
        parentId: 'electronics',
        description: 'Gaming consoles, controllers, and accessories',
        image: 'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=400',
        isActive: true,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-12-01')
      },
      {
        id: 'cameras-photography',
        name: 'Cameras & Photography',
        slug: 'cameras-photography',
        parentId: 'electronics',
        description: 'Digital cameras, lenses, and photography equipment',
        image: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400',
        isActive: true,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-12-01')
      }
    ]
  },
  {
    id: 'fashion-beauty',
    name: 'Fashion & Beauty',
    slug: 'fashion-beauty',
    description: 'Trendy fashion and premium beauty products from international brands',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400',
    isActive: true,
    seoTitle: 'Fashion & Beauty - International Brands',
    seoDescription: 'Shop trendy fashion and premium beauty products from top international brands. Authentic items with proxy shopping service.',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-12-01'),
    children: [
      {
        id: 'clothing',
        name: 'Clothing',
        slug: 'clothing',
        parentId: 'fashion-beauty',
        description: 'Trendy clothing from international fashion brands',
        image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400',
        isActive: true,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-12-01')
      },
      {
        id: 'shoes-footwear',
        name: 'Shoes & Footwear',
        slug: 'shoes-footwear',
        parentId: 'fashion-beauty',
        description: 'Premium shoes and footwear from global brands',
        image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400',
        isActive: true,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-12-01')
      },
      {
        id: 'bags-accessories',
        name: 'Bags & Accessories',
        slug: 'bags-accessories',
        parentId: 'fashion-beauty',
        description: 'Designer bags, wallets, and fashion accessories',
        image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400',
        isActive: true,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-12-01')
      },
      {
        id: 'cosmetics-skincare',
        name: 'Cosmetics & Skincare',
        slug: 'cosmetics-skincare',
        parentId: 'fashion-beauty',
        description: 'Premium cosmetics and skincare products',
        image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400',
        isActive: true,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-12-01')
      }
    ]
  },
  {
    id: 'health-sports',
    name: 'Health & Sports',
    slug: 'health-sports',
    description: 'Health supplements, fitness equipment, and sports gear',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400',
    isActive: true,
    seoTitle: 'Health & Sports - Fitness Equipment & Supplements',
    seoDescription: 'Shop health supplements, fitness equipment, and sports gear from trusted international brands.',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-12-01'),
    children: [
      {
        id: 'fitness-equipment',
        name: 'Fitness Equipment',
        slug: 'fitness-equipment',
        parentId: 'health-sports',
        description: 'Home gym equipment and fitness accessories',
        image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400',
        isActive: true,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-12-01')
      },
      {
        id: 'supplements',
        name: 'Health Supplements',
        slug: 'supplements',
        parentId: 'health-sports',
        description: 'Vitamins, minerals, and health supplements',
        image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400',
        isActive: true,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-12-01')
      },
      {
        id: 'sports-gear',
        name: 'Sports Gear',
        slug: 'sports-gear',
        parentId: 'health-sports',
        description: 'Professional sports equipment and gear',
        image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400',
        isActive: true,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-12-01')
      }
    ]
  },
  {
    id: 'home-living',
    name: 'Home & Living',
    slug: 'home-living',
    description: 'Home appliances, decor, and lifestyle products',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400',
    isActive: true,
    seoTitle: 'Home & Living - Home Appliances & Decor',
    seoDescription: 'Shop home appliances, decor, and lifestyle products from international brands with our proxy shopping service.',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-12-01'),
    children: [
      {
        id: 'kitchen-appliances',
        name: 'Kitchen Appliances',
        slug: 'kitchen-appliances',
        parentId: 'home-living',
        description: 'Modern kitchen appliances and cookware',
        image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400',
        isActive: true,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-12-01')
      },
      {
        id: 'home-decor',
        name: 'Home Decor',
        slug: 'home-decor',
        parentId: 'home-living',
        description: 'Stylish home decor and interior design items',
        image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400',
        isActive: true,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-12-01')
      },
      {
        id: 'furniture',
        name: 'Furniture',
        slug: 'furniture',
        parentId: 'home-living',
        description: 'Modern furniture and home furnishing',
        image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400',
        isActive: true,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-12-01')
      },
      {
        id: 'garden-outdoor',
        name: 'Garden & Outdoor',
        slug: 'garden-outdoor',
        parentId: 'home-living',
        description: 'Garden tools and outdoor living products',
        image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400',
        isActive: true,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-12-01')
      }
    ]
  }
];

// Flat category lookup for easier access
export const flatCategories: Record<string, ProductCategory> = {};

// Build flat lookup table
const buildFlatCategories = (categories: ProductCategory[]) => {
  categories.forEach(category => {
    flatCategories[category.id] = category;
    flatCategories[category.slug] = category;
    
    if (category.children) {
      buildFlatCategories(category.children);
    }
  });
};

// Initialize flat categories
buildFlatCategories(categoryTaxonomy);

// Export root categories for navigation
export const rootCategories = categoryTaxonomy;

// Export subcategories grouped by parent
export const subcategoriesByParent: Record<string, ProductCategory[]> = {};
categoryTaxonomy.forEach(parent => {
  if (parent.children) {
    subcategoriesByParent[parent.id] = parent.children;
    subcategoriesByParent[parent.slug] = parent.children;
  }
});
