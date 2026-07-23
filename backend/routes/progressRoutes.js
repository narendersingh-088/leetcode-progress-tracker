const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {upsertProgress, getUserProgress} = require('../controllers/progressController');

router.use(authMiddleware);

router.post('/', upsertProgress);
router.get('/', getUserProgress);

module.exports = router;