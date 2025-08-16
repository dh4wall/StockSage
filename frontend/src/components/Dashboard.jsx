import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Sidebar, SidebarHeader, SidebarContent, SidebarTrigger } from './ui/Sidebar.jsx';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card.jsx';
import { StockChart } from './StockChart.jsx';
import { StockDetails } from './StockDetails.jsx';
import {
  Search,
  Star,
  StarOff,
  Filter,
  X,
  TrendingUp,
  TrendingDown,
  Building2,
  Brain,
  Zap,
  AlertTriangle,
  DollarSign,
  Activity,
  Target,
  Sparkles,
  Menu,
  ChevronLeft,
  ChevronDown
} from 'lucide-react';
import { Input } from './ui/Input.jsx';
import { AppNavbar } from './AppNavbar.jsx';
import { Button } from './ui/Button.jsx';
import { Chatbot } from './Chatbot.jsx';
import ThemeToggle from './ThemeToggle.jsx';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Slider Component
const Slider = ({ value = [0], onValueChange, min = 0, max = 100, step = 1, className = "" }) => {
  const handleChange = (e) => {
    const newValue = parseInt(e.target.value);
    onValueChange([newValue]);
  };

  const percentage = ((value[0] - min) / (max - min)) * 100;

  return (
    <div className={`relative w-full ${className}`}>
      <div className="relative">
        {/* Track */}
        <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
          {/* Filled track */}
          <div
            className="h-2 bg-primary rounded-full transition-all duration-200"
            style={{ width: `${percentage}%` }}
          />
        </div>

        {/* Thumb */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value[0]}
          onChange={handleChange}
          className="absolute inset-0 w-full h-2 opacity-0 cursor-pointer"
        />

        {/* Visible thumb */}
        <div
          className="absolute top-1/2 w-4 h-4 bg-primary border-2 border-white rounded-full shadow-md transform -translate-y-1/2 transition-all duration-200 hover:scale-110"
          style={{ left: `calc(${percentage}% - 8px)` }}
        />
      </div>
    </div>
  );
};

const CompanyList = ({ companies, selectedCompany, onSelect, favorites, onToggleFavorite }) => {
  const [contextMenu, setContextMenu] = useState({ show: false, x: 0, y: 0, company: null });

  const handleRightClick = (e, company) => {
    e.preventDefault();
    setContextMenu({
      show: true,
      x: e.clientX,
      y: e.clientY,
      company
    });
  };

  const handleContextMenuAction = (action) => {
    if (action === 'favorite' && contextMenu.company) {
      onToggleFavorite(contextMenu.company.symbol);
    }
    setContextMenu({ show: false, x: 0, y: 0, company: null });
  };

  useEffect(() => {
    const handleClickOutside = () => {
      setContextMenu({ show: false, x: 0, y: 0, company: null });
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const sortedCompanies = useMemo(() => {
    return [...companies].sort((a, b) => {
      const aIsFavorite = favorites.includes(a.symbol);
      const bIsFavorite = favorites.includes(b.symbol);

      if (aIsFavorite && !bIsFavorite) return -1;
      if (!aIsFavorite && bIsFavorite) return 1;
      return a.name.localeCompare(b.name);
    });
  }, [companies, favorites]);

  return (
    <div className="h-full flex flex-col relative">
      {/* Fixed height scrollable container */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden px-2 sm:px-4 py-2 space-y-1 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-gray-100 dark:scrollbar-track-gray-800 hover:scrollbar-thumb-gray-400 dark:hover:scrollbar-thumb-gray-500">
        {sortedCompanies.map(c => (
          <button
            key={c.symbol}
            onClick={() => onSelect(c)}
            onContextMenu={(e) => handleRightClick(e, c)}
            className={`w-full text-left p-2 sm:p-3 rounded-lg flex items-center gap-2 sm:gap-3 transition-all duration-200 ${
              selectedCompany?.symbol === c.symbol
                ? 'bg-primary/10 text-primary border border-primary/20'
                : 'hover:bg-muted/50 border border-transparent'
            }`}
          >
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Building2 className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1 sm:gap-2">
                  <span className="font-medium text-xs sm:text-sm truncate">{c.name}</span>
                  {favorites.includes(c.symbol) && (
                    <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500 fill-current flex-shrink-0" />
                  )}
                </div>
                <div className="flex items-center gap-1 sm:gap-2 text-xs text-muted-foreground">
                  <span>{c.symbol}</span>
                  {c.sector && (
                    <>
                      <span className="hidden sm:inline">•</span>
                      <span className="truncate hidden sm:inline">{c.sector}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </button>
        ))}

        {/* Empty state */}
        {sortedCompanies.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Building2 className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 opacity-50" />
            <p className="text-xs sm:text-sm">No companies found</p>
          </div>
        )}
      </div>

      {/* Context Menu */}
      {contextMenu.show && (
        <div
          className="fixed bg-card border rounded-lg shadow-lg py-1 z-50"
          style={{ left: contextMenu.x, top: contextMenu.y }}
        >
          <button
            onClick={() => handleContextMenuAction('favorite')}
            className="w-full px-4 py-2 text-left text-sm hover:bg-muted flex items-center gap-2"
          >
            {favorites.includes(contextMenu.company?.symbol) ? (
              <>
                <StarOff className="w-4 h-4" />
                Remove from Favorites
              </>
            ) : (
              <>
                <Star className="w-4 h-4" />
                Add to Favorites
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [marketCapFilter, setMarketCapFilter] = useState('all');
  const [sectorFilter, setSectorFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [stockData, setStockData] = useState([]);
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('stockDashboard_favorites');
    return saved ? JSON.parse(saved) : [];
  });

  // Mobile sidebar state
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarOpen && window.innerWidth < 1024) {
        const sidebar = document.getElementById('mobile-sidebar');
        if (sidebar && !sidebar.contains(event.target)) {
          setSidebarOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [sidebarOpen]);

  // Forecast states - FIXED INITIALIZATION
  const [forecastData, setForecastData] = useState(null);
  const [forecastLoading, setForecastLoading] = useState(false);
  const [forecastError, setForecastError] = useState(null);
  const [forecastPeriod, setForecastPeriod] = useState(7);
  const [showForecast, setShowForecast] = useState(true); // Changed to true by default

  useEffect(() => {
    fetchCompanies();
  }, []);

  useEffect(() => {
    if (selectedCompany) {
      fetchStockData(selectedCompany.symbol);
      // Reset forecast when company changes but keep showing the section
      setForecastData(null);
      setForecastError(null);
      setForecastLoading(false);
      // Close sidebar on mobile when company is selected
      if (window.innerWidth < 1024) {
        setSidebarOpen(false);
      }
    }
  }, [selectedCompany]);

  useEffect(() => {
    localStorage.setItem('stockDashboard_favorites', JSON.stringify(favorites));
  }, [favorites]);

  const fetchCompanies = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/companies`);
      setCompanies(response.data);
    } catch (err) {
      console.error('Failed to fetch companies:', err);
    }
  };

  const fetchStockData = async (symbol) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/stock/${symbol}`);
      setStockData(response.data);
    } catch (err) {
      console.error('Failed to fetch stock data:', err);
    }
  };

  // ENHANCED FORECAST FUNCTION WITH BETTER DEBUGGING
  const generateAIForecast = async () => {
    if (!selectedCompany) {
      console.log('No company selected');
      alert('No company selected');
      return;
    }

    console.log('Starting forecast generation for:', selectedCompany.symbol);
    setForecastLoading(true);
    setForecastError(null);

    try {
      const forecastUrl = `${API_BASE_URL}/api/forecast/${selectedCompany.symbol}?period=${forecastPeriod}`;
      console.log('Making API call to:', forecastUrl);

      const response = await axios.get(forecastUrl, {
        timeout: 30000,
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log('Forecast API response:', response.data);

      if (!response.data || typeof response.data !== 'object') {
        throw new Error('Invalid response format from server');
      }

      if (!response.data.forecast) {
        throw new Error('Missing forecast data in response');
      }

      setForecastData(response.data);
      setForecastError(null);
      console.log('Forecast data set successfully');

    } catch (err) {
      console.error('Forecast error details:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        url: err.config?.url,
        code: err.code
      });

      let errorMessage = 'Failed to generate forecast';

      if (err.code === 'ECONNREFUSED' || err.message.includes('ECONNREFUSED')) {
        errorMessage = `Cannot connect to server. Make sure your backend server is running on ${API_BASE_URL}`;
      } else if (err.response?.status === 404) {
        errorMessage = 'Forecast endpoint not found. Check if /api/forecast route exists in your backend.';
      } else if (err.response?.status === 500) {
        errorMessage = err.response.data?.error || 'Server error occurred';
      } else if (err.code === 'ECONNABORTED') {
        errorMessage = 'Request timed out. Please try again.';
      } else if (err.message.includes('Network Error')) {
        errorMessage = 'Network error. Check if backend is running and accessible.';
      } else if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      }

      setForecastError(errorMessage);
      setForecastData(null);
      console.log('Error set:', errorMessage);
    } finally {
      setForecastLoading(false);
      console.log('Forecast loading finished');
    }
  };

  const toggleFavorite = (symbol) => {
    setFavorites(prev =>
      prev.includes(symbol)
        ? prev.filter(s => s !== symbol)
        : [...prev, symbol]
    );
  };

  const clearFilters = () => {
    setSearchQuery('');
    setMarketCapFilter('all');
    setSectorFilter('all');
    setSortBy('name');
  };

  // Enhanced filtering logic with new market cap and sector categorization
  const filteredCompanies = useMemo(() => {
    let filtered = companies.filter(c => {
      const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           c.symbol.toLowerCase().includes(searchQuery.toLowerCase());

      // Enhanced market cap filtering
      let matchesMarketCap = true;
      if (marketCapFilter !== 'all') {
        const marketCapValue = parseFloat(c.marketCapValue) || 0; // Assuming this field exists
        switch (marketCapFilter) {
          case 'large':
            matchesMarketCap = marketCapValue >= 10000000000; // $10B+
            break;
          case 'mid':
            matchesMarketCap = marketCapValue >= 2000000000 && marketCapValue < 10000000000; // $2B-$10B
            break;
          case 'small':
            matchesMarketCap = marketCapValue < 2000000000; // <$2B
            break;
          default:
            matchesMarketCap = true;
        }
      }

      // Enhanced sector filtering
      let matchesSector = true;
      if (sectorFilter !== 'all') {
        const sectorLower = (c.sector || '').toLowerCase();
        switch (sectorFilter) {
          case 'technology':
            matchesSector = sectorLower.includes('tech') || sectorLower.includes('software') || sectorLower.includes('internet');
            break;
          case 'healthcare':
            matchesSector = sectorLower.includes('health') || sectorLower.includes('pharma') || sectorLower.includes('biotech');
            break;
          case 'financials':
            matchesSector = sectorLower.includes('financial') || sectorLower.includes('bank') || sectorLower.includes('insurance');
            break;
          case 'energy':
            matchesSector = sectorLower.includes('energy') || sectorLower.includes('oil') || sectorLower.includes('gas');
            break;
          case 'consumer-discretionary':
            matchesSector = sectorLower.includes('consumer') && sectorLower.includes('discretionary');
            break;
          case 'consumer-staples':
            matchesSector = sectorLower.includes('consumer') && sectorLower.includes('staples');
            break;
          case 'industrials':
            matchesSector = sectorLower.includes('industrial') || sectorLower.includes('manufacturing');
            break;
          case 'materials':
            matchesSector = sectorLower.includes('materials') || sectorLower.includes('mining');
            break;
          case 'utilities':
            matchesSector = sectorLower.includes('utilities') || sectorLower.includes('utility');
            break;
          case 'real-estate':
            matchesSector = sectorLower.includes('real estate') || sectorLower.includes('reit');
            break;
          case 'telecommunications':
            matchesSector = sectorLower.includes('telecom') || sectorLower.includes('communication');
            break;
          default:
            matchesSector = c.sector === sectorFilter;
        }
      }

      return matchesSearch && matchesMarketCap && matchesSector;
    });

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'symbol':
          return a.symbol.localeCompare(b.symbol);
        case 'sector':
          return (a.sector || '').localeCompare(b.sector || '');
        case 'marketCap':
          return (a.marketCap || '').localeCompare(b.marketCap || '');
        default:
          return a.name.localeCompare(b.name);
      }
    });

    return filtered;
  }, [searchQuery, companies, marketCapFilter, sectorFilter, sortBy]);

  const uniqueSectors = useMemo(() => {
    const sectors = [...new Set(companies.map(c => c.sector).filter(Boolean))];
    return sectors.sort();
  }, [companies]);

  const uniqueMarketCaps = useMemo(() => {
    const caps = [...new Set(companies.map(c => c.marketCap).filter(Boolean))];
    return caps.sort();
  }, [companies]);

  const activeFiltersCount = [
    searchQuery,
    marketCapFilter !== 'all' ? marketCapFilter : null,
    sectorFilter !== 'all' ? sectorFilter : null,
    sortBy !== 'name' ? sortBy : null
  ].filter(Boolean).length;

  // Helper functions for forecast
  const currentPrice = stockData[stockData.length - 1]?.close || 0;
  const previousPrice = stockData[stockData.length - 2]?.close || currentPrice;
  const priceChange = currentPrice - previousPrice;

  const formatPeriodLabel = (days) => {
    if (days === 1) return '1 Day';
    if (days <= 7) return `${days} Days`;
    if (days <= 30) return `${Math.round(days / 7)} Week${Math.round(days / 7) > 1 ? 's' : ''}`;
    return `${Math.round(days / 30)} Month${Math.round(days / 30) > 1 ? 's' : ''}`;
  };

  const ForecastCard = ({ title, value, icon: Icon, trend, confidence, description }) => (
    <Card className="relative overflow-hidden">
      <div className="absolute top-0 right-0 w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-primary/10 to-transparent rounded-bl-full"></div>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
            <CardTitle className="text-xs sm:text-sm font-medium">{title}</CardTitle>
          </div>
          {confidence && (
            <div className="text-xs text-muted-foreground">
              {confidence}% confidence
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-baseline gap-2">
            <span className="text-lg sm:text-xl font-bold">{value}</span>
            {trend && (
              <div className={`flex items-center gap-1 text-xs ${trend.positive ? 'text-green-600' : 'text-red-600'}`}>
                {trend.positive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                <span>{trend.value}</span>
              </div>
            )}
          </div>
          {description && (
            <p className="text-xs text-muted-foreground line-clamp-2">{description}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <AppNavbar />
      <div className="flex flex-1 relative overflow-hidden">
        {/* Mobile overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => {
              console.log('Overlay clicked, closing sidebar');
              setSidebarOpen(false);
            }}
          />
        )}

        {/* FIXED SIDEBAR - Now properly fixed for large screens too */}
        <div 
          id="mobile-sidebar"
          className={`
            fixed inset-y-0 left-0 z-50 w-80 sm:w-96 lg:w-80
            transition-transform duration-300 ease-in-out
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            lg:pt-16
          `}
          style={{
            // Force fixed positioning and proper height on all screen sizes
            position: 'fixed',
            top: '0',
            left: sidebarOpen || window.innerWidth >= 1024 ? '0' : '-100%',
            height: '100vh',
            zIndex: 50
          }}
        >
          {/* CRITICAL: Set explicit height and flex structure */}
          <div className="w-full h-full border-r bg-background flex flex-col shadow-lg lg:shadow-md">
            {/* Mobile close button */}
            <div className="lg:hidden flex justify-between items-center p-4 border-b bg-background flex-shrink-0">
              <h2 className="font-semibold text-lg">Companies</h2>
              <button
                onClick={() => {
                  console.log('Close button clicked');
                  setSidebarOpen(false);
                }}
                className="h-8 w-8 p-0 hover:bg-muted rounded-full flex items-center justify-center"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Header Section - Fixed height, no flex-grow */}
            <div className="flex-shrink-0 border-b bg-background">
              <div className="p-3 sm:p-4 space-y-3 sm:space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search companies..."
                    className="pl-8 text-sm bg-background"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Filter className="h-4 w-4" />
                    Filters
                    {activeFiltersCount > 0 && (
                      <span className="bg-primary text-primary-foreground text-xs px-1.5 py-0.5 rounded-full">
                        {activeFiltersCount}
                      </span>
                    )}
                  </button>
                  {activeFiltersCount > 0 && (
                    <button
                      onClick={clearFilters}
                      className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <X className="h-3 w-3" />
                      Clear
                    </button>
                  )}
                </div>

                {showFilters && (
                  <div className="space-y-3 p-3 bg-muted/30 rounded-lg">
                    <div>
                      <label className="text-xs font-medium text-muted-foreground mb-1 block">Market Cap</label>
                      <select 
                        value={marketCapFilter} 
                        onChange={(e) => setMarketCapFilter(e.target.value)}
                        className="w-full h-8 px-3 text-sm border border-input bg-background hover:bg-accent rounded-md transition-colors"
                      >
                        <option value="all">All Market Caps</option>
                        <option value="large">Large Cap ({`>`}$10B)</option>
                        <option value="mid">Mid Cap ($2B-$10B)</option>
                        <option value="small">Small Cap ({`<`}$2B)</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-medium text-muted-foreground mb-1 block">Sector</label>
                      <select 
                        value={sectorFilter} 
                        onChange={(e) => setSectorFilter(e.target.value)}
                        className="w-full h-8 px-3 text-sm border border-input bg-background hover:bg-accent rounded-md transition-colors"
                      >
                        <option value="all">All Sectors</option>
                        <option value="technology">Technology</option>
                        <option value="healthcare">Healthcare</option>
                        <option value="financials">Financials</option>
                        <option value="energy">Energy</option>
                        <option value="consumer-discretionary">Consumer Discretionary</option>
                        <option value="consumer-staples">Consumer Staples</option>
                        <option value="industrials">Industrials</option>
                        <option value="materials">Materials</option>
                        <option value="utilities">Utilities</option>
                        <option value="real-estate">Real Estate</option>
                        <option value="telecommunications">Telecommunications</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-medium text-muted-foreground mb-1 block">Sort By</label>
                      <select 
                        value={sortBy} 
                        onChange={(e) => setSortBy(e.target.value)}
                        className="w-full h-8 px-3 text-sm border border-input bg-background hover:bg-accent rounded-md transition-colors"
                      >
                        <option value="name">Company Name</option>
                        <option value="symbol">Symbol</option>
                        <option value="sector">Sector</option>
                        <option value="marketCap">Market Cap</option>
                      </select>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{filteredCompanies.length} companies</span>
                  {favorites.length > 0 && (
                    <span className="flex items-center gap-1">
                      <Star className="h-3 w-3 text-yellow-500 fill-current" />
                      {favorites.length} favorites
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* CRITICAL: Scrollable Content Section with proper flex-1 and min-height-0 */}
            <div className="flex-1 min-h-0 bg-background">
              <div 
                className="h-full overflow-y-auto overflow-x-hidden sidebar-scroll scrollbar-thin scrollbar-thumb-slate-400 dark:scrollbar-thumb-slate-600 scrollbar-track-transparent hover:scrollbar-thumb-slate-500 dark:hover:scrollbar-thumb-slate-500"
              >
                {/* Enhanced scrollbar styles for webkit browsers to match dark theme */}
                <style jsx>{`
                  .sidebar-scroll::-webkit-scrollbar {
                    width: 10px;
                  }
                  .sidebar-scroll::-webkit-scrollbar-track {
                    background: transparent;
                    border-radius: 8px;
                  }
                  .sidebar-scroll::-webkit-scrollbar-thumb {
                    background: rgba(148, 163, 184, 0.4);
                    border-radius: 6px;
                    border: none;
                  }
                  .sidebar-scroll::-webkit-scrollbar-thumb:hover {
                    background: rgba(148, 163, 184, 0.6);
                  }
                  .sidebar-scroll::-webkit-scrollbar-thumb:active {
                    background: rgba(59, 130, 246, 0.8);
                  }
                  
                  /* Dark theme styles */
                  .dark .sidebar-scroll::-webkit-scrollbar-thumb {
                    background: rgba(100, 116, 139, 0.5);
                  }
                  .dark .sidebar-scroll::-webkit-scrollbar-thumb:hover {
                    background: rgba(100, 116, 139, 0.7);
                  }
                  .dark .sidebar-scroll::-webkit-scrollbar-thumb:active {
                    background: rgba(59, 130, 246, 0.8);
                  }
                  
                  /* Smooth transitions */
                  .sidebar-scroll::-webkit-scrollbar-thumb {
                    transition: background-color 0.2s ease;
                  }
                  
                  /* Hide scrollbar corner */
                  .sidebar-scroll::-webkit-scrollbar-corner {
                    background: transparent;
                  }
                  
                  /* Subtle appearance when not hovering */
                  .sidebar-scroll:not(:hover)::-webkit-scrollbar-thumb {
                    background: rgba(148, 163, 184, 0.2);
                  }
                  .dark .sidebar-scroll:not(:hover)::-webkit-scrollbar-thumb {
                    background: rgba(100, 116, 139, 0.3);
                  }
                `}</style>

                <div className="p-2 sm:p-4 space-y-1">
                  {filteredCompanies.map(c => (
                    <button
                      key={c.symbol}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        console.log('Company selected:', c.symbol);
                        setSelectedCompany(c);
                      }}
                      onContextMenu={(e) => {
                        e.preventDefault();
                        toggleFavorite(c.symbol);
                      }}
                      className={`w-full text-left p-2 sm:p-3 rounded-lg flex items-center gap-2 sm:gap-3 transition-all duration-200 ${
                        selectedCompany?.symbol === c.symbol
                          ? 'bg-primary/10 text-primary border border-primary/20'
                          : 'hover:bg-muted/50 border border-transparent'
                      }`}
                      style={{ touchAction: 'manipulation' }}
                    >
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Building2 className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1 sm:gap-2">
                            <span className="font-medium text-xs sm:text-sm truncate">{c.name}</span>
                            {favorites.includes(c.symbol) && (
                              <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500 fill-current flex-shrink-0" />
                            )}
                          </div>
                          <div className="flex items-center gap-1 sm:gap-2 text-xs text-muted-foreground">
                            <span>{c.symbol}</span>
                            {c.sector && (
                              <>
                                <span className="hidden sm:inline">•</span>
                                <span className="truncate hidden sm:inline">{c.sector}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}

                  {filteredCompanies.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <Building2 className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 opacity-50" />
                      <p className="text-xs sm:text-sm">No companies found</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main content - Now with proper margin to account for fixed sidebar */}
        <main className="flex-1 p-3 sm:p-4 lg:p-6 overflow-y-auto lg:ml-80 transition-all duration-300">
          {/* Mobile menu button */}
          <div className="lg:hidden mb-4 relative z-10">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Hamburger clicked - setting sidebar to true');
                setSidebarOpen(!sidebarOpen);
              }}
              className="flex items-center gap-2 w-full sm:w-auto justify-center px-4 py-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-md transition-colors"
              style={{ touchAction: 'manipulation' }}
            >
              <Menu className="h-4 w-4" />
              <span>Companies</span>
              {selectedCompany && (
                <span className="text-xs text-muted-foreground ml-1">
                  ({selectedCompany.symbol})
                </span>
              )}
            </button>
          </div>

          {selectedCompany ? (
            <div className="max-w-full">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-xl sm:text-2xl font-bold truncate">{selectedCompany.name}</h1>
                    {favorites.includes(selectedCompany.symbol) && (
                      <Star className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500 fill-current flex-shrink-0" />
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-1 sm:gap-2 text-sm text-muted-foreground">
                    <span>{selectedCompany.symbol}</span>
                    {selectedCompany.sector && (
                      <>
                        <span className="hidden sm:inline">•</span>
                        <span className="hidden sm:inline">{selectedCompany.sector}</span>
                      </>
                    )}
                    {selectedCompany.marketCap && (
                      <>
                        <span className="hidden sm:inline">•</span>
                        <span className="hidden sm:inline">{selectedCompany.marketCap}</span>
                      </>
                    )}
                  </div>
                </div>
                {/* <ThemeToggle /> */}
              </div>

              <div className="space-y-4 sm:space-y-6">
                <StockDetails data={stockData} />

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg sm:text-xl">Price History</CardTitle>
                  </CardHeader>
                  <CardContent className="p-2 sm:p-6">
                    <div className="w-full overflow-x-auto">
                      <StockChart data={stockData} />
                    </div>
                  </CardContent>
                </Card>

                {/* FIXED FORECAST SECTION - Always visible when company is selected */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex flex-wrap items-center gap-2 text-lg sm:text-xl">
                      <Brain className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                      <span>AI Stock Forecast</span>
                      <div className="flex items-center gap-1 bg-primary/10 px-2 py-1 rounded-full">
                        <Sparkles className="w-3 h-3 text-primary" />
                        <span className="text-xs font-medium text-primary">AI Powered</span>
                      </div>
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="space-y-4 sm:space-y-6">
                    {/* Controls Section - Always visible */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="space-y-2 flex-1 w-full sm:w-auto">
                        <label className="text-sm font-medium">Forecast Period: {formatPeriodLabel(forecastPeriod)}</label>
                        <Slider
                          value={[forecastPeriod]}
                          onValueChange={(value) => setForecastPeriod(value[0])}
                          max={30}
                          min={1}
                          step={1}
                          className="w-full"
                        />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>1 Day</span>
                          <span>2 Weeks</span>
                          <span>1 Month</span>
                        </div>
                      </div>
                      <button
                        onClick={generateAIForecast}
                        disabled={!selectedCompany || forecastLoading}
                        className="flex items-center gap-2 w-full sm:w-auto sm:min-w-[140px] px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                      >
                        {forecastLoading ? (
                          <>
                            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                            Analyzing...
                          </>
                        ) : (
                          <>
                            <Zap className="w-4 h-4" />
                            Generate Forecast
                          </>
                        )}
                      </button>
                    </div>

                    {/* Error Display */}
                    {forecastError && (
                      <div className="p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 rounded-lg">
                        <div className="flex items-center gap-2 text-red-600">
                          <AlertTriangle className="w-4 h-4" />
                          <span className="text-sm font-medium">Forecast Error</span>
                        </div>
                        <p className="text-sm text-red-700 dark:text-red-300 mt-1">{forecastError}</p>
                        <Button
                          onClick={generateAIForecast}
                          variant="outline"
                          size="sm"
                          className="mt-2 text-red-600 border-red-300 hover:bg-red-50"
                        >
                          Try Again
                        </Button>
                      </div>
                    )}

                    {/* Loading Display */}
                    {forecastLoading && (
                      <div className="text-center py-8">
                        <div className="inline-flex flex-col items-center gap-3 text-muted-foreground">
                          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                          <div className="space-y-1">
                            <p className="text-sm font-medium">Generating AI forecast...</p>
                            <p className="text-xs">This may take up to 30 seconds</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Results Display */}
                    {forecastData && !forecastLoading && !forecastError && (
                      <div className="space-y-4 sm:space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                          <ForecastCard
                            title="Predicted Price"
                            value={`${(forecastData.forecast?.targetPrice ?? 0).toFixed(2)}`}
                            icon={DollarSign}
                            trend={{
                              positive: (forecastData.forecast?.targetPrice ?? 0) >= currentPrice,
                              value: `${((((forecastData.forecast?.targetPrice ?? 0) - currentPrice) / currentPrice) * 100)?.toFixed(2) || '0'}%`
                            }}
                            confidence={forecastData.forecast?.confidence}
                            description={`${forecastPeriod} day${forecastPeriod > 1 ? 's' : ''} ahead prediction`}
                          />
                          <ForecastCard
                            title="Market Sentiment"
                            value={forecastData.forecast?.trend?.charAt(0).toUpperCase() + forecastData.forecast?.trend?.slice(1) || 'Neutral'}
                            icon={Activity}
                            confidence={forecastData.forecast?.confidence}
                            description={forecastData.analysis?.keyFactors?.[0] || 'Based on technical analysis'}
                          />
                          <ForecastCard
                            title="Risk Level"
                            value={forecastData.analysis?.riskLevel?.charAt(0).toUpperCase() + forecastData.analysis?.riskLevel?.slice(1) || 'Medium'}
                            icon={AlertTriangle}
                            confidence={forecastData.forecast?.confidence}
                            description={`Range: ${(forecastData.forecast?.priceRange?.low ?? 0).toFixed(2)} - ${(forecastData.forecast?.priceRange?.high ?? 0).toFixed(2)}`}
                          />
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200">
                            <CardHeader>
                              <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                                <Brain className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                                AI Analysis Summary
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                              <div>
                                <h4 className="font-medium text-sm mb-1 text-blue-800 dark:text-blue-200">Key Factors</h4>
                                <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                                  {forecastData.analysis?.keyFactors?.slice(0, 3).map((factor, index) => (
                                    <li key={index} className="flex items-start gap-2">
                                      <span className="text-blue-500 mt-1">•</span>
                                      <span className="break-words">{factor}</span>
                                    </li>
                                  )) || <li>Analysis not available</li>}
                                </ul>
                              </div>
                              <div>
                                <h4 className="font-medium text-sm mb-1 text-blue-800 dark:text-blue-200">Technical Indicators</h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-blue-700 dark:text-blue-300">
                                  <div>RSI: {(forecastData.technicalIndicators?.rsi ?? 0).toFixed(2)}</div>
                                  <div>Volatility: {(forecastData.technicalIndicators?.volatility ?? 0).toFixed(2)}%</div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>

                          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-200">
                            <CardHeader>
                              <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                                <Target className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                                Investment Suggestion
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
                                <span className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                                  forecastData.analysis?.recommendation === 'buy' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                                  forecastData.analysis?.recommendation === 'sell' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                                  'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                                }`}>
                                  {forecastData.analysis?.recommendation?.toUpperCase() || 'HOLD'}
                                </span>
                                <span className="text-sm text-muted-foreground">
                                  Risk: {forecastData.analysis?.riskLevel}
                                </span>
                              </div>
                              <div className="space-y-2">
                                <div className="text-sm">
                                  <span className="font-medium text-green-800 dark:text-green-200">Confidence:</span>
                                  <span className="ml-2">{forecastData.forecast?.confidence}%</span>
                                </div>
                                <div className="text-sm">
                                  <span className="font-medium text-green-800 dark:text-green-200">Expected Return:</span>
                                  <span className={`ml-2 ${
                                    (((forecastData.forecast?.targetPrice ?? 0) - currentPrice) / currentPrice * 100) >= 0
                                      ? 'text-green-600' : 'text-red-600'
                                  }`}>
                                    {(((forecastData.forecast?.targetPrice ?? 0) - currentPrice) / currentPrice * 100)?.toFixed(2)}%
                                  </span>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </div>

                        <div className="p-4 bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 rounded-lg">
                          <div className="flex items-start gap-2 text-yellow-800 dark:text-yellow-200">
                            <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                            <div className="text-sm">
                              <strong>Disclaimer:</strong> AI predictions are for informational purposes only and should not be considered as financial advice.
                              Always conduct your own research and consult with a financial advisor before making investment decisions.
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Default state when no forecast has been generated */}
                    {!forecastData && !forecastLoading && !forecastError && (
                      <div className="text-center py-8">
                        <div className="inline-flex flex-col items-center gap-3 text-muted-foreground">
                          <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-primary/10 flex items-center justify-center">
                            <Brain className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm font-medium">AI Forecast Ready</p>
                            <p className="text-xs">Click "Generate Forecast" to analyze {selectedCompany.name} stock</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full min-h-[60vh]">
              <div className="text-center px-4">
                <Building2 className="mx-auto h-12 w-12 sm:h-16 sm:w-16 text-muted-foreground/50 mb-4" />
                <h2 className="text-lg sm:text-xl font-semibold text-muted-foreground mb-2">Select a Company</h2>
                <p className="text-sm sm:text-base text-muted-foreground">
                  Choose a company from the sidebar to view its stock details and charts
                </p>
                {/* Show mobile button to open sidebar */}
                <div className="lg:hidden mt-4 relative z-10">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      console.log('Browse companies clicked - opening sidebar');
                      setSidebarOpen(true);
                    }}
                    className="flex items-center gap-2 mx-auto px-6 py-3 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md transition-colors"
                    style={{ touchAction: 'manipulation' }}
                  >
                    <Menu className="h-4 w-4" />
                    Browse Companies
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
      <Chatbot />
    </div>
  );
};

export default Dashboard;