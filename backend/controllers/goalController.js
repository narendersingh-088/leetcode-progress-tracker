const db = require('../config/db');

const createGoal = async (req, res) => {
    try{
        const userId = req.user.userId;
        const {target, deadline} = req.body;

        if(!target){
            return res.status(400).json({ error : 'target is required'});
        }

        const [result] = await db.query(
            'INSERT INTO goals (user_id, target, deadline) VALUES (?, ?, ?)',
            [userId, target, deadline || null]
        );

        res.status(201).json({ message : 'Goal created', goalId: result.insertId });

    }catch(err){
        console.error(err);
        res.status(500).json({ error : 'Server error creating goal'});
    }
};

const getGoals = async (req, res) => {
    try{
        const userId = req.user.userId;

        const[goals] = await db.query(
            'SELECT * FROM goals WHERE user_id = ? ORDER BY created_at DESC',
            [userId]
        );

        const[[{ totalSolved }]] = await db.query(
            `SELECT COUNT(*) AS totalSolved FROM user_progress WHERE user_id = ? AND status = 'Solved'`,
            [userId]
        );

        const goalsWithProgress = goals.map( g => ({
            ...g,
            completed_count: totalSolved,
            progress_percent: g.target > 0 ? Math.min(100, Math.round((totalSolved / g.target) * 100)) : 0
        }));

        res.status(200).json(goalsWithProgress);

    }catch(err){
        console.error(err);
        res.status(500).json({ error : 'Server error fetching goals'});
    }
};

const deleteGoal = async (req, res) => {
    try{
        const userId = req.user.userId;
        const { id } = req.params;

        const [result] = await db.query(
            'DELETE FROM goals WHERE id = ? AND user_id = ?',
            [id, userId]
        );

        if(result.affectedRows === 0){
            return res.status(404).json({ error : 'Goal not found'});
        }

        res.status(200).json({ message : 'Goal deleted '});

    }catch(err){
        console.error(err);
        res.status(500).json({ error : 'Server error deleting goal'});
    }
};

module.exports = {createGoal, getGoals, deleteGoal};