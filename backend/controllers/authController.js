const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
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

const login = async (req, res) => {
    try{
        const { email, password } = req.body;

        if(!email || !password){
            return res.status(400).json({ error : 'Email and password are required'});
        }

        const[users] = await db.query(
            'SELECT id, username, email, password_hash FROM users WHERE email = ?',
            [email]
        );
        if(users.length == 0){
            return res.status(401).json({ error : 'Invalid email or password'});
        }

        const user = users[0];

        const isMatch = await bcrypt.compare(password, user.password_hash);
        if(!isMatch){
            return res.status(401).json({error : 'Invalid email or password'});
        }

        const token = jwt.sign(
            {userId: user.id, username: user.username},
            process.env.JWT_SECRET,
            { expiresIn: '7d'}
        );

        res.status(200).json({
            message : 'Login succesful',
            token,
            user: {id: user.id, username:user.username, email: user.email}
        });
    }catch(err){
        console.error(err);
        res.status(500).json({error : 'Server error during login'});
    }
};

module.exports = {signup, login};