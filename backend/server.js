require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Leetcode tracker API is running');
});

const authRoutes = require('./routes/authRoutes');
const problemRoutes = require('./routes/problemRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/problems', problemRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`);
});