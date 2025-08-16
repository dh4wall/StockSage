import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  X,
  TrendingUp,
  TrendingDown,
  Building2,
  Brain,
  Zap,
  AlertTriangle,
  DollarSign,
  LineChart,
  Target,
  Sparkles,
  ArrowLeft,
  BarChart,
  Shield,
  Crown,
  Volume2,
  Calendar,
} from 'lucide-react';
import { AppNavbar } from './AppNavbar';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Card = ({ children, className = "" }) => (
  <div className={`bg-card text-card-foreground rounded-lg border shadow-sm ${className}`}>
    {children}
  </div>
);

const CardHeader = ({ children, className = "" }) => (
  <div className={`flex flex-col space-y-1.5 p-6 ${className}`}>
    {children}
  </div>
);

const CardTitle = ({ children, className = "" }) => (
  <h3 className={`text-2xl font-semibold leading-none tracking-tight ${className}`}>
    {children}
  </h3>
);

const CardContent = ({ children, className = "" }) => (
  <div className={`p-6 pt-0 ${className}`}>
    {children}
  </div>
);

const Button = ({ children, className = "", variant = "default", size = "default", disabled = false, ...props }) => {
  const baseClasses = "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";
  const variants = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90",
    outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
  };
  const sizes = {
    default: "h-10 px-4 py-2",
    sm: "h-9 rounded-md px-3",
  };
  
  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

const Select = ({ children, value, onValueChange, className = "" }) => {
  return (
    <select 
      value={value} 
      onChange={(e) => onValueChange(e.target.value)}
      className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    >
      {children}
    </select>
  );
};

const StockCompare = () => {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState([]);
  const [selectedStock1, setSelectedStock1] = useState('');
  const [selectedStock2, setSelectedStock2] = useState('');
  const [comparisonData, setComparisonData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/companies`);
      if (!response.ok) throw new Error('Failed to fetch companies');
      const data = await response.json();
      setCompanies(data);
    } catch (err) {
      console.error('Failed to fetch companies:', err);
    }
  };

  const compareStocks = async () => {
    if (!selectedStock1 || !selectedStock2) {
      setError('Please select two different stocks to compare');
      return;
    }

    if (selectedStock1 === selectedStock2) {
      setError('Cannot compare the same stock');
      return;
    }

    setIsLoading(true);
    setError(null);
    setComparisonData(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/compare`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          stock1: selectedStock1,
          stock2: selectedStock2
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }
      
      setComparisonData(data);
      setError(null);
      
    } catch (err) {
      console.error('Comparison error:', err);
      let errorMessage = err.message || 'Failed to compare stocks.';
      if (err.message.includes('Failed to fetch')) {
        errorMessage = `Cannot connect to server. Make sure your backend is running on ${API_BASE_URL}`;
      }
      
      setError(errorMessage);
      setComparisonData(null);
    } finally {
      setIsLoading(false);
    }
  };

  const formatPercentage = (value) => {
    if (typeof value !== 'number') return '0.00%';
    return `${value.toFixed(2)}%`;
  };

  const formatPrice = (value) => {
    if (typeof value !== 'number') return '$0.00';
    return `$${value.toFixed(2)}`;
  };

  const MetricCard = ({ title, stock1Value, stock2Value, icon: Icon, format = 'number', winner = null, description }) => {
    const formatValue = (value) => {
      if (format === 'currency') return formatPrice(value);
      if (format === 'percentage') return formatPercentage(value);
      if (format === 'number') return typeof value === 'number' ? value.toFixed(2) : value;
      return value;
    };

    const getWinnerColor = (stockNum) => {
      if (winner === null) return '';
      if (winner === stockNum) return 'text-green-600 font-semibold';
      return 'text-muted-foreground';
    };

    const stock1Company = companies.find(c => c.symbol === selectedStock1);
    const stock2Company = companies.find(c => c.symbol === selectedStock2);

    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Icon className="w-4 h-4 text-primary" />
            {title}
          </CardTitle>
          {description && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-xs text-muted-foreground mb-1">
                {stock1Company?.name || selectedStock1}
              </div>
              <div className={`text-lg font-bold ${getWinnerColor(1)}`}>
                {formatValue(stock1Value)}
              </div>
            </div>
            <div className="text-center">
              <div className="text-xs text-muted-foreground mb-1">
                {stock2Company?.name || selectedStock2}
              </div>
              <div className={`text-lg font-bold ${getWinnerColor(2)}`}>
                {formatValue(stock2Value)}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <AppNavbar />
      
      <div className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate(-1)}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold flex items-center gap-2">
                  <BarChart className="w-6 h-6 text-primary" />
                  Stock Comparison
                </h1>
                <p className="text-muted-foreground">Compare two stocks side by side with AI analysis</p>
              </div>
            </div>
          </div>

          {/* Stock Selectors */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Select First Stock</CardTitle>
              </CardHeader>
              <CardContent>
                <Select 
                  value={selectedStock1} 
                  onValueChange={setSelectedStock1}
                  className="w-full"
                >
                  <option value="">Choose a stock...</option>
                  {companies.map(company => (
                    <option key={company.symbol} value={company.symbol}>
                      {company.name} ({company.symbol})
                    </option>
                  ))}
                </Select>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Select Second Stock</CardTitle>
              </CardHeader>
              <CardContent>
                <Select 
                  value={selectedStock2} 
                  onValueChange={setSelectedStock2}
                  className="w-full"
                >
                  <option value="">Choose a stock...</option>
                  {companies.map(company => (
                    <option key={company.symbol} value={company.symbol}>
                      {company.name} ({company.symbol})
                    </option>
                  ))}
                </Select>
              </CardContent>
            </Card>
          </div>

          {/* Compare Button */}
          <div className="flex justify-center mb-6">
            <Button
              onClick={compareStocks}
              disabled={!selectedStock1 || !selectedStock2 || isLoading}
              className="min-w-[200px] h-12"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Brain className="w-5 h-5 mr-2" />
                  Compare Stocks
                </>
              )}
            </Button>
          </div>

          {/* Error Display */}
          {error && (
            <Card className="mb-6">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 text-red-600">
                  <AlertTriangle className="w-4 h-4" />
                  <span className="text-sm font-medium">Error</span>
                </div>
                <p className="text-sm text-red-700 dark:text-red-300 mt-1">{error}</p>
                <Button 
                  onClick={compareStocks}
                  variant="outline"
                  size="sm"
                  className="mt-2 text-red-600 border-red-300 hover:bg-red-50"
                  disabled={!selectedStock1 || !selectedStock2}
                >
                  Try Again
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Loading Display */}
          {isLoading && (
            <Card className="mb-6">
              <CardContent className="text-center py-8">
                <div className="inline-flex flex-col items-center gap-3 text-muted-foreground">
                  <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Analyzing stocks...</p>
                    <p className="text-xs">This may take up to 60 seconds</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Comparison Results */}
          {comparisonData && !isLoading && !error && (
            <div className="space-y-6">
              {/* Winner Card */}
              <Card className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-800 dark:text-green-200">
                    <Crown className="w-5 h-5" />
                    Analysis Result
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-lg font-bold text-green-800 dark:text-green-200">
                        Winner: {comparisonData.winner}
                      </div>
                      <div className="text-sm text-green-700 dark:text-green-300 mt-1">
                        {comparisonData.reason}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-green-800 dark:text-green-200">
                        AI Recommendation
                      </div>
                      <div className="flex items-center gap-1 text-xs text-green-600">
                        <Sparkles className="w-3 h-3" />
                        AI Powered Analysis
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Performance Metrics Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                <MetricCard
                  title="Current Price"
                  stock1Value={comparisonData.stocks?.stock1?.indicators?.currentPrice}
                  stock2Value={comparisonData.stocks?.stock2?.indicators?.currentPrice}
                  icon={DollarSign}
                  format="currency"
                  description="Latest trading price"
                />

                <MetricCard
                  title="1-Year Return"
                  stock1Value={comparisonData.stocks?.stock1?.yearReturn}
                  stock2Value={comparisonData.stocks?.stock2?.yearReturn}
                  icon={TrendingUp}
                  format="percentage"
                  winner={comparisonData.comparisonMetrics?.performanceWinner === selectedStock1 ? 1 : 
                          comparisonData.comparisonMetrics?.performanceWinner === selectedStock2 ? 2 : null}
                  description="Annual performance"
                />

                <MetricCard
                  title="Volatility"
                  stock1Value={comparisonData.stocks?.stock1?.indicators?.volatility}
                  stock2Value={comparisonData.stocks?.stock2?.indicators?.volatility}
                  icon={LineChart}
                  format="percentage"
                  winner={comparisonData.comparisonMetrics?.riskWinner === selectedStock1 ? 1 : 
                          comparisonData.comparisonMetrics?.riskWinner === selectedStock2 ? 2 : null}
                  description="Price volatility (lower is better)"
                />

                <MetricCard
                  title="RSI"
                  stock1Value={comparisonData.stocks?.stock1?.indicators?.rsi}
                  stock2Value={comparisonData.stocks?.stock2?.indicators?.rsi}
                  icon={Target}
                  format="number"
                  winner={comparisonData.comparisonMetrics?.momentumWinner === selectedStock1 ? 1 : 
                          comparisonData.comparisonMetrics?.momentumWinner === selectedStock2 ? 2 : null}
                  description="Relative Strength Index"
                />

                <MetricCard
                  title="Volume Trend"
                  stock1Value={comparisonData.stocks?.stock1?.indicators?.volumeTrend}
                  stock2Value={comparisonData.stocks?.stock2?.indicators?.volumeTrend}
                  icon={Volume2}
                  format="percentage"
                  winner={comparisonData.comparisonMetrics?.volumeWinner === selectedStock1 ? 1 : 
                          comparisonData.comparisonMetrics?.volumeWinner === selectedStock2 ? 2 : null}
                  description="Recent volume change"
                />

                <MetricCard
                  title="Max Drawdown"
                  stock1Value={comparisonData.stocks?.stock1?.maxDrawdown}
                  stock2Value={comparisonData.stocks?.stock2?.maxDrawdown}
                  icon={Shield}
                  format="percentage"
                  winner={
                    comparisonData.stocks?.stock1?.maxDrawdown < comparisonData.stocks?.stock2?.maxDrawdown ? 1 : 2
                  }
                  description="Maximum decline from peak (lower is better)"
                />
              </div>

              {/* Detailed Analysis */}
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Brain className="w-5 h-5 text-blue-600" />
                      Performance Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {comparisonData.analysis?.performanceAnalysis}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="w-5 h-5 text-orange-600" />
                      Risk Assessment
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {comparisonData.analysis?.riskAssessment}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="w-5 h-5 text-green-600" />
                      Investment Recommendation
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {comparisonData.analysis?.recommendation}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-purple-600" />
                      Market Outlook
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {comparisonData.analysis?.marketOutlook}
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Summary */}
              {comparisonData.summary && (
                <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-blue-800 dark:text-blue-200">
                      <Sparkles className="w-5 h-5" />
                      Executive Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-blue-700 dark:text-blue-300 leading-relaxed">
                      {comparisonData.summary}
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Disclaimer */}
              <div className="p-4 bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 rounded-lg">
                <div className="flex items-start gap-2 text-yellow-800 dark:text-yellow-200">
                  <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <div className="text-sm">
                    <strong>Disclaimer:</strong> {comparisonData.disclaimer}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Default state */}
          {!comparisonData && !isLoading && !error && (
            <Card>
              <CardContent className="text-center py-12">
                <div className="inline-flex flex-col items-center gap-4 text-muted-foreground">
                  <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                    <BarChart className="w-10 h-10 text-primary" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold">Stock Comparison Ready</h3>
                    <p className="text-sm max-w-md">
                      Select two stocks above and click "Compare Stocks" to get a detailed AI-powered analysis 
                      comparing their performance, risk, and investment potential.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default StockCompare;