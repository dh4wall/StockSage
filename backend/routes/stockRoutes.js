const express = require('express');
const { 
  getCompanies, 
  getStockData, 
  generateAIForecast, 
  compareStocks 
} = require('../controllers/stockController');

const router = express.Router();

router.get('/companies', getCompanies);
router.get('/stock/:symbol', getStockData);
router.get('/forecast/:symbol', generateAIForecast);
router.post('/compare', compareStocks);

module.exports = router;