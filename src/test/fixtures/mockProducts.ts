import { Product } from '@/types/product';

export const mockCategories = [
  {
    id: 'electronics',
    name: 'Electronics',
    slug: 'electronics',
    description: 'Electronic devices and gadgets'
  },
  {
    id: 'fashion',
    name: 'Fashion',
    slug: 'fashion',
    description: 'Clothing and accessories'
  }
];

export const mockBrands = [
  {
    id: 'apple',
    name: 'Apple',
    logo: '/logo-apple.jpg',
    country: 'usa' as const,
    verified: true
  },
  {
    id: 'samsung',
    name: 'Samsung', 
    logo: '/logo-samsung.jpg',
    country: 'korea' as const,
    verified: true
  },
  {
    id: 'sony',
    name: 'Sony',
    logo: '/logo-sony.jpg',
    country: 'japan' as const,
    verified: true
  }
];

export const createMockProduct = (overrides: Partial<Product> = {}): Product => ({
  id: '1',
  name: 'Test Product',
  slug: 'test-product',
  description: 'A test product for unit testing',
  shortDescription: 'Test product',
  originalPrice: 100,
  sellingPrice: 150,
  compareAtPrice: 200,
  currency: 'VND',
  status: 'available',
  type: 'ready_stock',
  origin: 'usa',
  category: mockCategories[0],
  brand: mockBrands[0],
  images: [
    {
      id: '1',
      url: '/test-image.jpg',
      alt: 'Test image',
      isPrimary: true,
      order: 1
    }
  ],
  stock: 10,
  sku: 'TEST-001',
  tags: ['test', 'mock'],
  featured: false,
  trending: false,
  rating: {
    average: 4.5,
    count: 100
  },
  sourceSite: 'Test Site',
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
  publishedAt: new Date('2024-01-01'),
  ...overrides
});

export const mockProductList: Product[] = [
  // Electronics products
  createMockProduct({
    id: '1',
    name: 'iPhone 15 Pro',
    slug: 'iphone-15-pro',
    description: 'Latest iPhone with advanced features',
    sellingPrice: 25000000,
    origin: 'usa',
    category: mockCategories[0],
    brand: mockBrands[0],
    status: 'available',
    type: 'ready_stock',
    tags: ['smartphone', 'apple', 'trending'],
    featured: true,
    trending: true,
    rating: { average: 4.8, count: 250 },
    createdAt: new Date('2024-01-15')
  }),
  
  createMockProduct({
    id: '2', 
    name: 'Samsung Galaxy S24',
    slug: 'samsung-galaxy-s24',
    description: 'Premium Android smartphone',
    sellingPrice: 20000000,
    origin: 'korea',
    category: mockCategories[0],
    brand: mockBrands[1],
    status: 'available',
    type: 'ready_stock',
    tags: ['smartphone', 'samsung', 'android'],
    featured: false,
    trending: true,
    rating: { average: 4.6, count: 180 },
    createdAt: new Date('2024-01-10')
  }),

  createMockProduct({
    id: '3',
    name: 'Sony WH-1000XM5',
    slug: 'sony-wh-1000xm5',
    description: 'Noise-canceling wireless headphones',
    sellingPrice: 8000000,
    origin: 'japan',
    category: mockCategories[0],
    brand: mockBrands[2],
    status: 'available',
    type: 'ready_stock',
    tags: ['headphones', 'sony', 'audio'],
    featured: true,
    trending: false,
    rating: { average: 4.9, count: 320 },
    createdAt: new Date('2024-01-05')
  }),

  // Pre-order product
  createMockProduct({
    id: '4',
    name: 'iPhone 16 Pro Max',
    slug: 'iphone-16-pro-max',
    description: 'Upcoming iPhone model',
    sellingPrice: 30000000,
    origin: 'usa',
    category: mockCategories[0],
    brand: mockBrands[0],
    status: 'preorder',
    type: 'pre_order',
    tags: ['smartphone', 'apple', 'preorder'],
    featured: false,
    trending: false,
    rating: { average: 0, count: 0 },
    createdAt: new Date('2024-01-20')
  }),

  // Flash deal product
  createMockProduct({
    id: '5',
    name: 'Samsung Galaxy Buds Pro',
    slug: 'samsung-galaxy-buds-pro',
    description: 'Wireless earbuds with active noise cancellation',
    sellingPrice: 3500000,
    compareAtPrice: 5000000,
    origin: 'korea',
    category: mockCategories[0], 
    brand: mockBrands[1],
    status: 'available',
    type: 'flash_deal',
    tags: ['earbuds', 'samsung', 'wireless'],
    featured: false,
    trending: true,
    rating: { average: 4.4, count: 150 },
    createdAt: new Date('2024-01-12')
  }),

  // Out of stock product
  createMockProduct({
    id: '6',
    name: 'Sony PlayStation 5',
    slug: 'sony-playstation-5',
    description: 'Next-gen gaming console',
    sellingPrice: 15000000,
    origin: 'japan',
    category: mockCategories[0],
    brand: mockBrands[2],
    status: 'out_of_stock',
    type: 'ready_stock',
    stock: 0,
    tags: ['gaming', 'console', 'sony'],
    featured: true,
    trending: true,
    rating: { average: 4.7, count: 200 },
    createdAt: new Date('2024-01-08')
  }),

  // Fashion product
  createMockProduct({
    id: '7',
    name: 'Nike Air Jordan 1',
    slug: 'nike-air-jordan-1',
    description: 'Classic basketball sneakers',
    sellingPrice: 4500000,
    origin: 'usa',
    category: mockCategories[1],
    brand: {
      id: 'nike',
      name: 'Nike',
      logo: '/logo-nike.jpg',
      country: 'usa',
      verified: true
    },
    status: 'available',
    type: 'ready_stock',
    tags: ['shoes', 'basketball', 'nike'],
    featured: false,
    trending: false,
    rating: { average: 4.3, count: 90 },
    createdAt: new Date('2024-01-03')
  }),

  // Group buy product
  createMockProduct({
    id: '8',
    name: 'Apple MacBook Pro M3',
    slug: 'apple-macbook-pro-m3',
    description: 'Professional laptop with M3 chip',
    sellingPrice: 45000000,
    origin: 'usa',
    category: mockCategories[0],
    brand: mockBrands[0],
    status: 'available',
    type: 'group_buy',
    tags: ['laptop', 'apple', 'professional'],
    featured: true,
    trending: false,
    rating: { average: 4.9, count: 50 },
    createdAt: new Date('2024-01-18')
  })
];
