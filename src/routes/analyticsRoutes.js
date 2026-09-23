const express = require('express');
const router = express.Router();
const { trackEvent, getAnalyticsDashboard } = require('../controllers/analyticsController');

// Public event ingestion
router.post('/track', trackEvent);

// Admin analytics dashboard
router.get('/dashboard', getAnalyticsDashboard);

module.exports = router;
