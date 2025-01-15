const pool = require('../config/db');

const getUsers = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM public.users');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
};

module.exports = { getUsers };