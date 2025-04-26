const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: '127.0.0.1',
  user: 'root',
  password: 'Root@201199',
  database: 'bpc_assignment',
  waitForConnections: true,
  connectionLimit: 10,
  port: 3306
});

module.exports = pool;
