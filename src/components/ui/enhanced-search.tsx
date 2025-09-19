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
  ArrowRight,
  Command
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { simpleProducts } from '@/data/simpleProducts';
import { generateSearchSuggestions as genSuggestions, getSearchHistory, addToSearchHistory, performAdvancedSearch, defaultSearchFilters } from '@/utils/advancedSearch';

interface SearchSuggestion {
  id: string;
  text: string;
  type: 'product' | 'category' | 'brand' | 'tag';
  url: string;
  description?: string;
  image?: string;
  count?: number;
}

interface SearchHistoryItem {
  query: string;
  timestamp: Date;
  resultCount: number;
}

interface EnhancedSearchProps {
  placeholder?: string;
  initialQuery?: string;
  onSearch?: (query: string) => void;
  className?: string;
  compact?: boolean;
  showHistory?: boolean;
  showSuggestions?: boolean;
  variant?: 'default' | 'navbar' | 'hero';
}

// Suggestions and recent searches will be computed dynamically from data & history.

// Animation variants
const dropdownVariants = {
  hidden: {
    opacity: 0,
    y: -8,
    scale: 0.96
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.2,
      ease: "easeOut",
      staggerChildren: 0.03
    }
  },
  exit: {
    opacity: 0,
    y: -4,
    scale: 0.98,
    transition: {
      duration: 0.15,
      ease: "easeIn"
    }
  }
};

const itemVariants = {
  hidden: {
    opacity: 0,
    x: -12
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.2,
      ease: "easeOut"
    }
  }
};

export const EnhancedSearch: React.FC<EnhancedSearchProps> = ({
  placeholder = "Search products, brands, categories...",
  initialQuery = "",
  onSearch,
  className,
  compact = false,
  showHistory = true,
  showSuggestions = true,
  variant = 'default'
}) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState(initialQuery);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [recentSearches, setRecentSearches] = useState<SearchHistoryItem[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isFocused, setIsFocused] = useState(false);
  
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();

  // Initialize recent searches from history
  useEffect(() => {
    setRecentSearches(getSearchHistory());
  }, []);

  // Debounced search effect using advanced search suggestions
  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (query.length >= 2 && showSuggestions) {
      setIsLoading(true);
      timeoutRef.current = setTimeout(() => {
        const generated = genSuggestions(simpleProducts as any, query);
        const mapped: SearchSuggestion[] = generated.map((s, idx) => ({
          id: `${s.type}-${idx}-${s.text}`,
          text: s.text,
          type: s.type as any,
          url: `/products?search=${encodeURIComponent(s.text)}`,
          description: s.count ? `${s.count} results` : undefined,
          count: s.count,
        }));
        setSuggestions(mapped);
        setIsLoading(false);
      }, 200);
    } else {
      setSuggestions([]);
      setIsLoading(false);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [query, showSuggestions]);

  // Handle click outside
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
    setIsFocused(true);
    setIsOpen(true);
  };

  const handleInputBlur = () => {
    setIsFocused(false);
  };

  const handleSearch = useCallback((searchQuery: string) => {
    if (!searchQuery.trim()) return;

    const trimmedQuery = searchQuery.trim();
    setQuery(trimmedQuery);
    setIsOpen(false);
    setSelectedIndex(-1);

    // Compute result count and add to search history
    const filters = { ...defaultSearchFilters, query: trimmedQuery };
    const results = performAdvancedSearch(simpleProducts as any, filters);
    addToSearchHistory(trimmedQuery, results.length);
    setRecentSearches(getSearchHistory());

    if (onSearch) {
      onSearch(trimmedQuery);
    } else {
      navigate(`/search?query=${encodeURIComponent(trimmedQuery)}`);
    }
  }, [onSearch, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedIndex >= 0) {
      const allItems = [...(query.length < 2 ? recentSearches : suggestions)];
      const selectedItem = allItems[selectedIndex];
      if (selectedItem) {
        const searchText = 'query' in selectedItem ? selectedItem.query : selectedItem.text;
        handleSearch(searchText);
      }
    } else {
      handleSearch(query);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const allItems = [...(query.length < 2 ? recentSearches : suggestions)];
    
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
    const iconClass = "w-4 h-4";
    switch (type) {
      case 'brand':
        return <Building2 className={cn(iconClass, "text-blue-500")} />;
      case 'category':
        return <Tag className={cn(iconClass, "text-green-500")} />;
      case 'tag':
        return <Hash className={cn(iconClass, "text-purple-500")} />;
      default:
        return <Search className={cn(iconClass, "text-gray-500")} />;
    }
  };

  const variantStyles = {
    default: "bg-white border-gray-200",
    navbar: "bg-white/90 backdrop-blur-sm border-gray-200/50",
    hero: "bg-white/95 backdrop-blur-md border-white/20 shadow-lg"
  };

  return (
    <div ref={searchRef} className={cn("relative", className)}>
      <form onSubmit={handleSubmit} className="relative">
        <div className={cn(
          "relative flex items-center rounded-lg border transition-all duration-200",
          variantStyles[variant],
          isFocused && "ring-2 ring-blue-500/20 border-blue-300"
        )}>
          <Search className="w-4 h-4 text-gray-400 ml-3 flex-shrink-0" />
          
          <Input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 px-2"
          />
          
          <div className="flex items-center pr-3 space-x-2">
            {isLoading && (
              <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
            )}
            
            {query && (
              <motion.button
                type="button"
                onClick={() => setQuery('')}
                className="text-gray-400 hover:text-gray-600"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X className="w-4 h-4" />
              </motion.button>
            )}
            
            <div className="hidden md:flex items-center space-x-1 text-xs text-gray-400">
              <Command className="w-3 h-3" />
              <span>K</span>
            </div>
          </div>
        </div>
      </form>

      {/* Search Dropdown */}
      <AnimatePresence>
        {isOpen && (query.length >= 2 ? suggestions.length > 0 : recentSearches.length > 0) && (
          <motion.div
            className="absolute top-full mt-2 w-full bg-white rounded-lg shadow-lg border border-gray-200 z-50 overflow-hidden"
            variants={dropdownVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {query.length < 2 && showHistory && recentSearches.length > 0 && (
              <>
                <div className="px-4 py-3 border-b border-gray-100">
                  <div className="flex items-center gap-2 text-sm font-medium text-gray-900">
                    <Clock className="w-4 h-4" />
                    Recent Searches
                  </div>
                </div>
                {recentSearches.map((item, index) => (
                  <motion.button
                    key={`${item.query}-${item.timestamp.getTime()}`}
                    variants={itemVariants}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors",
                      selectedIndex === index && "bg-blue-50"
                    )}
                    onClick={() => handleSearch(item.query)}
                  >
                    <Clock className="w-4 h-4 text-gray-400" />
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900">{item.query}</div>
                      <div className="text-xs text-gray-500">{item.resultCount} results</div>
                    </div>
                  </motion.button>
                ))}
              </>
            )}

            {query.length >= 2 && suggestions.length > 0 && (
              <>
                <div className="px-4 py-3 border-b border-gray-100">
                  <div className="flex items-center gap-2 text-sm font-medium text-gray-900">
                    <TrendingUp className="w-4 h-4" />
                    Suggestions
                  </div>
                </div>
                {suggestions.map((suggestion, index) => (
                  <motion.button
                    key={suggestion.id}
                    variants={itemVariants}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors group",
                      selectedIndex === index && "bg-blue-50"
                    )}
                    onClick={() => handleSearch(suggestion.text)}
                  >
                    {getSuggestionIcon(suggestion.type)}
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900 group-hover:text-blue-600">
                        {suggestion.text}
                      </div>
                      {suggestion.description && (
                        <div className="text-xs text-gray-500">{suggestion.description}</div>
                      )}
                    </div>
                    {suggestion.count && (
                      <Badge variant="secondary" className="text-xs">
                        {suggestion.count}
                      </Badge>
                    )}
                    <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-500 opacity-0 group-hover:opacity-100 transition-all" />
                  </motion.button>
                ))}
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
