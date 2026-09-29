-- ========================================================
-- Portfolio Database Setup Script
-- Project: Balaji M Personal Portfolio
-- Target: MySQL 5.7+ / 8.0+ / MariaDB
-- ========================================================

-- 1. Create database if it does not already exist
CREATE DATABASE IF NOT EXISTS portfolio_db
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

-- 2. Switch to the newly created database
USE portfolio_db;

-- 3. Create contacts table to store messages from portfolio contact form
CREATE TABLE IF NOT EXISTS contacts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(30) NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Sample verification query (Optional)
-- Run this query after submitting the form to verify stored messages:
-- SELECT * FROM contacts ORDER BY created_at DESC;
