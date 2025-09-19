import { Product } from '@/types/simple';
import { applyFilters, FilterState, defaultFilters } from '@/utils/productFilters';

export type SortOption = 'relevance' | 'price-asc' | 'price-desc' | 'rating' | 'popularity' | 'newest';

export interface SearchParamsState {
  query: string;
  filters: FilterState;
  sort: SortOption;
  page: number;
  perPage: number;
}

export const parseSearchParams = (search: string): Partial<SearchParamsState> => {
  const url = new URLSearchParams(search);
  const query = url.get('query') || url.get('q') || url.get('search') || '';
  const sort = (url.get('sort') as SortOption) || 'relevance';
  const page = parseInt(url.get('page') || '1', 10);
  const perPage = parseInt(url.get('perPage') || '12', 10);

  const filters: Partial<FilterState> = {
    search: query,
  };

  const categories = url.getAll('category');
  if (categories.length) filters.categories = categories;

  const origins = url.getAll('origin');
  if (origins.length) filters.origins = origins;

  const status = url.getAll('status');
  if (status.length) filters.status = status;

  const types = url.getAll('type');
  if (types.length) filters.types = types;

  const brands = url.getAll('brand');
  if (brands.length) filters.brands = brands;

  const minPrice = url.get('minPrice');
  const maxPrice = url.get('maxPrice');
  if (minPrice || maxPrice) {
    const min = minPrice ? parseInt(minPrice, 10) : defaultFilters.priceRange[0];
    const max = maxPrice ? parseInt(maxPrice, 10) : defaultFilters.priceRange[1];
    filters.priceRange = [min, max];
  }

  const quickFilter = url.get('quick') || '';
  if (quickFilter) filters.quickFilter = quickFilter;

  return { query, sort, page, perPage, filters: { ...defaultFilters, ...filters } as FilterState };
};

export const serializeSearchParams = (state: SearchParamsState): string => {
  const url = new URLSearchParams();
  if (state.query) url.set('query', state.query);
  if (state.sort && state.sort !== 'relevance') url.set('sort', state.sort);
  if (state.page && state.page > 1) url.set('page', String(state.page));
  if (state.perPage && state.perPage !== 12) url.set('perPage', String(state.perPage));

  const { filters } = state;
  filters.categories.forEach(c => url.append('category', c));
  filters.origins.forEach(o => url.append('origin', o));
  filters.status.forEach(s => url.append('status', s));
  filters.types.forEach(t => url.append('type', t));
  filters.brands.forEach(b => url.append('brand', b));

  if (filters.priceRange) {
    const [min, max] = filters.priceRange;
    if (min !== defaultFilters.priceRange[0]) url.set('minPrice', String(min));
    if (max !== defaultFilters.priceRange[1]) url.set('maxPrice', String(max));
  }
  if (filters.quickFilter) url.set('quick', filters.quickFilter);

  return url.toString();
};

export const sortProducts = (products: Product[], sort: SortOption, query: string): Product[] => {
  const cloned = [...products];
  switch (sort) {
    case 'price-asc':
      return cloned.sort((a, b) => a.sellingPrice - b.sellingPrice);
    case 'price-desc':
      return cloned.sort((a, b) => b.sellingPrice - a.sellingPrice);
    case 'rating':
      return cloned.sort((a, b) => b.rating.average - a.rating.average);
    case 'popularity':
      return cloned.sort((a, b) => (b.rating.count || 0) - (a.rating.count || 0));
    case 'newest':
      return cloned.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    case 'relevance':
    default:
      // Simple relevance: name match > tag match > description
      const q = query.toLowerCase();
      return cloned.sort((a, b) => {
        const score = (p: Product) => {
          let s = 0;
          if (p.name.toLowerCase().includes(q)) s += 3;
          if (p.tags.some(t => t.toLowerCase().includes(q))) s += 2;
          if (p.description.toLowerCase().includes(q)) s += 1;
          return s;
        };
        return score(b) - score(a);
      });
  }
};

export const paginate = <T,>(items: T[], page: number, perPage: number) => {
  const total = items.length;
  const pages = Math.max(1, Math.ceil(total / perPage));
  const current = Math.min(Math.max(1, page), pages);
  const start = (current - 1) * perPage;
  const end = start + perPage;
  return { page: current, pages, total, items: items.slice(start, end) };
};

export const performSearch = (all: Product[], state: SearchParamsState) => {
  const filtered = applyFilters(all as any, state.filters);
  const sorted = sortProducts(filtered as any, state.sort, state.query);
  const paged = paginate(sorted, state.page, state.perPage);
  return paged;
};