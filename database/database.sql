-- ========================================================
-- Portfolio Database Setup Script
-- Project: Balaji M Personal Portfolio
-- Target: PostgreSQL 12+ / 14+ / 15+ / 16+
-- Works with: Local PostgreSQL, Neon, Supabase, Render, Railway, AWS RDS
-- ========================================================

-- 1. Create database (run in psql shell or pgAdmin if database does not exist)
-- CREATE DATABASE portfolio_db;

-- 2. Switch to portfolio_db (in psql command line)
-- \c portfolio_db

-- 3. Create contacts table to store messages from portfolio contact form
CREATE TABLE IF NOT EXISTS contacts (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(30) NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Sample verification query (Optional)
-- Run this query after submitting the form to verify stored messages:
-- SELECT * FROM contacts ORDER BY created_at DESC;
