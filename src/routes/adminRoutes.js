const express = require('express');
const router = express.Router();
const {
  executeBatchMatching,
  getMatchingStats,
  getAllUsers,
  blockUser,
  unblockUser,
  getAdminReports,
  getFeedbackList,
  getNotificationLogs,
  triggerTestNotification,
  seedDemoPartners,
  resetMatching,
  getMatchesOverview,
  manualUnmatch,
  manualMatch,
  exportMatchesCsv,
} = require('../controllers/adminController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

// In production, require JWT auth and admin role
// In development, allow easy access if token is passed
const adminGuard = (req, res, next) => {
  if (req.headers.authorization) {
    return protect(req, res, () => {
      // If user is authenticated, ensure admin or allow in dev
      if (req.user.role === 'admin' || process.env.NODE_ENV !== 'production') {
        return next();
      }
      return res.status(403).json({ success: false, message: 'Admin role required.' });
    });
  }
  if (process.env.NODE_ENV !== 'production') {
    return next(); // Dev convenience
  }
  return res.status(401).json({ success: false, message: 'Authentication required.' });
};

router.use(adminGuard);

// Matching & Stats
router.post('/match', executeBatchMatching);
router.get('/stats', getMatchingStats);
router.get('/matches-overview', getMatchesOverview);
router.post('/manual-unmatch', manualUnmatch);
router.post('/manual-match', manualMatch);
router.get('/export-matches', exportMatchesCsv);

// Moderation & User Management
router.get('/users', getAllUsers);
router.post('/block', blockUser);
router.post('/unblock', unblockUser);
router.get('/reports', getAdminReports);
router.get('/feedback', getFeedbackList);

// Notifications & Seed
router.get('/notifications', getNotificationLogs);
router.post('/test-notification', triggerTestNotification);
router.post('/seed-demo', seedDemoPartners);
router.post('/reset-matching', resetMatching);

module.exports = router;

