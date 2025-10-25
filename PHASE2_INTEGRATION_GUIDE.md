# Phase 2 Part 2: Integration Guide

**Timeline**: October 28 - November 4, 2025  
**Goal**: Integrate skeleton loaders into ProductPage, CartPage, SearchPage, Checkout  
**Status**: 🚀 Ready to Start

---

## 📊 Integration Overview

| Component | File | Skeleton | Hook | Status |
|-----------|------|----------|------|--------|
| **ProductPage** | `src/pages/SimpleProducts.tsx` | ✅ ProductCardSkeleton | ⏳ useLoadingState | Ready |
| **SearchPage** | `src/pages/SearchResults.tsx` | ✅ SearchResultsSkeleton | ⏳ useLoadingState | Ready |
| **ProductDetail** | `src/pages/ProductDetail.tsx` | ⏳ Custom | ⏳ useLoadingState | Ready |
| **CartPage** | N/A (Sidebar) | ✅ CartSummarySkeleton | ⏳ useLoadingState | Ready |
| **Checkout** | N/A (Modal) | ✅ CartSummarySkeleton | ⏳ useLoadingState | Ready |

---

## 🎯 Phase 2 Part 2 Sprint Plan

### Sprint Week 1: Oct 28-31 (Component Integration)

#### Oct 28-29: ProductPage Integration ✅
**File**: `src/pages/SimpleProducts.tsx`  
**What's Already Done**: ProductCardSkeleton already imported (line 13)  
**What Needs Doing**:
1. Add `useLoadingState` hook
2. Replace simulated `isLoading` timeout with real hook
3. Wrap product fetch with hook

**Changes Required**:
```tsx
// Add import
import { useLoadingState } from '@/hooks/useLoadingState';

// In component
const { isLoading, error, load, retry } = useLoadingState({
  timeout: 8000,
  autoRetry: true,
  maxRetries: 3,
});

// Replace setTimeout with real fetch
useEffect(() => {
  load(async () => {
    // Simulate fetch or real API call
    return simpleProducts;
  });
}, [load]);

// Show error state if failed
if (error && paginatedProducts.length === 0) {
  return (
    <div className="text-center py-12">
      <p className="text-red-500">{error.message}</p>
      <button onClick={retry}>Retry</button>
    </div>
  );
}
```

#### Oct 29-30: CartPage & CheckoutIntegration
**Files**: 
- Cart sidebar: `src/components/SimpleCartSidebar.tsx`
- Cart summary: `src/components/cart/CartSummary.tsx`

**Changes Required**:
- Import `CartSummarySkeleton`
- Wrap cart calculation with `useLoadingState`
- Show skeleton while calculating totals

#### Oct 30-31: SearchPage Integration
**File**: `src/pages/SearchResults.tsx`  
**Status**: Already has advanced search, just add skeleton

**Changes Required**:
- Import `SearchResultsSkeleton`
- Add `useLoadingState` for search results
- Show skeleton during search

### Sprint Week 2: Nov 1-3 (Testing & Optimization)

#### Nov 1: Testing
- Responsive behavior (mobile, tablet, desktop)
- Dark mode CSS
- Accessibility (keyboard, screen reader)
- Animation smoothness

#### Nov 2-3: Code Review & Merge
- Create PR
- Code review feedback
- Merge to main

### Sprint Week 3: Nov 4+ (Deployment)

#### Nov 4: Staging Deploy
- Deploy to staging
- UAT testing

#### Nov 4+: Production Deploy
- After UAT sign-off
- Monitor metrics

---

## 💻 Integration Patterns

### Pattern 1: Simple Loading State (ProductPage)

```tsx
import { useLoadingState } from '@/hooks/useLoadingState';
import { ProductCardSkeleton } from '@/components/skeletons';

export const ProductPage = () => {
  const { isLoading, error, load, retry } = useLoadingState({
    timeout: 8000,
    autoRetry: true,
    maxRetries: 3,
  });

  const [products, setProducts] = useState([]);

  useEffect(() => {
    load(async () => {
      // Simulated or real fetch
      const data = simpleProducts; // or await fetch('/api/products')
      setProducts(data);
      return data;
    });
  }, [load]);

  // Show error
  if (error && products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 mb-4">{error.message}</p>
        <button 
          onClick={retry}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  // Show skeleton while loading
  if (isLoading && products.length === 0) {
    return <ProductCardSkeleton count={12} />;
  }

  // Show products
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map(product => (
        <ProductCard key={product.id} {...product} />
      ))}
    </div>
  );
};
```

### Pattern 2: Cart Summary Loading (CartPage)

```tsx
import { useLoadingState } from '@/hooks/useLoadingState';
import { CartSummarySkeleton } from '@/components/skeletons';

export const Cart = ({ items }) => {
  const { isLoading, error, load } = useLoadingState();
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    load(async () => {
      // Calculate summary (could be real API call)
      const subtotal = items.reduce((sum, item) => sum + (item.price * item.qty), 0);
      const data = {
        subtotal,
        tax: subtotal * 0.1,
        shipping: subtotal >= 500000 ? 0 : 30000,
      };
      setSummary(data);
      return data;
    });
  }, [items, load]);

  // Show skeleton while loading
  if (isLoading && !summary) {
    return <CartSummarySkeleton />;
  }

  if (error) return <div>Error loading cart</div>;

  return <CartSummary {...summary} />;
};
```

### Pattern 3: Search Results Loading (SearchPage)

```tsx
import { useLoadingState } from '@/hooks/useLoadingState';
import { SearchResultsSkeleton } from '@/components/skeletons';

export const SearchResults = ({ query }) => {
  const { isLoading, error, load } = useLoadingState();
  const [results, setResults] = useState([]);

  useEffect(() => {
    load(async () => {
      // Search API call
      const data = performSearch(simpleProducts, { query });
      setResults(data);
      return data;
    });
  }, [query, load]);

  if (isLoading && results.length === 0) {
    return <SearchResultsSkeleton productCount={12} showFilters={true} />;
  }

  if (error) return <div>Search failed: {error.message}</div>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {results.map(product => (
        <ProductCard key={product.id} {...product} />
      ))}
    </div>
  );
};
```

---

## 📋 Integration Checklist Per Component

### ✅ SimpleProducts.tsx (ProductPage)

- [ ] Import `useLoadingState` hook
- [ ] Remove simulated timeout loading
- [ ] Wrap product fetch with hook
- [ ] Add error UI with retry button
- [ ] Test responsive on mobile/tablet/desktop
- [ ] Verify dark mode colors
- [ ] Test keyboard navigation
- [ ] Run tests: `npm run test`
- [ ] Commit with message: "feat: Add skeleton loading to ProductPage"

### ✅ SearchResults.tsx (SearchPage)

- [ ] Import `SearchResultsSkeleton` and `useLoadingState`
- [ ] Add loading state for search results
- [ ] Show skeleton during search
- [ ] Maintain existing filters behavior
- [ ] Test responsive layout
- [ ] Verify dark mode
- [ ] Run tests
- [ ] Commit with message: "feat: Add skeleton loading to SearchPage"

### ✅ CartSummary.tsx (CartSummary)

- [ ] Import `CartSummarySkeleton` and `useLoadingState`
- [ ] Wrap total calculation with hook
- [ ] Show skeleton while loading
- [ ] Maintain existing promo code logic
- [ ] Test responsive
- [ ] Run tests
- [ ] Commit with message: "feat: Add skeleton loading to CartSummary"

### ✅ SimpleCartSidebar.tsx (Cart Sidebar)

- [ ] Add skeleton for cart items
- [ ] Add skeleton for summary
- [ ] Test on mobile (sidebar drawer)
- [ ] Run tests
- [ ] Commit with message: "feat: Add skeleton loading to CartSidebar"

---

## 🧪 Testing Checklist

### Per Component
- [ ] Skeleton appears during initial load
- [ ] Skeleton disappears when content loads
- [ ] Error state shows if request fails
- [ ] Retry button works
- [ ] No layout shift (CLS < 0.1)
- [ ] Animation smooth (60fps)
- [ ] Dark mode colors correct

### Cross-Browser
- [ ] Chrome/Chromium
- [ ] Safari
- [ ] Firefox
- [ ] Edge

### Responsive
- [ ] Desktop (1920x1080)
- [ ] Laptop (1366x768)
- [ ] Tablet (768x1024)
- [ ] Mobile (375x667)

### Accessibility
- [ ] Tab navigation works
- [ ] ARIA labels read correctly
- [ ] Screen reader announces "loading"
- [ ] Keyboard shortcuts work (Cmd+K search)

### Performance
- [ ] Lighthouse CLS < 0.1
- [ ] FCP < 2.5s
- [ ] LCP < 4.0s
- [ ] No memory leaks

---

## 🚀 Deployment Checklist

### Pre-Deployment
- [ ] All tests passing (126/126)
- [ ] No console errors in dev tools
- [ ] Lighthouse audit passed
- [ ] Mobile testing done
- [ ] UAT sign-off received

### Staging Deploy
- [ ] Push to staging branch
- [ ] Verify all integrations work
- [ ] A/B test if needed
- [ ] Monitor metrics

### Production Deploy
- [ ] Merge to main
- [ ] Tag release (v1.3.0)
- [ ] Deploy to production
- [ ] Monitor CLS, LCP, FCP
- [ ] Track user feedback

---

## 📞 Quick Reference

### Import Skeletons
```tsx
import { 
  SkeletonLoader,
  ProductCardSkeleton,
  CartSummarySkeleton,
  SearchResultsSkeleton,
} from '@/components/skeletons';
```

### Import Hook
```tsx
import { useLoadingState } from '@/hooks/useLoadingState';
```

### Basic Hook Usage
```tsx
const { isLoading, error, load, retry } = useLoadingState({
  timeout: 8000,        // 8 seconds
  autoRetry: true,      // Retry on failure
  maxRetries: 3,        // Max 3 attempts
  retryDelay: 1000,     // 1 second delay
});

// Execute async operation
useEffect(() => {
  load(async () => {
    const data = await fetchSomething();
    setState(data);
    return data;
  });
}, [load]);
```

### Error Handling
```tsx
if (error && data.length === 0) {
  return (
    <div className="error-container">
      <p>{error.message}</p>
      <button onClick={retry}>Retry</button>
    </div>
  );
}
```

### Show Skeleton
```tsx
if (isLoading && data.length === 0) {
  return <ProductCardSkeleton count={12} />;
}
```

---

## 🎬 Integration Video Guide

For each component integration, follow this sequence:

1. **Add Imports** (2 min)
   - Import hook and skeleton component

2. **Replace Loading Logic** (3 min)
   - Remove old loading mechanism
   - Add useLoadingState hook

3. **Add Error Handling** (2 min)
   - Show error UI
   - Add retry button

4. **Test Locally** (5 min)
   - Dev server: `npm run dev`
   - DevTools: Check console, network
   - Lighthouse: Run audit

5. **Commit Changes** (1 min)
   - Describe what changed
   - Reference Phase 2 in message

---

## ❓ FAQs

**Q: Should I replace ALL loading states?**  
A: No, only for async operations (API calls, heavy computations). Skip for instant UI updates (< 100ms).

**Q: Can I customize skeleton animations?**  
A: Yes, modify `src/components/skeletons/SkeletonLoader.css` @keyframes animation.

**Q: What if API is really fast?**  
A: Hook has min delay before showing skeleton (100ms by default). Adjust if needed.

**Q: How do I test with slow network?**  
A: DevTools → Network tab → Throttle to "Slow 3G" or custom speed.

**Q: Can I use multiple `useLoadingState` in one component?**  
A: Yes! Each hook manages its own state independently.

```tsx
const productsLoading = useLoadingState();
const cartLoading = useLoadingState();
```

---

## 📈 Success Metrics

After Phase 2 Part 2 integration, track these:

| Metric | Target | Tool |
|--------|--------|------|
| **CLS** | < 0.1 | Lighthouse |
| **LCP** | < 4.0s | Lighthouse |
| **FCP** | < 2.5s | Lighthouse |
| **Test Coverage** | 100% | npm run test |
| **Bundle Size** | +8KB | npm run build |
| **User Satisfaction** | +25% | Feedback |

---

## 📞 Support

**Issues?** Check:
1. Skeleton imported correctly: `src/components/skeletons/index.ts`
2. Hook imported correctly: `src/hooks/useLoadingState.ts`
3. All tests passing: `npm run test`
4. No console errors: DevTools Console
5. CSS loaded: DevTools Styles (check for pulse animation)

---

**Ready to integrate?** Start with ProductPage on Oct 28! 🚀

Let's make Phase 2 deployment smooth and measurable! 📊✨
