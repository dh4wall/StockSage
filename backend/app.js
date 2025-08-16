
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const stockRoutes = require('./routes/stockRoutes');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


app.get('/', (req, res) => {
  res.status(200).json({ status: 'alive' });
});


// Routes
app.use('/api', stockRoutes);

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(port, () => {
  console.log(`Backend running on http://localhost:${port}`);
});