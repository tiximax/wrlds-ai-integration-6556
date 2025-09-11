import { Product, ProductBrand, ProductOrigin } from '@/types/product';
import { getCategoryById } from '../utils/categoryUtils';

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

// Enhanced Mock Products Data with multiple images, variants, specs, and reviews
export const mockProducts: Product[] = [
  // READY STOCK PRODUCTS
  {
    id: '1',
    name: 'Nike Air Max 270 React',
    slug: 'nike-air-max-270-react',
    description: 'Giày thể thao Nike Air Max 270 React với công nghệ đệm khí tiên tiến, mang lại cảm giác thoải mái tối đa cho mọi hoạt động. Thiết kế hiện đại kết hợp hoàn hảo giữa phong cách và hiệu suất, phù hợp cho cả tập luyện và đi lại hàng ngày.',
    shortDescription: 'Giày thể thao Nike với công nghệ đệm khí tiên tiến',
    originalPrice: 150,
    sellingPrice: 4500000,
    compareAtPrice: 5200000,
    currency: 'VND',
    status: 'available',
    type: 'ready_stock',
    origin: 'usa',
    category: getCategoryById('shoes-footwear')!,
    brand: brands[0], // Nike
    images: [
      {
        id: '1-1',
        url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=800&fit=crop',
        alt: 'Nike Air Max 270 React - Main View',
        isPrimary: true,
        order: 1
      },
      {
        id: '1-2',
        url: 'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=800&h=800&fit=crop',
        alt: 'Nike Air Max 270 React - Side View',
        isPrimary: false,
        order: 2
      },
      {
        id: '1-3',
        url: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&h=800&fit=crop',
        alt: 'Nike Air Max 270 React - Back View',
        isPrimary: false,
        order: 3
      },
      {
        id: '1-4',
        url: 'https://images.unsplash.com/photo-1595341888016-a392ef81b7de?w=800&h=800&fit=crop',
        alt: 'Nike Air Max 270 React - Detail',
        isPrimary: false,
        order: 4
      }
    ],
    variants: [
      {
        id: 'var-1-1',
        name: 'Size',
        type: 'size',
        required: true,
        options: [
          { id: 'size-39', value: '39', label: 'Size 39', stock: 5, priceAdjustment: 0 },
          { id: 'size-40', value: '40', label: 'Size 40', stock: 8, priceAdjustment: 0 },
          { id: 'size-41', value: '41', label: 'Size 41', stock: 6, priceAdjustment: 0 },
          { id: 'size-42', value: '42', label: 'Size 42', stock: 4, priceAdjustment: 0 },
          { id: 'size-43', value: '43', label: 'Size 43', stock: 2, priceAdjustment: 0 }
        ]
      },
      {
        id: 'var-1-2',
        name: 'Màu sắc',
        type: 'color',
        required: true,
        options: [
          { id: 'color-black', value: 'black', label: 'Đen', stock: 12, priceAdjustment: 0 },
          { id: 'color-white', value: 'white', label: 'Trắng', stock: 8, priceAdjustment: 0 },
          { id: 'color-blue', value: 'blue', label: 'Xanh dương', stock: 5, priceAdjustment: 0 }
        ]
      }
    ],
    specifications: [
      { label: 'Chất liệu upper', value: 'Mesh thoáng khí + da tổng hợp' },
      { label: 'Chất liệu đế giữa', value: 'Foam React + Air Max' },
      { label: 'Chất liệu đế ngoài', value: 'Cao su bền chắc' },
      { label: 'Công nghệ', value: 'Air Max 270, React Foam' },
      { label: 'Phù hợp', value: 'Chạy bộ, tập gym, đi bộ' },
      { label: 'Xuất xứ', value: 'Việt Nam (Nike Official)' }
    ],
    reviews: [
      {
        id: 'rev-1-1',
        userId: 'user1',
        userName: 'Minh Anh',
        rating: 5,
        title: 'Giày rất thoải mái!',
        content: 'Mình đã sử dụng được 3 tháng, giày vẫn như mới và rất thoải mái khi chạy bộ. Đệm khí thật sự hiệu quả.',
        date: new Date('2024-01-18'),
        verified: true,
        helpful: 12
      },
      {
        id: 'rev-1-2',
        userId: 'user2',
        userName: 'Tuấn Đạt',
        rating: 4,
        title: 'Chất lượng tốt nhưng hơi chật',
        content: 'Giày đẹp và chất lượng ok, tuy nhiên size hơi nhỏ so với size thông thường. Nên lên size lớn hơn 0.5.',
        date: new Date('2024-01-16'),
        verified: true,
        helpful: 8
      },
      {
        id: 'rev-1-3',
        userId: 'user3',
        userName: 'Thu Hà',
        rating: 5,
        title: 'Đáng tiền!',
        content: 'Giày nhẹ, thoáng khí và thiết kế đẹp. Phù hợp cả tập gym và đi chơi. Sẽ mua thêm màu khác.',
        date: new Date('2024-01-14'),
        verified: false,
        helpful: 5
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
    description: 'Tai nghe không dây Sony WH-1000XM5 với công nghệ chống ồn hàng đầu thế giới, chất lượng âm thanh Hi-Res Audio, pin lên đến 30 giờ. Thiết kế mới nhẹ hơn và thoải mái hơn với 8 micro phone cho khả năng gọi điện crystal clear.',
    shortDescription: 'Tai nghe không dây Sony với chống ồn hàng đầu',
    originalPrice: 400,
    sellingPrice: 9800000,
    compareAtPrice: 11500000,
    currency: 'VND',
    status: 'available',
    type: 'ready_stock',
    origin: 'japan',
    category: getCategoryById('headphones-audio')!,
    brand: brands[1], // Sony
    images: [
      {
        id: '2-1',
        url: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&h=800&fit=crop',
        alt: 'Sony WH-1000XM5 - Main View',
        isPrimary: true,
        order: 1
      },
      {
        id: '2-2',
        url: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&h=800&fit=crop',
        alt: 'Sony WH-1000XM5 - Side Profile',
        isPrimary: false,
        order: 2
      },
      {
        id: '2-3',
        url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=800&fit=crop',
        alt: 'Sony WH-1000XM5 - Folded',
        isPrimary: false,
        order: 3
      },
      {
        id: '2-4',
        url: 'https://images.unsplash.com/photo-1590658165737-15a047b0db75?w=800&h=800&fit=crop',
        alt: 'Sony WH-1000XM5 - Controls',
        isPrimary: false,
        order: 4
      }
    ],
    variants: [
      {
        id: 'var-2-1',
        name: 'Màu sắc',
        type: 'color',
        required: true,
        options: [
          { id: 'color-black', value: 'black', label: 'Đen', stock: 8, priceAdjustment: 0 },
          { id: 'color-silver', value: 'silver', label: 'Bạc', stock: 5, priceAdjustment: 0 },
          { id: 'color-white', value: 'white', label: 'Trắng', stock: 2, priceAdjustment: 200000 }
        ]
      }
    ],
    specifications: [
      { label: 'Driver', value: '30mm, Dome type (CCAW Voice coil)' },
      { label: 'Tần số đáp ứng', value: '4 Hz-40,000 Hz' },
      { label: 'Impedance', value: '48 ohm (1 kHz) (khi bật)' },
      { label: 'Pin', value: '30 giờ (với NC và Bluetooth)' },
      { label: 'Sạc', value: 'USB-C, sạc nhanh 3 phút dùng 3 giờ' },
      { label: 'Bluetooth', value: 'Version 5.2 (A2DP, AVRCP, HFP, HSP)' },
      { label: 'Codec', value: 'SBC, AAC, LDAC' },
      { label: 'Noise Cancelling', value: 'V1 Processor + Dual Noise Sensor' },
      { label: 'Micro phone', value: '8 micro phones cho NC và cuộc gọi' },
      { label: 'Trọng lượng', value: '249g' }
    ],
    reviews: [
      {
        id: 'rev-2-1',
        userId: 'user4',
        userName: 'Đức Minh',
        rating: 5,
        title: 'Chống ồn tuyệt vời!',
        content: 'Chống ồn thật sự ấn tượng, ngồi máy bay hay tàu điện không nghe thấy tiếng ồn bên ngoài. Âm bass sâu, treble trong. Đáng đồng tiền.',
        date: new Date('2024-01-19'),
        verified: true,
        helpful: 25
      },
      {
        id: 'rev-2-2',
        userId: 'user5',
        userName: 'Mai Lan',
        rating: 4,
        title: 'Thoải mái đeo lâu',
        content: 'Đeo cả ngày không bị mỏi tai. Pin trâu, sạc nhanh. Tuy nhiên app điều khiển hơi phức tạp.',
        date: new Date('2024-01-17'),
        verified: true,
        helpful: 18
      },
      {
        id: 'rev-2-3',
        userId: 'user6',
        userName: 'Hoàng Nam',
        rating: 5,
        title: 'Worth every penny!',
        content: 'Nâng cấp từ XM4, XM5 nhẹ hơn và chống ồn tốt hơn hẳn. Call quality cũng rất clear. Highly recommend!',
        date: new Date('2024-01-15'),
        verified: false,
        helpful: 31
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
    category: getCategoryById('cosmetics-skincare')!,
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
    category: getCategoryById('headphones-audio')!,
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
    category: getCategoryById('gaming')!,
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
    category: getCategoryById('cosmetics-skincare')!,
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
    category: getCategoryById('kitchen-appliances')!,
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
    category: getCategoryById('shoes-footwear')!,
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
    category: getCategoryById('headphones-audio')!,
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
    category: getCategoryById('cosmetics-skincare')!,
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
    category: getCategoryById('cameras-photography')!,
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
    category: getCategoryById('cosmetics-skincare')!,
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
    category: getCategoryById('kitchen-appliances')!,
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
    category: getCategoryById('cosmetics-skincare')!,
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
    category: getCategoryById('headphones-audio')!,
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
  },

  // ADDITIONAL ELECTRONICS - iPad Pro
  {
    id: '16',
    name: 'iPad Pro 12.9" M2 (6th Gen)',
    slug: 'ipad-pro-12-9-m2-6th-gen',
    description: 'iPad Pro 12.9 inch với chip M2, màn hình Liquid Retina XDR, hỗ trợ Apple Pencil và Magic Keyboard. Hiệu suất mạnh mẽ cho sáng tạo và làm việc chuyên nghiệp.',
    shortDescription: 'iPad Pro 12.9" với chip M2 mạnh mẽ',
    originalPrice: 1099,
    sellingPrice: 28500000,
    compareAtPrice: 32000000,
    currency: 'VND',
    status: 'available',
    type: 'ready_stock',
    origin: 'usa',
    category: getCategoryById('smartphones-tablets')!,
    brand: {
      id: 'apple',
      name: 'Apple',
      logo: 'https://images.unsplash.com/photo-1611472173362-3f53dbd65d80?w=100&h=100&fit=crop',
      country: 'usa' as ProductOrigin,
      verified: true
    },
    images: [
      {
        id: '16-1',
        url: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&h=800&fit=crop',
        alt: 'iPad Pro 12.9 M2 - Front View',
        isPrimary: true,
        order: 1
      },
      {
        id: '16-2',
        url: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&h=800&fit=crop',
        alt: 'iPad Pro 12.9 M2 - Side View',
        isPrimary: false,
        order: 2
      },
      {
        id: '16-3',
        url: 'https://images.unsplash.com/photo-1585790050230-5dd28404ccb9?w=800&h=800&fit=crop',
        alt: 'iPad Pro 12.9 M2 - With Keyboard',
        isPrimary: false,
        order: 3
      }
    ],
    variants: [
      {
        id: 'var-16-1',
        name: 'Dung lượng',
        type: 'storage',
        required: true,
        options: [
          { id: 'storage-128gb', value: '128gb', label: '128GB', stock: 8, priceAdjustment: 0 },
          { id: 'storage-256gb', value: '256gb', label: '256GB', stock: 5, priceAdjustment: 3000000 },
          { id: 'storage-512gb', value: '512gb', label: '512GB', stock: 3, priceAdjustment: 6000000 },
          { id: 'storage-1tb', value: '1tb', label: '1TB', stock: 2, priceAdjustment: 12000000 }
        ]
      },
      {
        id: 'var-16-2',
        name: 'Màu sắc',
        type: 'color',
        required: true,
        options: [
          { id: 'color-silver', value: 'silver', label: 'Bạc', stock: 10, priceAdjustment: 0 },
          { id: 'color-space-gray', value: 'space-gray', label: 'Xám không gian', stock: 8, priceAdjustment: 0 }
        ]
      }
    ],
    specifications: [
      { label: 'Chip', value: 'Apple M2 8-core CPU, 10-core GPU' },
      { label: 'Màn hình', value: '12.9" Liquid Retina XDR (2732x2048)' },
      { label: 'Độ sáng', value: '1000 nits (SDR), 1600 nits (HDR)' },
      { label: 'RAM', value: '8GB/16GB unified memory' },
      { label: 'Camera sau', value: '12MP Wide + 10MP Ultra Wide + LiDAR' },
      { label: 'Camera trước', value: '12MP TrueDepth với Center Stage' },
      { label: 'Kết nối', value: 'USB-C Thunderbolt / USB 4, Wi-Fi 6E' },
      { label: 'Pin', value: 'Lên đến 10 giờ duyệt web' },
      { label: 'Hỗ trợ', value: 'Apple Pencil (2nd gen), Magic Keyboard' }
    ],
    reviews: [
      {
        id: 'rev-16-1',
        userId: 'user16',
        userName: 'Designer Pro',
        rating: 5,
        title: 'Thay thế laptop hoàn hảo!',
        content: 'Dùng để thiết kế và edit video rất mượt mà. Màn hình đẹp, hiệu suất M2 ấn tượng. Magic Keyboard biến nó thành laptop thật sự.',
        date: new Date('2024-01-21'),
        verified: true,
        helpful: 42
      },
      {
        id: 'rev-16-2',
        userId: 'user17',
        userName: 'Mobile Dev',
        rating: 4,
        title: 'Mạnh mẽ nhưng đắt',
        content: 'Code trên iPad Pro khá tiện với các app như Xcode Cloud. Tuy nhiên giá khá cao so với laptop cùng tầm.',
        date: new Date('2024-01-19'),
        verified: true,
        helpful: 28
      }
    ],
    stock: 18,
    sku: 'APPLE-IPADPRO129-M2',
    tags: ['apple', 'ipad pro', 'tablet', 'm2 chip', 'mỹ'],
    featured: true,
    trending: true,
    rating: {
      average: 4.8,
      count: 156
    },
    sourceUrl: 'https://www.apple.com/ipad-pro/',
    sourceSite: 'Apple US',
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-22'),
    publishedAt: new Date('2024-01-20')
  },

  // KOREAN BEAUTY - Sulwhasoo
  {
    id: '17',
    name: 'Sulwhasoo First Care Activating Serum',
    slug: 'sulwhasoo-first-care-activating-serum',
    description: 'Tinh chất dưỡng da Sulwhasoo First Care với thảo dược Hàn Quốc truyền thống, giúp tăng cường khả năng hấp thụ dưỡng chất và cải thiện texture da.',
    shortDescription: 'Tinh chất Sulwhasoo với thảo dược truyền thống',
    originalPrice: 68,
    sellingPrice: 1750000,
    compareAtPrice: 2100000,
    currency: 'VND',
    status: 'available',
    type: 'ready_stock',
    origin: 'korea',
    category: getCategoryById('cosmetics-skincare')!,
    brand: {
      id: 'sulwhasoo',
      name: 'Sulwhasoo',
      logo: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=100&h=100&fit=crop',
      country: 'korea' as ProductOrigin,
      verified: true
    },
    images: [
      {
        id: '17-1',
        url: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&h=800&fit=crop',
        alt: 'Sulwhasoo First Care Serum',
        isPrimary: true,
        order: 1
      },
      {
        id: '17-2',
        url: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=800&h=800&fit=crop',
        alt: 'Sulwhasoo packaging detail',
        isPrimary: false,
        order: 2
      }
    ],
    variants: [
      {
        id: 'var-17-1',
        name: 'Kích cỡ',
        type: 'size',
        required: true,
        options: [
          { id: 'size-60ml', value: '60ml', label: '60ml', stock: 12, priceAdjustment: 0 },
          { id: 'size-90ml', value: '90ml', label: '90ml', stock: 8, priceAdjustment: 800000 }
        ]
      }
    ],
    specifications: [
      { label: 'Thành phần chính', value: 'JAUM Balancing Complex™' },
      { label: 'Loại da phù hợp', value: 'Mọi loại da, đặc biệt da khô và lão hóa' },
      { label: 'Kết cấu', value: 'Dạng serum lỏng, thấm nhanh' },
      { label: 'Hương thơm', value: 'Hương thảo dược nhẹ nhàng' },
      { label: 'Cách dùng', value: 'Sử dụng sau bước làm sạch, trước toner' },
      { label: 'Xuất xứ', value: 'Hàn Quốc - Amorepacific' }
    ],
    reviews: [
      {
        id: 'rev-17-1',
        userId: 'user18',
        userName: 'Beauty Guru',
        rating: 5,
        title: 'Đẳng cấp K-Beauty!',
        content: 'Dùng được 2 tháng, da mịn màng và sáng hơn rõ rệt. Hương thảo dược rất thư giãn. Xứng đáng với giá tiền.',
        date: new Date('2024-01-20'),
        verified: true,
        helpful: 35
      }
    ],
    stock: 25,
    sku: 'SULWHASOO-FCA-60',
    tags: ['sulwhasoo', 'k-beauty', 'serum', 'thảo dược', 'hàn quốc'],
    featured: false,
    trending: true,
    rating: {
      average: 4.7,
      count: 89
    },
    sourceUrl: 'https://www.sulwhasoo.com/first-care-activating-serum',
    sourceSite: 'Sulwhasoo Korea',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-21'),
    publishedAt: new Date('2024-01-15')
  },

  // JAPANESE HOME APPLIANCE - Panasonic
  {
    id: '18',
    name: 'Panasonic Nanoe Hair Dryer EH-NA0J',
    slug: 'panasonic-nanoe-hair-dryer-eh-na0j',
    description: 'Máy sấy tóc Panasonic Nanoe EH-NA0J với công nghệ nanoe™ và mineral ion, giúp dưỡng ẩm tóc, giảm tĩnh điện và tăng độ bóng mượt tự nhiên.',
    shortDescription: 'Máy sấy tóc Panasonic với công nghệ nanoe™',
    originalPrice: 220,
    sellingPrice: 5800000,
    compareAtPrice: 6800000,
    currency: 'VND',
    status: 'available',
    type: 'ready_stock',
    origin: 'japan',
    category: getCategoryById('cosmetics-skincare')!,
    brand: {
      id: 'panasonic',
      name: 'Panasonic',
      logo: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=100&h=100&fit=crop',
      country: 'japan' as ProductOrigin,
      verified: true
    },
    images: [
      {
        id: '18-1',
        url: 'https://images.unsplash.com/photo-1522338140262-f46f5913618a?w=800&h=800&fit=crop',
        alt: 'Panasonic Nanoe Hair Dryer',
        isPrimary: true,
        order: 1
      },
      {
        id: '18-2',
        url: 'https://images.unsplash.com/photo-1560472354-c05b66c9a944?w=800&h=800&fit=crop',
        alt: 'Hair dryer with accessories',
        isPrimary: false,
        order: 2
      }
    ],
    variants: [
      {
        id: 'var-18-1',
        name: 'Màu sắc',
        type: 'color',
        required: true,
        options: [
          { id: 'color-white', value: 'white', label: 'Trắng', stock: 15, priceAdjustment: 0 },
          { id: 'color-pink', value: 'pink', label: 'Hồng', stock: 10, priceAdjustment: 0 },
          { id: 'color-black', value: 'black', label: 'Đen', stock: 8, priceAdjustment: 0 }
        ]
      }
    ],
    specifications: [
      { label: 'Công suất', value: '1400W' },
      { label: 'Công nghệ', value: 'nanoe™ + Mineral Ion' },
      { label: 'Chế độ nhiệt', value: '3 chế độ nhiệt + chế độ lạnh' },
      { label: 'Tốc độ gió', value: '3 tốc độ' },
      { label: 'Phụ kiện', value: 'Concentrator nozzle, Diffuser' },
      { label: 'Dây nguồn', value: '1.7m có thể xoay 360°' },
      { label: 'Trọng lượng', value: '550g (không kể dây)' },
      { label: 'Bảo hành', value: '2 năm chính hãng' }
    ],
    reviews: [
      {
        id: 'rev-18-1',
        userId: 'user19',
        userName: 'Hair Stylist',
        rating: 5,
        title: 'Tóc mượt mà hơn thật sự!',
        content: 'Dùng được 1 tháng, tóc ít xơ rối và bóng mượt hơn hẳn. Công nghệ nanoe thật sự hiệu quả. Tuy hơi nặng nhưng đáng đồng tiền.',
        date: new Date('2024-01-18'),
        verified: true,
        helpful: 67
      },
      {
        id: 'rev-18-2',
        userId: 'user20',
        userName: 'Long Hair Girl',
        rating: 4,
        title: 'Giảm thời gian sấy tóc',
        content: 'Sấy khô nhanh mà tóc không bị khô xơ. Âm thanh êm hơn máy cũ. Chỉ tiếc là giá hơi cao.',
        date: new Date('2024-01-16'),
        verified: true,
        helpful: 23
      }
    ],
    stock: 33,
    sku: 'PANASONIC-EHNA0J-001',
    tags: ['panasonic', 'máy sấy tóc', 'nanoe', 'nhật bản'],
    featured: true,
    trending: false,
    rating: {
      average: 4.6,
      count: 145
    },
    sourceUrl: 'https://www.panasonic.com/jp/consumer/beauty/hair-care/hair-dryer/eh-na0j.html',
    sourceSite: 'Panasonic Japan',
    createdAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-01-20'),
    publishedAt: new Date('2024-01-12')
  },

  // SPORTS EQUIPMENT - Under Armour
  {
    id: '19',
    name: 'Under Armour HOVR Phantom 3',
    slug: 'under-armour-hovr-phantom-3',
    description: 'Giày chạy bộ Under Armour HOVR Phantom 3 với công nghệ UA HOVR™ cung cấp cảm giác "zero gravity", kết nối MapMyRun™ để theo dõi chỉ số chạy.',
    shortDescription: 'Giày chạy bộ Under Armour với công nghệ HOVR™',
    originalPrice: 140,
    sellingPrice: 3800000,
    compareAtPrice: 4300000,
    currency: 'VND',
    status: 'available',
    type: 'ready_stock',
    origin: 'usa',
    category: getCategoryById('shoes-footwear')!,
    brand: {
      id: 'under-armour',
      name: 'Under Armour',
      logo: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5d?w=100&h=100&fit=crop',
      country: 'usa' as ProductOrigin,
      verified: true
    },
    images: [
      {
        id: '19-1',
        url: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&h=800&fit=crop',
        alt: 'Under Armour HOVR Phantom 3',
        isPrimary: true,
        order: 1
      },
      {
        id: '19-2',
        url: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&h=800&fit=crop',
        alt: 'HOVR Phantom 3 - Side View',
        isPrimary: false,
        order: 2
      },
      {
        id: '19-3',
        url: 'https://images.unsplash.com/photo-1539185441755-769473a23570?w=800&h=800&fit=crop',
        alt: 'HOVR Phantom 3 - Sole Detail',
        isPrimary: false,
        order: 3
      }
    ],
    variants: [
      {
        id: 'var-19-1',
        name: 'Size',
        type: 'size',
        required: true,
        options: [
          { id: 'size-us8', value: 'us8', label: 'US 8 (26cm)', stock: 6, priceAdjustment: 0 },
          { id: 'size-us9', value: 'us9', label: 'US 9 (27cm)', stock: 8, priceAdjustment: 0 },
          { id: 'size-us10', value: 'us10', label: 'US 10 (28cm)', stock: 5, priceAdjustment: 0 },
          { id: 'size-us11', value: 'us11', label: 'US 11 (29cm)', stock: 3, priceAdjustment: 0 }
        ]
      },
      {
        id: 'var-19-2',
        name: 'Màu sắc',
        type: 'color',
        required: true,
        options: [
          { id: 'color-black-white', value: 'black-white', label: 'Đen/Trắng', stock: 12, priceAdjustment: 0 },
          { id: 'color-gray-blue', value: 'gray-blue', label: 'Xám/Xanh', stock: 8, priceAdjustment: 0 },
          { id: 'color-red-black', value: 'red-black', label: 'Đỏ/Đen', stock: 4, priceAdjustment: 0 }
        ]
      }
    ],
    specifications: [
      { label: 'Công nghệ đế giữa', value: 'UA HOVR™ Foam' },
      { label: 'Upper', value: 'UA IntelliKnit với thoáng khí' },
      { label: 'Đế ngoài', value: 'Carbon rubber với Blown Rubber' },
      { label: 'Drop', value: '8mm (heel: 32mm, forefoot: 24mm)' },
      { label: 'Trọng lượng', value: '309g (US 9)' },
      { label: 'Kết nối', value: 'MapMyRun™ app tracking' },
      { label: 'Phù hợp', value: 'Chạy đường dài, tập luyện hàng ngày' },
      { label: 'Loại chân', value: 'Neutral runner' }
    ],
    reviews: [
      {
        id: 'rev-19-1',
        userId: 'user21',
        userName: 'Marathon Runner',
        rating: 5,
        title: 'Đệm êm như đi trên mây!',
        content: 'Chạy full marathon với đôi này không bị đau chân. Công nghệ HOVR thật sự tuyệt vời. App tracking cũng khá chính xác.',
        date: new Date('2024-01-22'),
        verified: true,
        helpful: 89
      },
      {
        id: 'rev-19-2',
        userId: 'user22',
        userName: 'Weekend Jogger',
        rating: 4,
        title: 'Thoải mái cho chạy bộ thường ngày',
        content: 'Giày nhẹ, đệm tốt, phù hợp chạy 5-10km. Upper hơi chật ở đầu ngón chân lúc đầu nhưng sau đó ok.',
        date: new Date('2024-01-19'),
        verified: true,
        helpful: 34
      }
    ],
    stock: 22,
    sku: 'UA-HOVRPH3-001',
    tags: ['under armour', 'giày chạy bộ', 'hovr', 'running', 'mỹ'],
    featured: false,
    trending: true,
    rating: {
      average: 4.5,
      count: 178
    },
    sourceUrl: 'https://www.underarmour.com/hovr-phantom-3',
    sourceSite: 'Under Armour US',
    createdAt: new Date('2024-01-16'),
    updatedAt: new Date('2024-01-22'),
    publishedAt: new Date('2024-01-16')
  },

  // GROUP BUY - KitchenAid Stand Mixer
  {
    id: '20',
    name: 'KitchenAid Artisan Stand Mixer 5QT',
    slug: 'kitchenaid-artisan-stand-mixer-5qt',
    description: 'Máy trộn bột KitchenAid Artisan 5 Quart với động cơ mạnh mẽ, 10 tốc độ trộn và hơn 15 phụ kiện tùy chọn. Thiết kế iconic và chất lượng bền bỉ.',
    shortDescription: 'Máy trộn bột KitchenAid Artisan 5 Quart',
    originalPrice: 449,
    sellingPrice: 9800000,
    compareAtPrice: 12500000,
    currency: 'VND',
    status: 'preorder',
    type: 'group_buy',
    origin: 'usa',
    category: getCategoryById('kitchen-appliances')!,
    brand: {
      id: 'kitchenaid',
      name: 'KitchenAid',
      logo: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=100&h=100&fit=crop',
      country: 'usa' as ProductOrigin,
      verified: true
    },
    deal: {
      id: 'deal-20',
      type: 'group_buy',
      discountPercent: 35,
      startDate: new Date('2024-01-20T00:00:00'),
      endDate: new Date('2024-03-01T23:59:59'),
      minQuantity: 15,
      currentQuantity: 11,
      maxQuantity: 30,
      isActive: true
    },
    preorderInfo: {
      id: 'preorder-20',
      expectedArrival: new Date('2024-04-15'),
      minPreorderQuantity: 15,
      currentPreorderCount: 11,
      depositPercent: 40,
      estimatedPrice: {
        min: 9500000,
        max: 10200000
      },
      isGroupBuy: true,
      groupBuyThreshold: 15
    },
    images: [
      {
        id: '20-1',
        url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=800&fit=crop',
        alt: 'KitchenAid Artisan Stand Mixer',
        isPrimary: true,
        order: 1
      },
      {
        id: '20-2',
        url: 'https://images.unsplash.com/photo-1556909502-4cb2f7ad5bd8?w=800&h=800&fit=crop',
        alt: 'KitchenAid mixer with dough hook',
        isPrimary: false,
        order: 2
      },
      {
        id: '20-3',
        url: 'https://images.unsplash.com/photo-1574869343229-06fda3779892?w=800&h=800&fit=crop',
        alt: 'KitchenAid mixer accessories',
        isPrimary: false,
        order: 3
      }
    ],
    variants: [
      {
        id: 'var-20-1',
        name: 'Màu sắc',
        type: 'color',
        required: true,
        options: [
          { id: 'color-empire-red', value: 'empire-red', label: 'Đỏ Empire', stock: 5, priceAdjustment: 0 },
          { id: 'color-onyx-black', value: 'onyx-black', label: 'Đen Onyx', stock: 4, priceAdjustment: 0 },
          { id: 'color-white', value: 'white', label: 'Trắng', stock: 3, priceAdjustment: 0 },
          { id: 'color-aqua-sky', value: 'aqua-sky', label: 'Xanh Aqua', stock: 2, priceAdjustment: 200000 }
        ]
      }
    ],
    specifications: [
      { label: 'Dung tích', value: '4.8L (5 Quart)' },
      { label: 'Động cơ', value: '325W tilt-head design' },
      { label: 'Tốc độ', value: '10 tốc độ trộn' },
      { label: 'Phụ kiện cơ bản', value: 'Flat beater, Dough hook, Wire whip' },
      { label: 'Chất liệu', value: 'Thép không gỉ và hợp kim đúc' },
      { label: 'Trọng lượng', value: '11.1 kg' },
      { label: 'Kích thước', value: '35.6 x 22.1 x 35.3 cm' },
      { label: 'Bảo hành', value: '2 năm chính hãng toàn cầu' }
    ],
    reviews: [
      {
        id: 'rev-20-1',
        userId: 'user23',
        userName: 'Baker Mom',
        rating: 5,
        title: 'Thiết bị nhà bếp trong mơ!',
        content: 'Dùng để làm bánh mì, bánh ngọt đều cực kỳ mượt mà. Build quality tuyệt vời, đáng để đầu tư lâu dài.',
        date: new Date('2024-01-21'),
        verified: true,
        helpful: 156
      },
      {
        id: 'rev-20-2',
        userId: 'user24',
        userName: 'Home Chef',
        rating: 5,
        title: 'Mua group buy đáng giá!',
        content: 'So với giá lẻ thì group buy này rất hời. Máy chạy êm, trộn đều, thiết kế đẹp làm điểm nhấn cho nhà bếp.',
        date: new Date('2024-01-20'),
        verified: false,
        helpful: 67
      }
    ],
    stock: 0,
    sku: 'KITCHENAID-ASM5QT-001',
    tags: ['kitchenaid', 'máy trộn bột', 'group buy', 'nhà bếp', 'mỹ'],
    featured: true,
    trending: true,
    rating: {
      average: 4.9,
      count: 234
    },
    sourceUrl: 'https://www.kitchenaid.com/artisan-series-5-quart-tilt-head-stand-mixer',
    sourceSite: 'KitchenAid US',
    createdAt: new Date('2024-01-18'),
    updatedAt: new Date('2024-01-22'),
    publishedAt: new Date('2024-01-18')
  },

  // PREORDER - Luxury Watch
  {
    id: '21',
    name: 'Seiko Prospex SSK001 Limited Edition',
    slug: 'seiko-prospex-ssk001-limited-edition',
    description: 'Đồng hồ Seiko Prospex SSK001 phiên bản giới hạn với bộ máy 4R36 tự động, khả năng chống nước 200m, thiết kế diving watch chuyên nghiệp.',
    shortDescription: 'Đồng hồ Seiko Prospex SSK001 Limited Edition',
    originalPrice: 350,
    sellingPrice: 8900000,
    currency: 'VND',
    status: 'preorder',
    type: 'pre_order',
    origin: 'japan',
    category: getCategoryById('bags-accessories')!,
    brand: {
      id: 'seiko',
      name: 'Seiko',
      logo: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=100&h=100&fit=crop',
      country: 'japan' as ProductOrigin,
      verified: true
    },
    preorderInfo: {
      id: 'preorder-21',
      expectedArrival: new Date('2024-03-30'),
      minPreorderQuantity: 25,
      currentPreorderCount: 19,
      depositPercent: 50,
      estimatedPrice: {
        min: 8700000,
        max: 9200000
      },
      isGroupBuy: true,
      groupBuyThreshold: 25
    },
    images: [
      {
        id: '21-1',
        url: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800&h=800&fit=crop',
        alt: 'Seiko Prospex SSK001',
        isPrimary: true,
        order: 1
      },
      {
        id: '21-2',
        url: 'https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=800&h=800&fit=crop',
        alt: 'Seiko Prospex - Side view',
        isPrimary: false,
        order: 2
      },
      {
        id: '21-3',
        url: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&h=800&fit=crop',
        alt: 'Seiko Prospex - Face detail',
        isPrimary: false,
        order: 3
      }
    ],
    variants: [
      {
        id: 'var-21-1',
        name: 'Dây đeo',
        type: 'strap',
        required: true,
        options: [
          { id: 'strap-steel', value: 'steel', label: 'Dây thép không gỉ', stock: 15, priceAdjustment: 0 },
          { id: 'strap-rubber', value: 'rubber', label: 'Dây cao su', stock: 10, priceAdjustment: -500000 }
        ]
      }
    ],
    specifications: [
      { label: 'Bộ máy', value: '4R36 Automatic (self-winding + manual winding)' },
      { label: 'Chức năng', value: 'Giờ, phút, giây, ngày, day/night indicator' },
      { label: 'Độ chính xác', value: '+45 to -35 giây/ngày' },
      { label: 'Dự trữ năng lượng', value: '41 giờ' },
      { label: 'Vỏ', value: 'Thép không gỉ 316L, đường kính 42.5mm' },
      { label: 'Chống nước', value: '200m (20 bar) - ISO 6425' },
      { label: 'Kính', value: 'Hardlex crystal' },
      { label: 'Luminous', value: 'LumiBrite trên kim và chỉ số' },
      { label: 'Sản xuất', value: 'Limited Edition - 3000 chiếc toàn cầu' }
    ],
    reviews: [
      {
        id: 'rev-21-1',
        userId: 'user25',
        userName: 'Watch Collector',
        rating: 5,
        title: 'Đồng hồ lặn chất lượng!',
        content: 'Build quality rất tốt cho tầm giá. Bộ máy 4R36 chạy ổn định. Limited edition nên có giá trị sưu tầm.',
        date: new Date('2024-01-19'),
        verified: true,
        helpful: 78
      }
    ],
    stock: 0,
    sku: 'SEIKO-SSK001-LE',
    tags: ['seiko', 'đồng hồ', 'prospex', 'limited edition', 'nhật bản'],
    featured: true,
    trending: false,
    rating: {
      average: 4.8,
      count: 45
    },
    sourceUrl: 'https://www.seikowatches.com/prospex-ssk001',
    sourceSite: 'Seiko Japan',
    createdAt: new Date('2024-01-17'),
    updatedAt: new Date('2024-01-21'),
    publishedAt: new Date('2024-01-17')
  },

  // FLASH DEAL - Gaming Headset
  {
    id: '22',
    name: 'Razer BlackShark V2 Gaming Headset',
    slug: 'razer-blackshark-v2-gaming-headset',
    description: 'Tai nghe gaming Razer BlackShark V2 với driver TriForce Titanium 50mm, THX 7.1 Spatial Audio, micro phone HyperClear và thiết kế nhẹ thoải mái.',
    shortDescription: 'Tai nghe gaming Razer BlackShark V2',
    originalPrice: 100,
    sellingPrice: 1800000,
    compareAtPrice: 2400000,
    currency: 'VND',
    status: 'available',
    type: 'flash_deal',
    origin: 'usa',
    category: getCategoryById('smartphones-tablets')!,
    brand: {
      id: 'razer',
      name: 'Razer',
      logo: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=100&h=100&fit=crop',
      country: 'usa' as ProductOrigin,
      verified: true
    },
    deal: {
      id: 'deal-22',
      type: 'flash_sale',
      discountPercent: 45,
      startDate: new Date('2024-01-23T00:00:00'),
      endDate: new Date('2024-01-26T23:59:59'),
      isActive: true
    },
    images: [
      {
        id: '22-1',
        url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&h=800&fit=crop',
        alt: 'Razer BlackShark V2',
        isPrimary: true,
        order: 1
      },
      {
        id: '22-2',
        url: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&h=800&fit=crop',
        alt: 'BlackShark V2 - Side view with mic',
        isPrimary: false,
        order: 2
      }
    ],
    variants: [
      {
        id: 'var-22-1',
        name: 'Phiên bản',
        type: 'edition',
        required: true,
        options: [
          { id: 'edition-standard', value: 'standard', label: 'Standard (3.5mm)', stock: 25, priceAdjustment: 0 },
          { id: 'edition-usb', value: 'usb', label: 'USB Sound Card', stock: 15, priceAdjustment: 400000 }
        ]
      }
    ],
    specifications: [
      { label: 'Driver', value: 'TriForce Titanium 50mm drivers' },
      { label: 'Tần số đáp ứng', value: '12 Hz – 28 kHz' },
      { label: 'Impedance', value: '32 Ω (1 kHz)' },
      { label: 'Micro phone', value: 'HyperClear Cardioid Mic' },
      { label: 'Kết nối', value: '3.5mm 4-pole / USB Sound Card' },
      { label: 'Âm thanh', value: 'THX 7.1 Spatial Audio' },
      { label: 'Trọng lượng', value: '262g' },
      { label: 'Tương thích', value: 'PC, PS5, PS4, Xbox, Nintendo Switch, Mobile' }
    ],
    reviews: [
      {
        id: 'rev-22-1',
        userId: 'user26',
        userName: 'Pro Gamer',
        rating: 5,
        title: 'Tai nghe gaming tốt nhất tầm giá!',
        content: 'Âm thanh rất chi tiết, micro rõ ràng. Đeo lâu không bị mỏi tai. Flash deal này rất đáng mua!',
        date: new Date('2024-01-23'),
        verified: true,
        helpful: 234
      },
      {
        id: 'rev-22-2',
        userId: 'user27',
        userName: 'Streamer',
        rating: 4,
        title: 'Micro chất lượng cao',
        content: 'Dùng để stream rất ổn. Micro lọc tiếng ồn tốt. Chỉ tiếc thiết kế hơi đơn giản.',
        date: new Date('2024-01-22'),
        verified: true,
        helpful: 89
      }
    ],
    stock: 40,
    sku: 'RAZER-BSV2-001',
    tags: ['razer', 'tai nghe gaming', 'thx audio', 'flash deal', 'mỹ'],
    featured: true,
    trending: true,
    rating: {
      average: 4.7,
      count: 567
    },
    sourceUrl: 'https://www.razer.com/gaming-headsets/razer-blackshark-v2',
    sourceSite: 'Razer US',
    createdAt: new Date('2024-01-21'),
    updatedAt: new Date('2024-01-23'),
    publishedAt: new Date('2024-01-21')
  },

  // HOME APPLIANCE - Instant Pot
  {
    id: '23',
    name: 'Instant Pot Duo Plus 8-Quart',
    slug: 'instant-pot-duo-plus-8-quart',
    description: 'Nồi áp suất điện đa năng Instant Pot Duo Plus 8 Quart với 9 chức năng nấu trong 1: áp suất, chậm, nấu cơm, xào, hấp, ủ sữa chua, làm ấm và khử trùng.',
    shortDescription: 'Nồi áp suất điện Instant Pot Duo Plus 8Qt',
    originalPrice: 120,
    sellingPrice: 3200000,
    compareAtPrice: 3800000,
    currency: 'VND',
    status: 'available',
    type: 'ready_stock',
    origin: 'usa',
    category: getCategoryById('home-decor')!,
    brand: {
      id: 'instant-pot',
      name: 'Instant Pot',
      logo: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=100&h=100&fit=crop',
      country: 'usa' as ProductOrigin,
      verified: true
    },
    images: [
      {
        id: '23-1',
        url: 'https://images.unsplash.com/photo-1556909162-6a6c4e5d4912?w=800&h=800&fit=crop',
        alt: 'Instant Pot Duo Plus 8Qt',
        isPrimary: true,
        order: 1
      },
      {
        id: '23-2',
        url: 'https://images.unsplash.com/photo-1574869343229-06fda3779892?w=800&h=800&fit=crop',
        alt: 'Instant Pot with accessories',
        isPrimary: false,
        order: 2
      }
    ],
    variants: [
      {
        id: 'var-23-1',
        name: 'Màu sắc',
        type: 'color',
        required: true,
        options: [
          { id: 'color-black', value: 'black', label: 'Đen', stock: 20, priceAdjustment: 0 },
          { id: 'color-red', value: 'red', label: 'Đỏ', stock: 12, priceAdjustment: 0 }
        ]
      }
    ],
    specifications: [
      { label: 'Dung tích', value: '7.6L (8 Quart)' },
      { label: 'Chức năng', value: '9-in-1: Pressure Cook, Slow Cook, Rice Cooker, Yogurt Maker, Steamer, Sauté, Food Warmer, Sous vide, Sterilizer' },
      { label: 'Áp suất', value: 'High/Low pressure settings' },
      { label: 'Công suất', value: '1500W' },
      { label: 'Chất liệu nồi', value: 'Thép không gỉ 3-ply bottom' },
      { label: 'Điều khiển', value: 'Microprocessor với 13 Smart Programs' },
      { label: 'An toàn', value: '10+ proven safety mechanisms' },
      { label: 'Phụ kiện', value: 'Steam rack, rice paddle, soup spoon, measuring cup' }
    ],
    reviews: [
      {
        id: 'rev-23-1',
        userId: 'user28',
        userName: 'Busy Mom',
        rating: 5,
        title: 'Cứu tinh của nhà bếp!',
        content: 'Nấu mọi thứ đều nhanh và ngon. Tôi hay dùng để nấu cơm, hầm xương, làm sữa chua. Rất tiện lợi cho gia đình đông người.',
        date: new Date('2024-01-20'),
        verified: true,
        helpful: 145
      },
      {
        id: 'rev-23-2',
        userId: 'user29',
        userName: 'Home Cook',
        rating: 4,
        title: 'Đa năng và tiện dụng',
        content: 'Chất lượng tốt, dễ sử dụng. Hầm thịt mềm trong thời gian ngắn. Chỉ hơi to so với bếp Việt Nam.',
        date: new Date('2024-01-18'),
        verified: true,
        helpful: 67
      }
    ],
    stock: 32,
    sku: 'INSTANTPOT-DUOPLUS8-001',
    tags: ['instant pot', 'nồi áp suất', 'đa năng', 'nhà bếp', 'mỹ'],
    featured: false,
    trending: true,
    rating: {
      average: 4.6,
      count: 289
    },
    sourceUrl: 'https://www.instantpot.com/duo-plus-8-quart',
    sourceSite: 'Instant Pot US',
    createdAt: new Date('2024-01-14'),
    updatedAt: new Date('2024-01-20'),
    publishedAt: new Date('2024-01-14')
  },

  // K-BEAUTY PREMIUM
  {
    id: '24',
    name: 'La Mer The Moisturizing Cream (100ml)',
    slug: 'la-mer-moisturizing-cream-100ml',
    description: 'Kem dưỡng ẩm La Mer với Miracle Broth™ độc quyền, giúp phục hồi và tái tạo làn da, mang lại độ ẩm sâu và làm chậm quá trình lão hóa.',
    shortDescription: 'Kem dưỡng ẩm La Mer với Miracle Broth™',
    originalPrice: 380,
    sellingPrice: 9800000,
    compareAtPrice: 11200000,
    currency: 'VND',
    status: 'available',
    type: 'ready_stock',
    origin: 'usa',
    category: getCategoryById('clothing')!,
    brand: {
      id: 'la-mer',
      name: 'La Mer',
      logo: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=100&h=100&fit=crop',
      country: 'usa' as ProductOrigin,
      verified: true
    },
    images: [
      {
        id: '24-1',
        url: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&h=800&fit=crop',
        alt: 'La Mer Moisturizing Cream',
        isPrimary: true,
        order: 1
      },
      {
        id: '24-2',
        url: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=800&h=800&fit=crop',
        alt: 'La Mer cream texture',
        isPrimary: false,
        order: 2
      }
    ],
    variants: [
      {
        id: 'var-24-1',
        name: 'Kích cỡ',
        type: 'size',
        required: true,
        options: [
          { id: 'size-30ml', value: '30ml', label: '30ml', stock: 8, priceAdjustment: -6000000 },
          { id: 'size-60ml', value: '60ml', label: '60ml', stock: 10, priceAdjustment: -3000000 },
          { id: 'size-100ml', value: '100ml', label: '100ml', stock: 5, priceAdjustment: 0 }
        ]
      }
    ],
    specifications: [
      { label: 'Thành phần chính', value: 'Miracle Broth™ (Sea Kelp Ferment)' },
      { label: 'Kết cấu', value: 'Cream dạng gel mỏng, thấm nhanh' },
      { label: 'Công dụng', value: 'Phục hồi, tái tạo da, chống lão hóa' },
      { label: 'Loại da', value: 'Mọi loại da, đặc biệt da khô và lão hóa' },
      { label: 'Cách dùng', value: 'Sử dụng sáng và tối sau serum' },
      { label: 'Hương thơm', value: 'Hương biển nhẹ nhàng đặc trưng' },
      { label: 'Xuất xứ', value: 'Made in USA - Estée Lauder Companies' }
    ],
    reviews: [
      {
        id: 'rev-24-1',
        userId: 'user30',
        userName: 'Luxury Skincare Fan',
        rating: 5,
        title: 'Đắt nhưng xứng đáng!',
        content: 'Dùng được 2 tuần đã thấy da mềm mượt và căng hơn rõ rệt. Thấm nhanh không dính. Definitely a holy grail product!',
        date: new Date('2024-01-22'),
        verified: true,
        helpful: 89
      },
      {
        id: 'rev-24-2',
        userId: 'user31',
        userName: 'Skincare Addict',
        rating: 4,
        title: 'Hiệu quả nhưng cần kiên nhẫn',
        content: 'Dùng 1 tháng mới thấy hiệu quả rõ rệt. Da ít nếp nhăn và đều màu hơn. Giá cao nhưng chất lượng tốt.',
        date: new Date('2024-01-19'),
        verified: true,
        helpful: 45
      }
    ],
    stock: 23,
    sku: 'LAMER-TMC-100ML',
    tags: ['la mer', 'luxury skincare', 'anti-aging', 'miracle broth', 'mỹ'],
    featured: true,
    trending: false,
    rating: {
      average: 4.8,
      count: 167
    },
    sourceUrl: 'https://www.lamer.com/moisturizing-cream',
    sourceSite: 'La Mer US',
    createdAt: new Date('2024-01-19'),
    updatedAt: new Date('2024-01-22'),
    publishedAt: new Date('2024-01-19')
  },

  // FITNESS EQUIPMENT - Preorder
  {
    id: '25',
    name: 'Peloton Bike+ Home Fitness',
    slug: 'peloton-bike-plus-home-fitness',
    description: 'Xe đạp thể thao tại nhà Peloton Bike+ với màn hình HD xoay 360°, kết nối Apple GymKit, auto-follow resistance và hàng nghìn lớp học trực tuyến.',
    shortDescription: 'Xe đạp Peloton Bike+ với màn hình HD',
    originalPrice: 2495,
    sellingPrice: 65000000,
    currency: 'VND',
    status: 'preorder',
    type: 'pre_order',
    origin: 'usa',
    category: getCategoryById('sports-gear')!,
    brand: {
      id: 'peloton',
      name: 'Peloton',
      logo: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=100&h=100&fit=crop',
      country: 'usa' as ProductOrigin,
      verified: true
    },
    preorderInfo: {
      id: 'preorder-25',
      expectedArrival: new Date('2024-05-15'),
      minPreorderQuantity: 5,
      currentPreorderCount: 3,
      depositPercent: 60,
      estimatedPrice: {
        min: 63000000,
        max: 67000000
      },
      isGroupBuy: true,
      groupBuyThreshold: 5
    },
    images: [
      {
        id: '25-1',
        url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=800&fit=crop',
        alt: 'Peloton Bike+ Home Setup',
        isPrimary: true,
        order: 1
      },
      {
        id: '25-2',
        url: 'https://images.unsplash.com/photo-1567013127542-490d757e51cd?w=800&h=800&fit=crop',
        alt: 'Peloton Bike+ Screen Detail',
        isPrimary: false,
        order: 2
      }
    ],
    variants: [
      {
        id: 'var-25-1',
        name: 'Gói dịch vụ',
        type: 'package',
        required: true,
        options: [
          { id: 'package-basic', value: 'basic', label: 'Bike Only', stock: 3, priceAdjustment: 0 },
          { id: 'package-premium', value: 'premium', label: 'Bike + 12 tháng All-Access', stock: 2, priceAdjustment: 4500000 }
        ]
      }
    ],
    specifications: [
      { label: 'Màn hình', value: '23.8" HD touchscreen xoay 360°' },
      { label: 'Âm thanh', value: '2.2 channel front-facing soundbar' },
      { label: 'Kết nối', value: 'Wi-Fi, Bluetooth, Apple GymKit' },
      { label: 'Trở lực', value: 'Auto-follow resistance technology' },
      { label: 'Kích thước', value: '135 x 61 x 162 cm' },
      { label: 'Trọng lượng', value: '63.5 kg' },
      { label: 'Chịu tải', value: 'Tối đa 135 kg' },
      { label: 'Phụ kiện', value: '3lb hand weights, water bottle holder, device holder' },
      { label: 'Bảo hành', value: '12 tháng parts & labor, 60 tháng frame' }
    ],
    reviews: [
      {
        id: 'rev-25-1',
        userId: 'user32',
        userName: 'Fitness Enthusiast',
        rating: 5,
        title: 'Game changer cho home gym!',
        content: 'Chất lượng build rất cao, màn hình sắc nét. Các lớp học online rất đa dạng và motivating. Đáng để đầu tư!',
        date: new Date('2024-01-21'),
        verified: true,
        helpful: 234
      }
    ],
    stock: 0,
    sku: 'PELOTON-BIKEPLUS-001',
    tags: ['peloton', 'xe đạp thể dục', 'home fitness', 'preorder', 'mỹ'],
    featured: true,
    trending: true,
    rating: {
      average: 4.9,
      count: 1234
    },
    sourceUrl: 'https://www.onepeloton.com/bike-plus',
    sourceSite: 'Peloton US',
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-22'),
    publishedAt: new Date('2024-01-20')
  },

  // ELECTRONICS - Gaming Console
  {
    id: '26',
    name: 'Sony PlayStation 5 Slim Digital Edition',
    slug: 'sony-playstation-5-slim-digital',
    description: 'PlayStation 5 Slim Digital Edition với thiết kế nhỏ gọn hơn 30%, SSD tùy chỉnh, DualSense controller với haptic feedback và 3D audio.',
    shortDescription: 'PlayStation 5 Slim Digital Edition',
    originalPrice: 399,
    sellingPrice: 12800000,
    compareAtPrice: 14500000,
    currency: 'VND',
    status: 'available',
    type: 'ready_stock',
    origin: 'japan',
    category: getCategoryById('gaming')!,
    brand: brands[1], // Sony
    images: [
      {
        id: '26-1',
        url: 'https://images.unsplash.com/photo-1607853202273-797f1c22a38e?w=800&h=800&fit=crop',
        alt: 'PlayStation 5 Slim Digital',
        isPrimary: true,
        order: 1
      },
      {
        id: '26-2',
        url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=800&fit=crop',
        alt: 'PS5 with DualSense controller',
        isPrimary: false,
        order: 2
      }
    ],
    variants: [
      {
        id: 'var-26-1',
        name: 'Gói bán',
        type: 'bundle',
        required: true,
        options: [
          { id: 'bundle-console', value: 'console', label: 'Console Only', stock: 15, priceAdjustment: 0 },
          { id: 'bundle-game', value: 'game', label: 'Console + Spider-Man 2', stock: 8, priceAdjustment: 1800000 },
          { id: 'bundle-premium', value: 'premium', label: 'Console + 2 Games + Extra Controller', stock: 5, priceAdjustment: 4500000 }
        ]
      }
    ],
    specifications: [
      { label: 'CPU', value: 'AMD Zen 2, 8 cores @ 3.5GHz' },
      { label: 'GPU', value: 'AMD RDNA 2, 10.28 TFLOPs' },
      { label: 'RAM', value: '16GB GDDR6' },
      { label: 'Storage', value: '1TB custom NVMe SSD' },
      { label: 'Optical Drive', value: 'None (Digital Only)' },
      { label: 'Resolution', value: '4K @ 120Hz, 8K support' },
      { label: 'Audio', value: 'Tempest 3D AudioTech' },
      { label: 'Controller', value: 'DualSense với haptic feedback' }
    ],
    reviews: [
      {
        id: 'rev-26-1',
        userId: 'user33',
        userName: 'Gamer Pro',
        rating: 5,
        title: 'PS5 Slim tuyệt vời!',
        content: 'Nhỏ gọn hơn bản gốc nhưng hiệu năng không thay đổi. Loading game cực nhanh, DualSense controller rất immersive.',
        date: new Date('2024-01-23'),
        verified: true,
        helpful: 456
      },
      {
        id: 'rev-26-2',
        userId: 'user34',
        userName: 'Console Collector',
        rating: 4,
        title: 'Digital version tiện lợi',
        content: 'Không cần đĩa game rất tiện. PSN Store có nhiều deal tốt. Chỉ tiếc không thể chơi game PS4 cũ dạng đĩa.',
        date: new Date('2024-01-21'),
        verified: true,
        helpful: 189
      }
    ],
    stock: 28,
    sku: 'SONY-PS5SLIM-DE',
    tags: ['sony', 'playstation 5', 'gaming', 'console', 'nhật bản'],
    featured: true,
    trending: true,
    rating: {
      average: 4.8,
      count: 1890
    },
    sourceUrl: 'https://www.playstation.com/ps5/',
    sourceSite: 'Sony Japan',
    createdAt: new Date('2024-01-22'),
    updatedAt: new Date('2024-01-23'),
    publishedAt: new Date('2024-01-22')
  },

  // HOME LIVING - Robot Vacuum
  {
    id: '27',
    name: 'iRobot Roomba j7+ Self-Emptying',
    slug: 'irobot-roomba-j7-plus-self-emptying',
    description: 'Robot hút bụi iRobot Roomba j7+ với AI nhận diện vật cản, tự động làm rỗng thùng rác trong 60 ngày và điều khiển thông minh qua app.',
    shortDescription: 'Robot hút bụi iRobot Roomba j7+ AI',
    originalPrice: 849,
    sellingPrice: 22500000,
    compareAtPrice: 26000000,
    currency: 'VND',
    status: 'available',
    type: 'ready_stock',
    origin: 'usa',
    category: getCategoryById('furniture')!,
    brand: {
      id: 'irobot',
      name: 'iRobot',
      logo: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=100&h=100&fit=crop',
      country: 'usa' as ProductOrigin,
      verified: true
    },
    images: [
      {
        id: '27-1',
        url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop',
        alt: 'iRobot Roomba j7+ with Clean Base',
        isPrimary: true,
        order: 1
      },
      {
        id: '27-2',
        url: 'https://images.unsplash.com/photo-1518825371320-2ef5b0f2a992?w=800&h=800&fit=crop',
        alt: 'Roomba j7+ cleaning carpet',
        isPrimary: false,
        order: 2
      }
    ],
    specifications: [
      { label: 'Hệ thống lọc', value: '3-Stage Cleaning System với Edge-Sweeping Brush' },
      { label: 'AI Recognition', value: 'PrecisionVision Navigation + Object Detection' },
      { label: 'Auto-Empty', value: 'Clean Base tự động trong 60 ngày' },
      { label: 'Pin', value: '75 phút, tự động sạc và tiếp tục' },
      { label: 'Điều khiển', value: 'iRobot HOME App, Alexa, Google Assistant' },
      { label: 'Lập trình', value: 'Smart Mapping với tên phòng tùy chỉnh' },
      { label: 'Chống rơi', value: 'Cliff Detect sensors' },
      { label: 'Bảo hành', value: '1 năm chính hãng + hỗ trợ kỹ thuật' }
    ],
    reviews: [
      {
        id: 'rev-27-1',
        userId: 'user35',
        userName: 'Smart Home User',
        rating: 5,
        title: 'AI thông minh, tránh vật cản cực tốt!',
        content: 'Không bao giờ bị kẹt hay húp phân thú cưng như robot cũ. Tự empty rất tiện, 2 tháng mới cần thay túi.',
        date: new Date('2024-01-22'),
        verified: true,
        helpful: 167
      },
      {
        id: 'rev-27-2',
        userId: 'user36',
        userName: 'Pet Owner',
        rating: 4,
        title: 'Tuyệt vời cho nhà có thú cưng',
        content: 'Hút lông chó mèo rất sạch. AI nhận diện giày dép, đồ chơi và tránh chính xác. Giá hơi cao nhưng xứng đáng.',
        date: new Date('2024-01-20'),
        verified: true,
        helpful: 89
      }
    ],
    stock: 18,
    sku: 'IROBOT-J7PLUS-001',
    tags: ['irobot', 'robot hút bụi', 'ai', 'self-emptying', 'mỹ'],
    featured: true,
    trending: false,
    rating: {
      average: 4.7,
      count: 345
    },
    sourceUrl: 'https://www.irobot.com/roomba/j-series',
    sourceSite: 'iRobot US',
    createdAt: new Date('2024-01-18'),
    updatedAt: new Date('2024-01-22'),
    publishedAt: new Date('2024-01-18')
  }
,

  // EXPANDED PRODUCT DATABASE - FASHION & BEAUTY
  {
    id: '28',
    name: 'Uniqlo Heattech Ultra Warm Crew Neck Long Sleeve T-Shirt',
    slug: 'uniqlo-heattech-ultra-warm-tshirt',
    description: 'Áo thun dài tay Heattech Ultra Warm của Uniqlo với công nghệ sợi nhiệt độc quyền, giữ ấm gấp 2.25 lần so với Heattech thường. Chất liệu mềm mại, co giãn và có tính năng kháng khuẩn, khử mùi.',
    shortDescription: 'Áo thun nhiệt Uniqlo với công nghệ Heattech Ultra Warm',
    originalPrice: 29.90,
    sellingPrice: 790000,
    compareAtPrice: 890000,
    currency: 'VND',
    status: 'available',
    type: 'ready_stock',
    origin: 'japan',
    category: getCategoryById('bags-accessories')!,
    brand: { id: 'uniqlo', name: 'Uniqlo', country: 'japan' as ProductOrigin, verified: true },
    images: [
      {
        id: '28-1',
        url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=800&fit=crop',
        alt: 'Uniqlo Heattech Ultra Warm T-Shirt',
        isPrimary: true,
        order: 1
      },
      {
        id: '28-2',
        url: 'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=800&h=800&fit=crop',
        alt: 'Heattech fabric detail',
        isPrimary: false,
        order: 2
      }
    ],
    variants: [
      {
        id: 'var-28-1',
        name: 'Size',
        type: 'size',
        required: true,
        options: [
          { id: 'size-xs', value: 'XS', label: 'XS', stock: 8, priceAdjustment: 0 },
          { id: 'size-s', value: 'S', label: 'S', stock: 12, priceAdjustment: 0 },
          { id: 'size-m', value: 'M', label: 'M', stock: 15, priceAdjustment: 0 },
          { id: 'size-l', value: 'L', label: 'L', stock: 10, priceAdjustment: 0 },
          { id: 'size-xl', value: 'XL', label: 'XL', stock: 6, priceAdjustment: 0 }
        ]
      },
      {
        id: 'var-28-2',
        name: 'Màu sắc',
        type: 'color',
        required: true,
        options: [
          { id: 'color-black', value: 'black', label: 'Đen', stock: 25, priceAdjustment: 0 },
          { id: 'color-white', value: 'white', label: 'Trắng', stock: 20, priceAdjustment: 0 },
          { id: 'color-gray', value: 'gray', label: 'Xám', stock: 18, priceAdjustment: 0 },
          { id: 'color-navy', value: 'navy', label: 'Xanh navy', stock: 15, priceAdjustment: 0 }
        ]
      }
    ],
    specifications: [
      { label: 'Chất liệu', value: '38% Acrylic, 32% Polyester, 20% Rayon, 10% Spandex' },
      { label: 'Công nghệ', value: 'Heattech Ultra Warm - Giữ ấm gấp 2.25 lần' },
      { label: 'Tính năng', value: 'Kháng khuẩn, khử mùi, thấm hút ẩm' },
      { label: 'Kiểu dáng', value: 'Slim fit, cổ tròn' },
      { label: 'Hướng dẫn giặt', value: 'Giặt máy nước lạnh, không tẩy trắng' }
    ],
    reviews: [
      {
        id: 'rev-28-1',
        userId: 'user28',
        userName: 'Mai Linh',
        rating: 5,
        title: 'Ấm và thoải mái!',
        content: 'Áo rất ấm, mặc trong mùa đông Hà Nội hoàn toàn ok. Chất liệu mềm mại và không bí.',
        date: new Date('2024-01-10'),
        verified: true,
        helpful: 15
      }
    ],
    stock: 51,
    sku: 'UNIQLO-HEATTECH-ULTRA',
    tags: ['uniqlo', 'heattech', 'áo thun', 'nhật bản', 'mùa đông'],
    featured: true,
    trending: false,
    rating: { average: 4.7, count: 89 },
    sourceUrl: 'https://www.uniqlo.com/jp/',
    sourceSite: 'Uniqlo Japan',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-20'),
    publishedAt: new Date('2024-01-10')
  },

  {
    id: '29',
    name: 'Innisfree Green Tea Seed Serum',
    slug: 'innisfree-green-tea-seed-serum',
    description: 'Tinh chất dưỡng ẩm từ hạt trà xanh Jeju của Innisfree, cung cấp độ ẩm sâu và bảo vệ da khỏi tác hại môi trường. Công thức nhẹ, thấm nhanh, phù hợp cho mọi loại da.',
    shortDescription: 'Tinh chất dưỡng ẩm từ hạt trà xanh Jeju',
    originalPrice: 25.00,
    sellingPrice: 650000,
    compareAtPrice: 750000,
    currency: 'VND',
    status: 'available',
    type: 'ready_stock',
    origin: 'korea',
    category: getCategoryById('clothing')!,
    brand: { id: 'innisfree', name: 'Innisfree', country: 'korea' as ProductOrigin, verified: true },
    images: [
      {
        id: '29-1',
        url: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&h=800&fit=crop',
        alt: 'Innisfree Green Tea Seed Serum',
        isPrimary: true,
        order: 1
      },
      {
        id: '29-2',
        url: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=800&h=800&fit=crop',
        alt: 'Green tea ingredients',
        isPrimary: false,
        order: 2
      }
    ],
    variants: [
      {
        id: 'var-29-1',
        name: 'Dung tích',
        type: 'size',
        required: true,
        options: [
          { id: 'size-80ml', value: '80ml', label: '80ml', stock: 20, priceAdjustment: 0 },
          { id: 'size-160ml', value: '160ml', label: '160ml (Value Size)', stock: 12, priceAdjustment: 300000 }
        ]
      }
    ],
    specifications: [
      { label: 'Dung tích', value: '80ml / 160ml' },
      { label: 'Thành phần chính', value: 'Green Tea Seed Oil, Hyaluronic Acid' },
      { label: 'Công dụng', value: 'Dưỡng ẩm, làm dịu da, chống oxy hóa' },
      { label: 'Loại da', value: 'Mọi loại da, đặc biệt da khô và nhạy cảm' },
      { label: 'Xuất xứ', value: 'Hàn Quốc' }
    ],
    reviews: [
      {
        id: 'rev-29-1',
        userId: 'user29',
        userName: 'Ngọc Anh',
        rating: 5,
        title: 'Serum tuyệt vời!',
        content: 'Da mình khô và nhạy cảm, dùng serum này 2 tuần thấy da ẩm mướt hơn hẳn. Không gây kích ứng.',
        date: new Date('2024-01-15'),
        verified: true,
        helpful: 23
      }
    ],
    stock: 32,
    sku: 'INNISFREE-GTS-SERUM',
    tags: ['innisfree', 'serum', 'trà xanh', 'hàn quốc', 'dưỡng ẩm'],
    featured: true,
    trending: true,
    rating: { average: 4.6, count: 245 },
    sourceUrl: 'https://www.innisfree.com/',
    sourceSite: 'Innisfree Korea',
    createdAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-01-20'),
    publishedAt: new Date('2024-01-12')
  },

  // ELECTRONICS EXPANSION
  {
    id: '30',
    name: 'iPad Air 5th Generation',
    slug: 'ipad-air-5th-generation',
    description: 'iPad Air thế hệ thứ 5 với chip M1 mạnh mẽ, màn hình Liquid Retina 10.9 inch, hỗ trợ Apple Pencil thế hệ 2 và Magic Keyboard. Hiệu suất vượt trội cho công việc, học tập và giải trí.',
    shortDescription: 'iPad Air với chip M1, màn hình 10.9 inch',
    originalPrice: 599.00,
    sellingPrice: 16500000,
    compareAtPrice: 18000000,
    currency: 'VND',
    status: 'available',
    type: 'ready_stock',
    origin: 'usa',
    category: getCategoryById('cameras-photography')!,
    brand: { id: 'apple', name: 'Apple', country: 'usa' as ProductOrigin, verified: true },
    images: [
      {
        id: '30-1',
        url: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&h=800&fit=crop',
        alt: 'iPad Air 5th Generation',
        isPrimary: true,
        order: 1
      },
      {
        id: '30-2',
        url: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=800&h=800&fit=crop',
        alt: 'iPad with Apple Pencil',
        isPrimary: false,
        order: 2
      }
    ],
    variants: [
      {
        id: 'var-30-1',
        name: 'Dung lượng',
        type: 'storage',
        required: true,
        options: [
          { id: 'storage-64gb', value: '64GB', label: '64GB', stock: 8, priceAdjustment: 0 },
          { id: 'storage-256gb', value: '256GB', label: '256GB', stock: 12, priceAdjustment: 3000000 }
        ]
      },
      {
        id: 'var-30-2',
        name: 'Màu sắc',
        type: 'color',
        required: true,
        options: [
          { id: 'color-space-gray', value: 'space-gray', label: 'Space Gray', stock: 15, priceAdjustment: 0 },
          { id: 'color-starlight', value: 'starlight', label: 'Starlight', stock: 12, priceAdjustment: 0 },
          { id: 'color-pink', value: 'pink', label: 'Pink', stock: 8, priceAdjustment: 0 },
          { id: 'color-purple', value: 'purple', label: 'Purple', stock: 5, priceAdjustment: 0 },
          { id: 'color-blue', value: 'blue', label: 'Blue', stock: 10, priceAdjustment: 0 }
        ]
      }
    ],
    specifications: [
      { label: 'Chip', value: 'Apple M1 with 8-core CPU' },
      { label: 'Màn hình', value: '10.9-inch Liquid Retina display' },
      { label: 'Camera sau', value: '12MP Wide camera' },
      { label: 'Camera trước', value: '12MP Ultra Wide front camera' },
      { label: 'Kết nối', value: 'Wi-Fi 6, Bluetooth 5.0, USB-C' },
      { label: 'Hệ điều hành', value: 'iPadOS' }
    ],
    reviews: [
      {
        id: 'rev-30-1',
        userId: 'user30',
        userName: 'Minh Quân',
        rating: 5,
        title: 'Hiệu suất tuyệt vời!',
        content: 'iPad Air M1 chạy mọi ứng dụng rất mượt mà, rất phù hợp cho thiết kế và học tập. Pin trâu, màn hình đẹp.',
        date: new Date('2024-01-18'),
        verified: true,
        helpful: 28
      }
    ],
    stock: 20,
    sku: 'APPLE-IPAD-AIR-5',
    tags: ['apple', 'ipad', 'tablet', 'mỹ', 'm1'],
    featured: true,
    trending: true,
    rating: { average: 4.8, count: 342 },
    sourceUrl: 'https://www.apple.com/ipad-air/',
    sourceSite: 'Apple Store US',
    createdAt: new Date('2024-01-16'),
    updatedAt: new Date('2024-01-20'),
    publishedAt: new Date('2024-01-16')
  },

  // HOME & LIVING PRODUCTS
  {
    id: '31',
    name: 'Dyson V15 Detect Absolute',
    slug: 'dyson-v15-detect-absolute',
    description: 'Máy hút bụi không dây Dyson V15 Detect Absolute với công nghệ laser phát hiện bụi vi mô, cảm biến piezo đếm số lượng hạt bụi, thời gian sử dụng lên đến 60 phút. Bộ phụ kiện đầy đủ cho mọi bề mặt.',
    shortDescription: 'Máy hút bụi không dây với công nghệ laser phát hiện bụi',
    originalPrice: 749.99,
    sellingPrice: 19500000,
    compareAtPrice: 21000000,
    currency: 'VND',
    status: 'available',
    type: 'ready_stock',
    origin: 'europe',
    category: getCategoryById('garden-outdoor')!,
    brand: { id: 'dyson', name: 'Dyson', country: 'europe' as ProductOrigin, verified: true },
    images: [
      {
        id: '31-1',
        url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop',
        alt: 'Dyson V15 Detect',
        isPrimary: true,
        order: 1
      },
      {
        id: '31-2',
        url: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&h=800&fit=crop',
        alt: 'Dyson attachments',
        isPrimary: false,
        order: 2
      }
    ],
    variants: [
      {
        id: 'var-31-1',
        name: 'Màu sắc',
        type: 'color',
        required: true,
        options: [
          { id: 'color-nickel-red', value: 'nickel-red', label: 'Nickel/Red', stock: 15, priceAdjustment: 0 },
          { id: 'color-yellow-nickel', value: 'yellow-nickel', label: 'Yellow/Nickel', stock: 10, priceAdjustment: 0 }
        ]
      }
    ],
    specifications: [
      { label: 'Motor', value: 'Dyson Hyperdymium motor 125,000rpm' },
      { label: 'Thời gian sử dụng', value: 'Lên đến 60 phút' },
      { label: 'Dung tích bình chứa', value: '0.77 lít' },
      { label: 'Trọng lượng', value: '3.05kg' },
      { label: 'Công nghệ', value: 'Laser detection, Piezo sensor' },
      { label: 'Bộ phụ kiện', value: '8 công cụ chuyên dụng' }
    ],
    reviews: [
      {
        id: 'rev-31-1',
        userId: 'user31',
        userName: 'Hương Giang',
        rating: 5,
        title: 'Hút bụi cực sạch!',
        content: 'Máy hút rất mạnh, laser giúp thấy được bụi nhỏ li ti. Pin trâu, hút được cả nhà mà vẫn còn pin.',
        date: new Date('2024-01-14'),
        verified: true,
        helpful: 19
      }
    ],
    stock: 8,
    sku: 'DYSON-V15-DETECT',
    tags: ['dyson', 'máy hút bụi', 'không dây', 'châu âu'],
    featured: true,
    trending: false,
    rating: { average: 4.7, count: 156 },
    sourceUrl: 'https://www.dyson.com/',
    sourceSite: 'Dyson Official',
    createdAt: new Date('2024-01-08'),
    updatedAt: new Date('2024-01-20'),
    publishedAt: new Date('2024-01-08')
  },

  // HEALTH & FITNESS EXPANSION
  {
    id: '32',
    name: 'Whey Protein Gold Standard 100% Isolate',
    slug: 'whey-protein-gold-standard-isolate',
    description: 'Whey protein isolate cao cấp từ Optimum Nutrition với 25g protein per serving, tỷ lệ hấp thụ nhanh, hỗ trợ tăng cơ và phục hồi sau tập luyện. Được kiểm định chất lượng nghiêm ngặt.',
    shortDescription: 'Whey protein isolate cao cấp 25g protein/serving',
    originalPrice: 89.99,
    sellingPrice: 2350000,
    compareAtPrice: 2600000,
    currency: 'VND',
    status: 'available',
    type: 'ready_stock',
    origin: 'usa',
    category: getCategoryById('supplements')!,
    brand: { id: 'optimum', name: 'Optimum Nutrition', country: 'usa' as ProductOrigin, verified: true },
    images: [
      {
        id: '32-1',
        url: 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=800&h=800&fit=crop',
        alt: 'Whey Protein Gold Standard',
        isPrimary: true,
        order: 1
      }
    ],
    variants: [
      {
        id: 'var-32-1',
        name: 'Hương vị',
        type: 'flavor',
        required: true,
        options: [
          { id: 'flavor-vanilla', value: 'vanilla', label: 'Vanilla', stock: 20, priceAdjustment: 0 },
          { id: 'flavor-chocolate', value: 'chocolate', label: 'Chocolate', stock: 25, priceAdjustment: 0 },
          { id: 'flavor-strawberry', value: 'strawberry', label: 'Strawberry', stock: 15, priceAdjustment: 0 },
          { id: 'flavor-cookies-cream', value: 'cookies-cream', label: 'Cookies & Cream', stock: 18, priceAdjustment: 0 }
        ]
      },
      {
        id: 'var-32-2',
        name: 'Dung lượng',
        type: 'size',
        required: true,
        options: [
          { id: 'size-1.6lb', value: '1.6lb', label: '1.6 lbs (744g)', stock: 30, priceAdjustment: 0 },
          { id: 'size-3.36lb', value: '3.36lb', label: '3.36 lbs (1.52kg)', stock: 20, priceAdjustment: 1200000 },
          { id: 'size-5lb', value: '5lb', label: '5 lbs (2.27kg)', stock: 15, priceAdjustment: 2000000 }
        ]
      }
    ],
    specifications: [
      { label: 'Protein per serving', value: '25g' },
      { label: 'Serving size', value: '30.4g (1 scoop)' },
      { label: 'Servings per container', value: '24 (1.6lbs)' },
      { label: 'Loại protein', value: '100% Whey Protein Isolate' },
      { label: 'Carbs', value: '<1g per serving' },
      { label: 'Fat', value: '0g per serving' }
    ],
    reviews: [
      {
        id: 'rev-32-1',
        userId: 'user32',
        userName: 'Đức Anh',
        rating: 5,
        title: 'Protein tuyệt vời!',
        content: 'Tan nhanh, không tanh, hỗ trợ tăng cơ rất tốt. Dùng được 6 tháng rồi, hiệu quả rõ rệt.',
        date: new Date('2024-01-12'),
        verified: true,
        helpful: 33
      }
    ],
    stock: 78,
    sku: 'ON-WHEY-GOLD-ISO',
    tags: ['whey protein', 'tăng cơ', 'thể thao', 'mỹ', 'dinh dưỡng'],
    featured: false,
    trending: true,
    rating: { average: 4.6, count: 289 },
    sourceUrl: 'https://optimumnutrition.com/',
    sourceSite: 'Optimum Nutrition',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-20'),
    publishedAt: new Date('2024-01-10')
  },

  // ADDITIONAL PRODUCTS FOR COMPREHENSIVE DATABASE
  {
    id: '33',
    name: 'Nintendo Switch OLED Model',
    slug: 'nintendo-switch-oled',
    description: 'Nintendo Switch OLED với màn hình OLED 7 inch, âm thanh được cải thiện, 64GB bộ nhớ trong, dock có cổng LAN. Chơi game ở nhà và mang đi được với chất lượng hình ảnh tuyệt vời.',
    shortDescription: 'Máy chơi game Nintendo Switch với màn hình OLED 7 inch',
    originalPrice: 349.99,
    sellingPrice: 9200000,
    compareAtPrice: 9800000,
    currency: 'VND',
    status: 'available',
    type: 'ready_stock',
    origin: 'japan',
    category: getCategoryById('smartphones-tablets')!,
    brand: { id: 'nintendo', name: 'Nintendo', country: 'japan' as ProductOrigin, verified: true },
    images: [
      {
        id: '33-1',
        url: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=800&h=800&fit=crop',
        alt: 'Nintendo Switch OLED',
        isPrimary: true,
        order: 1
      }
    ],
    variants: [
      {
        id: 'var-33-1',
        name: 'Màu sắc',
        type: 'color',
        required: true,
        options: [
          { id: 'color-neon', value: 'neon', label: 'Neon Blue/Red', stock: 15, priceAdjustment: 0 },
          { id: 'color-white', value: 'white', label: 'White', stock: 12, priceAdjustment: 0 }
        ]
      }
    ],
    specifications: [
      { label: 'Màn hình', value: '7-inch OLED screen' },
      { label: 'Độ phân giải', value: '1280 x 720 (Handheld)' },
      { label: 'Bộ nhớ trong', value: '64GB' },
      { label: 'Pin', value: '4.5 - 9 hours' },
      { label: 'Wi-Fi', value: 'IEEE 802.11 a/b/g/n/ac' }
    ],
    reviews: [
      {
        id: 'rev-33-1',
        userId: 'user33',
        userName: 'Hoàng Nam',
        rating: 5,
        title: 'Màn hình OLED đẹp tuyệt!',
        content: 'Chơi Zelda trên màn hình OLED này thật sự ấn tượng. Màu sắc sống động, pin cũng tốt hơn.',
        date: new Date('2024-01-17'),
        verified: true,
        helpful: 25
      }
    ],
    stock: 27,
    sku: 'NINTENDO-SWITCH-OLED',
    tags: ['nintendo', 'switch', 'gaming', 'oled', 'nhật bản'],
    featured: true,
    trending: true,
    rating: { average: 4.8, count: 445 },
    sourceUrl: 'https://www.nintendo.com/',
    sourceSite: 'Nintendo Japan',
    createdAt: new Date('2024-01-13'),
    updatedAt: new Date('2024-01-20'),
    publishedAt: new Date('2024-01-13')
  },

  {
    id: '34',
    name: 'Laneige Water Sleeping Mask',
    slug: 'laneige-water-sleeping-mask',
    description: 'Mặt nạ ngủ dưỡng ẩm Laneige với công nghệ Sleep-tox™ và Moisture Wrap™, cung cấp độ ẩm suốt đêm, giúp da mềm mại và rạng rỡ vào buổi sáng.',
    shortDescription: 'Mặt nạ ngủ dưỡng ẩm với công nghệ Sleep-tox™',
    originalPrice: 34.00,
    sellingPrice: 850000,
    compareAtPrice: 950000,
    currency: 'VND',
    status: 'available',
    type: 'ready_stock',
    origin: 'korea',
    category: getCategoryById('cosmetics-skincare')!,
    brand: { id: 'laneige', name: 'Laneige', country: 'korea' as ProductOrigin, verified: true },
    images: [
      {
        id: '34-1',
        url: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&h=800&fit=crop',
        alt: 'Laneige Water Sleeping Mask',
        isPrimary: true,
        order: 1
      }
    ],
    variants: [
      {
        id: 'var-34-1',
        name: 'Dung tích',
        type: 'size',
        required: true,
        options: [
          { id: 'size-70ml', value: '70ml', label: '70ml', stock: 25, priceAdjustment: 0 },
          { id: 'size-15ml', value: '15ml', label: '15ml (Travel Size)', stock: 40, priceAdjustment: -400000 }
        ]
      }
    ],
    specifications: [
      { label: 'Dung tích', value: '70ml / 15ml' },
      { label: 'Công nghệ', value: 'Sleep-tox™, Moisture Wrap™' },
      { label: 'Thành phần chính', value: 'Hydro Ionized Mineral Water' },
      { label: 'Công dụng', value: 'Dưỡng ẩm, phục hồi da qua đêm' },
      { label: 'Xuất xứ', value: 'Hàn Quốc' }
    ],
    reviews: [
      {
        id: 'rev-34-1',
        userId: 'user34',
        userName: 'Thùy Linh',
        rating: 5,
        title: 'Da mềm mịn sau một đêm!',
        content: 'Dùng mặt nạ này buổi tối, sáng dậy da mềm mịn và ẩm mượt hẳn. Không nhờn, thấm nhanh.',
        date: new Date('2024-01-16'),
        verified: true,
        helpful: 31
      }
    ],
    stock: 65,
    sku: 'LANEIGE-WSM-70ML',
    tags: ['laneige', 'mặt nạ ngủ', 'dưỡng ẩm', 'hàn quốc', 'skincare'],
    featured: false,
    trending: true,
    rating: { average: 4.7, count: 523 },
    sourceUrl: 'https://www.laneige.com/',
    sourceSite: 'Laneige Korea',
    createdAt: new Date('2024-01-11'),
    updatedAt: new Date('2024-01-20'),
    publishedAt: new Date('2024-01-11')
  },

  {
    id: '35',
    name: 'Instant Pot Duo 7-in-1',
    slug: 'instant-pot-duo-7in1',
    description: 'Nồi áp suất điện đa năng Instant Pot Duo với 7 chức năng: nồi áp suất, nồi cơm điện, chảo xào, nồi hầm, máy làm yaourt, máy hâm nóng và máy hấp. Tiết kiệm thời gian nấu nướng.',
    shortDescription: 'Nồi áp suất điện đa năng 7-trong-1',
    originalPrice: 99.95,
    sellingPrice: 2650000,
    compareAtPrice: 2950000,
    currency: 'VND',
    status: 'available',
    type: 'ready_stock',
    origin: 'usa',
    category: getCategoryById('home-decor')!,
    brand: { id: 'instantpot', name: 'Instant Pot', country: 'usa' as ProductOrigin, verified: true },
    images: [
      {
        id: '35-1',
        url: 'https://images.unsplash.com/photo-1585515656019-1f0c5c3df2cd?w=800&h=800&fit=crop',
        alt: 'Instant Pot Duo 7-in-1',
        isPrimary: true,
        order: 1
      }
    ],
    variants: [
      {
        id: 'var-35-1',
        name: 'Dung tích',
        type: 'size',
        required: true,
        options: [
          { id: 'size-3qt', value: '3qt', label: '3 Quart (2.8L)', stock: 8, priceAdjustment: -500000 },
          { id: 'size-6qt', value: '6qt', label: '6 Quart (5.7L)', stock: 15, priceAdjustment: 0 },
          { id: 'size-8qt', value: '8qt', label: '8 Quart (7.6L)', stock: 10, priceAdjustment: 700000 }
        ]
      }
    ],
    specifications: [
      { label: 'Chức năng', value: '7-in-1: Pressure Cooker, Rice Cooker, Slow Cooker, Steamer, Sauté, Yogurt Maker, Warmer' },
      { label: 'Dung tích', value: '3Qt / 6Qt / 8Qt' },
      { label: 'Chất liệu nồi', value: 'Stainless steel 3-ply bottom' },
      { label: 'Áp suất', value: '10.15~11.6 psi' },
      { label: 'Công suất', value: '1000W (6Qt)' }
    ],
    reviews: [
      {
        id: 'rev-35-1',
        userId: 'user35',
        userName: 'Minh Hải',
        rating: 5,
        title: 'Nấu ăn nhanh và tiện!',
        content: 'Nồi này giúp nấu cơm, nấu canh siêu nhanh. Đặc biệt làm thịt kho rất mềm. Đáng đồng tiền.',
        date: new Date('2024-01-09'),
        verified: true,
        helpful: 27
      }
    ],
    stock: 33,
    sku: 'INSTANT-POT-DUO-7IN1',
    tags: ['instant pot', 'nồi áp suất', 'đa năng', 'mỹ', 'nhà bếp'],
    featured: true,
    trending: false,
    rating: { average: 4.6, count: 892 },
    sourceUrl: 'https://www.instantpot.com/',
    sourceSite: 'Instant Pot US',
    createdAt: new Date('2024-01-07'),
    updatedAt: new Date('2024-01-20'),
    publishedAt: new Date('2024-01-07')
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
