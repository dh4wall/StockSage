// import { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { Card, CardContent, CardHeader, CardTitle } from './ui/Card.jsx';
// import { Button } from './ui/Button.jsx';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/Select.jsx';
// import { 
//   Brain, 
//   TrendingUp, 
//   TrendingDown, 
//   Activity, 
//   Target, 
//   AlertTriangle,
//   Zap,
//   BarChart3,
//   ArrowLeft,
//   Sparkles,
//   DollarSign
// } from 'lucide-react';
// import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

// const ForecastCard = ({ title, value, icon: Icon, trend, confidence, description }) => (
//   <Card className="relative overflow-hidden">
//     <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-primary/10 to-transparent rounded-bl-full"></div>
//     <CardHeader className="pb-2">
//       <div className="flex items-center justify-between">
//         <div className="flex items-center gap-2">
//           <Icon className="w-5 h-5 text-primary" />
//           <CardTitle className="text-sm font-medium">{title}</CardTitle>
//         </div>
//         {confidence && (
//           <div className="text-xs text-muted-foreground">
//             {confidence}% confidence
//           </div>
//         )}
//       </div>
//     </CardHeader>
//     <CardContent>
//       <div className="space-y-2">
//         <div className="flex items-baseline gap-2">
//           <span className="text-2xl font-bold">{value}</span>
//           {trend && (
//             <div className={`flex items-center gap-1 text-sm ${trend.positive ? 'text-green-600' : 'text-red-600'}`}>
//               {trend.positive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
//               <span>{trend.value}</span>
//             </div>
//           )}
//         </div>
//         {description && (
//           <p className="text-xs text-muted-foreground">{description}</p>
//         )}
//       </div>
//     </CardContent>
//   </Card>
// );

// // ## CORRECTED CHART COMPONENT ##
// const ForecastChart = ({ historical, forecast }) => {
//   // 1. Prepare historical data with a unique key
//   const historicalPoints = historical.slice(-10).map((d, index) => ({
//     date: `Day -${10 - index}`,
//     historicalPrice: d.close,
//   }));

//   // 2. Prepare forecast data with a unique key
//   const forecastPoints = forecast.map(d => ({
//     date: `Day +${d.day}`,
//     predictedPrice: d.predictedPrice,
//   }));

//   // 3. Create the connection point to make the line seamless
//   const lastHistoricalPoint = historicalPoints[historicalPoints.length - 1];
//   if (lastHistoricalPoint && forecastPoints.length > 0) {
//     forecastPoints.unshift({
//       date: lastHistoricalPoint.date,
//       predictedPrice: lastHistoricalPoint.historicalPrice,
//     });
//   }

//   // 4. Combine all data points
//   const combinedData = [...historicalPoints, ...forecastPoints.slice(1)];
  
//   return (
//     <ResponsiveContainer width="100%" height={400}>
//       <LineChart data={combinedData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
//         <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
//         <XAxis dataKey="date" tick={{ fontSize: 11 }} />
//         <YAxis tick={{ fontSize: 11 }} domain={['dataMin - 5', 'dataMax + 5']} allowDataOverflow />
//         <Tooltip 
//           content={({ active, payload, label }) => {
//             if (active && payload && payload.length) {
//               const data = payload[0].payload;
//               const price = data.historicalPrice ?? data.predictedPrice;
//               const type = data.historicalPrice ? 'Actual' : 'Predicted';
//               return (
//                 <div className="bg-card p-3 border rounded-lg shadow-lg">
//                   <p className="font-medium mb-1">{label}</p>
//                   <p className="text-sm">
//                     <span className={type === 'Predicted' ? 'text-blue-600' : 'text-green-600'}>
//                       {type}: ${price?.toFixed(2)}
//                     </span>
//                   </p>
//                 </div>
//               );
//             }
//             return null;
//           }}
//         />
//         {/* 5. Each line now has its own unique dataKey */}
//         <Line 
//           type="monotone" 
//           dataKey="historicalPrice" 
//           stroke="#10b981" 
//           strokeWidth={2}
//           dot={false}
//           connectNulls={false}
//         />
//         <Line 
//           type="monotone" 
//           dataKey="predictedPrice" 
//           stroke="#3b82f6" 
//           strokeWidth={2} 
//           strokeDasharray="5 5"
//           dot={false}
//           connectNulls={false}
//         />
//       </LineChart>
//     </ResponsiveContainer>
//   );
// };

// const ForecastPage = () => {
//   const { symbol } = useParams();
//   const navigate = useNavigate();
  
//   const [selectedStock, setSelectedStock] = useState(symbol || '');
//   const [forecastData, setForecastData] = useState(null);
//   const [historicalData, setHistoricalData] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [companies, setCompanies] = useState([]);
//   const [forecastPeriod, setForecastPeriod] = useState('7');

//   useEffect(() => {
//     fetchCompanies();
//   }, []);

//   useEffect(() => {
//     if (selectedStock) {
//       // Clear old forecast when stock changes
//       setForecastData(null);
//       fetchHistoricalData(selectedStock);
//     }
//   }, [selectedStock]);

//   const fetchCompanies = async () => {
//     try {
//       const response = await axios.get('http://localhost:5000/api/companies');
//       setCompanies(response.data);
//     } catch (err) {
//       console.error('Failed to fetch companies:', err);
//     }
//   };

//   const fetchHistoricalData = async (stockSymbol) => {
//     try {
//       const response = await axios.get(`http://localhost:5000/api/stock/${stockSymbol}`);
//       setHistoricalData(response.data);
//     } catch (err) {
//       console.error('Failed to fetch historical data:', err);
//       setError('Failed to fetch historical data');
//     }
//   };

//   const generateAIForecast = async () => {
//     if (!selectedStock) {
//       setError('Please select a stock');
//       return;
//     }

//     setLoading(true);
//     setError(null);
//     setForecastData(null);

//     try {
//       const response = await axios.get(`http://localhost:5000/api/forecast/${selectedStock}?period=${forecastPeriod}`);
//       setForecastData(response.data);
//     } catch (err) {
//       console.error('Forecast error:', err);
//       setError(err.response?.data?.error || 'Failed to generate forecast');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const selectedCompany = companies.find(c => c.symbol === selectedStock);
//   const currentPrice = historicalData[historicalData.length - 1]?.close || 0;
//   const previousPrice = historicalData[historicalData.length - 2]?.close || 0;

//   // Added a check to prevent division by zero
//   const priceChange = currentPrice - previousPrice;
//   const priceChangePercent = previousPrice ? (priceChange / previousPrice) * 100 : 0;

//   return (
//     <div className="min-h-screen bg-background p-6">
//       <div className="max-w-7xl mx-auto space-y-6">
//         <div className="flex items-center justify-between">
//           <div className="flex items-center gap-4">
//             <Button 
//               variant="outline" 
//               onClick={() => navigate('/dashboard')}
//               className="flex items-center gap-2"
//             >
//               <ArrowLeft className="w-4 h-4" />
//               Back to Dashboard
//             </Button>
//             <div>
//               <h1 className="text-3xl font-bold flex items-center gap-2">
//                 <Brain className="w-8 h-8 text-primary" />
//                 AI Stock Forecast
//               </h1>
//               <p className="text-muted-foreground">
//                 Advanced machine learning predictions powered by Gemini AI
//               </p>
//             </div>
//           </div>
//           <div className="flex items-center gap-2 bg-primary/10 px-3 py-2 rounded-lg">
//             <Sparkles className="w-4 h-4 text-primary" />
//             <span className="text-sm font-medium text-primary">AI Powered</span>
//           </div>
//         </div>

//         <Card>
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               <Target className="w-5 h-5" />
//               Select Stock & Forecast Period
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="grid md:grid-cols-3 gap-4">
//               <div>
//                 <label className="text-sm font-medium mb-2 block">Stock Symbol</label>
//                 <Select value={selectedStock} onValueChange={setSelectedStock}>
//                   <SelectTrigger>
//                     <SelectValue placeholder="Select a stock..." />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {companies.map(company => (
//                       <SelectItem key={company.symbol} value={company.symbol}>
//                         {company.symbol} - {company.name}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </div>
//               <div>
//                 <label className="text-sm font-medium mb-2 block">Forecast Period</label>
//                 <Select value={forecastPeriod} onValueChange={setForecastPeriod}>
//                   <SelectTrigger>
//                     <SelectValue />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="1">1 Day</SelectItem>
//                     <SelectItem value="3">3 Days</SelectItem>
//                     <SelectItem value="7">1 Week</SelectItem>
//                     <SelectItem value="14">2 Weeks</SelectItem>
//                     <SelectItem value="30">1 Month</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>
//               <div className="flex items-end">
//                 <Button 
//                   onClick={generateAIForecast}
//                   disabled={!selectedStock || loading}
//                   className="w-full flex items-center gap-2"
//                 >
//                   {loading ? (
//                     <>
//                       <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
//                       Analyzing...
//                     </>
//                   ) : (
//                     <>
//                       <Zap className="w-4 h-4" />
//                       Generate Forecast
//                     </>
//                   )}
//                 </Button>
//               </div>
//             </div>
//           </CardContent>
//         </Card>
        
//         {/* Other components remain the same... */}
//         {selectedCompany && historicalData.length > 0 && (
//           <Card>
//             <CardHeader>
//               <CardTitle className="flex items-center gap-2">
//                 <BarChart3 className="w-5 h-5" />
//                 {selectedCompany.name} ({selectedStock})
//               </CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div className="grid md:grid-cols-4 gap-4">
//                 <div className="text-center">
//                   <div className="text-2xl font-bold">${currentPrice.toFixed(2)}</div>
//                   <div className="text-sm text-muted-foreground">Current Price</div>
//                 </div>
//                 <div className="text-center">
//                   <div className={`text-2xl font-bold flex items-center justify-center gap-1 ${priceChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
//                     {priceChange >= 0 ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
//                     {priceChange >= 0 ? '+' : ''}${priceChange.toFixed(2)}
//                   </div>
//                   <div className="text-sm text-muted-foreground">Change ($)</div>
//                 </div>
//                 <div className="text-center">
//                   <div className={`text-2xl font-bold ${priceChangePercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
//                     {priceChangePercent >= 0 ? '+' : ''}{priceChangePercent.toFixed(2)}%
//                   </div>
//                   <div className="text-sm text-muted-foreground">Change (%)</div>
//                 </div>
//                 <div className="text-center">
//                   <div className="text-2xl font-bold text-muted-foreground">{historicalData.length}</div>
//                   <div className="text-sm text-muted-foreground">Data Points</div>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         )}

//         {error && (
//           <Card className="border-red-200 bg-red-50 dark:bg-red-950/20">
//             <CardContent className="pt-6">
//               <div className="flex items-center gap-2 text-red-600">
//                 <AlertTriangle className="w-5 h-5" />
//                 <span>{error}</span>
//               </div>
//             </CardContent>
//           </Card>
//         )}

//         {loading && (
//           <Card>
//             <CardContent className="pt-6 text-center">
//               <p>Loading forecast...</p>
//             </CardContent>
//           </Card>
//         )}

//         {forecastData && (
//           <div className="space-y-6">
//             <div className="grid md:grid-cols-3 gap-4">
//               <ForecastCard
//                 title="Predicted Price"
//                 value={`$${forecastData.forecast?.targetPrice?.toFixed(2) || 'N/A'}`}
//                 icon={DollarSign}
//                 trend={{
//                   positive: forecastData.forecast?.targetPrice >= currentPrice,
//                   value: `${((forecastData.forecast?.targetPrice - currentPrice) / currentPrice * 100)?.toFixed(2) || '0'}%`
//                 }}
//                 confidence={forecastData.forecast?.confidence}
//                 description={`${forecastPeriod} day${parseInt(forecastPeriod) > 1 ? 's' : ''} ahead prediction`}
//               />
//               <ForecastCard
//                 title="Market Sentiment"
//                 value={forecastData.forecast?.trend?.charAt(0).toUpperCase() + forecastData.forecast?.trend?.slice(1) || 'Neutral'}
//                 icon={Activity}
//                 confidence={forecastData.forecast?.confidence}
//                 description={forecastData.analysis?.keyFactors?.[0] || 'Based on technical analysis'}
//               />
//               <ForecastCard
//                 title="Risk Level"
//                 value={forecastData.analysis?.riskLevel?.charAt(0).toUpperCase() + forecastData.analysis?.riskLevel?.slice(1) || 'Medium'}
//                 icon={AlertTriangle}
//                 confidence={forecastData.forecast?.confidence}
//                 description={`Price range: $${forecastData.forecast?.priceRange?.low?.toFixed(2)} - $${forecastData.forecast?.priceRange?.high?.toFixed(2)}`}
//               />
//             </div>

//             <Card>
//               <CardHeader>
//                 <CardTitle className="flex items-center gap-2">
//                   <TrendingUp className="w-5 h-5" />
//                   Price Prediction Chart
//                 </CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <ForecastChart 
//                   historical={historicalData}
//                   forecast={forecastData.chartData || []}
//                 />
//                 <div className="flex items-center justify-center gap-6 mt-4 text-sm">
//                   <div className="flex items-center gap-2">
//                     <div className="w-4 h-1 bg-green-600 rounded"></div>
//                     <span>Historical Data</span>
//                   </div>
//                   <div className="flex items-center gap-2">
//                     <div className="w-4 h-1 bg-blue-600 rounded"></div>
//                     <span>AI Prediction</span>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>

//             <Card>
//               <CardHeader>
//                 <CardTitle className="flex items-center gap-2">
//                   <Brain className="w-5 h-5" />
//                   AI Analysis & Insights
//                 </CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-4">
//                   <div>
//                     <h4 className="font-medium mb-2">Key Factors</h4>
//                     <ul className="text-sm text-muted-foreground space-y-1">
//                       {forecastData.analysis?.keyFactors?.map((factor, index) => (
//                         <li key={index}>• {factor}</li>
//                       )) || <li>Analysis not available</li>}
//                     </ul>
//                   </div>
//                   <div>
//                     <h4 className="font-medium mb-2">Technical Indicators</h4>
//                     <div className="grid grid-cols-2 gap-4 text-sm">
//                       <div>SMA 7: ${forecastData.technicalIndicators?.sma7?.toFixed(2)}</div>
//                       <div>SMA 20: ${forecastData.technicalIndicators?.sma20?.toFixed(2)}</div>
//                       <div>RSI: {forecastData.technicalIndicators?.rsi?.toFixed(2)}</div>
//                       <div>Volatility: {forecastData.technicalIndicators?.volatility?.toFixed(2)}%</div>
//                     </div>
//                   </div>
//                   <div>
//                     <h4 className="font-medium mb-2">Recommendation</h4>
//                     <div className="flex items-center gap-2">
//                       <span className={`px-2 py-1 rounded text-xs font-medium ${
//                         forecastData.analysis?.recommendation === 'buy' ? 'bg-green-100 text-green-800' :
//                         forecastData.analysis?.recommendation === 'sell' ? 'bg-red-100 text-red-800' :
//                         'bg-yellow-100 text-yellow-800'
//                       }`}>
//                         {forecastData.analysis?.recommendation?.toUpperCase() || 'HOLD'}
//                       </span>
//                       <span className="text-sm text-muted-foreground">
//                         Risk Level: {forecastData.analysis?.riskLevel}
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           </div>
//         )}

//         <Card className="border-yellow-200 bg-yellow-50 dark:bg-yellow-950/20">
//           <CardContent className="pt-6">
//             <div className="flex items-start gap-2 text-yellow-800 dark:text-yellow-200">
//               <AlertTriangle className="w-5 h-5 mt-0.5 flex-shrink-0" />
//               <div className="text-sm">
//                 <strong>Disclaimer:</strong> These predictions are generated by AI and should not be considered as financial advice. 
//                 Always conduct your own research and consider consulting with a financial advisor before making investment decisions. 
//                 Past performance does not guarantee future results.
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// };

// export default ForecastPage;