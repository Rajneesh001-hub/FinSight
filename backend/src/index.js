const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

// Import middleware
const authenticateToken = require('./middleware/auth');

// Import routes
const transactionRoutes = require('./routes/transactions');
const dashboardRoutes = require('./routes/dashboard');
const budgetRoutes = require('./routes/budgets');
const goalRoutes = require('./routes/goals');
const importRoutes = require('./routes/import');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3001',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Health check endpoint (no auth required)
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date()
  });
});

// Apply authentication middleware to all routes except health check
app.use(authenticateToken);

// Register routes
app.use('/api/transactions', transactionRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/budgets', budgetRoutes);
app.use('/api/goals', goalRoutes);
app.use('/api', importRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not found',
    code: 'NOT_FOUND',
    status: 404,
    path: req.path
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  const statusCode = err.status || 500;
  const errorCode = err.code || 'INTERNAL_ERROR';
  const message = err.message || 'Internal server error';

  res.status(statusCode).json({
    error: message,
    code: errorCode,
    status: statusCode
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`FinSight Backend API running on http://localhost:${PORT}`);
  console.log(`CORS enabled for http://localhost:3001`);
});
