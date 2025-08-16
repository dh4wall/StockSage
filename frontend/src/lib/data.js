export const calculate52WeekHigh = (data) => Math.max(...data.map(d => d.high)) || 0;
export const calculate52WeekLow = (data) => Math.min(...data.map(d => d.low)) || 0;
export const calculateAverageVolume = (data) => {
  if (!data.length) return 0;
  return data.reduce((sum, d) => sum + d.volume, 0) / data.length;
};
export const calculateSMA = (data, period) => {
  const sma = [];
  for (let i = 0; i < data.length; i++) {
    if (i < period - 1) sma.push(null);
    else {
      const sum = data.slice(i - period + 1, i + 1).reduce((s, d) => s + d.close, 0);
      sma.push(sum / period);
    }
  }
  return sma;
};