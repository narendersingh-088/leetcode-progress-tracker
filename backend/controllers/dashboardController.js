const db = require('../config/db');

const getStats = async (req, res) => {
    try{
        const userId = req.user.userId;

        const[difficultyCounts] = await db.query(`
            SELECT p.difficulty, COUNT(*) AS count
            FROM user_progress up
            JOIN problems p ON up.problem_id = p.id
            WHERE up.user_id = ? AND up.status = 'Solved'
            GROUP BY p.difficulty
            `, [userId]);

        const stats = {totalSolved: 0, easy: 0, medium: 0, hard: 0};
        difficultyCounts.forEach(row => {
            stats.totalSolved += row.count;
            if(row.difficulty === 'Easy') stats.easy = row.count;
            if(row.difficulty === 'Medium') stats.medium = row.count;
            if(row.difficulty === 'Hard') stats.hard = row.count;
        });

        const [[attemptRow]] = await db.query(`
            SELECT 
                SUM(CASE WHEN status = 'Solved' THEN 1 ELSE 0 END) AS solvedCount,
                COUNT(*) AS totalAttempts
            FROM user_progress
            WHERE user_id = ?
            `, [userId]);

        const acceptanceRate = attemptRow.totalAttempts > 0
            ? Math.round((attemptRow.solvedCount / attemptRow.totalAttempts) * 100) : 0;
        
        const [solvedDates] = await db.query(`
            SELECT DISTINCT date_solved
            FROM user_progress
            WHERE user_id = ? AND status = 'Solved' AND date_solved IS NOT NULL
            ORDER BY date_solved DESC
            `, [userId]);

        let streak = 0;
        if(solvedDates.length > 0){
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            let cursor = new Date(today);
            const dateSet = new Set(solvedDates.map(r => r.date_solved.toISOString().slice(0, 10)));

            if(!dateSet.has(cursor.toISOString().slice(0, 10))){
                cursor.setDate(cursor.getDate() - 1);
            }

            while(dateSet.has(cursor.toISOString().slice(0, 10))){
                streak++;
                cursor.setDate(cursor.getDate() - 1);
            }
        }

        res.status(200).json({
            totalSolved: stats.totalSolved,
            easy: stats.easy,
            medium: stats.medium,
            hard: stats.hard,
            acceptanceRate,
            currentStreak: streak
        });

    }catch(err){
        console.error(err);
        res.status(500).json({ error : 'Server error fetching dashboard stats'});
    }
};

const getTopicProgress = async (req, res) => {
    try{
        const userId = req.user.userId;

        const [rows] = await db.query(`
            SELECT 
                p.topic,
                COUNT(DISTINCT p.id) AS totalProblems,
                COUNT(DISTINCT CASE WHEN up.status = 'Solved' AND up.user_id = ? THEN up.problem_id END) AS solvedCount
                FROM problems p
                LEFT JOIN user_progress up ON up.problem_id = p.id
                GROUP BY p.topic
                ORDER BY p.topic
            `, [userId]);
        
        const topicProgress = rows.map( r =>({
            topic: r.topic,
            totalProblems: r.totalProblems,
            solvedCount: r.solvedCount,
            percent: r.totalProblems > 0 ? Math.round((r.solvedCount / r.totalProblems) * 100) : 0
        }));

        res.status(200).json(topicProgress);

    }catch(err){
        console.error(err);
        res.status(500).json({ error : 'Server error fetching topic progress'});
    }
};

const getHeatmapData = async (req, res) => {
    try{
        const userId = req.user.userId;

        const[rows] = await db.query(`
            SELECT date_solved, COUNT(*) AS count
            FROM user_progress
            WHERE user_id = ? AND status = 'Solved' AND date_solved IS NOT NULL
                AND date_solved >= DATE_SUB(CURDATE(), INTERVAL 90 DAY)
            GROUP BY date_solved
            ORDER BY date_solved ASC
            `, [userId]);

        const heatmap = {};
        rows.forEach(r => {
            const dateKey = r.date_solved.toISOString().slice(0, 10);
            heatmap[dateKey] = r.count;
        });

        res.status(200).json(heatmap);

    }catch(err){
        console.error(err);
        res.status(500).json({ error : 'Server error fetching heatmap data'});
    }
};

module.exports = {getStats, getTopicProgress, getHeatmapData};