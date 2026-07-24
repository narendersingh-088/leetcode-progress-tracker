const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {upsertProgress, getUserProgress, getRevisionList, updateProgress, deleteProgress} = require('../controllers/progressController');


router.use(authMiddleware);

router.post('/', upsertProgress);
router.get('/', getUserProgress);
router.get('/revision', getRevisionList);
router.put('/:id', updateProgress);
router.delete('/:id', deleteProgress);

module.exports = router;