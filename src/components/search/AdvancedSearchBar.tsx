import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
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
  Command,
  Zap,
  Star,
  Sparkles,
  Brain,
  Target,
  Filter,
  Mic,
  MicOff
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { 
  IntelligentSuggestion, 
  SearchContext, 
  generateIntelligentSuggestions,
  mockTrendingSearches,
  createDefaultSearchContext
} from '@/utils/intelligentSearch';
import { Product } from '@/types/product';

interface AdvancedSearchBarProps {
  placeholder?: string;
  initialQuery?: string;
  onSearch?: (query: string, context?: SearchContext) => void;
  className?: string;
  compact?: boolean;
  showHistory?: boolean;
  showSuggestions?: boolean;
  variant?: 'default' | 'navbar' | 'hero' | 'advanced';
  products?: Product[];
  context?: SearchContext;
  enableVoiceSearch?: boolean;
  showAnalytics?: boolean;
  maxSuggestions?: number;
}

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
      staggerChildren: 0.02
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

const suggestionVariants = {
  hidden: {
    opacity: 0,
    x: -12,
    scale: 0.95
  },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      duration: 0.2,
      ease: "easeOut"
    }
  }
};

const sparkleVariants = {
  animate: {
    scale: [1, 1.2, 1],
    rotate: [0, 180, 360],
    opacity: [0.5, 1, 0.5],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

export const AdvancedSearchBar: React.FC<AdvancedSearchBarProps> = ({
  placeholder = "Search with AI-powered intelligence...",
  initialQuery = "",
  onSearch,
  className,
  compact = false,
  showHistory = true,
  showSuggestions = true,
  variant = 'default',
  products = [],
  context: externalContext,
  enableVoiceSearch = true,
  showAnalytics = true,
  maxSuggestions = 12
}) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState(initialQuery);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<IntelligentSuggestion[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isFocused, setIsFocused] = useState(false);
  const [isVoiceListening, setIsVoiceListening] = useState(false);
  const [searchContext, setSearchContext] = useState<SearchContext>(
    externalContext || createDefaultSearchContext()
  );
  
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  // Update context when external context changes
  useEffect(() => {
    if (externalContext) {
      setSearchContext(externalContext);
    }
  }, [externalContext]);

  // Initialize voice search if enabled
  useEffect(() => {
    if (enableVoiceSearch && 'webkitSpeechRecognition' in window) {
      recognitionRef.current = new (window as any).webkitSpeechRecognition();
      const recognition = recognitionRef.current;
      
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'vi-VN';

      recognition.onstart = () => {
        setIsVoiceListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setQuery(transcript);
        setIsOpen(true);
        handleSearch(transcript);
      };

      recognition.onend = () => {
        setIsVoiceListening(false);
      };

      recognition.onerror = (event: any) => {
        console.error('Voice recognition error:', event.error);
        setIsVoiceListening(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [enableVoiceSearch]);

  // Intelligent suggestions generation with debouncing
  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (query.length >= 1 && showSuggestions && products.length > 0) {
      setIsLoading(true);
      timeoutRef.current = setTimeout(() => {
        const intelligentSuggestions = generateIntelligentSuggestions(
          products,
          query,
          searchContext,
          mockTrendingSearches
        ).slice(0, maxSuggestions);
        
        setSuggestions(intelligentSuggestions);
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
  }, [query, showSuggestions, products, searchContext, maxSuggestions]);

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

  const handleVoiceSearch = () => {
    if (!recognitionRef.current) return;

    if (isVoiceListening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
    }
  };

  const handleSearch = useCallback((searchQuery: string) => {
    if (!searchQuery.trim()) return;

    const trimmedQuery = searchQuery.trim();
    setQuery(trimmedQuery);
    setIsOpen(false);
    setSelectedIndex(-1);

    // Update search context
    const updatedContext = {
      ...searchContext,
      recentSearches: [trimmedQuery, ...searchContext.recentSearches.slice(0, 19)],
      sessionSearches: [...searchContext.sessionSearches, trimmedQuery]
    };
    setSearchContext(updatedContext);

    if (onSearch) {
      onSearch(trimmedQuery, updatedContext);
    } else {
      navigate(`/products?search=${encodeURIComponent(trimmedQuery)}`);
    }
  }, [onSearch, navigate, searchContext]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedIndex >= 0 && suggestions[selectedIndex]) {
      const selectedSuggestion = suggestions[selectedIndex];
      handleSearch(selectedSuggestion.text);
    } else {
      handleSearch(query);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => Math.min(prev + 1, suggestions.length - 1));
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
        if (selectedIndex >= 0 && suggestions[selectedIndex]) {
          e.preventDefault();
          setQuery(suggestions[selectedIndex].text);
        }
        break;
    }
  };

  const getSuggestionIcon = (suggestion: IntelligentSuggestion) => {
    const iconClass = "w-4 h-4 flex-shrink-0";
    
    switch (suggestion.type) {
      case 'product':
        return <Search className={cn(iconClass, "text-blue-500")} />;
      case 'brand':
        return <Building2 className={cn(iconClass, "text-purple-500")} />;
      case 'category':
        return <Tag className={cn(iconClass, "text-green-500")} />;
      case 'tag':
        return <Hash className={cn(iconClass, "text-orange-500")} />;
      case 'trending':
        return <TrendingUp className={cn(iconClass, "text-red-500")} />;
      case 'recommended':
        return <Star className={cn(iconClass, "text-yellow-500")} />;
      default:
        return <Search className={cn(iconClass, "text-gray-500")} />;
    }
  };

  const getSourceIcon = (source: IntelligentSuggestion['source']) => {
    const iconClass = "w-3 h-3";
    switch (source) {
      case 'trending':
        return <TrendingUp className={cn(iconClass, "text-red-400")} />;
      case 'personalized':
        return <Target className={cn(iconClass, "text-blue-400")} />;
      case 'contextual':
        return <Brain className={cn(iconClass, "text-purple-400")} />;
      case 'fuzzy':
        return <Zap className={cn(iconClass, "text-yellow-400")} />;
      default:
        return null;
    }
  };

  const variantStyles = {
    default: "bg-white border-gray-200 shadow-sm",
    navbar: "bg-white/90 backdrop-blur-sm border-gray-200/50 shadow-md",
    hero: "bg-white/95 backdrop-blur-md border-white/20 shadow-xl",
    advanced: "bg-gradient-to-r from-white to-gray-50 border-gray-300 shadow-lg"
  };

  const placeholderByVariant = {
    default: placeholder,
    navbar: "Search products, brands...",
    hero: "What are you looking for today?",
    advanced: "Search with AI-powered intelligence..."
  };

  const groupedSuggestions = useMemo(() => {
    const groups: Record<string, IntelligentSuggestion[]> = {
      trending: [],
      products: [],
      categories: [],
      brands: [],
      recommended: [],
      others: []
    };

    suggestions.forEach(suggestion => {
      switch (suggestion.type) {
        case 'trending':
          groups.trending.push(suggestion);
          break;
        case 'product':
          groups.products.push(suggestion);
          break;
        case 'category':
          groups.categories.push(suggestion);
          break;
        case 'brand':
          groups.brands.push(suggestion);
          break;
        case 'recommended':
          groups.recommended.push(suggestion);
          break;
        default:
          groups.others.push(suggestion);
      }
    });

    return Object.entries(groups).filter(([, items]) => items.length > 0);
  }, [suggestions]);

  return (
    <div ref={searchRef} className={cn("relative", className)}>
      <form onSubmit={handleSubmit} className="relative">
        <div className={cn(
          "relative flex items-center rounded-xl border-2 transition-all duration-300 group",
          variantStyles[variant],
          isFocused && "ring-4 ring-blue-500/20 border-blue-400 shadow-lg scale-[1.02]",
          isLoading && "border-blue-300"
        )}>
          <div className="flex items-center pl-4">
            <Search className={cn(
              "w-5 h-5 transition-colors duration-200",
              isFocused ? "text-blue-500" : "text-gray-400"
            )} />
            {variant === 'advanced' && (
              <motion.div
                variants={sparkleVariants}
                animate="animate"
                className="ml-2"
              >
                <Sparkles className="w-4 h-4 text-blue-500" />
              </motion.div>
            )}
          </div>
          
          <Input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            onKeyDown={handleKeyDown}
            placeholder={placeholderByVariant[variant]}
            className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 px-3 text-base"
          />
          
          <div className="flex items-center pr-4 space-x-2">
            {isLoading && (
              <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
            )}
            
            {query && !isLoading && (
              <motion.button
                type="button"
                onClick={() => {
                  setQuery('');
                  inputRef.current?.focus();
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X className="w-4 h-4" />
              </motion.button>
            )}

            {enableVoiceSearch && recognitionRef.current && (
              <motion.button
                type="button"
                onClick={handleVoiceSearch}
                className={cn(
                  "p-1 rounded-full transition-colors",
                  isVoiceListening 
                    ? "text-red-500 bg-red-100" 
                    : "text-gray-400 hover:text-blue-500 hover:bg-blue-50"
                )}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {isVoiceListening ? (
                  <MicOff className="w-4 h-4" />
                ) : (
                  <Mic className="w-4 h-4" />
                )}
              </motion.button>
            )}
            
            {!compact && (
              <div className="hidden md:flex items-center space-x-1 text-xs text-gray-400">
                <Command className="w-3 h-3" />
                <span>K</span>
              </div>
            )}
          </div>
        </div>
      </form>

      {/* Advanced Search Suggestions */}
      <AnimatePresence>
        {isOpen && suggestions.length > 0 && (
          <motion.div
            className="absolute top-full mt-3 w-full bg-white rounded-xl shadow-2xl border border-gray-200 z-50 overflow-hidden max-h-96 overflow-y-auto"
            variants={dropdownVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {showAnalytics && query.length >= 2 && (
              <div className="px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-purple-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm font-medium text-blue-900">
                    <Brain className="w-4 h-4" />
                    AI-Powered Results
                  </div>
                  <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-700">
                    {suggestions.length} suggestions
                  </Badge>
                </div>
              </div>
            )}

            {groupedSuggestions.map(([groupName, groupSuggestions], groupIndex) => (
              <div key={groupName}>
                {groupName !== 'others' && groupSuggestions.length > 0 && (
                  <div className="px-4 py-2 bg-gray-50 border-b border-gray-100">
                    <div className="flex items-center gap-2 text-xs font-medium text-gray-600 uppercase tracking-wide">
                      {groupName === 'trending' && <TrendingUp className="w-3 h-3" />}
                      {groupName === 'products' && <Search className="w-3 h-3" />}
                      {groupName === 'categories' && <Tag className="w-3 h-3" />}
                      {groupName === 'brands' && <Building2 className="w-3 h-3" />}
                      {groupName === 'recommended' && <Star className="w-3 h-3" />}
                      {groupName}
                    </div>
                  </div>
                )}
                
                {groupSuggestions.map((suggestion, index) => {
                  const globalIndex = suggestions.findIndex(s => s.id === suggestion.id);
                  return (
                    <motion.button
                      key={suggestion.id}
                      variants={suggestionVariants}
                      className={cn(
                        "w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-blue-50 transition-all duration-200 group",
                        selectedIndex === globalIndex && "bg-blue-100 border-r-4 border-blue-500"
                      )}
                      onClick={() => handleSearch(suggestion.text)}
                    >
                      {getSuggestionIcon(suggestion)}
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-gray-900 group-hover:text-blue-700 truncate">
                            {suggestion.text}
                          </span>
                          {getSourceIcon(suggestion.source)}
                        </div>
                        
                        {suggestion.metadata.description && (
                          <div className="text-xs text-gray-500 truncate mt-1">
                            {suggestion.metadata.description}
                          </div>
                        )}
                        
                        <div className="flex items-center gap-2 mt-1">
                          {suggestion.metadata.count && (
                            <Badge variant="outline" className="text-xs">
                              {suggestion.metadata.count} results
                            </Badge>
                          )}
                          {suggestion.metadata.popularity && (
                            <div className="flex items-center gap-1 text-xs text-orange-500">
                              <TrendingUp className="w-3 h-3" />
                              {Math.round(suggestion.metadata.popularity * 100)}%
                            </div>
                          )}
                          {suggestion.confidence > 0.8 && (
                            <div className="flex items-center gap-1 text-xs text-green-500">
                              <Star className="w-3 h-3" />
                              High match
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {suggestion.metadata.image && (
                        <div className="w-10 h-10 bg-gray-100 rounded-lg overflow-hidden">
                          <img 
                            src={suggestion.metadata.image} 
                            alt={suggestion.text}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      
                      <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-500 opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-1" />
                    </motion.button>
                  );
                })}
              </div>
            ))}

            {showAnalytics && (
              <div className="px-4 py-2 bg-gray-50 border-t border-gray-100">
                <div className="text-xs text-gray-500 text-center">
                  Powered by AI • {suggestions.length} intelligent suggestions generated
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {isVoiceListening && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded-full shadow-lg"
        >
          <div className="flex items-center gap-2 text-sm">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 1 }}
            >
              <Mic className="w-4 h-4" />
            </motion.div>
            Listening...
          </div>
        </motion.div>
      )}
    </div>
  );
};
