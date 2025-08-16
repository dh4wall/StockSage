import { useState } from 'react';
import { Area, AreaChart, Line, LineChart, ComposedChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Brush, ReferenceLine } from 'recharts';
import { TrendingUp, TrendingDown, BarChart3, Activity } from 'lucide-react';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-card text-card-foreground p-3 border rounded-lg shadow-lg">
        <p className="font-medium mb-2">{`${label}`}</p>
        {data.open && <p className="text-green-600 text-sm">{`Open: ${data.open.toFixed(2)}`}</p>}
        {data.high && <p className="text-blue-600 text-sm">{`High: ${data.high.toFixed(2)}`}</p>}
        {data.low && <p className="text-red-600 text-sm">{`Low: ${data.low.toFixed(2)}`}</p>}
        <p className="text-purple-600 font-medium text-sm">{`Close: ${data.close.toFixed(2)}`}</p>
        {data.volume && <p className="text-muted-foreground text-sm">{`Volume: ${data.volume.toLocaleString()}`}</p>}
        {data.sma && <p className="text-orange-600 text-sm">{`SMA: ${data.sma.toFixed(2)}`}</p>}
      </div>
    );
  }
  return null;
};

const ChartTypeToggle = ({ chartType, onTypeChange }) => {
  const types = [
    { id: 'area', label: 'Area', icon: Activity },
    { id: 'line', label: 'Line', icon: TrendingUp },
    { id: 'candlestick', label: 'OHLC', icon: BarChart3 }
  ];

  return (
    <div className="flex space-x-1 bg-muted p-1 rounded-lg">
      {types.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          onClick={() => onTypeChange(id)}
          className={`flex items-center space-x-1 px-3 py-1.5 rounded text-sm transition-colors ${
            chartType === id 
              ? 'bg-background text-primary shadow-sm' 
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Icon size={14} />
          <span>{label}</span>
        </button>
      ))}
    </div>
  );
};

const StockChart = ({ data }) => {
  const [chartType, setChartType] = useState('area');
  const [showSMA, setShowSMA] = useState(true);
  
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-96 text-muted-foreground">
        <div className="text-center">
          <BarChart3 className="mx-auto h-12 w-12 mb-4 opacity-50" />
          <p>No chart data available</p>
        </div>
      </div>
    );
  }

  const currentPrice = data[data.length - 1]?.close || 0;
  const previousPrice = data[data.length - 2]?.close || currentPrice;
  const priceChange = currentPrice - previousPrice;
  const isPositive = priceChange >= 0;

  const renderChart = () => {
    const commonProps = {
      data,
      margin: { top: 5, right: 30, left: 20, bottom: 5 }
    };

    switch (chartType) {
      case 'line':
        return (
          <LineChart {...commonProps}>
            <defs>
              <linearGradient id="colorGlow" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor={isPositive ? "#10b981" : "#ef4444"} stopOpacity={0.1} />
                <stop offset="100%" stopColor={isPositive ? "#10b981" : "#ef4444"} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 11 }} 
              axisLine={false}
              tickLine={false}
            />
            <YAxis 
              tick={{ fontSize: 11 }} 
              axisLine={false}
              tickLine={false}
              domain={['dataMin - 5', 'dataMax + 5']}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line 
              type="monotone" 
              dataKey="close" 
              stroke={isPositive ? "#10b981" : "#ef4444"}
              strokeWidth={2} 
              dot={false}
              activeDot={{ r: 4, fill: isPositive ? "#10b981" : "#ef4444" }}
            />
            {showSMA && (
              <Line 
                type="monotone" 
                dataKey="sma" 
                stroke="#f59e0b" 
                strokeWidth={1.5} 
                strokeDasharray="5 5" 
                dot={false}
              />
            )}
            <Brush 
              dataKey="date" 
              height={30} 
              stroke="#8884d8"
              className="opacity-60"
            />
          </LineChart>
        );

      case 'candlestick':
        return (
          <ComposedChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 11 }} 
              axisLine={false}
              tickLine={false}
            />
            <YAxis 
              tick={{ fontSize: 11 }} 
              axisLine={false}
              tickLine={false}
              domain={['dataMin - 5', 'dataMax + 5']}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line type="monotone" dataKey="high" stroke="#10b981" strokeWidth={1} dot={false} />
            <Line type="monotone" dataKey="low" stroke="#ef4444" strokeWidth={1} dot={false} />
            <Area 
              type="monotone" 
              dataKey="close" 
              stroke="#3b82f6" 
              fill="rgba(59, 130, 246, 0.1)"
              strokeWidth={2}
            />
            <Line type="monotone" dataKey="open" stroke="#8b5cf6" strokeWidth={1} dot={false} />
            {showSMA && (
              <Line 
                type="monotone" 
                dataKey="sma" 
                stroke="#f59e0b" 
                strokeWidth={1.5} 
                strokeDasharray="5 5" 
                dot={false}
              />
            )}
            <Brush 
              dataKey="date" 
              height={30} 
              stroke="#8884d8"
              className="opacity-60"
            />
          </ComposedChart>
        );

      case 'area':
      default:
        return (
          <AreaChart {...commonProps}>
            <defs>
              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={isPositive ? "#10b981" : "#ef4444"} stopOpacity={0.3}/>
                <stop offset="95%" stopColor={isPositive ? "#10b981" : "#ef4444"} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 11 }} 
              axisLine={false}
              tickLine={false}
            />
            <YAxis 
              tick={{ fontSize: 11 }} 
              axisLine={false}
              tickLine={false}
              domain={['dataMin - 5', 'dataMax + 5']}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area 
              type="monotone" 
              dataKey="close" 
              stroke={isPositive ? "#10b981" : "#ef4444"}
              fillOpacity={1} 
              fill="url(#colorPrice)" 
              strokeWidth={2}
            />
            {showSMA && (
              <Line 
                type="monotone" 
                dataKey="sma" 
                stroke="#f59e0b" 
                strokeWidth={1.5} 
                strokeDasharray="5 5" 
                dot={false}
              />
            )}
            <ReferenceLine 
              y={currentPrice} 
              stroke={isPositive ? "#10b981" : "#ef4444"}
              strokeDasharray="2 2"
              className="opacity-50"
            />
            <Brush 
              dataKey="date" 
              height={30} 
              stroke="#8884d8"
              className="opacity-60"
            />
          </AreaChart>
        );
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <ChartTypeToggle chartType={chartType} onTypeChange={setChartType} />
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowSMA(!showSMA)}
            className={`flex items-center space-x-1 px-2 py-1 rounded text-xs transition-colors ${
              showSMA 
                ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' 
                : 'bg-muted text-muted-foreground'
            }`}
          >
            <div className="w-3 h-0.5 bg-orange-500"></div>
            <span>SMA</span>
          </button>
          <div className="flex items-center space-x-1">
            {isPositive ? (
              <TrendingUp className="h-4 w-4 text-green-600" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-600" />
            )}
            <span className={`text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {isPositive ? '+' : ''}{((priceChange / previousPrice) * 100).toFixed(2)}%
            </span>
          </div>
        </div>
      </div>
      
      <ResponsiveContainer width="100%" height={400}>
        {renderChart()}
      </ResponsiveContainer>
    </div>
  );
};

export { StockChart };