const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');

/**
 * Authentication Rate Limiter (Brute-Force Protection)
 * Restricts POST /api/auth/register and POST /api/auth/login to 5 requests per 15 minutes per IP
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 auth attempts per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many authentication attempts from this IP. Please try again after 15 minutes.',
  },
  skipSuccessfulRequests: false,
});

/**
 * General API Rate Limiter
 * Restricts general API endpoints to 100 requests per 15 minutes per IP
 */
const generalApiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP. Please try again after 15 minutes.',
  },
});

/**
 * Input Sanitation Middleware
 * Strips keys containing '$' and '.' to prevent NoSQL Injection attacks in MongoDB
 */
const mongoSanitizeMiddleware = mongoSanitize({
  replaceWith: '_',
  onSanitize: ({ req, key }) => {
    console.warn(`⚠️ [Security Alert] Sanitized malicious NoSQL operator in parameter: "${key}" from IP: ${req.ip}`);
  },
});

/**
 * Production Security Headers via Helmet
 */
const helmetSecurity = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
      fontSrc: ["'self'", 'https://fonts.gstatic.com', 'data:'],
      imgSrc: ["'self'", 'data:', 'https:', 'blob:'],
      connectSrc: ["'self'", 'ws:', 'wss:', 'https:', 'http:'],
    },
  },
  crossOriginEmbedderPolicy: false,
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  },
});

module.exports = {
  authLimiter,
  generalApiLimiter,
  mongoSanitizeMiddleware,
  helmetSecurity,
};
