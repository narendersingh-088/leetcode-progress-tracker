const bcrypt = require('bcrypt');
const db = require('../config/db');

const signup = async (req, res) => {
    try{
        const { username, email, password } = req.body;

        if(!username || !email || !password){
            return res.status(400).json({ error : 'Username, email and password are required'});
        }
        if(password.length < 6){
            return res.status(400).json({ error : 'Password must be at least 6 characters'});
        }

        const[existing] = await db.query(
            'SELECT id FROM users WHERE email = ? OR username = ?',
            [email, username]
        );
        if(existing.length > 0){
            return res.status(409).json({ error : 'Username or email already in use'});
        }

        const saltRounds = 10;
        const password_hash = await bcrypt.hash(password, saltRounds);

        const[result] = await db.query(
            'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)',
            [username, email, password_hash]
        );

        res.status(201).json({
            message: 'User created succesfully',
            userId: result.insertId
        });
    }catch(err){
        console.error(err);
        res.status(500).json({error : 'Server error during signup'});
    }
};

module.exports = {signup};