// Export products from simpleProducts.ts to Shopify CSV format
// Usage: node scripts/export-to-shopify.mjs

import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Products data (copied from simpleProducts.ts)
const products = [
  {
    id: '1',
    name: 'Premium Japanese Sneakers',
    slug: 'premium-japanese-sneakers',
    description: 'High-quality sneakers from Japan with excellent comfort and style. Sneakers Nhật Bản cao cấp, êm ái và thời trang.',
    sellingPrice: 2500000,
    originalPrice: 3000000,
    stock: 15,
    sku: 'SHOES-001',
    category: 'Shoes',
    origin: 'japan',
    status: 'available',
    tags: ['shoes', 'japanese', 'premium', 'sneakers'],
    imageUrl: '/lovable-uploads/078a129e-0f98-4d91-af61-873687db1a04.png'
  },
  {
    id: '2',
    name: 'Korean Beauty Set',
    slug: 'korean-beauty-set',
    description: 'Complete Korean skincare set for glowing skin. Bộ skincare Hàn Quốc đầy đủ cho làn da rạng rỡ.',
    sellingPrice: 1800000,
    originalPrice: 2000000,
    stock: 25,
    sku: 'BEAUTY-001',
    category: 'Beauty',
    origin: 'korea',
    status: 'available',
    tags: ['beauty', 'korean', 'skincare'],
    imageUrl: '/lovable-uploads/11e92b89-ed02-453a-9888-56cd91807f2d.png'
  },
  {
    id: '3',
    name: 'American Tech Gadget',
    slug: 'american-tech-gadget',
    description: 'Latest technology gadget from the USA with premium features. Thiết bị công nghệ từ Mỹ với tính năng cao cấp.',
    sellingPrice: 3500000,
    originalPrice: 4000000,
    stock: 8,
    sku: 'TECH-001',
    category: 'Electronics',
    origin: 'usa',
    status: 'available',
    tags: ['electronics', 'tech', 'gadget', 'usa'],
    imageUrl: '/lovable-uploads/14ea3fe0-19d6-425c-b95b-4117bc41f3ca.png'
  },
  {
    id: '4',
    name: 'European Fashion Watch',
    slug: 'european-fashion-watch',
    description: 'Elegant European watch with sophisticated design. Đồng hồ thời trang châu Âu thiết kế tinh xảo.',
    sellingPrice: 5200000,
    originalPrice: 6000000,
    stock: 12,
    sku: 'WATCH-001',
    category: 'Fashion',
    origin: 'europe',
    status: 'available',
    tags: ['fashion', 'watch', 'luxury', 'europe'],
    imageUrl: '/lovable-uploads/1cd5a3da-7a58-4374-abc1-d7b02b0c5fd5.png'
  },
  {
    id: '5',
    name: 'Japanese Gaming Console',
    slug: 'japanese-gaming-console',
    description: 'Latest gaming console from Japan with exclusive games. Máy chơi game Nhật Bản với hệ game độc quyền.',
    sellingPrice: 8500000,
    originalPrice: 9000000,
    stock: 5,
    sku: 'GAME-001',
    category: 'Gaming',
    origin: 'japan',
    status: 'preorder',
    tags: ['gaming', 'console', 'japanese', 'preorder'],
    imageUrl: '/lovable-uploads/30473baa-85f4-4931-aad9-c722ae7a4918.png'
  },
  {
    id: '6',
    name: 'Korean Home Appliance',
    slug: 'korean-home-appliance',
    description: 'Smart home appliance with advanced Korean technology. Thiết bị gia dụng thông minh công nghệ Hàn Quốc.',
    sellingPrice: 4200000,
    originalPrice: 4800000,
    stock: 18,
    sku: 'HOME-001',
    category: 'Home & Living',
    origin: 'korea',
    status: 'available',
    tags: ['home', 'appliance', 'smart', 'korean'],
    imageUrl: '/lovable-uploads/39605e90-8478-4fee-b1b9-cee41df66f10.png'
  },
  {
    id: '7',
    name: 'USA Premium Headphones',
    slug: 'usa-premium-headphones',
    description: 'High-quality headphones with premium sound from USA. Tai nghe cao cấp từ Mỹ, âm thanh trung thực.',
    sellingPrice: 3200000,
    originalPrice: 3600000,
    stock: 0,
    sku: 'AUDIO-001',
    category: 'Audio',
    origin: 'usa',
    status: 'out_of_stock',
    tags: ['audio', 'headphones', 'premium', 'usa'],
    imageUrl: '/lovable-uploads/39671993-1bb4-4bb6-8819-3ca5c07c0042.png'
  },
  {
    id: '8',
    name: 'European Luxury Bag',
    slug: 'european-luxury-bag',
    description: 'Designer luxury bag from Europe with premium materials. Túi xách cao cấp châu Âu, chất liệu thượng hạng.',
    sellingPrice: 6800000,
    originalPrice: 7500000,
    stock: 7,
    sku: 'BAG-001',
    category: 'Accessories',
    origin: 'europe',
    status: 'available',
    tags: ['accessories', 'bag', 'luxury', 'designer'],
    imageUrl: '/lovable-uploads/3de85ddd-15e1-4216-9697-f91abb9a47ce.png'
  }
];

// Convert VND to USD (rough estimate for Shopify)
const vndToUsd = (vnd) => (vnd / 25000).toFixed(2);

// Generate Shopify CSV
const generateShopifyCSV = () => {
  const headers = [
    'Handle',
    'Title',
    'Body (HTML)',
    'Vendor',
    'Type',
    'Tags',
    'Published',
    'Option1 Name',
    'Option1 Value',
    'Variant SKU',
    'Variant Grams',
    'Variant Inventory Tracker',
    'Variant Inventory Qty',
    'Variant Inventory Policy',
    'Variant Fulfillment Service',
    'Variant Price',
    'Variant Compare At Price',
    'Variant Requires Shipping',
    'Variant Taxable',
    'Image Src',
    'Image Position',
    'Image Alt Text',
    'Status'
  ];

  const rows = products.map(product => {
    const status = product.status === 'out_of_stock' ? 'draft' : 'active';
    
    return [
      product.slug,
      product.name,
      product.description.replace(/\n/g, '<br>'),
      `WRLDS ${product.origin.toUpperCase()}`,
      product.category,
      product.tags.join(', '),
      'TRUE',
      'Title',
      'Default Title',
      product.sku,
      '500', // weight in grams
      'shopify',
      product.stock.toString(),
      'deny',
      'manual',
      vndToUsd(product.sellingPrice),
      product.originalPrice ? vndToUsd(product.originalPrice) : '',
      'TRUE',
      'TRUE',
      product.imageUrl,
      '1',
      `${product.name} - Primary Image`,
      status
    ];
  });

  // Convert to CSV format
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');

  return csvContent;
};

// Save to file
const csv = generateShopifyCSV();
const outputPath = join(__dirname, '..', 'shopify-products-import.csv');
writeFileSync(outputPath, csv, 'utf-8');

console.log('✅ Shopify CSV exported successfully!');
console.log(`📁 File saved to: ${outputPath}`);
console.log('\n📊 Product Summary:');
console.log(`   Total products: ${products.length}`);
console.log(`   Categories: ${[...new Set(products.map(p => p.category))].join(', ')}`);
console.log(`   Origins: ${[...new Set(products.map(p => p.origin))].join(', ')}`);
console.log('\n🚀 Next steps:');
console.log('   1. Sign up at https://partners.shopify.com');
console.log('   2. Create a development store');
console.log('   3. Import this CSV file via Shopify Admin > Products > Import');
console.log('   4. Upload product images to Shopify');
