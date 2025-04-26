const db = require('./db');

async function getParametersData() {
  const [rows] = await db.query('SELECT date, total_etp, etp_ro FROM parameters');
  return rows;
}

module.exports = { getParametersData };