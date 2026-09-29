# Balaji M - Personal Portfolio Website

A modern, colorful, professional, and responsive developer & data analytics portfolio website built with **HTML5, CSS3, JavaScript (ES6+), Node.js, Express, and MySQL**.

Designed with **glassmorphism aesthetics**, dynamic dark/light mode switching, responsive navigation, interactive category filtering, scroll animations, and a full-stack contact form connected to a MySQL database.

---

## 🌟 Key Features

- **Accurate Profile Information**: Strictly built on Balaji M's real credentials, education at Presidency University (CGPA 7.15/10), projects, and skills.
- **Glassmorphism & Vibrant Modern Palette**: High-contrast typography, radiant gradient accents, ambient glows, and rounded cards.
- **Dark & Light Mode Switcher**: Preserves user preference across page visits using `localStorage`.
- **Responsive Layout**: Pixel-perfect presentation across mobile phones, tablets, laptops, and ultra-wide desktops.
- **Sticky Navbar with ScrollSpy**: Active link indicator that highlights sections dynamically as you scroll.
- **Interactive Skills Section**: Categorized into Programming, Web, Databases, Analytics, and Tools with instant filtering tabs.
- **Showcase Projects**: Detailed cards for Excel and Python projects featuring key analytical features and GitHub buttons.
- **Live Contact Form with MySQL Backend**:
  - Full client-side JavaScript validation (name, email, phone, message).
  - Parameterized SQL queries using `mysql2/promise` to prevent SQL injection.
  - Express REST API with graceful error handling and friendly feedback.
- **Back to Top Floating Action**: Quick smooth scroll to top with reveal animations.

---

## 📁 Project Directory Structure

```text
portfolio/
├── frontend/
│   ├── index.html          # Semantic HTML5 single-page structure
│   ├── style.css           # Custom CSS3 styles, theme variables, glassmorphism
│   ├── script.js           # Theme toggle, scroll animations, API integration
│   └── assets/             # Media and static graphics
│
├── backend/
│   ├── server.js           # Express API server & static file host
│   ├── db.js               # MySQL connection pool configuration
│   ├── package.json        # Dependencies and scripts
│   ├── .env                # Local environment variables
│   └── .env.example        # Environment variables template
│
├── database/
│   └── database.sql        # MySQL table schema and database setup script
│
└── README.md               # Complete setup, execution, and API guide
```

---

## 🛠️ Tech Stack & Requirements

### Frontend
- **HTML5**: Semantic tags, accessibility attributes, and SEO metadata.
- **CSS3**: Custom properties (CSS variables), Flexbox, CSS Grid, Glassmorphism backdrop filters, CSS keyframes.
- **JavaScript**: ES6+, Fetch API, IntersectionObserver, LocalStorage.

### Backend
- **Node.js**: Runtime environment (v16+ recommended).
- **Express.js**: Lightweight REST API server.
- **MySQL2**: Connection pooling with Promise API and parameterized queries.
- **Cors & Dotenv**: Cross-Origin Resource Sharing and secure environment variable handling.

### Database
- **MySQL 5.7+ / 8.0+** or MariaDB.

---

## 🚀 Quick Start Guide

### Step 1: Set Up MySQL Database

1. Open your MySQL client (MySQL Workbench, phpMyAdmin, or Command Line):
   ```bash
   mysql -u root -p
   ```
2. Run the script provided in `database/database.sql`:
   ```sql
   SOURCE c:/Users/dell/OneDrive/Desktop/Portfolio/database/database.sql;
   ```
   Or copy and paste the contents into your MySQL console:
   ```sql
   CREATE DATABASE IF NOT EXISTS portfolio_db;
   USE portfolio_db;

   CREATE TABLE IF NOT EXISTS contacts (
       id INT AUTO_INCREMENT PRIMARY KEY,
       name VARCHAR(150) NOT NULL,
       email VARCHAR(255) NOT NULL,
       phone VARCHAR(30) NOT NULL,
       message TEXT NOT NULL,
       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
   ```

---

### Step 2: Configure Backend Environment Variables

1. Navigate to the `backend/` folder.
2. Verify or edit the `.env` file with your local MySQL credentials:
   ```env
   PORT=5000
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   DB_NAME=portfolio_db
   ```

---

### Step 3: Install Backend Dependencies

Open your terminal, navigate to the `backend` directory, and run:
```bash
cd backend
npm install
```

---

### Step 4: Run the Application

#### Option A: Run Full-Stack Express Server (Recommended)
From the `backend/` directory:
```bash
npm start
```
- The backend server will start on `http://localhost:5000`.
- The Express server automatically serves both the **Frontend website** and the **API**:
  - 🌐 **Website**: [http://localhost:5000](http://localhost:5000)
  - 📡 **Contact API**: [http://localhost:5000/api/contact](http://localhost:5000/api/contact)
  - 🩺 **Health Check**: [http://localhost:5000/api/health](http://localhost:5000/api/health)

#### Option B: Standalone Frontend (Live Server / Direct Browser)
- You can simply double-click `frontend/index.html` or open it with VS Code's **Live Server** extension (`http://127.0.0.1:5500`).
- The frontend will send contact messages directly to `http://localhost:5000/api/contact`.
- Even if the backend server is temporarily not running, the form validates inputs and displays informative feedback without breaking.

---

## 📡 API Reference

### 1. Health Check
- **Endpoint**: `GET /api/health`
- **Response**:
  ```json
  {
    "status": "online",
    "server": "Balaji M Portfolio Backend",
    "database": "connected",
    "timestamp": "2026-09-29T00:25:00.000Z"
  }
  ```

### 2. Submit Contact Message
- **Endpoint**: `POST /api/contact`
- **Headers**: `Content-Type: application/json`
- **Request Body**:
  ```json
  {
    "name": "Rahul Sharma",
    "email": "rahul@example.com",
    "phone": "+91 9876543210",
    "message": "Hello Balaji, I reviewed your data analytics projects and would like to discuss an opportunity."
  }
  ```
- **Success Response (201 Created)**:
  ```json
  {
    "success": true,
    "message": "Thank you, Balaji M has received your message and will get back to you shortly!",
    "contactId": 1
  }
  ```
- **Validation Failure Response (400 Bad Request)**:
  ```json
  {
    "success": false,
    "message": "Validation failed. Please review your input.",
    "errors": [
      "A valid email address is required.",
      "Message is required and must be at least 10 characters long."
    ]
  }
  ```

---

## 🔒 Security Best Practices Implemented

1. **SQL Injection Prevention**: All queries to the MySQL database use parameterized statements (`?` placeholders via `mysql2`).
2. **Credential Isolation**: Database passwords and server ports are stored exclusively in `.env` and are never exposed to client-side code.
3. **Double Validation**: Form input is validated on the client side for instant user feedback and re-validated on the backend server for integrity.
4. **CORS Configuration**: Restricts methods to `GET`, `POST`, `OPTIONS`.
5. **Payload Size Limits**: Limits incoming JSON body size to prevent payload-based denial of service.

---

## 👤 Portfolio Information & Credits

- **Name**: BALAJI M
- **Degree**: B.Tech in Information Science and Technology
- **Institution**: Presidency University, India (2023 – 2027) | CGPA: 7.15/10
- **Location**: Bangalore, India
- **Email**: [balajisheety08@gmail.com](mailto:balajisheety08@gmail.com)
- **Phone**: [+91 9335352300](tel:+919335352300)
- **GitHub**: [github.com/balu250](https://github.com/balu250)
- **LinkedIn**: Balaji M
- **License**: ISC License © 2026 Balaji M
"# Portfolio" 
