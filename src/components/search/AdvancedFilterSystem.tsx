import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Filter,
  SlidersHorizontal, 
  X, 
  ChevronDown,
  ChevronRight,
  Check,
  Star,
  TrendingUp,
  Save,
  Trash2,
  RefreshCw,
  BarChart3,
  Eye,
  EyeOff,
  Plus,
  Minus,
  Search,
  Tag,
  DollarSign,
  Calendar,
  MapPin,
  Shield
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { Product } from '@/types/product';

// Enhanced filter types
export interface AdvancedFilter {
  id: string;
  name: string;
  type: 'checkbox' | 'range' | 'select' | 'multiselect' | 'rating' | 'date' | 'custom';
  category: 'basic' | 'advanced' | 'premium';
  icon?: React.ReactNode;
  options?: FilterOption[];
  range?: {
    min: number;
    max: number;
    step?: number;
    formatter?: (value: number) => string;
  };
  metadata: {
    popularity: number;
    resultsCount: number;
    trending?: boolean;
    premium?: boolean;
  };
}

export interface FilterOption {
  value: string;
  label: string;
  count: number;
  selected: boolean;
  color?: string;
  icon?: React.ReactNode;
  trending?: boolean;
  premium?: boolean;
}

export interface SavedFilter {
  id: string;
  name: string;
  filters: Record<string, any>;
  timestamp: Date;
  usage: number;
  category: string;
  public: boolean;
}

export interface FilterState {
  activeFilters: Record<string, any>;
  appliedFilters: Record<string, any>;
  savedFilters: SavedFilter[];
  quickFilters: string[];
  sortBy: string;
  viewMode: 'grid' | 'list';
}

interface AdvancedFilterSystemProps {
  filters: AdvancedFilter[];
  products: Product[];
  onFiltersChange: (filters: FilterState) => void;
  className?: string;
  showAnalytics?: boolean;
  enableSavedFilters?: boolean;
  enableQuickFilters?: boolean;
  maxActiveFilters?: number;
}

// Animation variants
const filterVariants = {
  hidden: { opacity: 0, height: 0 },
  visible: { 
    opacity: 1, 
    height: 'auto',
    transition: { 
      duration: 0.3,
      ease: 'easeOut'
    }
  },
  exit: { 
    opacity: 0, 
    height: 0,
    transition: { 
      duration: 0.2,
      ease: 'easeIn'
    }
  }
};

const chipVariants = {
  initial: { scale: 0, opacity: 0 },
  animate: { 
    scale: 1, 
    opacity: 1,
    transition: { 
      type: 'spring',
      stiffness: 500,
      damping: 30
    }
  },
  exit: { 
    scale: 0, 
    opacity: 0,
    transition: { 
      duration: 0.2
    }
  }
};

const AdvancedFilterSystem: React.FC<AdvancedFilterSystemProps> = ({
  filters,
  products,
  onFiltersChange,
  className,
  showAnalytics = true,
  enableSavedFilters = true,
  enableQuickFilters = true,
  maxActiveFilters = 20
}) => {
  const [filterState, setFilterState] = useState<FilterState>({
    activeFilters: {},
    appliedFilters: {},
    savedFilters: [],
    quickFilters: ['trending', 'new-arrivals', 'bestsellers'],
    sortBy: 'relevance',
    viewMode: 'grid'
  });

  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');
  const [saveFilterName, setSaveFilterName] = useState('');
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);

  // Calculate active filters count
  const activeFiltersCount = useMemo(() => {
    return Object.keys(filterState.activeFilters).filter(
      key => {
        const value = filterState.activeFilters[key];
        return Array.isArray(value) ? value.length > 0 : value != null && value !== '';
      }
    ).length;
  }, [filterState.activeFilters]);

  // Filter groups for better organization
  const filterGroups = useMemo(() => {
    const groups: Record<string, AdvancedFilter[]> = {
      basic: [],
      advanced: [],
      premium: []
    };

    filters.forEach(filter => {
      if (searchFilter) {
        if (filter.name.toLowerCase().includes(searchFilter.toLowerCase())) {
          groups[filter.category].push(filter);
        }
      } else {
        groups[filter.category].push(filter);
      }
    });

    return groups;
  }, [filters, searchFilter]);

  // Handle filter change
  const handleFilterChange = useCallback((filterId: string, value: any) => {
    const newState = {
      ...filterState,
      activeFilters: {
        ...filterState.activeFilters,
        [filterId]: value
      }
    };
    setFilterState(newState);
    onFiltersChange(newState);
  }, [filterState, onFiltersChange]);

  // Apply filters
  const applyFilters = useCallback(() => {
    const newState = {
      ...filterState,
      appliedFilters: { ...filterState.activeFilters }
    };
    setFilterState(newState);
    onFiltersChange(newState);
  }, [filterState, onFiltersChange]);

  // Clear filters
  const clearFilters = useCallback(() => {
    const newState = {
      ...filterState,
      activeFilters: {},
      appliedFilters: {}
    };
    setFilterState(newState);
    onFiltersChange(newState);
  }, [filterState, onFiltersChange]);

  // Save current filter combination
  const saveCurrentFilters = useCallback(() => {
    if (!saveFilterName.trim()) return;

    const savedFilter: SavedFilter = {
      id: Date.now().toString(),
      name: saveFilterName.trim(),
      filters: { ...filterState.activeFilters },
      timestamp: new Date(),
      usage: 0,
      category: 'custom',
      public: false
    };

    const newState = {
      ...filterState,
      savedFilters: [...filterState.savedFilters, savedFilter]
    };
    
    setFilterState(newState);
    setSaveFilterName('');
  }, [filterState, saveFilterName]);

  // Load saved filters
  const loadSavedFilter = useCallback((savedFilter: SavedFilter) => {
    const updatedFilter = {
      ...savedFilter,
      usage: savedFilter.usage + 1
    };

    const newState = {
      ...filterState,
      activeFilters: { ...savedFilter.filters },
      savedFilters: filterState.savedFilters.map(sf => 
        sf.id === savedFilter.id ? updatedFilter : sf
      )
    };
    
    setFilterState(newState);
    onFiltersChange(newState);
  }, [filterState, onFiltersChange]);

  // Remove saved filter
  const removeSavedFilter = useCallback((filterId: string) => {
    const newState = {
      ...filterState,
      savedFilters: filterState.savedFilters.filter(sf => sf.id !== filterId)
    };
    setFilterState(newState);
  }, [filterState]);

  // Get filter analytics
  const filterAnalytics = useMemo(() => {
    const analytics = {
      totalFilters: filters.length,
      activeFilters: activeFiltersCount,
      popularFilters: filters.filter(f => f.metadata.popularity > 0.7).length,
      trendingFilters: filters.filter(f => f.metadata.trending).length,
      resultsImpact: products.length
    };
    return analytics;
  }, [filters, activeFiltersCount, products.length]);

  // Render filter option
  const renderFilterOption = (filter: AdvancedFilter) => {
    const currentValue = filterState.activeFilters[filter.id];

    switch (filter.type) {
      case 'checkbox':
        return (
          <div className="space-y-3">
            {filter.options?.map(option => (
              <motion.div
                key={option.value}
                className="flex items-center space-x-3"
                whileHover={{ x: 4 }}
              >
                <Checkbox
                  checked={Array.isArray(currentValue) && currentValue.includes(option.value)}
                  onCheckedChange={(checked) => {
                    const newValue = Array.isArray(currentValue) ? [...currentValue] : [];
                    if (checked) {
                      newValue.push(option.value);
                    } else {
                      const index = newValue.indexOf(option.value);
                      if (index > -1) newValue.splice(index, 1);
                    }
                    handleFilterChange(filter.id, newValue);
                  }}
                />
                <div className="flex-1 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {option.icon && <span className="text-gray-500">{option.icon}</span>}
                    <span className="text-sm font-medium text-gray-900">
                      {option.label}
                    </span>
                    {option.trending && (
                      <Badge variant="destructive" className="text-xs">
                        Trending
                      </Badge>
                    )}
                    {option.premium && (
                      <Badge variant="secondary" className="text-xs">
                        Premium
                      </Badge>
                    )}
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {option.count}
                  </Badge>
                </div>
              </motion.div>
            ))}
          </div>
        );

      case 'range':
        const rangeValue = currentValue || [filter.range?.min || 0, filter.range?.max || 100];
        return (
          <div className="space-y-4">
            <Slider
              value={rangeValue}
              onValueChange={(value) => handleFilterChange(filter.id, value)}
              max={filter.range?.max}
              min={filter.range?.min}
              step={filter.range?.step || 1}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-gray-600">
              <span>
                {filter.range?.formatter 
                  ? filter.range.formatter(rangeValue[0]) 
                  : rangeValue[0]
                }
              </span>
              <span>
                {filter.range?.formatter 
                  ? filter.range.formatter(rangeValue[1]) 
                  : rangeValue[1]
                }
              </span>
            </div>
          </div>
        );

      case 'rating':
        return (
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map(rating => (
              <motion.button
                key={rating}
                onClick={() => handleFilterChange(filter.id, rating)}
                className={cn(
                  "flex items-center space-x-2 w-full p-2 rounded-lg transition-colors",
                  currentValue === rating 
                    ? "bg-yellow-100 border border-yellow-300" 
                    : "hover:bg-gray-50"
                )}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        "w-4 h-4",
                        i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                      )}
                    />
                  ))}
                </div>
                <span className="text-sm">& Up</span>
                <div className="flex-1"></div>
                <Badge variant="outline" className="text-xs">
                  {Math.floor(Math.random() * 1000)}
                </Badge>
              </motion.button>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  // Quick filters component
  const QuickFilters = () => (
    <div className="flex flex-wrap gap-2 mb-6">
      {filterState.quickFilters.map(quickFilter => (
        <motion.button
          key={quickFilter}
          variants={chipVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium hover:bg-blue-200 transition-colors"
          onClick={() => {
            // Handle quick filter logic
            console.log('Quick filter:', quickFilter);
          }}
        >
          {quickFilter}
        </motion.button>
      ))}
    </div>
  );

  // Active filters chips
  const ActiveFiltersChips = () => (
    <AnimatePresence>
      {Object.entries(filterState.activeFilters).map(([filterId, value]) => {
        if (!value || (Array.isArray(value) && value.length === 0)) return null;
        
        const filter = filters.find(f => f.id === filterId);
        if (!filter) return null;

        return (
          <motion.div
            key={filterId}
            variants={chipVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-900 rounded-full text-sm"
          >
            {filter.icon && <span className="w-3 h-3">{filter.icon}</span>}
            <span>{filter.name}</span>
            <button
              onClick={() => handleFilterChange(filterId, null)}
              className="hover:bg-blue-200 rounded-full p-0.5"
            >
              <X className="w-3 h-3" />
            </button>
          </motion.div>
        );
      })}
    </AnimatePresence>
  );

  // Filter section component
  const FilterSection = ({ filter }: { filter: AdvancedFilter }) => {
    const [isOpen, setIsOpen] = useState(true);

    return (
      <div className="border border-gray-200 rounded-lg mb-4 overflow-hidden">
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleTrigger className="flex items-center justify-between w-full p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-3">
              {filter.icon && (
                <div className="text-gray-500">{filter.icon}</div>
              )}
              <div>
                <span className="font-medium text-gray-900">{filter.name}</span>
                {filter.metadata.trending && (
                  <Badge variant="destructive" className="ml-2 text-xs">
                    Hot
                  </Badge>
                )}
                {filter.metadata.premium && (
                  <Badge variant="secondary" className="ml-2 text-xs">
                    Premium
                  </Badge>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                {filter.metadata.resultsCount}
              </Badge>
              <motion.div
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </motion.div>
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <motion.div
              variants={filterVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="p-4 pt-0"
            >
              {renderFilterOption(filter)}
            </motion.div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    );
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Mobile Filter Button */}
      <div className="lg:hidden">
        <Sheet open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className="w-full relative">
              <SlidersHorizontal className="w-4 h-4 mr-2" />
              Advanced Filters
              {activeFiltersCount > 0 && (
                <Badge className="absolute -top-2 -right-2 min-w-5 h-5 text-xs">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-full max-w-md overflow-y-auto">
            <SheetHeader>
              <SheetTitle>Advanced Filters</SheetTitle>
            </SheetHeader>
            {/* Mobile filter content */}
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Filter Panel */}
      <div className="hidden lg:block">
        <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Filter className="w-5 h-5 text-gray-700" />
              <h3 className="font-semibold text-gray-900">Advanced Filters</h3>
            </div>
            <div className="flex items-center gap-2">
              {showAnalytics && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsAnalyticsOpen(!isAnalyticsOpen)}
                      >
                        <BarChart3 className="w-4 h-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Filter Analytics</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
              {activeFiltersCount > 0 && (
                <Badge variant="secondary">{activeFiltersCount} active</Badge>
              )}
            </div>
          </div>

          {/* Analytics Panel */}
          <AnimatePresence>
            {isAnalyticsOpen && (
              <motion.div
                variants={filterVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="bg-blue-50 rounded-lg p-4 space-y-3"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {filterAnalytics.resultsImpact}
                    </div>
                    <div className="text-sm text-blue-800">Results</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {filterAnalytics.activeFilters}
                    </div>
                    <div className="text-sm text-green-800">Active</div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Quick Filters */}
          {enableQuickFilters && <QuickFilters />}

          {/* Active Filter Chips */}
          {activeFiltersCount > 0 && (
            <div className="flex flex-wrap gap-2">
              <ActiveFiltersChips />
              <Button
                variant="outline"
                size="sm"
                onClick={clearFilters}
                className="text-xs"
              >
                <X className="w-3 h-3 mr-1" />
                Clear All
              </Button>
            </div>
          )}

          {/* Filter Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search filters..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filter Groups */}
          <div className="space-y-6">
            {Object.entries(filterGroups).map(([category, categoryFilters]) => {
              if (categoryFilters.length === 0) return null;
              
              return (
                <div key={category}>
                  <h4 className="font-medium text-gray-900 mb-3 capitalize flex items-center gap-2">
                    {category === 'premium' && <Star className="w-4 h-4 text-yellow-500" />}
                    {category === 'basic' && <Tag className="w-4 h-4 text-blue-500" />}
                    {category === 'advanced' && <SlidersHorizontal className="w-4 h-4 text-purple-500" />}
                    {category} Filters
                  </h4>
                  <div className="space-y-2">
                    {categoryFilters.map(filter => (
                      <FilterSection key={filter.id} filter={filter} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Saved Filters */}
          {enableSavedFilters && filterState.savedFilters.length > 0 && (
            <div>
              <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                <Save className="w-4 h-4 text-green-500" />
                Saved Filters
              </h4>
              <div className="space-y-2">
                {filterState.savedFilters.map(savedFilter => (
                  <div
                    key={savedFilter.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <div className="font-medium text-sm">{savedFilter.name}</div>
                      <div className="text-xs text-gray-500">
                        Used {savedFilter.usage} times
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => loadSavedFilter(savedFilter)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeSavedFilter(savedFilter.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Save Current Filters */}
          {enableSavedFilters && activeFiltersCount > 0 && (
            <div>
              <div className="flex gap-2">
                <Input
                  placeholder="Filter name..."
                  value={saveFilterName}
                  onChange={(e) => setSaveFilterName(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={saveCurrentFilters} size="sm">
                  <Save className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Apply/Clear Actions */}
          <div className="flex gap-3 pt-4 border-t">
            <Button 
              onClick={applyFilters} 
              className="flex-1"
              disabled={activeFiltersCount === 0}
            >
              Apply Filters ({products.length} results)
            </Button>
            <Button 
              variant="outline" 
              onClick={clearFilters}
              disabled={activeFiltersCount === 0}
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedFilterSystem;
