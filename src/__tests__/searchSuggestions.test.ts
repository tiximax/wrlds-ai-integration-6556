import { describe, it, expect } from 'vitest';
import { generateSearchSuggestions, SEARCH_CONFIG } from '@/utils/advancedSearch';

// Minimal Product shape for this test (cast as any to satisfy function signature)
const makeProduct = (overrides: any = {}) => ({
  id: (globalThis.crypto?.randomUUID?.() ?? Math.random().toString(36).slice(2)),
  name: 'Alpha Product',
  description: 'Alpha description',
  category: { id: 'cat-alpha', name: 'Alpha Category', slug: 'alpha-cat' },
  tags: ['alpha'],
  sellingPrice: 1000,
  stock: 10,
  rating: { average: 4.5, count: 10 },
  images: [{ id: 'img', url: '/placeholder.svg', alt: 'img', isPrimary: true }],
  status: 'available',
  createdAt: new Date(),
  ...overrides,
}) as any;

describe('generateSearchSuggestions', () => {
  it('trả về rỗng khi query ngắn hơn MIN_QUERY_LENGTH', () => {
    const products = [makeProduct()];
    const suggestions = generateSearchSuggestions(products, 'a');
    expect(suggestions).toEqual([]);
  });

  it('không phân biệt hoa/thường và match theo tên sản phẩm, category, và tag', () => {
    const products = [
      makeProduct({ name: 'Korean Beauty Set', category: { id: 'c1', name: 'Beauty', slug: 'beauty' }, tags: ['beauty', 'skin'] }),
      makeProduct({ name: 'premium japanese sneakers', category: { id: 'c2', name: 'Shoes', slug: 'shoes' }, tags: ['shoes', 'sneakers'] }),
    ];

    const q1 = 'BEAUT';
    const s1 = generateSearchSuggestions(products, q1);
    // Có ít nhất 1 gợi ý theo tên sản phẩm hoặc category/tag chứa "beaut"
    expect(s1.length).toBeGreaterThan(0);
    // Tìm thấy suggestion liên quan đến Beauty (product hoặc category hoặc tag)
    const texts = s1.map(s => s.text.toLowerCase());
    expect(texts.some(t => t.includes('beaut'))).toBe(true);

    const q2 = 'jap';
    const s2 = generateSearchSuggestions(products, q2);
    // Gợi ý theo product name chứa "jap"
    expect(s2.some(s => s.text.toLowerCase().includes('japanese'))).toBe(true);
  });

  it('sắp xếp theo count giảm dần và giới hạn số lượng theo MAX_SUGGESTIONS', () => {
    // Tạo 12 sản phẩm, tất cả đều có tag "alpha" để count cho tag này rất cao
    const many = Array.from({ length: 12 }, (_, i) => makeProduct({ name: `Alpha ${i + 1}`, tags: ['alpha', `alpha-${i+1}`] }));
    const suggestions = generateSearchSuggestions(many, 'alpha');

    // Bị cắt theo MAX_SUGGESTIONS
    expect(suggestions.length).toBe(SEARCH_CONFIG.MAX_SUGGESTIONS);

    // Phần tử đầu có count bằng lớn nhất (ít nhất >= 12 do tag/category lặp lại nhiều lần)
    const maxCount = Math.max(...suggestions.map(s => s.count || 0));
    expect(maxCount).toBeGreaterThan(0);
    expect(suggestions[0].count).toBe(maxCount);
  });
});

