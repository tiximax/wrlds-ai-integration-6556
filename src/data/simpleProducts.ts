import { Product } from '@/types/simple';

// Simplified product data that actually works
export const simpleProducts: Product[] = [
  {
    id: '1',
    name: 'Premium Japanese Sneakers',
    slug: 'premium-japanese-sneakers',
    shortDescription: 'Sneakers Nhật Bản cao cấp, êm ái và thời trang.',
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
        alt: 'Premium Japanese Sneakers - Primary',
        isPrimary: true,
        order: 1
      },
      {
        id: 'img-1b',
        url: '/lovable-uploads/078a129e-0f98-4d91-af61-873687db1a04.png',
        alt: 'Premium Japanese Sneakers - Side',
        isPrimary: false,
        order: 2
      }
    ],
    category: {
      id: 'cat-1',
      name: 'Shoes',
      slug: 'shoes',
      isActive: true,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01')
    },
    origin: 'japan',
    status: 'available',
    specifications: [
      { label: 'Chất liệu', value: 'Vải dệt + Cao su' },
      { label: 'Màu sắc', value: 'Trắng/Đen' },
      { label: 'Trọng lượng', value: '0.9 kg' },
      { label: 'Bảo hành', value: '12 tháng' }
    ],
    sourceUrl: 'https://japan-store.com/premium-sneakers',
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
    shortDescription: 'Bộ skincare Hàn Quốc đầy đủ cho làn da rạng rỡ.',
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
        alt: 'Korean Beauty Set - Primary',
        isPrimary: true,
        order: 1
      },
      {
        id: 'img-2b',
        url: '/lovable-uploads/11e92b89-ed02-453a-9888-56cd91807f2d.png',
        alt: 'Korean Beauty Set - Items',
        isPrimary: false,
        order: 2
      }
    ],
    category: {
      id: 'cat-2',
      name: 'Beauty',
      slug: 'beauty',
      isActive: true,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01')
    },
    origin: 'korea',
    status: 'available',
    specifications: [
      { label: 'Loại da', value: 'Mọi loại da' },
      { label: 'Quy cách', value: '5 sản phẩm/skincare routine' },
      { label: 'HSD', value: '36 tháng' }
    ],
    sourceUrl: 'https://korea-beauty.com/beauty-set',
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
  },
  {
    id: '3',
    name: 'American Tech Gadget',
    shortDescription: 'Thiết bị công nghệ từ Mỹ với tính năng cao cấp.',
    slug: 'american-tech-gadget',
    description: 'Latest technology gadget from the USA with premium features.',
    sellingPrice: 3500000,
    originalPrice: 4000000,
    currency: 'VND',
    stock: 8,
    sku: 'TECH-001',
    images: [
      {
        id: 'img-3',
        url: '/lovable-uploads/14ea3fe0-19d6-425c-b95b-4117bc41f3ca.png',
        alt: 'American Tech Gadget - Primary',
        isPrimary: true,
        order: 1
      },
      {
        id: 'img-3b',
        url: '/lovable-uploads/14ea3fe0-19d6-425c-b95b-4117bc41f3ca.png',
        alt: 'American Tech Gadget - Back',
        isPrimary: false,
        order: 2
      }
    ],
    category: {
      id: 'cat-3',
      name: 'Electronics',
      slug: 'electronics',
      isActive: true,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01')
    },
    origin: 'usa',
    status: 'available',
    specifications: [
      { label: 'Kết nối', value: 'Wi-Fi, Bluetooth' },
      { label: 'Nguồn', value: 'Pin sạc USB-C' },
      { label: 'Bảo hành', value: '12 tháng' }
    ],
    sourceUrl: 'https://usa-tech.com/gadget',
    rating: {
      average: 4.3,
      count: 67
    },
    type: 'ready_stock',
    sourceSite: 'usa-tech.com',
    tags: ['electronics', 'tech', 'gadget', 'usa'],
    featured: true,
    trending: false,
    createdAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-01-22')
  },
  {
    id: '4',
    name: 'European Fashion Watch',
    shortDescription: 'Đồng hồ thời trang châu Âu thiết kế tinh xảo.',
    slug: 'european-fashion-watch',
    description: 'Elegant European watch with sophisticated design.',
    sellingPrice: 5200000,
    originalPrice: 6000000,
    currency: 'VND',
    stock: 12,
    sku: 'WATCH-001',
    images: [
      {
        id: 'img-4',
        url: '/lovable-uploads/1cd5a3da-7a58-4374-abc1-d7b02b0c5fd5.png',
        alt: 'European Fashion Watch - Primary',
        isPrimary: true,
        order: 1
      },
      {
        id: 'img-4b',
        url: '/lovable-uploads/1cd5a3da-7a58-4374-abc1-d7b02b0c5fd5.png',
        alt: 'European Fashion Watch - Closeup',
        isPrimary: false,
        order: 2
      }
    ],
    category: {
      id: 'cat-4',
      name: 'Fashion',
      slug: 'fashion',
      isActive: true,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01')
    },
    origin: 'europe',
    status: 'available',
    specifications: [
      { label: 'Chống nước', value: '5 ATM' },
      { label: 'Chất liệu dây', value: 'Da thật' },
      { label: 'Đường kính mặt', value: '40 mm' }
    ],
    sourceUrl: 'https://europe-fashion.com/watch',
    rating: {
      average: 4.7,
      count: 143
    },
    type: 'ready_stock',
    sourceSite: 'europe-fashion.com',
    tags: ['fashion', 'watch', 'luxury', 'europe'],
    featured: false,
    trending: true,
    createdAt: new Date('2024-01-08'),
    updatedAt: new Date('2024-01-25')
  },
  {
    id: '5',
    name: 'Japanese Gaming Console',
    shortDescription: 'Máy chơi game Nhật Bản với hệ game độc quyền.',
    slug: 'japanese-gaming-console',
    description: 'Latest gaming console from Japan with exclusive games.',
    sellingPrice: 8500000,
    originalPrice: 9000000,
    currency: 'VND',
    stock: 5,
    sku: 'GAME-001',
    images: [
      {
        id: 'img-5',
        url: '/lovable-uploads/30473baa-85f4-4931-aad9-c722ae7a4918.png',
        alt: 'Japanese Gaming Console - Primary',
        isPrimary: true,
        order: 1
      },
      {
        id: 'img-5b',
        url: '/lovable-uploads/30473baa-85f4-4931-aad9-c722ae7a4918.png',
        alt: 'Japanese Gaming Console - Ports',
        isPrimary: false,
        order: 2
      }
    ],
    category: {
      id: 'cat-5',
      name: 'Gaming',
      slug: 'gaming',
      isActive: true,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01')
    },
    origin: 'japan',
    status: 'preorder',
    specifications: [
      { label: 'Bộ nhớ', value: '1 TB' },
      { label: 'Kết nối', value: 'HDMI 2.1, Wi‑Fi 6' }
    ],
    sourceUrl: 'https://japan-games.com/console',
    rating: {
      average: 4.9,
      count: 234
    },
    type: 'pre_order',
    sourceSite: 'japan-games.com',
    tags: ['gaming', 'console', 'japanese', 'preorder'],
    featured: true,
    trending: true,
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-28')
  },
  {
    id: '6',
    name: 'Korean Home Appliance',
    shortDescription: 'Thiết bị gia dụng thông minh công nghệ Hàn Quốc.',
    slug: 'korean-home-appliance',
    description: 'Smart home appliance with advanced Korean technology.',
    sellingPrice: 4200000,
    originalPrice: 4800000,
    currency: 'VND',
    stock: 18,
    sku: 'HOME-001',
    images: [
      {
        id: 'img-6',
        url: '/lovable-uploads/39605e90-8478-4fee-b1b9-cee41df66f10.png',
        alt: 'Korean Home Appliance - Primary',
        isPrimary: true,
        order: 1
      },
      {
        id: 'img-6b',
        url: '/lovable-uploads/39605e90-8478-4fee-b1b9-cee41df66f10.png',
        alt: 'Korean Home Appliance - Usage',
        isPrimary: false,
        order: 2
      }
    ],
    category: {
      id: 'cat-6',
      name: 'Home & Living',
      slug: 'home-living',
      isActive: true,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01')
    },
    origin: 'korea',
    status: 'available',
    specifications: [
      { label: 'Công suất', value: '1200 W' },
      { label: 'Điện áp', value: '220V' },
      { label: 'Kích thước', value: '450 × 300 × 200 mm' }
    ],
    sourceUrl: 'https://korea-home.com/appliance',
    rating: {
      average: 4.4,
      count: 89
    },
    type: 'ready_stock',
    sourceSite: 'korea-home.com',
    tags: ['home', 'appliance', 'smart', 'korean'],
    featured: false,
    trending: false,
    createdAt: new Date('2024-01-14'),
    updatedAt: new Date('2024-01-19')
  },
  {
    id: '7',
    name: 'USA Premium Headphones',
    shortDescription: 'Tai nghe cao cấp từ Mỹ, âm thanh trung thực.',
    slug: 'usa-premium-headphones',
    description: 'High-quality headphones with premium sound from USA.',
    sellingPrice: 3200000,
    originalPrice: 3600000,
    currency: 'VND',
    stock: 0,
    sku: 'AUDIO-001',
    images: [
      {
        id: 'img-7',
        url: '/lovable-uploads/39671993-1bb4-4bb6-8819-3ca5c07c0042.png',
        alt: 'USA Premium Headphones - Primary',
        isPrimary: true,
        order: 1
      },
      {
        id: 'img-7b',
        url: '/lovable-uploads/39671993-1bb4-4bb6-8819-3ca5c07c0042.png',
        alt: 'USA Premium Headphones - Side',
        isPrimary: false,
        order: 2
      }
    ],
    category: {
      id: 'cat-7',
      name: 'Audio',
      slug: 'audio',
      isActive: true,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01')
    },
    origin: 'usa',
    status: 'out_of_stock',
    specifications: [
      { label: 'Driver', value: '40 mm' },
      { label: 'Kết nối', value: 'Bluetooth 5.3' },
      { label: 'Thời lượng pin', value: '30 giờ' }
    ],
    sourceUrl: 'https://usa-audio.com/premium-headphones',
    rating: {
      average: 4.6,
      count: 156
    },
    type: 'ready_stock',
    sourceSite: 'usa-audio.com',
    tags: ['audio', 'headphones', 'premium', 'usa'],
    featured: false,
    trending: false,
    createdAt: new Date('2024-01-03'),
    updatedAt: new Date('2024-01-30')
  },
  {
    id: '8',
    name: 'European Luxury Bag',
    shortDescription: 'Túi xách cao cấp châu Âu, chất liệu thượng hạng.',
    slug: 'european-luxury-bag',
    description: 'Designer luxury bag from Europe with premium materials.',
    sellingPrice: 6800000,
    originalPrice: 7500000,
    currency: 'VND',
    stock: 7,
    sku: 'BAG-001',
    images: [
      {
        id: 'img-8',
        url: '/lovable-uploads/3de85ddd-15e1-4216-9697-f91abb9a47ce.png',
        alt: 'European Luxury Bag - Primary',
        isPrimary: true,
        order: 1
      },
      {
        id: 'img-8b',
        url: '/lovable-uploads/3de85ddd-15e1-4216-9697-f91abb9a47ce.png',
        alt: 'European Luxury Bag - Detail',
        isPrimary: false,
        order: 2
      }
    ],
    category: {
      id: 'cat-8',
      name: 'Accessories',
      slug: 'accessories',
      isActive: true,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01')
    },
    origin: 'europe',
    status: 'available',
    specifications: [
      { label: 'Chất liệu', value: 'Da thật' },
      { label: 'Kích thước', value: '28 × 20 × 10 cm' },
      { label: 'Màu sắc', value: 'Be/Nâu' }
    ],
    sourceUrl: 'https://europe-luxury.com/bag',
    rating: {
      average: 4.8,
      count: 78
    },
    type: 'ready_stock',
    sourceSite: 'europe-luxury.com',
    tags: ['accessories', 'bag', 'luxury', 'designer'],
    featured: true,
    trending: false,
    createdAt: new Date('2024-01-07'),
    updatedAt: new Date('2024-01-26')
  }
];

export default simpleProducts;