import { Product } from '@/types/product';
import { SearchResult } from './advancedSearch';
import { IntelligentSuggestion, SearchContext } from './intelligentSearch';

// Analytics event types
export interface SearchEvent {
  id: string;
  timestamp: Date;
  sessionId: string;
  userId?: string;
  type: 'search' | 'click' | 'conversion' | 'filter' | 'suggestion' | 'voice' | 'typo_correction';
  data: Record<string, any>;
  metadata: {
    userAgent: string;
    viewport: { width: number; height: number };
    location?: { country?: string; region?: string };
    deviceType: 'mobile' | 'desktop' | 'tablet';
    source: 'organic' | 'suggestion' | 'voice' | 'correction';
  };
}

// Search performance metrics
export interface SearchMetrics {
  query: string;
  timestamp: Date;
  performance: {
    searchTime: number; // milliseconds
    resultCount: number;
    avgRelevanceScore: number;
    topRelevanceScore: number;
    suggestionTime?: number;
  };
  userBehavior: {
    clickThroughRate: number;
    bounceRate: number;
    timeToFirstClick: number;
    scrollDepth: number;
    refinementCount: number;
  };
  conversionData: {
    conversions: number;
    conversionRate: number;
    revenue: number;
    avgOrderValue: number;
  };
}

// Popular search tracking
export interface PopularSearch {
  query: string;
  count: number;
  conversionRate: number;
  avgRelevanceScore: number;
  lastSearched: Date;
  trending: {
    velocity: number; // Growth rate
    weekOverWeek: number;
    monthOverMonth: number;
  };
  demographics: {
    topCountries: string[];
    topDevices: string[];
    topTimeRanges: string[];
  };
}

// Search failure analysis
export interface SearchFailure {
  query: string;
  timestamp: Date;
  failureType: 'no_results' | 'poor_results' | 'timeout' | 'error';
  context: {
    appliedFilters: Record<string, any>;
    previousQueries: string[];
    userSession: string;
  };
  suggestions: {
    didYouMean?: string;
    relatedQueries: string[];
    autoCorrection?: string;
  };
}

// User search behavior profile
export interface UserSearchProfile {
  userId: string;
  searchPatterns: {
    preferredCategories: string[];
    commonQueries: string[];
    searchFrequency: number;
    avgSessionDuration: number;
  };
  preferences: {
    preferredSortOrder: string;
    preferredViewMode: 'grid' | 'list';
    priceRange: [number, number];
    brands: string[];
  };
  behavior: {
    clickThroughRate: number;
    conversionRate: number;
    avgTimeToConversion: number;
    abandonmentRate: number;
  };
  intelligence: {
    searchSophistication: number; // 0-1 score
    queryComplexity: number;
    filterUsage: number;
    voiceSearchUsage: number;
  };
}

// Real-time search analytics
export interface SearchAnalytics {
  realTime: {
    activeSearchers: number;
    searchesPerMinute: number;
    topQueries: PopularSearch[];
    conversionRate: number;
    avgSearchTime: number;
  };
  performance: {
    searchLatency: {
      p50: number;
      p95: number;
      p99: number;
    };
    suggestionLatency: {
      p50: number;
      p95: number;
      p99: number;
    };
    errorRate: number;
    successRate: number;
  };
  userBehavior: {
    searchesToConversion: number;
    avgSessionSearches: number;
    refinementRate: number;
    voiceSearchAdoption: number;
  };
}

// Configuration for analytics
export const ANALYTICS_CONFIG = {
  SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutes
  BATCH_SIZE: 100,
  FLUSH_INTERVAL: 5000, // 5 seconds
  MAX_EVENTS_MEMORY: 1000,
  RETENTION_DAYS: 90,
  SAMPLING_RATE: 1.0, // 100% sampling in dev, adjust for production
  ENABLE_REAL_TIME: true,
  ENABLE_USER_PROFILES: true
} as const;

// Analytics class for tracking and analysis
export class SearchAnalyticsTracker {
  private events: SearchEvent[] = [];
  private sessionId: string;
  private userId?: string;
  private batchTimeout?: NodeJS.Timeout;
  private performanceObserver?: PerformanceObserver;

  constructor(userId?: string) {
    this.sessionId = this.generateSessionId();
    this.userId = userId;
    this.initializePerformanceTracking();
    this.startBatchFlush();
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private initializePerformanceTracking(): void {
    if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
      this.performanceObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.name.includes('search')) {
            this.trackPerformanceMetric(entry.name, entry.duration);
          }
        }
      });
      this.performanceObserver.observe({ entryTypes: ['measure'] });
    }
  }

  private startBatchFlush(): void {
    this.batchTimeout = setInterval(() => {
      this.flushEvents();
    }, ANALYTICS_CONFIG.FLUSH_INTERVAL);
  }

  private async flushEvents(): Promise<void> {
    if (this.events.length === 0) return;

    const eventsToFlush = [...this.events];
    this.events = [];

    try {
      // In a real application, this would send to your analytics service
      await this.sendToAnalyticsService(eventsToFlush);
    } catch (error) {
      console.error('Failed to flush analytics events:', error);
      // Re-add events back to queue with limit
      this.events = [...eventsToFlush.slice(-50), ...this.events].slice(0, ANALYTICS_CONFIG.MAX_EVENTS_MEMORY);
    }
  }

  private async sendToAnalyticsService(events: SearchEvent[]): Promise<void> {
    // Mock implementation - replace with actual analytics service
    if (process.env.NODE_ENV === 'development') {
      console.log('Analytics events:', events);
    }
    
    // Example: Send to your analytics endpoint
    // await fetch('/api/analytics/search', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ events })
    // });
  }

  private createEvent(type: SearchEvent['type'], data: Record<string, any>): SearchEvent {
    return {
      id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      sessionId: this.sessionId,
      userId: this.userId,
      type,
      data,
      metadata: {
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
        viewport: typeof window !== 'undefined' 
          ? { width: window.innerWidth, height: window.innerHeight }
          : { width: 1920, height: 1080 },
        deviceType: this.detectDeviceType(),
        source: data.source || 'organic'
      }
    };
  }

  private detectDeviceType(): 'mobile' | 'desktop' | 'tablet' {
    if (typeof window === 'undefined') return 'desktop';
    
    const width = window.innerWidth;
    if (width < 768) return 'mobile';
    if (width < 1024) return 'tablet';
    return 'desktop';
  }

  // Public tracking methods
  public trackSearch(query: string, results: SearchResult[], context: SearchContext, searchTime: number): void {
    const event = this.createEvent('search', {
      query: query.trim().toLowerCase(),
      resultCount: results.length,
      searchTime,
      avgRelevanceScore: results.reduce((sum, r) => sum + r.score, 0) / results.length || 0,
      topRelevanceScore: Math.max(...results.map(r => r.score), 0),
      appliedFilters: context.recentSearches.length > 0 ? { hasHistory: true } : {},
      queryLength: query.length,
      hasSpecialChars: /[^a-zA-Z0-9\s]/.test(query),
      isVoiceSearch: context.sessionSearches.some(s => s.includes('voice:')),
      searchMethod: 'text'
    });
    
    this.addEvent(event);
    performance.mark(`search-${query}-end`);
  }

  public trackSuggestionClick(suggestion: IntelligentSuggestion, position: number, query: string): void {
    const event = this.createEvent('suggestion', {
      originalQuery: query,
      selectedSuggestion: suggestion.text,
      suggestionType: suggestion.type,
      suggestionSource: suggestion.source,
      position,
      confidence: suggestion.confidence,
      score: suggestion.score,
      metadata: suggestion.metadata
    });
    
    this.addEvent(event);
  }

  public trackResultClick(result: SearchResult, position: number, query: string): void {
    const event = this.createEvent('click', {
      query,
      productId: result.product.id,
      productName: result.product.name,
      position,
      relevanceScore: result.score,
      matchedFields: result.matchedFields,
      price: result.product.sellingPrice,
      brand: result.product.brand?.name,
      category: result.product.category?.name
    });
    
    this.addEvent(event);
  }

  public trackConversion(productId: string, query: string, revenue: number, timeToConversion: number): void {
    const event = this.createEvent('conversion', {
      productId,
      originalQuery: query,
      revenue,
      timeToConversion,
      sessionSearches: this.getSessionSearchCount(),
      conversionType: 'purchase'
    });
    
    this.addEvent(event);
  }

  public trackFilterUsage(filterType: string, filterValue: any, resultCount: number): void {
    const event = this.createEvent('filter', {
      filterType,
      filterValue: JSON.stringify(filterValue),
      resultCount,
      appliedFiltersCount: 1 // Would be calculated based on active filters
    });
    
    this.addEvent(event);
  }

  public trackVoiceSearch(transcript: string, confidence: number, searchTime: number): void {
    const event = this.createEvent('voice', {
      transcript: transcript.toLowerCase(),
      confidence,
      searchTime,
      transcriptLength: transcript.length,
      hasCorrection: confidence < 0.8,
      source: 'voice'
    });
    
    this.addEvent(event);
  }

  public trackTypoCorrection(originalQuery: string, correctedQuery: string, accepted: boolean): void {
    const event = this.createEvent('typo_correction', {
      originalQuery,
      correctedQuery,
      accepted,
      editDistance: this.calculateEditDistance(originalQuery, correctedQuery),
      source: 'correction'
    });
    
    this.addEvent(event);
  }

  public trackPerformanceMetric(metricName: string, value: number): void {
    // Store performance metrics for batch processing
    this.addEvent(this.createEvent('search', {
      metric: metricName,
      value,
      timestamp: Date.now()
    }));
  }

  private calculateEditDistance(str1: string, str2: string): number {
    const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null));

    for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
    for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;

    for (let j = 1; j <= str2.length; j++) {
      for (let i = 1; i <= str1.length; i++) {
        const substitutionCost = str1[i - 1] === str2[j - 1] ? 0 : 1;
        matrix[j][i] = Math.min(
          matrix[j][i - 1] + 1,
          matrix[j - 1][i] + 1,
          matrix[j - 1][i - 1] + substitutionCost
        );
      }
    }

    return matrix[str2.length][str1.length];
  }

  private addEvent(event: SearchEvent): void {
    this.events.push(event);
    
    // Prevent memory overflow
    if (this.events.length > ANALYTICS_CONFIG.MAX_EVENTS_MEMORY) {
      this.events = this.events.slice(-ANALYTICS_CONFIG.MAX_EVENTS_MEMORY);
    }
  }

  private getSessionSearchCount(): number {
    return this.events.filter(e => e.type === 'search').length;
  }

  public getSessionAnalytics(): Partial<SearchAnalytics> {
    const searchEvents = this.events.filter(e => e.type === 'search');
    const clickEvents = this.events.filter(e => e.type === 'click');
    const conversionEvents = this.events.filter(e => e.type === 'conversion');

    const avgSearchTime = searchEvents.reduce((sum, e) => sum + (e.data.searchTime || 0), 0) / searchEvents.length || 0;
    const clickThroughRate = searchEvents.length > 0 ? clickEvents.length / searchEvents.length : 0;
    const conversionRate = searchEvents.length > 0 ? conversionEvents.length / searchEvents.length : 0;

    return {
      realTime: {
        activeSearchers: 1,
        searchesPerMinute: this.calculateSearchesPerMinute(),
        topQueries: this.getTopQueries(),
        conversionRate,
        avgSearchTime
      },
      userBehavior: {
        searchesToConversion: conversionEvents.length > 0 ? searchEvents.length / conversionEvents.length : 0,
        avgSessionSearches: searchEvents.length,
        refinementRate: this.calculateRefinementRate(),
        voiceSearchAdoption: this.calculateVoiceSearchAdoption()
      }
    };
  }

  private calculateSearchesPerMinute(): number {
    const recentEvents = this.events.filter(e => 
      e.type === 'search' && 
      Date.now() - e.timestamp.getTime() < 60000
    );
    return recentEvents.length;
  }

  private getTopQueries(): PopularSearch[] {
    const queryMap = new Map<string, { count: number; lastSearched: Date }>();
    
    this.events
      .filter(e => e.type === 'search')
      .forEach(e => {
        const query = e.data.query;
        const existing = queryMap.get(query) || { count: 0, lastSearched: new Date(0) };
        queryMap.set(query, {
          count: existing.count + 1,
          lastSearched: new Date(Math.max(existing.lastSearched.getTime(), e.timestamp.getTime()))
        });
      });

    return Array.from(queryMap.entries())
      .sort((a, b) => b[1].count - a[1].count)
      .slice(0, 10)
      .map(([query, data]) => ({
        query,
        count: data.count,
        conversionRate: this.calculateQueryConversionRate(query),
        avgRelevanceScore: this.calculateQueryAvgRelevance(query),
        lastSearched: data.lastSearched,
        trending: {
          velocity: 0.5, // Mock data
          weekOverWeek: 0.1,
          monthOverMonth: 0.2
        },
        demographics: {
          topCountries: ['US', 'UK', 'CA'],
          topDevices: ['desktop', 'mobile'],
          topTimeRanges: ['morning', 'evening']
        }
      }));
  }

  private calculateRefinementRate(): number {
    // Calculate how often users refine their searches
    const searchQueries = this.events
      .filter(e => e.type === 'search')
      .map(e => e.data.query);
    
    if (searchQueries.length < 2) return 0;
    
    let refinements = 0;
    for (let i = 1; i < searchQueries.length; i++) {
      if (searchQueries[i] !== searchQueries[i - 1]) {
        refinements++;
      }
    }
    
    return refinements / (searchQueries.length - 1);
  }

  private calculateVoiceSearchAdoption(): number {
    const totalSearches = this.events.filter(e => e.type === 'search').length;
    const voiceSearches = this.events.filter(e => e.type === 'voice').length;
    return totalSearches > 0 ? voiceSearches / totalSearches : 0;
  }

  private calculateQueryConversionRate(query: string): number {
    const searchesForQuery = this.events.filter(e => e.type === 'search' && e.data.query === query).length;
    const conversionsForQuery = this.events.filter(e => e.type === 'conversion' && e.data.originalQuery === query).length;
    return searchesForQuery > 0 ? conversionsForQuery / searchesForQuery : 0;
  }

  private calculateQueryAvgRelevance(query: string): number {
    const searchEvents = this.events.filter(e => e.type === 'search' && e.data.query === query);
    const totalRelevance = searchEvents.reduce((sum, e) => sum + (e.data.avgRelevanceScore || 0), 0);
    return searchEvents.length > 0 ? totalRelevance / searchEvents.length : 0;
  }

  public destroy(): void {
    if (this.batchTimeout) {
      clearInterval(this.batchTimeout);
    }
    if (this.performanceObserver) {
      this.performanceObserver.disconnect();
    }
    this.flushEvents(); // Final flush
  }
}

// Global analytics instance
let globalTracker: SearchAnalyticsTracker | null = null;

export const getAnalyticsTracker = (userId?: string): SearchAnalyticsTracker => {
  if (!globalTracker) {
    globalTracker = new SearchAnalyticsTracker(userId);
  }
  return globalTracker;
};

export const destroyAnalyticsTracker = (): void => {
  if (globalTracker) {
    globalTracker.destroy();
    globalTracker = null;
  }
};

// Utility functions for analytics
export const generateSearchReport = (events: SearchEvent[]): SearchAnalytics => {
  const searchEvents = events.filter(e => e.type === 'search');
  const clickEvents = events.filter(e => e.type === 'click');
  const conversionEvents = events.filter(e => e.type === 'conversion');

  return {
    realTime: {
      activeSearchers: new Set(events.map(e => e.sessionId)).size,
      searchesPerMinute: calculateSearchesPerMinute(events),
      topQueries: generateTopQueries(events),
      conversionRate: searchEvents.length > 0 ? conversionEvents.length / searchEvents.length : 0,
      avgSearchTime: searchEvents.reduce((sum, e) => sum + (e.data.searchTime || 0), 0) / searchEvents.length || 0
    },
    performance: {
      searchLatency: {
        p50: calculatePercentile(searchEvents.map(e => e.data.searchTime || 0), 50),
        p95: calculatePercentile(searchEvents.map(e => e.data.searchTime || 0), 95),
        p99: calculatePercentile(searchEvents.map(e => e.data.searchTime || 0), 99)
      },
      suggestionLatency: {
        p50: 50, // Mock data
        p95: 200,
        p99: 500
      },
      errorRate: 0.01,
      successRate: 0.99
    },
    userBehavior: {
      searchesToConversion: conversionEvents.length > 0 ? searchEvents.length / conversionEvents.length : 0,
      avgSessionSearches: searchEvents.length / new Set(searchEvents.map(e => e.sessionId)).size || 0,
      refinementRate: calculateRefinementRate(events),
      voiceSearchAdoption: events.filter(e => e.type === 'voice').length / searchEvents.length || 0
    }
  };
};

const calculateSearchesPerMinute = (events: SearchEvent[]): number => {
  const oneMinuteAgo = Date.now() - 60000;
  return events.filter(e => e.type === 'search' && e.timestamp.getTime() > oneMinuteAgo).length;
};

const generateTopQueries = (events: SearchEvent[]): PopularSearch[] => {
  const queryMap = new Map<string, number>();
  events.filter(e => e.type === 'search').forEach(e => {
    const query = e.data.query;
    queryMap.set(query, (queryMap.get(query) || 0) + 1);
  });

  return Array.from(queryMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([query, count]) => ({
      query,
      count,
      conversionRate: 0.05, // Mock data
      avgRelevanceScore: 0.8,
      lastSearched: new Date(),
      trending: {
        velocity: 0.1,
        weekOverWeek: 0.05,
        monthOverMonth: 0.15
      },
      demographics: {
        topCountries: ['US', 'UK'],
        topDevices: ['desktop'],
        topTimeRanges: ['morning']
      }
    }));
};

const calculatePercentile = (values: number[], percentile: number): number => {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const index = Math.ceil((percentile / 100) * sorted.length) - 1;
  return sorted[Math.max(0, index)];
};

const calculateRefinementRate = (events: SearchEvent[]): number => {
  const sessionSearches = new Map<string, string[]>();
  
  events.filter(e => e.type === 'search').forEach(e => {
    const queries = sessionSearches.get(e.sessionId) || [];
    queries.push(e.data.query);
    sessionSearches.set(e.sessionId, queries);
  });

  let totalRefinements = 0;
  let totalSessions = 0;

  for (const queries of sessionSearches.values()) {
    if (queries.length > 1) {
      totalSessions++;
      for (let i = 1; i < queries.length; i++) {
        if (queries[i] !== queries[i - 1]) {
          totalRefinements++;
        }
      }
    }
  }

  return totalSessions > 0 ? totalRefinements / totalSessions : 0;
};
