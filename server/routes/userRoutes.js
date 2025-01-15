const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const pool = require('../config/db'); // Połączenie z bazą danych

const router = express.Router();

// Endpoint logowania
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    console.log("Received email:", email);

    try {
        const userResult = await pool.query('SELECT * FROM public.users WHERE email = $1', [email]);
        const user = userResult.rows[0];
        console.log('User from DB:', user);

        if (!user) {
            console.log("Invalid email");
            return res.status(401).json({ message: 'Invalid email' });
        }
        console.log(password)
        console.log(user.password)

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (password !== user.password) {
            console.log("Invalid password");
            return res.status(401).json({ message: 'Invalid password' });
        }

        const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
        console.log("Token created:", token);
        res.json({ token });  // Zwrócenie tokenu w odpowiedzi
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;