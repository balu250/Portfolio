/**
 * Database connection setup for Balaji M Portfolio
 * Uses mysql2 connection pooling with promises and parameterized queries.
 */

const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

// Create connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'portfolio_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
});

// Helper function to test DB connection gracefully
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Successfully connected to MySQL database: ' + (process.env.DB_NAME || 'portfolio_db'));
    connection.release();
    return true;
  } catch (error) {
    console.warn('⚠️  MySQL Database connection notice:');
    console.warn(`   Could not connect to MySQL at ${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || 3306}.`);
    console.warn('   Reason:', error.message);
    console.warn('   Please ensure MySQL is running and database "portfolio_db" is created using database/database.sql.');
    return false;
  }
}

module.exports = {
  pool,
  testConnection
};
