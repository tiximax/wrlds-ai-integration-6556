import { Product, ProductCategory, ProductBrand, ProductOrigin } from '@/types/product';

// Categories
export const categories: ProductCategory[] = [
  {
    id: 'fashion',
    name: 'Thời trang & Làm đẹp',
    slug: 'fashion-beauty',
    description: 'Thời trang, mỹ phẩm, phụ kiện từ các thương hiệu nổi tiếng'
  },
  {
    id: 'electronics',
    name: 'Điện tử & Công nghệ',
    slug: 'electronics-tech',
    description: 'Smartphone, laptop, thiết bị công nghệ mới nhất'
  },
  {
    id: 'health',
    name: 'Sức khỏe & Thể thao',
    slug: 'health-sports',
    description: 'Thực phẩm chức năng, dụng cụ thể thao, chăm sóc sức khỏe'
  },
  {
    id: 'home',
    name: 'Đồ gia dụng',
    slug: 'home-living',
    description: 'Đồ gia dụng, nội thất, thiết bị nhà bếp'
  }
];

// Brands
export const brands: ProductBrand[] = [
  {
    id: 'nike',
    name: 'Nike',
    logo: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&h=100&fit=crop',
    country: 'usa' as ProductOrigin,
    verified: true
  },
  {
    id: 'sony',
    name: 'Sony',
    logo: 'https://images.unsplash.com/photo-1589003077984-894e133dabab?w=100&h=100&fit=crop',
    country: 'japan' as ProductOrigin,
    verified: true
  },
  {
    id: 'samsung',
    name: 'Samsung',
    logo: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=100&h=100&fit=crop',
    country: 'korea' as ProductOrigin,
    verified: true
  },
  {
    id: 'shiseido',
    name: 'Shiseido',
    logo: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=100&h=100&fit=crop',
    country: 'japan' as ProductOrigin,
    verified: true
  }
];

// Mock Products Data
export const mockProducts: Product[] = [
  // READY STOCK PRODUCTS
  {
    id: '1',
    name: 'Nike Air Max 270 React',
    slug: 'nike-air-max-270-react',
    description: 'Giày thể thao Nike Air Max 270 React với công nghệ đệm khí tiên tiến, mang lại cảm giác thoải mái tối đa cho mọi hoạt động.',
    shortDescription: 'Giày thể thao Nike với công nghệ đệm khí tiên tiến',
    originalPrice: 150,
    sellingPrice: 4500000,
    compareAtPrice: 5200000,
    currency: 'VND',
    status: 'available',
    type: 'ready_stock',
    origin: 'usa',
    category: categories[2], // health-sports
    brand: brands[0], // Nike
    images: [
      {
        id: '1-1',
        url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=800&fit=crop',
        alt: 'Nike Air Max 270 React',
        isPrimary: true,
        order: 1
      }
    ],
    stock: 25,
    sku: 'NIKE-AM270-001',
    tags: ['nike', 'giày thể thao', 'air max', 'mỹ'],
    featured: true,
    trending: true,
    rating: {
      average: 4.8,
      count: 156
    },
    sourceUrl: 'https://www.nike.com/t/air-max-270-react',
    sourceSite: 'Nike.com',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-20'),
    publishedAt: new Date('2024-01-15')
  },

  {
    id: '2',
    name: 'Sony WH-1000XM5 Wireless Headphones',
    slug: 'sony-wh-1000xm5-headphones',
    description: 'Tai nghe không dây Sony WH-1000XM5 với công nghệ chống ồn hàng đầu, chất lượng âm thanh Hi-Res, pin 30 giờ.',
    shortDescription: 'Tai nghe không dây Sony với chống ồn hàng đầu',
    originalPrice: 400,
    sellingPrice: 9800000,
    compareAtPrice: 11500000,
    currency: 'VND',
    status: 'available',
    type: 'ready_stock',
    origin: 'japan',
    category: categories[1], // electronics
    brand: brands[1], // Sony
    images: [
      {
        id: '2-1',
        url: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&h=800&fit=crop',
        alt: 'Sony WH-1000XM5 Headphones',
        isPrimary: true,
        order: 1
      }
    ],
    stock: 15,
    sku: 'SONY-WH1000XM5-001',
    tags: ['sony', 'tai nghe', 'không dây', 'nhật bản'],
    featured: true,
    trending: false,
    rating: {
      average: 4.9,
      count: 243
    },
    sourceUrl: 'https://www.sony.com/electronics/headband-headphones/wh-1000xm5',
    sourceSite: 'Sony Japan',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-18'),
    publishedAt: new Date('2024-01-10')
  },

  {
    id: '3',
    name: 'Shiseido Ultimune Power Infusing Concentrate',
    slug: 'shiseido-ultimune-power-concentrate',
    description: 'Tinh chất dưỡng da Shiseido Ultimune giúp tăng cường sức đề kháng cho da, chống lão hóa và mang lại làn da khỏe mạnh rạng rỡ.',
    shortDescription: 'Tinh chất dưỡng da Shiseido tăng cường sức đề kháng',
    originalPrice: 89,
    sellingPrice: 2450000,
    compareAtPrice: 2800000,
    currency: 'VND',
    status: 'available',
    type: 'ready_stock',
    origin: 'japan',
    category: categories[0], // fashion-beauty
    brand: brands[3], // Shiseido
    images: [
      {
        id: '3-1',
        url: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&h=800&fit=crop',
        alt: 'Shiseido Ultimune',
        isPrimary: true,
        order: 1
      }
    ],
    stock: 30,
    sku: 'SHISEIDO-ULT-001',
    tags: ['shiseido', 'skincare', 'tinh chất', 'nhật bản'],
    featured: false,
    trending: true,
    rating: {
      average: 4.7,
      count: 89
    },
    sourceUrl: 'https://www.shiseido.com/ultimune-power-infusing-concentrate',
    sourceSite: 'Shiseido Japan',
    createdAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-01-19'),
    publishedAt: new Date('2024-01-12')
  },

  // FLASH DEAL PRODUCTS
  {
    id: '4',
    name: 'Samsung Galaxy Buds2 Pro',
    slug: 'samsung-galaxy-buds2-pro',
    description: 'Tai nghe không dây Samsung Galaxy Buds2 Pro với chống ồn thông minh, âm thanh 360 Audio, thiết kế nhỏ gọn.',
    shortDescription: 'Tai nghe không dây Samsung với chống ồn thông minh',
    originalPrice: 230,
    sellingPrice: 4200000,
    compareAtPrice: 5500000,
    currency: 'VND',
    status: 'available',
    type: 'flash_deal',
    origin: 'korea',
    category: categories[1], // electronics
    brand: brands[2], // Samsung
    deal: {
      id: 'deal-4',
      type: 'flash_sale',
      discountPercent: 35,
      startDate: new Date('2024-01-20T00:00:00'),
      endDate: new Date('2024-01-25T23:59:59'),
      isActive: true
    },
    images: [
      {
        id: '4-1',
        url: 'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=800&h=800&fit=crop',
        alt: 'Samsung Galaxy Buds2 Pro',
        isPrimary: true,
        order: 1
      }
    ],
    stock: 50,
    sku: 'SAMSUNG-GB2P-001',
    tags: ['samsung', 'tai nghe', 'hàn quốc', 'flash deal'],
    featured: true,
    trending: true,
    rating: {
      average: 4.6,
      count: 178
    },
    sourceUrl: 'https://www.samsung.com/galaxy-buds2-pro',
    sourceSite: 'Samsung Korea',
    createdAt: new Date('2024-01-18'),
    updatedAt: new Date('2024-01-20'),
    publishedAt: new Date('2024-01-18')
  },

  // PREORDER PRODUCTS
  {
    id: '5',
    name: 'Nintendo Switch OLED (Limited Edition)',
    slug: 'nintendo-switch-oled-limited-edition',
    description: 'Máy chơi game Nintendo Switch OLED phiên bản giới hạn với màn hình OLED 7 inch, âm thanh nâng cao và thiết kế độc quyền.',
    shortDescription: 'Nintendo Switch OLED phiên bản giới hạn',
    originalPrice: 350,
    sellingPrice: 9200000,
    compareAtPrice: 10500000,
    currency: 'VND',
    status: 'preorder',
    type: 'pre_order',
    origin: 'japan',
    category: categories[1], // electronics
    brand: {
      id: 'nintendo',
      name: 'Nintendo',
      logo: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=100&h=100&fit=crop',
      country: 'japan' as ProductOrigin,
      verified: true
    },
    preorderInfo: {
      id: 'preorder-5',
      expectedArrival: new Date('2024-03-15'),
      minPreorderQuantity: 50,
      currentPreorderCount: 32,
      depositPercent: 30,
      estimatedPrice: {
        min: 9000000,
        max: 9500000
      },
      isGroupBuy: true,
      groupBuyThreshold: 50
    },
    images: [
      {
        id: '5-1',
        url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=800&fit=crop',
        alt: 'Nintendo Switch OLED',
        isPrimary: true,
        order: 1
      }
    ],
    stock: 0,
    sku: 'NINTENDO-SWOLED-LE',
    tags: ['nintendo', 'gaming', 'preorder', 'limited edition'],
    featured: true,
    trending: true,
    rating: {
      average: 4.9,
      count: 12
    },
    sourceUrl: 'https://www.nintendo.co.jp/switch-oled',
    sourceSite: 'Nintendo Japan',
    createdAt: new Date('2024-01-19'),
    updatedAt: new Date('2024-01-21'),
    publishedAt: new Date('2024-01-19')
  },

  {
    id: '6',
    name: 'SK-II Facial Treatment Essence (230ml)',
    slug: 'sk-ii-facial-treatment-essence-230ml',
    description: 'Nước thần SK-II Facial Treatment Essence 230ml với 90% Pitera™, giúp cải thiện kết cấu da và mang lại làn da rạng rỡ.',
    shortDescription: 'Nước thần SK-II với 90% Pitera™',
    originalPrice: 185,
    sellingPrice: 5200000,
    currency: 'VND',
    status: 'preorder',
    type: 'pre_order',
    origin: 'japan',
    category: categories[0], // fashion-beauty
    brand: {
      id: 'sk-ii',
      name: 'SK-II',
      logo: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=100&h=100&fit=crop',
      country: 'japan' as ProductOrigin,
      verified: true
    },
    preorderInfo: {
      id: 'preorder-6',
      expectedArrival: new Date('2024-02-28'),
      minPreorderQuantity: 30,
      currentPreorderCount: 18,
      depositPercent: 20,
      estimatedPrice: {
        min: 5000000,
        max: 5400000
      },
      isGroupBuy: true,
      groupBuyThreshold: 30
    },
    images: [
      {
        id: '6-1',
        url: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=800&h=800&fit=crop',
        alt: 'SK-II Facial Treatment Essence',
        isPrimary: true,
        order: 1
      }
    ],
    stock: 0,
    sku: 'SKII-FTE-230',
    tags: ['sk-ii', 'skincare', 'preorder', 'pitera'],
    featured: false,
    trending: true,
    rating: {
      average: 4.8,
      count: 8
    },
    sourceUrl: 'https://www.sk-ii.com/facial-treatment-essence',
    sourceSite: 'SK-II Japan',
    createdAt: new Date('2024-01-16'),
    updatedAt: new Date('2024-01-21'),
    publishedAt: new Date('2024-01-16')
  },

  // GROUP BUY PRODUCTS
  {
    id: '7',
    name: 'Dyson V15 Detect Absolute',
    slug: 'dyson-v15-detect-absolute',
    description: 'Máy hút bụi không dây Dyson V15 Detect với công nghệ laser phát hiện bụi vi mô, lực hút mạnh mẽ và pin lâu dài.',
    shortDescription: 'Máy hút bụi Dyson V15 với công nghệ laser',
    originalPrice: 750,
    sellingPrice: 16800000,
    compareAtPrice: 19500000,
    currency: 'VND',
    status: 'preorder',
    type: 'group_buy',
    origin: 'usa',
    category: categories[3], // home-living
    brand: {
      id: 'dyson',
      name: 'Dyson',
      logo: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=100&h=100&fit=crop',
      country: 'usa' as ProductOrigin,
      verified: true
    },
    deal: {
      id: 'deal-7',
      type: 'group_buy',
      discountPercent: 25,
      startDate: new Date('2024-01-15T00:00:00'),
      endDate: new Date('2024-02-15T23:59:59'),
      minQuantity: 20,
      currentQuantity: 14,
      maxQuantity: 50,
      isActive: true
    },
    preorderInfo: {
      id: 'preorder-7',
      expectedArrival: new Date('2024-03-01'),
      minPreorderQuantity: 20,
      currentPreorderCount: 14,
      depositPercent: 30,
      estimatedPrice: {
        min: 16500000,
        max: 17000000
      },
      isGroupBuy: true,
      groupBuyThreshold: 20
    },
    images: [
      {
        id: '7-1',
        url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop',
        alt: 'Dyson V15 Detect',
        isPrimary: true,
        order: 1
      }
    ],
    stock: 0,
    sku: 'DYSON-V15-ABS',
    tags: ['dyson', 'máy hút bụi', 'group buy', 'không dây'],
    featured: true,
    trending: false,
    rating: {
      average: 4.7,
      count: 5
    },
    sourceUrl: 'https://www.dyson.com/vacuum-cleaners/cordless/v15-detect',
    sourceSite: 'Dyson US',
    createdAt: new Date('2024-01-14'),
    updatedAt: new Date('2024-01-21'),
    publishedAt: new Date('2024-01-14')
  },

  // MORE READY STOCK PRODUCTS
  {
    id: '8',
    name: 'Adidas Ultraboost 22',
    slug: 'adidas-ultraboost-22',
    description: 'Giày chạy bộ Adidas Ultraboost 22 với công nghệ BOOST mới nhất, upper Primeknit+ và thiết kế hiện đại.',
    shortDescription: 'Giày chạy bộ Adidas với công nghệ BOOST',
    originalPrice: 190,
    sellingPrice: 4800000,
    compareAtPrice: 5500000,
    currency: 'VND',
    status: 'available',
    type: 'ready_stock',
    origin: 'usa',
    category: categories[2], // health-sports
    brand: {
      id: 'adidas',
      name: 'Adidas',
      logo: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5d?w=100&h=100&fit=crop',
      country: 'usa' as ProductOrigin,
      verified: true
    },
    images: [
      {
        id: '8-1',
        url: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5d?w=800&h=800&fit=crop',
        alt: 'Adidas Ultraboost 22',
        isPrimary: true,
        order: 1
      }
    ],
    stock: 40,
    sku: 'ADIDAS-UB22-001',
    tags: ['adidas', 'giày chạy bộ', 'ultraboost', 'mỹ'],
    featured: false,
    trending: true,
    rating: {
      average: 4.5,
      count: 134
    },
    sourceUrl: 'https://www.adidas.com/ultraboost-22',
    sourceSite: 'Adidas US',
    createdAt: new Date('2024-01-11'),
    updatedAt: new Date('2024-01-20'),
    publishedAt: new Date('2024-01-11')
  },

  {
    id: '9',
    name: 'Apple AirPods Pro (2nd Gen)',
    slug: 'apple-airpods-pro-2nd-gen',
    description: 'Tai nghe Apple AirPods Pro thế hệ 2 với chip H2, chống ồn adaptive, âm thanh spatial và khả năng chống nước.',
    shortDescription: 'Tai nghe Apple AirPods Pro thế hệ 2',
    originalPrice: 249,
    sellingPrice: 6200000,
    compareAtPrice: 6800000,
    currency: 'VND',
    status: 'available',
    type: 'ready_stock',
    origin: 'usa',
    category: categories[1], // electronics
    brand: {
      id: 'apple',
      name: 'Apple',
      logo: 'https://images.unsplash.com/photo-1611472173362-3f53dbd65d80?w=100&h=100&fit=crop',
      country: 'usa' as ProductOrigin,
      verified: true
    },
    images: [
      {
        id: '9-1',
        url: 'https://images.unsplash.com/photo-1611472173362-3f53dbd65d80?w=800&h=800&fit=crop',
        alt: 'Apple AirPods Pro 2nd Gen',
        isPrimary: true,
        order: 1
      }
    ],
    stock: 20,
    sku: 'APPLE-APP2-001',
    tags: ['apple', 'airpods', 'tai nghe', 'mỹ'],
    featured: true,
    trending: true,
    rating: {
      average: 4.8,
      count: 267
    },
    sourceUrl: 'https://www.apple.com/airpods-pro/',
    sourceSite: 'Apple US',
    createdAt: new Date('2024-01-13'),
    updatedAt: new Date('2024-01-21'),
    publishedAt: new Date('2024-01-13')
  },

  {
    id: '10',
    name: 'COSRX Snail 96 Mucin Power Essence',
    slug: 'cosrx-snail-96-mucin-essence',
    description: 'Tinh chất ốc sên COSRX với 96% Snail Secretion Filtrate, giúp phục hồi và làm dịu da, cải thiện độ đàn hồi.',
    shortDescription: 'Tinh chất ốc sên COSRX 96% Mucin',
    originalPrice: 25,
    sellingPrice: 650000,
    compareAtPrice: 750000,
    currency: 'VND',
    status: 'available',
    type: 'ready_stock',
    origin: 'korea',
    category: categories[0], // fashion-beauty
    brand: {
      id: 'cosrx',
      name: 'COSRX',
      logo: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=100&h=100&fit=crop',
      country: 'korea' as ProductOrigin,
      verified: true
    },
    images: [
      {
        id: '10-1',
        url: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&h=800&fit=crop',
        alt: 'COSRX Snail Mucin Essence',
        isPrimary: true,
        order: 1
      }
    ],
    stock: 60,
    sku: 'COSRX-SNM96-001',
    tags: ['cosrx', 'snail mucin', 'k-beauty', 'hàn quốc'],
    featured: false,
    trending: true,
    rating: {
      average: 4.6,
      count: 89
    },
    sourceUrl: 'https://cosrx.kr/snail-96-mucin-power-essence',
    sourceSite: 'COSRX Korea',
    createdAt: new Date('2024-01-09'),
    updatedAt: new Date('2024-01-19'),
    publishedAt: new Date('2024-01-09')
  },

  // ADDITIONAL PREORDER PRODUCTS
  {
    id: '11',
    name: 'Canon EOS R6 Mark II',
    slug: 'canon-eos-r6-mark-ii',
    description: 'Máy ảnh mirrorless Canon EOS R6 Mark II với sensor full-frame 24.2MP, quay video 4K 60p và chống rung 8 stops.',
    shortDescription: 'Máy ảnh Canon EOS R6 Mark II full-frame',
    originalPrice: 2499,
    sellingPrice: 62000000,
    currency: 'VND',
    status: 'preorder',
    type: 'pre_order',
    origin: 'japan',
    category: categories[1], // electronics
    brand: {
      id: 'canon',
      name: 'Canon',
      logo: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=100&h=100&fit=crop',
      country: 'japan' as ProductOrigin,
      verified: true
    },
    preorderInfo: {
      id: 'preorder-11',
      expectedArrival: new Date('2024-04-15'),
      minPreorderQuantity: 10,
      currentPreorderCount: 6,
      depositPercent: 50,
      estimatedPrice: {
        min: 60000000,
        max: 65000000
      },
      isGroupBuy: true,
      groupBuyThreshold: 10
    },
    images: [
      {
        id: '11-1',
        url: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&h=800&fit=crop',
        alt: 'Canon EOS R6 Mark II',
        isPrimary: true,
        order: 1
      }
    ],
    stock: 0,
    sku: 'CANON-R6M2-001',
    tags: ['canon', 'máy ảnh', 'mirrorless', 'preorder'],
    featured: true,
    trending: false,
    rating: {
      average: 4.9,
      count: 3
    },
    sourceUrl: 'https://www.canon.co.jp/eos-r6-mark-ii',
    sourceSite: 'Canon Japan',
    createdAt: new Date('2024-01-17'),
    updatedAt: new Date('2024-01-21'),
    publishedAt: new Date('2024-01-17')
  },

  {
    id: '12',
    name: 'The Ordinary Retinol 1% in Squalane',
    slug: 'the-ordinary-retinol-1-squalane',
    description: 'Serum retinol The Ordinary 1% trong Squalane, giúp cải thiện nếp nhăn, tăng độ đàn hồi và làm mịn da.',
    shortDescription: 'Serum retinol The Ordinary 1%',
    originalPrice: 12,
    sellingPrice: 320000,
    compareAtPrice: 380000,
    currency: 'VND',
    status: 'available',
    type: 'ready_stock',
    origin: 'usa',
    category: categories[0], // fashion-beauty
    brand: {
      id: 'the-ordinary',
      name: 'The Ordinary',
      logo: 'https://images.unsplash.com/photo-1574017228031-27b8e5d55bb8?w=100&h=100&fit=crop',
      country: 'usa' as ProductOrigin,
      verified: true
    },
    images: [
      {
        id: '12-1',
        url: 'https://images.unsplash.com/photo-1574017228031-27b8e5d55bb8?w=800&h=800&fit=crop',
        alt: 'The Ordinary Retinol 1%',
        isPrimary: true,
        order: 1
      }
    ],
    stock: 80,
    sku: 'TO-RET1-001',
    tags: ['the ordinary', 'retinol', 'skincare', 'mỹ'],
    featured: false,
    trending: true,
    rating: {
      average: 4.4,
      count: 156
    },
    sourceUrl: 'https://theordinary.com/retinol-1-in-squalane',
    sourceSite: 'The Ordinary US',
    createdAt: new Date('2024-01-08'),
    updatedAt: new Date('2024-01-20'),
    publishedAt: new Date('2024-01-08')
  },

  // FLASH DEAL
  {
    id: '13',
    name: 'Zojirushi Rice Cooker NS-LGC05',
    slug: 'zojirushi-rice-cooker-ns-lgc05',
    description: 'Nồi cơm điện Zojirushi NS-LGC05 3 cốc với công nghệ fuzzy logic, nấu cơm ngon và giữ ấm lâu dài.',
    shortDescription: 'Nồi cơm điện Zojirushi 3 cốc fuzzy logic',
    originalPrice: 180,
    sellingPrice: 3200000,
    compareAtPrice: 4200000,
    currency: 'VND',
    status: 'available',
    type: 'flash_deal',
    origin: 'japan',
    category: categories[3], // home-living
    brand: {
      id: 'zojirushi',
      name: 'Zojirushi',
      logo: 'https://images.unsplash.com/photo-1585515656846-b1ed1dac7db1?w=100&h=100&fit=crop',
      country: 'japan' as ProductOrigin,
      verified: true
    },
    deal: {
      id: 'deal-13',
      type: 'flash_sale',
      discountPercent: 40,
      startDate: new Date('2024-01-22T00:00:00'),
      endDate: new Date('2024-01-24T23:59:59'),
      isActive: true
    },
    images: [
      {
        id: '13-1',
        url: 'https://images.unsplash.com/photo-1585515656846-b1ed1dac7db1?w=800&h=800&fit=crop',
        alt: 'Zojirushi Rice Cooker',
        isPrimary: true,
        order: 1
      }
    ],
    stock: 35,
    sku: 'ZOJI-NSLGC05-001',
    tags: ['zojirushi', 'nồi cơm điện', 'flash deal', 'nhật bản'],
    featured: true,
    trending: false,
    rating: {
      average: 4.7,
      count: 67
    },
    sourceUrl: 'https://www.zojirushi.co.jp/ns-lgc05',
    sourceSite: 'Zojirushi Japan',
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-22'),
    publishedAt: new Date('2024-01-20')
  },

  {
    id: '14',
    name: 'Laneige Water Sleeping Mask',
    slug: 'laneige-water-sleeping-mask',
    description: 'Mặt nạ ngủ Laneige Water Sleeping Mask với công nghệ Hydro Ionized Mineral Water, cấp ẩm sâu qua đêm.',
    shortDescription: 'Mặt nạ ngủ Laneige cấp ẩm sâu',
    originalPrice: 34,
    sellingPrice: 890000,
    compareAtPrice: 1050000,
    currency: 'VND',
    status: 'available',
    type: 'ready_stock',
    origin: 'korea',
    category: categories[0], // fashion-beauty
    brand: {
      id: 'laneige',
      name: 'Laneige',
      logo: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=100&h=100&fit=crop',
      country: 'korea' as ProductOrigin,
      verified: true
    },
    images: [
      {
        id: '14-1',
        url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=800&fit=crop',
        alt: 'Laneige Water Sleeping Mask',
        isPrimary: true,
        order: 1
      }
    ],
    stock: 45,
    sku: 'LANEIGE-WSM-001',
    tags: ['laneige', 'sleeping mask', 'k-beauty', 'hàn quốc'],
    featured: false,
    trending: true,
    rating: {
      average: 4.5,
      count: 123
    },
    sourceUrl: 'https://www.laneige.com/water-sleeping-mask',
    sourceSite: 'Laneige Korea',
    createdAt: new Date('2024-01-07'),
    updatedAt: new Date('2024-01-18'),
    publishedAt: new Date('2024-01-07')
  },

  {
    id: '15',
    name: 'JBL Charge 5 Portable Speaker',
    slug: 'jbl-charge-5-portable-speaker',
    description: 'Loa di động JBL Charge 5 với âm thanh JBL Pro Sound, chống nước IP67, pin 20 giờ và sạc điện thoại.',
    shortDescription: 'Loa di động JBL Charge 5 chống nước',
    originalPrice: 180,
    sellingPrice: 4500000,
    compareAtPrice: 5200000,
    currency: 'VND',
    status: 'available',
    type: 'ready_stock',
    origin: 'usa',
    category: categories[1], // electronics
    brand: {
      id: 'jbl',
      name: 'JBL',
      logo: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=100&h=100&fit=crop',
      country: 'usa' as ProductOrigin,
      verified: true
    },
    images: [
      {
        id: '15-1',
        url: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&h=800&fit=crop',
        alt: 'JBL Charge 5',
        isPrimary: true,
        order: 1
      }
    ],
    stock: 28,
    sku: 'JBL-CHARGE5-001',
    tags: ['jbl', 'loa di động', 'bluetooth', 'mỹ'],
    featured: false,
    trending: false,
    rating: {
      average: 4.6,
      count: 198
    },
    sourceUrl: 'https://www.jbl.com/charge-5',
    sourceSite: 'JBL US',
    createdAt: new Date('2024-01-06'),
    updatedAt: new Date('2024-01-17'),
    publishedAt: new Date('2024-01-06')
  }
];

// Utility functions
export const getProductsByStatus = (status: string) => {
  return mockProducts.filter(product => product.status === status);
};

export const getProductsByType = (type: string) => {
  return mockProducts.filter(product => product.type === type);
};

export const getProductsByOrigin = (origin: string) => {
  return mockProducts.filter(product => product.origin === origin);
};

export const getFeaturedProducts = () => {
  return mockProducts.filter(product => product.featured);
};

export const getTrendingProducts = () => {
  return mockProducts.filter(product => product.trending);
};

export const getProductBySlug = (slug: string) => {
  return mockProducts.find(product => product.slug === slug);
};

export const getProductById = (id: string) => {
  return mockProducts.find(product => product.id === id);
};
