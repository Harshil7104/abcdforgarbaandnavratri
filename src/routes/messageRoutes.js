const express = require('express');
const router = express.Router();
const { getMessages, sendMessage, reportUser } = require('../controllers/messageController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect); // Protect all message routes with JWT

router.get('/:matchId', getMessages);
router.post('/send', sendMessage);
router.post('/report', reportUser);

module.exports = router;
