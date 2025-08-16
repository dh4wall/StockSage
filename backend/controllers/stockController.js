require('dotenv').config();
const yahooFinance = require('yahoo-finance2').default;
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { getAllCompanies } = require('../models/companyModel');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const getCompanies = async (req, res, next) => {
  try {
    const companies = await getAllCompanies();
    res.json(companies);
  } catch (err) {
    next(err);
  }
};

const getStockData = async (req, res, next) => {
  const { symbol } = req.params;
  try {
    const now = new Date();
    const oneYearAgo = new Date(now.setFullYear(now.getFullYear() - 1));
    const data = await yahooFinance.historical(symbol, {
      period1: oneYearAgo.toISOString().split('T')[0],
      period2: new Date().toISOString().split('T')[0],
      interval: '1d',
    });
    res.json(data);
  } catch (err) {
    next(err);
  }
};

const calculateTechnicalIndicators = (data) => {
  const prices = data.map(d => d.close);
  const volumes = data.map(d => d.volume);
  
  const sma7 = prices.slice(-7).reduce((a, b) => a + b, 0) / 7;
  const sma20 = prices.slice(-20).reduce((a, b) => a + b, 0) / 20;
  
  const gains = [];
  const losses = [];
  for (let i = 1; i < prices.length; i++) {
    const change = prices[i] - prices[i-1];
    if (change > 0) gains.push(change);
    else losses.push(Math.abs(change));
  }
  const avgGain = gains.reduce((a, b) => a + b, 0) / gains.length;
  const avgLoss = losses.reduce((a, b) => a + b, 0) / losses.length;
  const rsi = 100 - (100 / (1 + (avgGain / avgLoss)));
  
  const mean = prices.reduce((a, b) => a + b, 0) / prices.length;
  const variance = prices.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / prices.length;
  const volatility = Math.sqrt(variance);
  
  const avgVolume = volumes.reduce((a, b) => a + b, 0) / volumes.length;
  const recentVolume = volumes.slice(-5).reduce((a, b) => a + b, 0) / 5;
  const volumeTrend = ((recentVolume - avgVolume) / avgVolume) * 100;
  
  const recentPrices = prices.slice(-10);
  const priceChange = ((recentPrices[recentPrices.length-1] - recentPrices[0]) / recentPrices[0]) * 100;
  
  return {
    sma7: parseFloat(sma7.toFixed(2)),
    sma20: parseFloat(sma20.toFixed(2)),
    rsi: parseFloat(rsi.toFixed(2)),
    volatility: parseFloat(volatility.toFixed(2)),
    volumeTrend: parseFloat(volumeTrend.toFixed(2)),
    priceChange: parseFloat(priceChange.toFixed(2)),
    currentPrice: prices[prices.length - 1],
    support: Math.min(...prices.slice(-20)),
    resistance: Math.max(...prices.slice(-20))
  };
};

const generateAIForecast = async (req, res, next) => {
  const { symbol } = req.params;
  const { period = '7' } = req.query;
  
  try {
    if (!genAI) {
      return res.status(500).json({
        error: 'Gemini API key not configured'
      });
    }

    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));
    
    const historicalData = await yahooFinance.historical(symbol, {
      period1: thirtyDaysAgo.toISOString().split('T')[0],
      period2: new Date().toISOString().split('T')[0],
      interval: '1d',
    });

    if (!historicalData || historicalData.length === 0) {
      return res.status(404).json({ 
        error: 'No historical data found for this symbol' 
      });
    }

    const indicators = calculateTechnicalIndicators(historicalData);
    
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const prompt = `As a financial analyst, provide a stock price forecast for ${symbol} based on this data:

CURRENT METRICS:
- Current Price: $${indicators.currentPrice}
- 7-day SMA: $${indicators.sma7}
- 20-day SMA: $${indicators.sma20}
- RSI: ${indicators.rsi}
- Volatility: ${indicators.volatility}%
- Volume Trend: ${indicators.volumeTrend}%
- Recent Price Change: ${indicators.priceChange}%
- Support Level: $${indicators.support}
- Resistance Level: $${indicators.resistance}

RECENT PRICE DATA (last 10 days):
${historicalData.slice(-10).map(d => `${d.date.toDateString()}: $${d.close.toFixed(2)}`).join('\n')}

Please provide a ${period}-day forecast in this EXACT JSON format:
{
  "forecast": {
    "targetPrice": [number],
    "priceRange": {"low": [number], "high": [number]},
    "confidence": [number 0-100],
    "trend": "[bullish/bearish/neutral]"
  },
  "analysis": {
    "keyFactors": ["factor1", "factor2", "factor3"],
    "riskLevel": "[low/medium/high]",
    "recommendation": "[buy/hold/sell]"
  },
  "chartData": [
    {"day": 1, "predictedPrice": [number]},
    {"day": 2, "predictedPrice": [number]}
  ]
}

Generate exactly ${period} days of chart data. Be realistic and base predictions on technical analysis.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    let forecastData;
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        forecastData = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No valid JSON found in response');
      }
    } catch (parseError) {
      return res.status(500).json({
        error: 'Failed to parse AI response',
        rawResponse: text
      });
    }

    const enrichedForecast = {
      ...forecastData,
      symbol,
      period: parseInt(period),
      currentPrice: indicators.currentPrice,
      technicalIndicators: indicators,
      generatedAt: new Date().toISOString(),
      disclaimer: "This forecast is for educational purposes only and should not be considered financial advice."
    };

    res.json(enrichedForecast);

  } catch (error) {
    console.error('Forecast generation error:', error);
    next(error);
  }
};

// NEW COMPARE STOCKS API
const compareStocks = async (req, res, next) => {
  const { stock1, stock2 } = req.body;
  
  try {
    if (!stock1 || !stock2) {
      return res.status(400).json({
        error: 'Both stock1 and stock2 symbols are required'
      });
    }

    if (stock1 === stock2) {
      return res.status(400).json({
        error: 'Cannot compare the same stock'
      });
    }

    if (!genAI) {
      return res.status(500).json({
        error: 'Gemini API key not configured'
      });
    }

    console.log(`Starting comparison between ${stock1} and ${stock2}`);

    // Fetch historical data for both stocks
    const now = new Date();
    const oneYearAgo = new Date(now.setFullYear(now.getFullYear() - 1));
    
    const [stock1Data, stock2Data] = await Promise.all([
      yahooFinance.historical(stock1, {
        period1: oneYearAgo.toISOString().split('T')[0],
        period2: new Date().toISOString().split('T')[0],
        interval: '1d',
      }),
      yahooFinance.historical(stock2, {
        period1: oneYearAgo.toISOString().split('T')[0],
        period2: new Date().toISOString().split('T')[0],
        interval: '1d',
      })
    ]);

    if (!stock1Data || stock1Data.length === 0) {
      return res.status(404).json({ 
        error: `No historical data found for ${stock1}` 
      });
    }

    if (!stock2Data || stock2Data.length === 0) {
      return res.status(404).json({ 
        error: `No historical data found for ${stock2}` 
      });
    }

    // Calculate technical indicators for both stocks
    const stock1Indicators = calculateTechnicalIndicators(stock1Data);
    const stock2Indicators = calculateTechnicalIndicators(stock2Data);

    // Get company info for context
    const companies = await getAllCompanies();
    const stock1Info = companies.find(c => c.symbol === stock1) || { name: stock1, sector: 'Unknown' };
    const stock2Info = companies.find(c => c.symbol === stock2) || { name: stock2, sector: 'Unknown' };

    // Calculate additional comparison metrics
    const calculateYearReturn = (data) => {
      if (data.length < 252) return 0; // Need at least a year of data
      const startPrice = data[0].close;
      const endPrice = data[data.length - 1].close;
      return ((endPrice - startPrice) / startPrice) * 100;
    };

    const calculateMaxDrawdown = (data) => {
      let maxDrawdown = 0;
      let peak = data[0].close;
      
      for (let i = 1; i < data.length; i++) {
        if (data[i].close > peak) {
          peak = data[i].close;
        }
        const drawdown = ((peak - data[i].close) / peak) * 100;
        if (drawdown > maxDrawdown) {
          maxDrawdown = drawdown;
        }
      }
      return maxDrawdown;
    };

    const stock1YearReturn = calculateYearReturn(stock1Data);
    const stock2YearReturn = calculateYearReturn(stock2Data);
    const stock1MaxDrawdown = calculateMaxDrawdown(stock1Data);
    const stock2MaxDrawdown = calculateMaxDrawdown(stock2Data);

    // Create comprehensive prompt for Gemini
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const prompt = `As a professional financial analyst, provide a comprehensive comparison between two stocks and investment recommendations.

STOCK 1: ${stock1} (${stock1Info.name})
Sector: ${stock1Info.sector}
Current Price: $${stock1Indicators.currentPrice}
7-day SMA: $${stock1Indicators.sma7}
20-day SMA: $${stock1Indicators.sma20}
RSI: ${stock1Indicators.rsi}
Volatility: ${stock1Indicators.volatility}%
Volume Trend: ${stock1Indicators.volumeTrend}%
Recent Price Change: ${stock1Indicators.priceChange}%
Support Level: $${stock1Indicators.support}
Resistance Level: $${stock1Indicators.resistance}
1-Year Return: ${stock1YearReturn.toFixed(2)}%
Max Drawdown: ${stock1MaxDrawdown.toFixed(2)}%

STOCK 2: ${stock2} (${stock2Info.name})
Sector: ${stock2Info.sector}
Current Price: $${stock2Indicators.currentPrice}
7-day SMA: $${stock2Indicators.sma7}
20-day SMA: $${stock2Indicators.sma20}
RSI: ${stock2Indicators.rsi}
Volatility: ${stock2Indicators.volatility}%
Volume Trend: ${stock2Indicators.volumeTrend}%
Recent Price Change: ${stock2Indicators.priceChange}%
Support Level: $${stock2Indicators.support}
Resistance Level: $${stock2Indicators.resistance}
1-Year Return: ${stock2YearReturn.toFixed(2)}%
Max Drawdown: ${stock2MaxDrawdown.toFixed(2)}%

Please provide a detailed comparison analysis in this EXACT JSON format:
{
  "analysis": {
    "performanceAnalysis": "Detailed comparison of performance metrics, returns, and growth patterns between both stocks",
    "riskAssessment": "Comprehensive risk analysis including volatility, drawdowns, and sector risks for both stocks",
    "recommendation": "Investment recommendation with specific allocation suggestions and rationale",
    "marketOutlook": "Future outlook and market positioning analysis for both stocks"
  },
  "summary": "Executive summary with key findings and final verdict",
  "winner": "Stock symbol of recommended choice",
  "reason": "Brief explanation for the recommendation",
  "metrics": {
    "betterPerformer": "Symbol of stock with better recent performance",
    "lowerRisk": "Symbol of stock with lower risk profile",
    "higherGrowth": "Symbol of stock with higher growth potential"
  }
}

Be specific, analytical, and provide actionable insights. Consider both fundamental and technical factors.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    let comparisonData;
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        comparisonData = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No valid JSON found in response');
      }
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      return res.status(500).json({
        error: 'Failed to parse AI response',
        rawResponse: text
      });
    }

    // Enrich the response with calculated data
    const enrichedComparison = {
      ...comparisonData,
      stocks: {
        stock1: {
          symbol: stock1,
          name: stock1Info.name,
          sector: stock1Info.sector,
          indicators: stock1Indicators,
          yearReturn: stock1YearReturn,
          maxDrawdown: stock1MaxDrawdown
        },
        stock2: {
          symbol: stock2,
          name: stock2Info.name,
          sector: stock2Info.sector,
          indicators: stock2Indicators,
          yearReturn: stock2YearReturn,
          maxDrawdown: stock2MaxDrawdown
        }
      },
      comparisonMetrics: {
        performanceWinner: stock1YearReturn > stock2YearReturn ? stock1 : stock2,
        riskWinner: stock1Indicators.volatility < stock2Indicators.volatility ? stock1 : stock2,
        momentumWinner: stock1Indicators.rsi > stock2Indicators.rsi ? stock1 : stock2,
        volumeWinner: stock1Indicators.volumeTrend > stock2Indicators.volumeTrend ? stock1 : stock2
      },
      generatedAt: new Date().toISOString(),
      disclaimer: "This comparison is for educational purposes only and should not be considered financial advice."
    };

    console.log('Comparison generated successfully');
    res.json(enrichedComparison);

  } catch (error) {
    console.error('Stock comparison error:', error);
    next(error);
  }
};

module.exports = { 
  getCompanies, 
  getStockData, 
  generateAIForecast,
  compareStocks
};