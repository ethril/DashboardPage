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
        //TODO do poprawy bcrypt (isPasswordValid);
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

// Endpoint generowania hasła
router.post('/generate-password', async (req, res) => {
    const { password } = req.body;
    console.log("Received password:", password);

    try {
        // Ustal odpowiednią ilość rund dla haszowania za pomocą bcrypt (np. 10)
        const saltRounds = 10;

        // Hashowanie hasła
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        console.log("Hashed password:", hashedPassword);

        // Opcjonalnie: możesz zapisać hasło do bazy danych lub zwrócić je w odpowiedzi
        res.json({ hashedPassword });
    } catch (error) {
        console.error('Error during password generation:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;