import React, { useMemo, useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSearchParams, useNavigate } from 'react-router-dom';
import PageLayout from '@/components/PageLayout';
import SearchFilters from '@/components/SearchFilters';
import { simpleProducts } from '@/data/simpleProducts';
import SimpleProductCard from '@/components/SimpleProductCard';
import { EnhancedButton } from '@/components/ui/enhanced-button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { parseSearchParams, serializeSearchParams, performSearch, SortOption } from '@/utils/searchUtils';
import { FilterState, defaultFilters } from '@/utils/productFilters';

const SearchResults: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
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
          <h1 className="text-3xl font-bold text-gray-900">Search Results</h1>
          <p className="text-gray-600 mt-2">Tìm thấy {result.total} sản phẩm</p>
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
              <div className="flex items-center gap-2">
                {query && (
                  <Badge variant="secondary">Query: {query}</Badge>
                )}
                {filters.origins.map((o) => (
                  <Badge key={o} variant="outline">Origin: {o}</Badge>
                ))}
                {filters.status.map((s) => (
                  <Badge key={s} variant="outline">Status: {s}</Badge>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <Select value={sort} onValueChange={handleSortChange}>
                  <SelectTrigger className="w-[180px]"><SelectValue placeholder="Sort" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relevance">Relevance</SelectItem>
                    <SelectItem value="price-asc">Price: Low to High</SelectItem>
                    <SelectItem value="price-desc">Price: High to Low</SelectItem>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                    <SelectItem value="popularity">Most Popular</SelectItem>
                    <SelectItem value="newest">Newest</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={String(perPage)} onValueChange={handlePerPageChange}>
                  <SelectTrigger className="w-[120px]"><SelectValue placeholder="Per page" /></SelectTrigger>
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 mb-8">
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
                <EnhancedButton variant="outline" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={result.page === 1}>Previous</EnhancedButton>
                {Array.from({ length: result.pages }, (_, i) => i + 1).map(p => (
                  <EnhancedButton key={p} variant={result.page === p ? 'primary' : 'outline'} onClick={() => setPage(p)} className="w-10">{p}</EnhancedButton>
                ))}
                <EnhancedButton variant="outline" onClick={() => setPage(p => Math.min(result.pages, p + 1))} disabled={result.page === result.pages}>Next</EnhancedButton>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default SearchResults;