import { Routes, Route } from 'react-router-dom';
import Landing from './components/Landing.jsx';
import Dashboard from './components/Dashboard.jsx';
import StockCompare from './components/StockCompare.jsx';
// import ForecastPage from './components/ForecastPage.jsx';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/compare" element={<StockCompare />} />
      {/* <Route path="/forecast/:symbol?" element={<ForecastPage />} /> */}
    </Routes>
  );
}

export default App;