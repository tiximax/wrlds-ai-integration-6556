import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Clock, 
  X, 
  TrendingUp, 
  Hash, 
  Tag, 
  Building2,
  Loader2,
  ArrowRight
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { mockProducts } from '@/data/products';
import {
  generateSearchSuggestions,
  getSearchHistory,
  removeFromSearchHistory,
  clearSearchHistory,
  addToSearchHistory,
  SEARCH_CONFIG,
  SearchSuggestion,
  SearchHistoryItem
} from '@/utils/advancedSearch';
import { useDebounce } from '@/hooks/useDebounce';

interface SearchBarProps {
  placeholder?: string;
  initialQuery?: string;
  onSearch?: (query: string) => void;
  className?: string;
  showSuggestions?: boolean;
  showHistory?: boolean;
  compact?: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = 'Tìm kiếm sản phẩm, thương hiệu, danh mục...',
  initialQuery = '',
  onSearch,
  className = '',
  showSuggestions = true,
  showHistory = true,
  compact = false
}) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState(initialQuery);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debouncedQuery = useDebounce(query, SEARCH_CONFIG.DEBOUNCE_DELAY);

  // Load search history on mount
  useEffect(() => {
    if (showHistory) {
      setSearchHistory(getSearchHistory());
    }
  }, [showHistory]);

  // Generate suggestions when debounced query changes
  useEffect(() => {
    if (debouncedQuery.length >= SEARCH_CONFIG.MIN_QUERY_LENGTH && showSuggestions) {
      setIsLoading(true);
      // Simulate async operation
      const timeoutId = setTimeout(() => {
        const newSuggestions = generateSearchSuggestions(mockProducts, debouncedQuery);
        setSuggestions(newSuggestions);
        setIsLoading(false);
      }, 100);

      return () => clearTimeout(timeoutId);
    } else {
      setSuggestions([]);
      setIsLoading(false);
    }
  }, [debouncedQuery, showSuggestions]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setIsOpen(true);
    setSelectedIndex(-1);
  };

  const handleInputFocus = () => {
    setIsOpen(true);
    // Refresh search history when focusing
    if (showHistory) {
      setSearchHistory(getSearchHistory());
    }
  };

  const handleSearch = useCallback((searchQuery: string) => {
    if (!searchQuery.trim()) return;

    const finalQuery = searchQuery.trim();
    setQuery(finalQuery);
    setIsOpen(false);
    setSelectedIndex(-1);

    if (onSearch) {
      onSearch(finalQuery);
    } else {
      // Navigate to products page with search query
      navigate(`/products?search=${encodeURIComponent(finalQuery)}`);
    }
  }, [onSearch, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedIndex >= 0) {
      // Use selected suggestion
      const allItems = [...(query.length < SEARCH_CONFIG.MIN_QUERY_LENGTH ? searchHistory : []), ...suggestions];
      const selectedItem = allItems[selectedIndex];
      if (selectedItem) {
        const searchText = 'query' in selectedItem ? selectedItem.query : selectedItem.text;
        handleSearch(searchText);
      }
    } else {
      handleSearch(query);
    }
  };

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    handleSearch(suggestion.text);
  };

  const handleHistoryClick = (historyItem: SearchHistoryItem) => {
    handleSearch(historyItem.query);
  };

  const handleHistoryRemove = (historyItem: SearchHistoryItem, e: React.MouseEvent) => {
    e.stopPropagation();
    removeFromSearchHistory(historyItem.query);
    setSearchHistory(getSearchHistory());
  };

  const handleClearHistory = () => {
    clearSearchHistory();
    setSearchHistory([]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const allItems = [...(query.length < SEARCH_CONFIG.MIN_QUERY_LENGTH ? searchHistory : []), ...suggestions];
    
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => Math.min(prev + 1, allItems.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => Math.max(prev - 1, -1));
        break;
      case 'Escape':
        setIsOpen(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
      case 'Tab':
        if (selectedIndex >= 0 && allItems[selectedIndex]) {
          e.preventDefault();
          const selectedItem = allItems[selectedIndex];
          const searchText = 'query' in selectedItem ? selectedItem.query : selectedItem.text;
          setQuery(searchText);
        }
        break;
    }
  };

  const getSuggestionIcon = (type: SearchSuggestion['type']) => {
    switch (type) {
      case 'brand':
        return <Building2 className="w-4 h-4 text-blue-500" />;
      case 'category':
        return <Tag className="w-4 h-4 text-green-500" />;
      case 'tag':
        return <Hash className="w-4 h-4 text-purple-500" />;
      default:
        return <Search className="w-4 h-4 text-gray-500" />;
    }
  };

  const showDropdown = isOpen && (
    (query.length < SEARCH_CONFIG.MIN_QUERY_LENGTH && searchHistory.length > 0) ||
    suggestions.length > 0 ||
    isLoading
  );

  const allItems = [...(query.length < SEARCH_CONFIG.MIN_QUERY_LENGTH ? searchHistory : []), ...suggestions];

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      {/* Search Input */}
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 ${compact ? 'w-4 h-4' : 'w-5 h-5'}`} />
          <Input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className={`${compact ? 'pl-9 h-9' : 'pl-12 h-12'} pr-12 rounded-lg border-gray-200 focus:border-blue-500 focus:ring-blue-500`}
          />
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
            {query && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  setQuery('');
                  setSuggestions([]);
                  inputRef.current?.focus();
                }}
                className="p-1 h-auto hover:bg-gray-100 rounded-full"
              >
                <X className="w-4 h-4 text-gray-400" />
              </Button>
            )}
            <Button
              type="submit"
              size="sm"
              disabled={!query.trim()}
              className={`${compact ? 'h-6 px-2' : 'h-8 px-3'} bg-blue-600 hover:bg-blue-700`}
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <ArrowRight className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
      </form>

      {/* Dropdown */}
      <AnimatePresence>
        {showDropdown && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-96 overflow-y-auto"
          >
            {/* Loading State */}
            {isLoading && (
              <div className="p-4 text-center">
                <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2 text-blue-500" />
                <p className="text-sm text-gray-500">Đang tìm kiếm...</p>
              </div>
            )}

            {/* Search History */}
            {!isLoading && query.length < SEARCH_CONFIG.MIN_QUERY_LENGTH && searchHistory.length > 0 && (
              <div className="p-2">
                <div className="flex items-center justify-between px-2 py-1 mb-2">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Tìm kiếm gần đây
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClearHistory}
                    className="text-xs text-gray-400 hover:text-gray-600 h-auto p-1"
                  >
                    Xóa tất cả
                  </Button>
                </div>
                {searchHistory.slice(0, 5).map((item, index) => (
                  <button
                    key={item.query}
                    onClick={() => handleHistoryClick(item)}
                    className={`w-full flex items-center justify-between p-2 rounded-md text-left transition-colors ${
                      selectedIndex === index ? 'bg-blue-50' : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <Clock className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {item.query}
                        </p>
                        <p className="text-xs text-gray-500">
                          {item.resultCount} kết quả
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => handleHistoryRemove(item, e)}
                      className="p-1 h-auto opacity-0 group-hover:opacity-100 hover:bg-gray-200 rounded-full flex-shrink-0"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </button>
                ))}
              </div>
            )}

            {/* Suggestions */}
            {!isLoading && suggestions.length > 0 && (
              <div className="p-2">
                {query.length >= SEARCH_CONFIG.MIN_QUERY_LENGTH && (
                  <div className="px-2 py-1 mb-2">
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Gợi ý tìm kiếm
                    </h3>
                  </div>
                )}
                {suggestions.map((suggestion, index) => {
                  const adjustedIndex = query.length < SEARCH_CONFIG.MIN_QUERY_LENGTH ? 
                    index + searchHistory.length : index;
                  return (
                    <button
                      key={`${suggestion.type}-${suggestion.text}`}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className={`w-full flex items-center gap-3 p-2 rounded-md text-left transition-colors ${
                        selectedIndex === adjustedIndex ? 'bg-blue-50' : 'hover:bg-gray-50'
                      }`}
                    >
                      {getSuggestionIcon(suggestion.type)}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {suggestion.text}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="secondary" className="text-xs">
                            {suggestion.type === 'product' ? 'Sản phẩm' :
                             suggestion.type === 'brand' ? 'Thương hiệu' :
                             suggestion.type === 'category' ? 'Danh mục' : 'Tag'}
                          </Badge>
                          <span className="text-xs text-gray-500">
                            {suggestion.count} kết quả
                          </span>
                        </div>
                      </div>
                      <TrendingUp className="w-4 h-4 text-gray-400" />
                    </button>
                  );
                })}
              </div>
            )}

            {/* No Results */}
            {!isLoading && query.length >= SEARCH_CONFIG.MIN_QUERY_LENGTH && suggestions.length === 0 && (
              <div className="p-4 text-center">
                <Search className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-500 mb-2">Không tìm thấy gợi ý nào</p>
                <p className="text-xs text-gray-400">
                  Nhấn Enter để tìm kiếm "{query}"
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchBar;
