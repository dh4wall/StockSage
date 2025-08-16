import { DollarSign, TrendingUp, TrendingDown, Volume2, BarChart3, Activity } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, change, changePercent, positive, subtitle }) => (
  <div className="bg-card p-4 rounded-lg border hover:shadow-md transition-shadow">
    <div className="flex items-start justify-between">
      <div className="flex items-center space-x-2">
        <div className={`p-2 rounded-lg ${positive === true ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' : positive === false ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' : 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'}`}>
          <Icon size={16} />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-lg font-semibold text-foreground">{value}</p>
          {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
        </div>
      </div>
      {change && (
        <div className="text-right">
          <div className={`flex items-center space-x-1 ${positive ? 'text-green-600' : 'text-red-600'}`}>
            {positive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            <span className="text-sm font-medium">{change}</span>
          </div>
          {changePercent && (
            <p className={`text-xs ${positive ? 'text-green-600' : 'text-red-600'}`}>
              {changePercent}
            </p>
          )}
        </div>
      )}
    </div>
  </div>
);

const StockDetails = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-card p-4 rounded-lg border animate-pulse">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-muted rounded-lg"></div>
              <div>
                <div className="w-20 h-3 bg-muted rounded mb-2"></div>
                <div className="w-16 h-4 bg-muted rounded"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  const high = Math.max(...data.map(d => d.high));
  const low = Math.min(...data.map(d => d.low));
  const avgVolume = data.reduce((sum, d) => sum + d.volume, 0) / data.length;
  const currentPrice = data[data.length - 1]?.close || 0;
  const previousPrice = data[data.length - 2]?.close || currentPrice;
  const priceChange = currentPrice - previousPrice;
  const priceChangePercent = (priceChange / previousPrice) * 100;

  const totalVolume = data.reduce((sum, d) => sum + d.volume, 0);
  const maxVolume = Math.max(...data.map(d => d.volume));
  const priceRange = high - low;
  const currentFromLow = ((currentPrice - low) / priceRange) * 100;

  const stats = [
    {
      title: 'Current Price',
      value: `$${currentPrice.toFixed(2)}`,
      icon: DollarSign,
      change: priceChange >= 0 ? `+$${priceChange.toFixed(2)}` : `-$${Math.abs(priceChange).toFixed(2)}`,
      changePercent: `${priceChange >= 0 ? '+' : ''}${priceChangePercent.toFixed(2)}%`,
      positive: priceChange >= 0
    },
    {
      title: '52-Week High',
      value: `$${high.toFixed(2)}`,
      icon: TrendingUp,
      subtitle: `${((currentPrice / high) * 100).toFixed(1)}% of high`
    },
    {
      title: '52-Week Low',
      value: `$${low.toFixed(2)}`,
      icon: TrendingDown,
      subtitle: `${currentFromLow.toFixed(1)}% above low`
    },
    {
      title: 'Average Volume',
      value: avgVolume >= 1000000 
        ? `${(avgVolume / 1000000).toFixed(1)}M` 
        : avgVolume >= 1000 
        ? `${(avgVolume / 1000).toFixed(0)}K` 
        : avgVolume.toLocaleString(),
      icon: Volume2,
      subtitle: `Max: ${maxVolume >= 1000000 ? `${(maxVolume / 1000000).toFixed(1)}M` : `${(maxVolume / 1000).toFixed(0)}K`}`
    }
  ];

  const additionalStats = [
    {
      title: 'Price Range',
      value: `$${priceRange.toFixed(2)}`,
      icon: BarChart3,
      subtitle: `High to Low spread`
    },
    {
      title: 'Total Volume',
      value: totalVolume >= 1000000 
        ? `${(totalVolume / 1000000).toFixed(1)}M` 
        : `${(totalVolume / 1000).toFixed(0)}K`,
      icon: Activity,
      subtitle: `${data.length} day period`
    }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {additionalStats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      <div className="bg-card p-4 rounded-lg border">
        <h3 className="text-sm font-medium text-foreground mb-3">Price Position</h3>
        <div className="relative h-2 bg-muted rounded-full">
          <div 
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 rounded-full"
            style={{ width: '100%' }}
          ></div>
          <div 
            className="absolute top-0 h-full w-1 bg-primary rounded-full shadow-md transform -translate-x-0.5"
            style={{ left: `${currentFromLow}%` }}
            title={`${currentFromLow.toFixed(1)}% from low`}
          ></div>
        </div>
        <div className="flex justify-between mt-2 text-xs text-muted-foreground">
          <span>52W Low</span>
          <span className="font-medium text-primary">Current: {currentFromLow.toFixed(1)}%</span>
          <span>52W High</span>
        </div>
      </div>
    </div>
  );
};

export { StockDetails };