require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// const db = require('./config/db');
// db.query('SELECT 1+1 AS result')
//   .then(([rows]) => console.log('DB connected:', rows))
//   .catch(err => console.error('DB connection failed:', err));

app.get('/', (req, res) => {
    res.send('Leetcode tracker API is running');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`);
});