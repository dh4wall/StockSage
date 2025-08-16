const { Pool } = require('pg');
require('dotenv').config();
// Neon PostgreSQL connection (replace with your actual Neon connection string)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

module.exports = pool;