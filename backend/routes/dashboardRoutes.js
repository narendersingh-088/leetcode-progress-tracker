const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {getStats, getTopicProgress} = require('../controllers/dashboardController');

router.use(authMiddleware);
router.get('/stats', getStats);
router.get('/topics', getTopicProgress);

module.exports = router;