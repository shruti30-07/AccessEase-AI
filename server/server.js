require('dotenv').config();
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const aiRoutes = require('./routes/ai');

const app = express();
const PORT = process.env.PORT || 3001;

// CORS configuration - allow frontend dev server
app.use(
  cors({
    origin: ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173'],
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Rate limiting - prevent abuse
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: { error: 'Too many requests. Please wait a moment before trying again.' },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// API routes
app.use('/api/ai', aiRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  const apiConfigured = !!(
    process.env.XAI_API_KEY &&
    process.env.XAI_API_KEY !== 'your_xai_api_key_here'
  );
  res.json({
    status: 'ok',
    apiConfigured,
    model: process.env.XAI_MODEL || 'grok-2-vision-1212',
    timestamp: new Date().toISOString(),
  });
});

// Multer error handler
app.use((err, req, res, next) => {
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ error: 'File too large. Maximum size is 10MB.' });
  }
  if (err.code === 'LIMIT_FILE_COUNT') {
    return res.status(400).json({ error: 'Too many files. Please upload one file at a time.' });
  }
  if (err.message && err.message.startsWith('Invalid file type')) {
    return res.status(400).json({ error: err.message });
  }
  next(err);
});

// General error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.message);
  res.status(500).json({ error: 'An unexpected error occurred.' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found.' });
});

app.listen(PORT, () => {
  const apiConfigured = !!(
    process.env.XAI_API_KEY &&
    process.env.XAI_API_KEY !== 'your_xai_api_key_here'
  );
  console.log(`\n🚀 AccessEase AI Server running on port ${PORT}`);
  console.log(`📡 API: http://localhost:${PORT}/api`);
  console.log(`🔑 Grok API: ${apiConfigured ? '✅ Configured' : '⚠️  Not configured (Demo mode active)'}`);
  if (!apiConfigured) {
    console.log(`\n   To enable AI features:`);
    console.log(`   1. Copy server/.env.example to server/.env`);
    console.log(`   2. Add your xAI API key: XAI_API_KEY=your_key_here`);
    console.log(`   3. Restart the server\n`);
  }
});

module.exports = app;
