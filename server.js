const http = require('http');
const path = require('path');
const fs = require('fs');
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { Server } = require('socket.io');

// Load environment variables
dotenv.config();

const connectDB = require('./src/config/db');
const authRoutes = require('./src/routes/authRoutes');
const userRoutes = require('./src/routes/userRoutes');
const messageRoutes = require('./src/routes/messageRoutes');
const adminRoutes = require('./src/routes/adminRoutes');
const analyticsRoutes = require('./src/routes/analyticsRoutes');
const initChatSocket = require('./src/socket/chatSocket');
const { initMatchingSchedule } = require('./src/services/matchingEngine');
const { errorHandler } = require('./src/middleware/errorMiddleware');

// Initialize MongoDB connection
connectDB();

// Initialize automated Pre-Navratri matching schedule
initMatchingSchedule();

const app = express();
const server = http.createServer(app);

// Allowed origins
const allowedOrigins = [
  process.env.CLIENT_URL || 'http://localhost:3000',
  'https://findmygarbapartner.com',
  'https://www.findmygarbapartner.com',
  'https://findmygarbapartner.in',
  'https://www.findmygarbapartner.in',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
];

const isOriginAllowed = (origin) => {
  if (!origin) return true; // Server-to-server or mobile app
  if (process.env.NODE_ENV !== 'production') return true; // Dev mode
  if (allowedOrigins.indexOf(origin) !== -1) return true; // Whitelisted

  // Allow Vercel, Netlify, Render, Cloudflare, Ngrok, and LAN IP ranges
  if (
    /https?:\/\/([a-zA-Z0-9-]+\.)?vercel\.app$/.test(origin) ||
    /https?:\/\/([a-zA-Z0-9-]+\.)?netlify\.app$/.test(origin) ||
    /https?:\/\/([a-zA-Z0-9-]+\.)?onrender\.com$/.test(origin) ||
    /https?:\/\/([a-zA-Z0-9-]+\.)?trycloudflare\.com(:\d+)?$/.test(origin) ||
    /https?:\/\/([a-zA-Z0-9-]+\.)?ngrok-free\.app(:\d+)?$/.test(origin) ||
    /https?:\/\/([a-zA-Z0-9-]+\.)?ngrok\.io(:\d+)?$/.test(origin) ||
    /https?:\/\/([a-zA-Z0-9-]+\.)?loca\.lt(:\d+)?$/.test(origin) ||
    /https?:\/\/(192\.168\.\d+\.\d+|10\.\d+\.\d+\.\d+|172\.(1[6-9]|2\d|3[0-1])\.\d+\.\d+)(:\d+)?$/.test(origin)
  ) {
    return true;
  }
  return false;
};

// Initialize Socket.io with dynamic CORS
const io = new Server(server, {
  cors: {
    origin: (origin, callback) => {
      if (isOriginAllowed(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Blocked by CORS policy'));
      }
    },
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

app.set('io', io);
initChatSocket(io);

const {
  authLimiter,
  generalApiLimiter,
  mongoSanitizeMiddleware,
  helmetSecurity,
} = require('./src/middleware/security');

// Security HTTP headers configured for React SPA & external fonts/images
app.use(helmetSecurity);

// Cross-Origin Resource Sharing (CORS) setup
app.use(
  cors({
    origin: (origin, callback) => {
      if (isOriginAllowed(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Blocked by CORS policy'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Body parser middlewares
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// NoSQL Injection Sanitizer (strips $ and . from req.body, req.query, req.params)
app.use(mongoSanitizeMiddleware);

// Rate Limiting
app.use('/api', generalApiLimiter);
app.use('/api/auth/register', authLimiter);
app.use('/api/auth/login', authLimiter);

// Health Check Endpoint (For Cloud Cold-Start Prevention / Render / Railway / Uptime monitoring)
const healthHandler = (req, res) => {
  res.status(200).json({
    status: 'OK',
    uptime: Number(process.uptime().toFixed(2)),
    message: 'Find My Garba Partner server is hot and active',
    timestamp: new Date().toISOString(),
  });
};

app.get('/api/health', healthHandler);
app.get('/health', healthHandler);

// Mount Feature API Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/analytics', analyticsRoutes);

// API 404 Handler for any unhandled /api requests
app.all('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `API endpoint not found: ${req.originalUrl}`,
  });
});

// Serve Frontend Static Assets in Production
const clientDistPath = path.join(__dirname, 'client', 'dist');
if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));

  // SPA Catch-all Route: Send index.html for all non-API GET requests
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(clientDistPath, 'index.html'));
  });
} else {
  // Development fallback when client is running separately via Vite
  app.get('/', (req, res) => {
    res.status(200).json({
      success: true,
      message: '🎉 Find My Garba Partner API is running!',
      platform: 'findmygarbapartner.com',
      region: 'Gujarat, India',
      version: '1.1.0',
      note: 'Vite dev server running on port 5173 or build client with `npm run build`',
      timestamp: new Date().toISOString(),
    });
  });
}

// Global Error Handling
app.use(errorHandler);

const { initKeepAlive } = require('./src/services/keepAliveService');

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Find My Garba Partner API & Socket.io server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  // Initialize Cloud Keep-Alive self-ping
  initKeepAlive({ port: PORT, intervalMinutes: 12 });
});

// Graceful Shutdown for Process Termination (Railway, Docker, etc.)
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});

module.exports = { app, server };

