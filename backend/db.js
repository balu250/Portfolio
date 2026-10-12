/**
 * Database connection setup for Balaji M Portfolio
 * Uses node-postgres (pg) connection pooling with parameterized queries.
 * Supports both local PostgreSQL instances and cloud databases (Neon, Supabase, Render, Railway, AWS RDS).
 */

const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

// Determine if SSL is required (common for cloud-hosted PostgreSQL instances like Neon/Supabase)
const useSsl =
  process.env.DB_SSL === 'true' ||
  (process.env.DATABASE_URL &&
    !process.env.DATABASE_URL.includes('localhost') &&
    !process.env.DATABASE_URL.includes('127.0.0.1'));

// Create PostgreSQL connection pool
// Accepts either a unified DATABASE_URL connection string or individual environment parameters
const poolConfig = process.env.DATABASE_URL
  ? {
      connectionString: process.env.DATABASE_URL,
      ssl: useSsl ? { rejectUnauthorized: false } : false
    }
  : {
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 5432,
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_NAME || 'portfolio_db',
      ssl: useSsl ? { rejectUnauthorized: false } : false,
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000
    };

const pool = new Pool(poolConfig);

// Helper function to test DB connection gracefully
async function testConnection() {
  try {
    const client = await pool.connect();
    const targetInfo = process.env.DATABASE_URL ? 'via DATABASE_URL' : (process.env.DB_NAME || 'portfolio_db');
    console.log(`✅ Successfully connected to PostgreSQL database: ${targetInfo}`);
    client.release();
    return true;
  } catch (error) {
    console.warn('⚠️  PostgreSQL Database connection notice:');
    if (process.env.DATABASE_URL) {
      console.warn('   Could not connect to PostgreSQL via DATABASE_URL.');
    } else {
      console.warn(`   Could not connect to PostgreSQL at ${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || 5432}.`);
    }
    console.warn('   Reason:', error.message);
    console.warn('   Please ensure PostgreSQL is running and table "contacts" is created using database/database.sql.');
    return false;
  }
}

module.exports = {
  pool,
  testConnection
};
