const express = require('express');
const router = express.Router();
const { getProfile, getUserById, submitFeedback } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

// Protected user routes
router.get('/profile', protect, getProfile);
router.post('/feedback', protect, submitFeedback);
router.get('/:id', protect, getUserById);

module.exports = router;
