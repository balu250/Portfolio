/**
 * Express Backend Server for Balaji M's Personal Portfolio
 * Handles API endpoints and database operations for contact messages.
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const { pool, testConnection } = require('./db');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for frontend requests
app.use(cors({
  origin: '*', // Allows access from Live Server, localhost, or any client host
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parsing middleware
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Serve frontend static files if user opens http://localhost:5000
const frontendPath = path.join(__dirname, '..', 'frontend');
app.use(express.static(frontendPath));

// Email validation regular expression
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
// Phone validation regular expression: supports international prefixes, spaces, dashes, digits
const PHONE_REGEX = /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]{6,20}$/;

/**
 * Health Check Endpoint
 * GET /api/health
 */
app.get('/api/health', async (req, res) => {
  let dbStatus = 'disconnected';
  try {
    const [rows] = await pool.query('SELECT 1 AS health');
    if (rows && rows[0]?.health === 1) {
      dbStatus = 'connected';
    }
  } catch (err) {
    dbStatus = 'error: ' + err.code;
  }

  res.status(200).json({
    status: 'online',
    server: 'Balaji M Portfolio Backend',
    database: dbStatus,
    timestamp: new Date().toISOString()
  });
});

/**
 * Contact Message Submission Endpoint
 * POST /api/contact
 * Receives: { name, email, phone, message }
 * Stores in MySQL contacts table using parameterized query
 */
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    // 1. Validation checks
    const errors = [];

    // Validate Name
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      errors.push('Full Name is required and must be at least 2 characters long.');
    } else if (name.trim().length > 100) {
      errors.push('Full Name must be under 100 characters.');
    }

    // Validate Email
    if (!email || typeof email !== 'string' || !EMAIL_REGEX.test(email.trim())) {
      errors.push('A valid email address is required.');
    } else if (email.trim().length > 255) {
      errors.push('Email must be under 255 characters.');
    }

    // Validate Phone Number
    if (!phone || typeof phone !== 'string' || !PHONE_REGEX.test(phone.trim())) {
      errors.push('A valid phone number is required (at least 7 to 15 digits).');
    } else if (phone.trim().length > 30) {
      errors.push('Phone number is too long.');
    }

    // Validate Message
    if (!message || typeof message !== 'string' || message.trim().length < 10) {
      errors.push('Message is required and must be at least 10 characters long.');
    } else if (message.trim().length > 3000) {
      errors.push('Message cannot exceed 3000 characters.');
    }

    // Return 400 if validation fails
    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed. Please review your input.',
        errors
      });
    }

    // Cleaned sanitized inputs
    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanPhone = phone.trim();
    const cleanMessage = message.trim();

    // 2. Insert into MySQL contacts table using parameterized queries (prevents SQL injection)
    const insertQuery = `
      INSERT INTO contacts (name, email, phone, message, created_at)
      VALUES (?, ?, ?, ?, NOW())
    `;

    const [result] = await pool.execute(insertQuery, [
      cleanName,
      cleanEmail,
      cleanPhone,
      cleanMessage
    ]);

    // 3. Return success response
    return res.status(201).json({
      success: true,
      message: 'Thank you, Balaji M has received your message and will get back to you shortly!',
      contactId: result.insertId
    });

  } catch (error) {
    console.error('Error handling /api/contact:', error.message);

    // Provide helpful message depending on error type without exposing sensitive credentials
    if (error.code === 'ECONNREFUSED' || error.code === 'PROTOCOL_CONNECTION_LOST' || error.code === 'ER_BAD_DB_ERROR') {
      return res.status(503).json({
        success: false,
        message: 'The database server is currently unreachable. Please make sure MySQL is running and the "portfolio_db" database has been created.',
        errorCode: error.code
      });
    }

    return res.status(500).json({
      success: false,
      message: 'An unexpected internal error occurred while saving your message. Please try again or reach out directly via email.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Fallback for root route if frontend isn't served automatically
app.get('*', (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

// Start Express Server
app.listen(PORT, async () => {
  console.log(`🚀 Balaji M Portfolio Server is running on port ${PORT}`);
  console.log(`🌐 Local URL: http://localhost:${PORT}`);
  console.log(`📡 Contact API: http://localhost:${PORT}/api/contact`);
  
  // Test connection to MySQL database
  await testConnection();
});
