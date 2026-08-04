const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {getStats, getTopicProgress, getHeatmapData, getAnalytics} = require('../controllers/dashboardController');

router.use(authMiddleware);
router.get('/stats', getStats);
router.get('/topics', getTopicProgress);
router.get('/heatmap', getHeatmapData);
router.get('/analytics', getAnalytics);

module.exports = router;