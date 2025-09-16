import { SimpleProduct } from '@/types/simple';

// Simplified product data that actually works
export const simpleProducts: SimpleProduct[] = [
  {
    id: '1',
    name: 'Premium Japanese Sneakers',
    slug: 'premium-japanese-sneakers',
    description: 'High-quality sneakers from Japan with excellent comfort and style.',
    sellingPrice: 2500000,
    originalPrice: 3000000,
    currency: 'VND',
    stock: 15,
    sku: 'SHOES-001',
    images: [
      {
        id: 'img-1',
        url: '/lovable-uploads/078a129e-0f98-4d91-af61-873687db1a04.png',
        alt: 'Premium Japanese Sneakers',
        isPrimary: true
      }
    ],
    category: {
      id: 'cat-1',
      name: 'Shoes',
      slug: 'shoes'
    },
    origin: 'japan',
    status: 'available',
    rating: {
      average: 4.5,
      count: 128
    },
    type: 'ready_stock',
    sourceSite: 'japan-store.com',
    tags: ['shoes', 'japanese', 'premium', 'sneakers'],
    featured: true,
    trending: false,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-20')
  },
  {
    id: '2',
    name: 'Korean Beauty Set',
    slug: 'korean-beauty-set',
    description: 'Complete Korean skincare set for glowing skin.',
    sellingPrice: 1800000,
    originalPrice: 2000000,
    currency: 'VND',
    stock: 25,
    sku: 'BEAUTY-001',
    images: [
      {
        id: 'img-2',
        url: '/lovable-uploads/11e92b89-ed02-453a-9888-56cd91807f2d.png',
        alt: 'Korean Beauty Set',
        isPrimary: true
      }
    ],
    category: {
      id: 'cat-2',
      name: 'Beauty',
      slug: 'beauty'
    },
    origin: 'korea',
    status: 'available',
    rating: {
      average: 4.8,
      count: 95
    },
    type: 'ready_stock',
    sourceSite: 'korea-beauty.com',
    tags: ['beauty', 'korean', 'skincare'],
    featured: false,
    trending: true,
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-18')
  }
];

export default simpleProducts;