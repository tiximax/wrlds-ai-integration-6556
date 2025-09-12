import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  SearchAnalytics,
  PopularSearch,
  SearchEvent,
  SearchMetrics,
  UserSearchProfile,
  SearchFailure,
  generateSearchReport,
  getAnalyticsTracker
} from '@/utils/searchAnalytics';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { 
  Search, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Clock, 
  Target, 
  Filter, 
  Mic, 
  Eye, 
  AlertCircle, 
  CheckCircle, 
  Activity,
  Calendar,
  Download,
  RefreshCw
} from 'lucide-react';

interface SearchAnalyticsDashboardProps {
  className?: string;
  refreshInterval?: number;
  userId?: string;
  onExport?: (data: SearchAnalytics) => void;
}

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: React.ReactNode;
  color: 'blue' | 'green' | 'purple' | 'orange' | 'red';
  loading?: boolean;
}

const MetricCard: React.FC<MetricCardProps> = ({ 
  title, 
  value, 
  change, 
  icon, 
  color, 
  loading 
}) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600 border-blue-200',
    green: 'bg-green-50 text-green-600 border-green-200',
    purple: 'bg-purple-50 text-purple-600 border-purple-200',
    orange: 'bg-orange-50 text-orange-600 border-orange-200',
    red: 'bg-red-50 text-red-600 border-red-200'
  };

  const changeColor = change && change > 0 ? 'text-green-500' : 'text-red-500';
  const changeIcon = change && change > 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-6 rounded-lg border ${colorClasses[color]} bg-white shadow-sm hover:shadow-md transition-shadow`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
            {icon}
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900">
              {loading ? (
                <div className="animate-pulse bg-gray-200 h-8 w-16 rounded"></div>
              ) : (
                value
              )}
            </p>
          </div>
        </div>
        {change !== undefined && (
          <div className={`flex items-center space-x-1 ${changeColor}`}>
            {changeIcon}
            <span className="text-sm font-medium">{Math.abs(change)}%</span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

interface TopQueryItemProps {
  query: PopularSearch;
  rank: number;
}

const TopQueryItem: React.FC<TopQueryItemProps> = ({ query, rank }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: rank * 0.1 }}
    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
  >
    <div className="flex items-center space-x-3">
      <div className="flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-600 rounded-full text-sm font-semibold">
        {rank}
      </div>
      <div>
        <p className="font-medium text-gray-900">{query.query}</p>
        <p className="text-sm text-gray-500">
          {query.count} searches • {(query.conversionRate * 100).toFixed(1)}% conversion
        </p>
      </div>
    </div>
    <div className="flex items-center space-x-2">
      {query.trending.velocity > 0 ? (
        <TrendingUp className="h-4 w-4 text-green-500" />
      ) : (
        <TrendingDown className="h-4 w-4 text-red-500" />
      )}
      <span className="text-sm text-gray-500">
        {(query.trending.velocity * 100).toFixed(0)}%
      </span>
    </div>
  </motion.div>
);

const SearchAnalyticsDashboard: React.FC<SearchAnalyticsDashboardProps> = ({
  className = '',
  refreshInterval = 30000,
  userId,
  onExport
}) => {
  const [analytics, setAnalytics] = useState<SearchAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'performance' | 'behavior' | 'queries'>('overview');
  const [timeRange, setTimeRange] = useState<'1h' | '24h' | '7d' | '30d'>('24h');
  const [lastRefresh, setLastRefresh] = useState(new Date());

  // Mock data for demonstration
  const mockAnalytics: SearchAnalytics = {
    realTime: {
      activeSearchers: 24,
      searchesPerMinute: 3.2,
      topQueries: [
        {
          query: 'wireless headphones',
          count: 245,
          conversionRate: 0.08,
          avgRelevanceScore: 0.87,
          lastSearched: new Date(),
          trending: { velocity: 0.15, weekOverWeek: 0.12, monthOverMonth: 0.23 },
          demographics: { topCountries: ['US', 'UK', 'CA'], topDevices: ['mobile', 'desktop'], topTimeRanges: ['evening', 'afternoon'] }
        },
        {
          query: 'smartphone case',
          count: 189,
          conversionRate: 0.12,
          avgRelevanceScore: 0.91,
          lastSearched: new Date(),
          trending: { velocity: 0.08, weekOverWeek: 0.05, monthOverMonth: 0.18 },
          demographics: { topCountries: ['US', 'DE', 'FR'], topDevices: ['mobile', 'tablet'], topTimeRanges: ['morning', 'evening'] }
        },
        {
          query: 'gaming laptop',
          count: 167,
          conversionRate: 0.06,
          avgRelevanceScore: 0.83,
          lastSearched: new Date(),
          trending: { velocity: -0.02, weekOverWeek: -0.03, monthOverMonth: 0.10 },
          demographics: { topCountries: ['US', 'UK', 'AU'], topDevices: ['desktop', 'mobile'], topTimeRanges: ['evening', 'night'] }
        }
      ],
      conversionRate: 0.089,
      avgSearchTime: 145
    },
    performance: {
      searchLatency: { p50: 89, p95: 245, p99: 567 },
      suggestionLatency: { p50: 23, p95: 78, p99: 156 },
      errorRate: 0.012,
      successRate: 0.988
    },
    userBehavior: {
      searchesToConversion: 3.4,
      avgSessionSearches: 2.7,
      refinementRate: 0.34,
      voiceSearchAdoption: 0.18
    }
  };

  const fetchAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      // In a real application, this would fetch from your analytics API
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
      setAnalytics(mockAnalytics);
      setLastRefresh(new Date());
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnalytics();
    const interval = setInterval(fetchAnalytics, refreshInterval);
    return () => clearInterval(interval);
  }, [fetchAnalytics, refreshInterval]);

  const handleExport = () => {
    if (analytics && onExport) {
      onExport(analytics);
    }
  };

  const handleRefresh = () => {
    fetchAnalytics();
  };

  if (!analytics) {
    return (
      <div className={`p-6 bg-white rounded-lg shadow-sm ${className}`}>
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <Activity className="h-4 w-4" /> },
    { id: 'performance', label: 'Performance', icon: <Clock className="h-4 w-4" /> },
    { id: 'behavior', label: 'User Behavior', icon: <Users className="h-4 w-4" /> },
    { id: 'queries', label: 'Top Queries', icon: <Search className="h-4 w-4" /> }
  ];

  const timeRangeOptions = [
    { value: '1h', label: '1 Hour' },
    { value: '24h', label: '24 Hours' },
    { value: '7d', label: '7 Days' },
    { value: '30d', label: '30 Days' }
  ];

  const performanceData = [
    { name: 'P50', search: analytics.performance.searchLatency.p50, suggestion: analytics.performance.suggestionLatency.p50 },
    { name: 'P95', search: analytics.performance.searchLatency.p95, suggestion: analytics.performance.suggestionLatency.p95 },
    { name: 'P99', search: analytics.performance.searchLatency.p99, suggestion: analytics.performance.suggestionLatency.p99 }
  ];

  const behaviorData = [
    { name: 'Text Search', value: (1 - analytics.userBehavior.voiceSearchAdoption) * 100, color: '#3B82F6' },
    { name: 'Voice Search', value: analytics.userBehavior.voiceSearchAdoption * 100, color: '#10B981' }
  ];

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  return (
    <div className={`bg-white rounded-lg shadow-sm ${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Search Analytics</h2>
            <p className="text-sm text-gray-500 mt-1">
              Last updated: {lastRefresh.toLocaleTimeString()}
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Time Range Selector */}
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {timeRangeOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            {/* Action Buttons */}
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>

            <button
              onClick={handleExport}
              className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Download className="h-4 w-4" />
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mt-6 border-b border-gray-200">
          <nav className="flex space-x-8">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 pb-3 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.icon}
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <MetricCard
                  title="Active Searchers"
                  value={analytics.realTime.activeSearchers}
                  change={12.3}
                  icon={<Users className="h-5 w-5" />}
                  color="blue"
                  loading={loading}
                />
                <MetricCard
                  title="Searches/Min"
                  value={analytics.realTime.searchesPerMinute.toFixed(1)}
                  change={-2.1}
                  icon={<Activity className="h-5 w-5" />}
                  color="green"
                  loading={loading}
                />
                <MetricCard
                  title="Conversion Rate"
                  value={`${(analytics.realTime.conversionRate * 100).toFixed(1)}%`}
                  change={5.7}
                  icon={<Target className="h-5 w-5" />}
                  color="purple"
                  loading={loading}
                />
                <MetricCard
                  title="Avg Search Time"
                  value={`${analytics.realTime.avgSearchTime}ms`}
                  change={-8.9}
                  icon={<Clock className="h-5 w-5" />}
                  color="orange"
                  loading={loading}
                />
              </div>

              {/* Real-time Activity Chart */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Real-time Search Activity</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={[
                    { time: '00:00', searches: 12, conversions: 1 },
                    { time: '04:00', searches: 8, conversions: 0 },
                    { time: '08:00', searches: 32, conversions: 3 },
                    { time: '12:00', searches: 45, conversions: 4 },
                    { time: '16:00', searches: 38, conversions: 3 },
                    { time: '20:00', searches: 28, conversions: 2 }
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="searches"
                      stackId="1"
                      stroke="#3B82F6"
                      fill="#3B82F6"
                      fillOpacity={0.6}
                      name="Searches"
                    />
                    <Area
                      type="monotone"
                      dataKey="conversions"
                      stackId="2"
                      stroke="#10B981"
                      fill="#10B981"
                      fillOpacity={0.6}
                      name="Conversions"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          )}

          {activeTab === 'performance' && (
            <motion.div
              key="performance"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Performance Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <MetricCard
                  title="Success Rate"
                  value={`${(analytics.performance.successRate * 100).toFixed(1)}%`}
                  change={0.2}
                  icon={<CheckCircle className="h-5 w-5" />}
                  color="green"
                />
                <MetricCard
                  title="Error Rate"
                  value={`${(analytics.performance.errorRate * 100).toFixed(2)}%`}
                  change={-15.3}
                  icon={<AlertCircle className="h-5 w-5" />}
                  color="red"
                />
                <MetricCard
                  title="P95 Latency"
                  value={`${analytics.performance.searchLatency.p95}ms`}
                  change={-12.1}
                  icon={<Clock className="h-5 w-5" />}
                  color="blue"
                />
                <MetricCard
                  title="Suggestion Speed"
                  value={`${analytics.performance.suggestionLatency.p50}ms`}
                  change={-5.7}
                  icon={<Search className="h-5 w-5" />}
                  color="purple"
                />
              </div>

              {/* Latency Chart */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Latency Distribution</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="search" fill="#3B82F6" name="Search Latency (ms)" />
                    <Bar dataKey="suggestion" fill="#10B981" name="Suggestion Latency (ms)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          )}

          {activeTab === 'behavior' && (
            <motion.div
              key="behavior"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Behavior Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <MetricCard
                  title="Searches to Conversion"
                  value={analytics.userBehavior.searchesToConversion.toFixed(1)}
                  change={-8.3}
                  icon={<Target className="h-5 w-5" />}
                  color="purple"
                />
                <MetricCard
                  title="Avg Session Searches"
                  value={analytics.userBehavior.avgSessionSearches.toFixed(1)}
                  change={3.2}
                  icon={<Activity className="h-5 w-5" />}
                  color="blue"
                />
                <MetricCard
                  title="Refinement Rate"
                  value={`${(analytics.userBehavior.refinementRate * 100).toFixed(0)}%`}
                  change={-1.7}
                  icon={<Filter className="h-5 w-5" />}
                  color="orange"
                />
                <MetricCard
                  title="Voice Search Adoption"
                  value={`${(analytics.userBehavior.voiceSearchAdoption * 100).toFixed(0)}%`}
                  change={23.8}
                  icon={<Mic className="h-5 w-5" />}
                  color="green"
                />
              </div>

              {/* Search Method Distribution */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Search Method Distribution</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={behaviorData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {behaviorData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">User Engagement Trends</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={[
                      { day: 'Mon', engagement: 2.3, retention: 0.68 },
                      { day: 'Tue', engagement: 2.7, retention: 0.72 },
                      { day: 'Wed', engagement: 2.5, retention: 0.69 },
                      { day: 'Thu', engagement: 3.1, retention: 0.75 },
                      { day: 'Fri', engagement: 2.8, retention: 0.71 },
                      { day: 'Sat', engagement: 2.4, retention: 0.67 },
                      { day: 'Sun', engagement: 2.2, retention: 0.65 }
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="engagement" 
                        stroke="#3B82F6" 
                        name="Avg Searches per Session"
                        strokeWidth={2}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="retention" 
                        stroke="#10B981" 
                        name="Retention Rate"
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'queries' && (
            <motion.div
              key="queries"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Top Queries List */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Top Search Queries</h3>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Eye className="h-4 w-4" />
                    <span>Last {timeRange}</span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  {analytics.realTime.topQueries.map((query, index) => (
                    <TopQueryItem key={query.query} query={query} rank={index + 1} />
                  ))}
                </div>
              </div>

              {/* Query Performance Chart */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Query Performance Comparison</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analytics.realTime.topQueries.slice(0, 5)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="query" 
                      angle={-45}
                      textAnchor="end"
                      height={80}
                      interval={0}
                    />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="#3B82F6" name="Search Count" />
                    <Bar 
                      dataKey={(entry) => entry.conversionRate * 1000} 
                      fill="#10B981" 
                      name="Conversion Rate (‰)"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SearchAnalyticsDashboard;
