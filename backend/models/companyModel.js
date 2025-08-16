const pool = require('../config/db');

const getAllCompanies = async () => {
  try {
    const result = await pool.query('SELECT * FROM companies');
    return result.rows;
  } catch (err) {
    throw err;
  }
};

module.exports = { getAllCompanies };