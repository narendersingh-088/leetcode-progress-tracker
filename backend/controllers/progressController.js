const db = require('../config/db');

const upsertProgress = async (req, res) => {
    try{
        const userId = req.user.userId;
        const { problem_id, status, date_solved, notes, revision, time_taken } = req.body;

        if(!problem_id){
            return res.status(400).json({ error : 'problem_id is required'});
        }

        const[problem] = await db.query('SELECT id FROM problems WHERE id = ?', [problem_id]);
        if(problem.length === 0){
            return res.status(404).json({ error : 'Problem not found'});
        }

        const query = `
            INSERT INTO user_progress
            (user_id, problem_id, status, date_solved, notes, revision, time_taken)
            VALUES(?, ?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE
            status = VALUES(status),
            date_solved = VALUES(date_solved),
            notes = VALUES(notes),
            revision = VALUES(revision  ),
            time_taken = VALUES(time_taken)
            `;

        await db.query(query, 
                [userId, 
                problem_id, 
                status || 'Solved', 
                date_solved || new Date().toISOString().slice(0, 10), 
                notes || null, 
                revision || false, 
                time_taken || null]);

        res.status(200).json({ message : 'Progress saved'});

    }catch(err){
        console.error(err);
        res.status(500).json({ error : 'Server error saving progress'});
    }
};

const getUserProgress = async (req, res) => {
    try{
        const userId = req.user.userId;

        const[rows] = await db.query(`
            SELECT up.id, up.status, up.date_solved, up.notes, up.revision, up.time_taken,
            p.id AS problem_id, p.title, p.difficulty, p.topic, p.url
            FROM user_progress up
            JOIN problems p ON up.problem_id = p.id
            WHERE up.user_id = ?
            ORDER BY up.date_solved DESC
            `, [userId])

            res.status(200).json(rows);

    }catch(err){
        console.error(err);
        res.status(500).json({ error : 'Server error fetching progress'});
    }
};

module.exports = {upsertProgress, getUserProgress};