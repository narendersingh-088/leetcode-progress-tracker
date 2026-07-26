const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {createGoal, getGoals, deleteGoal} = require('../controllers/goalController');

router.use(authMiddleware);

router.post('/', createGoal);
router.get('/', getGoals);
router.delete('/:id', deleteGoal);

module.exports = router;