const db = require('../config/db');

const getAllProblems = async (req, res) => {
    try{
        const {topic, difficulty, search} = req.query;

        let query = 'SELECT * FROM problems WHERE 1=1';
        const params = [];

        if(topic){
            query += ' AND topic = ?';
            params.push(topic);
        }
        if(difficulty){
            query += ' AND difficulty = ?';
            params.push(difficulty);
        }
        if(search){
            query += ' AND title LIKE ?';
            params.push(`%${search}%`);
        }

        query += ' ORDER BY leetcode_id ASC';

        const[problems] = await db.query(query, params);
        res.status(200).json(problems);

    }catch(err){
        console.error(err);
        res.status(500).json({ error : 'Server error fetching problems'});
    }
};

const getProblemById = async (req, res) => {
    try{
        const { id } = req.params;
        const [problems] = await db.query('SELECT * FROM problems WHERE id = ?', [id]);

        if(problems.length === 0){
            return res.status(404).json({ error : 'Problem not found'});
        }
        res.status(200).json(problems[0]);

    }catch(err){
        console.error(err);
        res.status(500).json({ error : 'Server error fetching problem'});
    }
};

module.exports = {getAllProblems, getProblemById};