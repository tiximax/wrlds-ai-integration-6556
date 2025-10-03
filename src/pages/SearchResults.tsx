import React, { useMemo, useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSearchParams, useNavigate } from 'react-router-dom';
import PageLayout from '@/components/PageLayout';
import SearchFilters from '@/components/SearchFilters';
import { simpleProducts } from '@/data/simpleProducts';
import SimpleProductCard from '@/components/SimpleProductCard';
import { EnhancedButton } from '@/components/ui/enhanced-button';
import { useTranslation } from 'react-i18next';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { parseSearchParams, serializeSearchParams, performSearch, SortOption } from '@/utils/searchUtils';
import { FilterState, defaultFilters } from '@/utils/productFilters';
import VirtualScroll from '@/components/ui/virtual-scroll';

const SearchResults: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const initial = useMemo(() => parseSearchParams(window.location.search), []);

  const [query, setQuery] = useState(initial.query || '');
  const [filters, setFilters] = useState<FilterState>({ ...defaultFilters, ...(initial.filters || {}) });
  const [sort, setSort] = useState<SortOption>(initial.sort || 'relevance');
  const [page, setPage] = useState<number>(initial.page || 1);
  const [perPage, setPerPage] = useState<number>(initial.perPage || 12);

  // keep filters.search synced with query
  useEffect(() => {
    setFilters((prev) => ({ ...prev, search: query }));
  }, [query]);

  // recompute results
  const result = useMemo(() => {
    return performSearch(simpleProducts as any, {
      query,
      filters,
      sort,
      page,
      perPage,
    });
  }, [query, filters, sort, page, perPage]);

  // update URL when state changes
  useEffect(() => {
    const sp = serializeSearchParams({ query, filters, sort, page, perPage });
    setSearchParams(sp);
  }, [query, filters, sort, page, perPage, setSearchParams]);

  // respond to external URL changes (e.g., back/forward, manual history.replaceState)
  useEffect(() => {
    const current = serializeSearchParams({ query, filters, sort, page, perPage });
    const incoming = parseSearchParams('?' + searchParams.toString());

    // Compare and update only when different to avoid loops
    const differs = (
      (incoming.query || '') !== query ||
      JSON.stringify(incoming.filters || defaultFilters) !== JSON.stringify(filters) ||
      (incoming.sort || 'relevance') !== sort ||
      (incoming.page || 1) !== page ||
      (incoming.perPage || 12) !== perPage
    );

    if (differs) {
      setQuery(incoming.query || '');
      setFilters({ ...defaultFilters, ...(incoming.filters || {}) });
      setSort((incoming.sort as SortOption) || 'relevance');
      setPage(incoming.page || 1);
      setPerPage(incoming.perPage || 12);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const handleSortChange = (value: string) => {
    setSort(value as SortOption);
    setPage(1);
  };

  const handlePerPageChange = (value: string) => {
    const v = parseInt(value, 10) || 12;
    setPerPage(v);
    setPage(1);
  };

  return (
    <PageLayout>
      <Helmet>
        <title>Search Results - Global Shopping Assistant</title>
        <meta name="description" content={`Kết quả tìm kiếm cho: ${query}`} />
      </Helmet>

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900" data-testid="search-results-heading">{t('searchResults.title')}</h1>
          <p className="text-gray-600 mt-2">{t('searchResults.found', { count: result.total })}</p>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Filters */}
          <div className="lg:col-span-3">
            <SearchFilters
              filters={filters}
              onFiltersChange={(f) => { setFilters(f); setPage(1); }}
              products={simpleProducts as any}
              totalResults={result.total}
            />
          </div>

          {/* Results */}
          <div className="lg:col-span-9">
            {/* Controls */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-2 flex-wrap">
                {query && (
                  <Badge variant="secondary" className="gap-1" data-testid="chip-query">
                    {t('searchResults.query')}: {query}
                    <button
                      aria-label="Remove query"
                      className="ml-1 hover:text-red-500"
                      onClick={() => { setQuery(''); setPage(1); }}
                      data-testid="chip-remove-query"
                    >
                      ×
                    </button>
                  </Badge>
                )}

                {filters.categories.map((c) => (
                  <Badge key={`cat-${c}`} variant="outline" className="gap-1" data-testid={`chip-category-${c}`}>
                    {t('searchResults.category')}: {c}
                    <button
                      aria-label={`Remove category ${c}`}
                      className="ml-1 hover:text-red-500"
                      onClick={() => {
                        setFilters(prev => ({ ...prev, categories: prev.categories.filter(x => x !== c) }));
                        setPage(1);
                      }}
                      data-testid={`chip-remove-category-${c}`}
                    >
                      ×
                    </button>
                  </Badge>
                ))}

                {filters.origins.map((o) => (
                  <Badge key={`origin-${o}`} variant="outline" className="gap-1" data-testid={`chip-origin-${o}`}>
                    {t('searchResults.origin')}: {o}
                    <button
                      aria-label={`Remove origin ${o}`}
                      className="ml-1 hover:text-red-500"
                      onClick={() => {
                        setFilters(prev => ({ ...prev, origins: prev.origins.filter(x => x !== o) }));
                        setPage(1);
                      }}
                      data-testid={`chip-remove-origin-${o}`}
                    >
                      ×
                    </button>
                  </Badge>
                ))}

                {filters.status.map((s) => (
                  <Badge key={`status-${s}`} variant="outline" className="gap-1" data-testid={`chip-status-${s}`}>
                    {t('searchResults.status')}: {s}
                    <button
                      aria-label={`Remove status ${s}`}
                      className="ml-1 hover:text-red-500"
                      onClick={() => {
                        setFilters(prev => ({ ...prev, status: prev.status.filter(x => x !== s) }));
                        setPage(1);
                      }}
                      data-testid={`chip-remove-status-${s}`}
                    >
                      ×
                    </button>
                  </Badge>
                ))}

                {filters.types.map((t) => (
                  <Badge key={`type-${t}`} variant="outline" className="gap-1" data-testid={`chip-type-${t}`}>
                    {t('searchResults.type')}: {t}
                    <button
                      aria-label={`Remove type ${t}`}
                      className="ml-1 hover:text-red-500"
                      onClick={() => {
                        setFilters(prev => ({ ...prev, types: prev.types.filter(x => x !== t) }));
                        setPage(1);
                      }}
                      data-testid={`chip-remove-type-${t}`}
                    >
                      ×
                    </button>
                  </Badge>
                ))}

                {filters.brands.map((b) => (
                  <Badge key={`brand-${b}`} variant="outline" className="gap-1" data-testid={`chip-brand-${b}`}>
                    {t('searchResults.brand')}: {b}
                    <button
                      aria-label={`Remove brand ${b}`}
                      className="ml-1 hover:text-red-500"
                      onClick={() => {
                        setFilters(prev => ({ ...prev, brands: prev.brands.filter(x => x !== b) }));
                        setPage(1);
                      }}
                      data-testid={`chip-remove-brand-${b}`}
                    >
                      ×
                    </button>
                  </Badge>
                ))}

                {(filters.priceRange[0] !== defaultFilters.priceRange[0] || filters.priceRange[1] !== defaultFilters.priceRange[1]) && (
                  <Badge variant="outline" className="gap-1" data-testid="chip-price">
                    {t('searchResults.price')}: {filters.priceRange[0]} - {filters.priceRange[1]}
                    <button
                      aria-label="Reset price range"
                      className="ml-1 hover:text-red-500"
                      onClick={() => { setFilters(prev => ({ ...prev, priceRange: defaultFilters.priceRange })); setPage(1); }}
                      data-testid="chip-remove-price"
                    >
                      ×
                    </button>
                  </Badge>
                )}

                {filters.quickFilter && (
                  <Badge variant="outline" className="gap-1" data-testid={`chip-quick-${filters.quickFilter}`}>
                    Quick: {filters.quickFilter}
                    <button
                      aria-label="Remove quick filter"
                      className="ml-1 hover:text-red-500"
                      onClick={() => { setFilters(prev => ({ ...prev, quickFilter: '' })); setPage(1); }}
                      data-testid="chip-remove-quick"
                    >
                      ×
                    </button>
                  </Badge>
                )}
              </div>

              <div className="flex items-center gap-2">
                <Select value={sort} onValueChange={handleSortChange}>
                  <SelectTrigger className="w-[180px]"><SelectValue placeholder={t('searchResults.sort')} /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relevance">{t('searchResults.sortOptions.relevance')}</SelectItem>
                    <SelectItem value="price-asc">{t('searchResults.sortOptions.priceAsc')}</SelectItem>
                    <SelectItem value="price-desc">{t('searchResults.sortOptions.priceDesc')}</SelectItem>
                    <SelectItem value="rating">{t('searchResults.sortOptions.rating')}</SelectItem>
                    <SelectItem value="popularity">{t('searchResults.sortOptions.popularity')}</SelectItem>
                    <SelectItem value="newest">{t('searchResults.sortOptions.newest')}</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={String(perPage)} onValueChange={handlePerPageChange}>
                  <SelectTrigger className="w-[120px]"><SelectValue placeholder={t('searchResults.perPage')} /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="12">12</SelectItem>
                    <SelectItem value="24">24</SelectItem>
                    <SelectItem value="48">48</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Grid */}
              {result.items.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 mb-8" data-testid="search-results-grid">
                {result.items.map((product) => (
                  <SimpleProductCard key={product.id} product={product as any} highlightQuery={query} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg mb-4">Không tìm thấy sản phẩm phù hợp</p>
                <p className="text-gray-400">Thử thay đổi từ khóa hoặc bộ lọc</p>
              </div>
            )}

            {/* Pagination */}
            {result.pages > 1 && (
              <div className="flex justify-center gap-2">
                <EnhancedButton variant="outline" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={result.page === 1}>{t('searchResults.previous')}</EnhancedButton>
                {Array.from({ length: result.pages }, (_, i) => i + 1).map(p => (
                  <EnhancedButton key={p} variant={result.page === p ? 'primary' : 'outline'} onClick={() => setPage(p)} className="w-10">{p}</EnhancedButton>
                ))}
                <EnhancedButton variant="outline" onClick={() => setPage(p => Math.min(result.pages, p + 1))} disabled={result.page === result.pages}>{t('searchResults.next')}</EnhancedButton>
              </div>
            )}
          </div>
        </div>

        {/* Performance Demo: Virtual Scroll (does not affect main UX) */}
        <div className="mt-12">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Performance Demo</h2>
          <p className="text-sm text-gray-600 mb-3">Virtualized list of 500 rows (container height 240px, item 32px)</p>
          <div className="border rounded">
            {(() => {
              const demoItems = Array.from({ length: 500 }, (_, i) => `Row #${i + 1}`);
              return (
                <VirtualScroll
                  items={demoItems}
                  itemHeight={32}
                  height={240}
                  overscan={6}
                  data-testid="virtual-scroll-demo"
                  renderItem={(txt, idx) => (
                    <div className="px-3 flex items-center justify-between text-sm">
                      <span>{txt}</span>
                      <span className="text-gray-400">{idx + 1}</span>
                    </div>
                  )}
                />
              );
            })()}
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default SearchResults;