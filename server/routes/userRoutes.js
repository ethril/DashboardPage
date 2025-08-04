const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const pool = require('../config/db'); // Połączenie z bazą danych

const router = express.Router();

// Endpoint logowania
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        console.log('Otrzymane dane:', {
            email,
            passwordLength: password?.length
        });

        if (!email || !password) {
            return res.status(400).json({
                message: 'Wymagane są wszystkie pola'
            });
        }

        // Zapytanie do PostgreSQL
        const result = await pool.query(
            'SELECT * FROM users WHERE email = $1',
            [email.toLowerCase()]
        );

        const user = result.rows[0];

        if (!user) {
            return res.status(401).json({
                message: 'Nieprawidłowy email lub hasło'
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({
                message: 'Nieprawidłowy email lub hasło'
            });
        }

        const token = jwt.sign(
            { userId: user.id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            token,
            userId: user.id,
            email: user.email
        });
    } catch (error) {
        console.error('Błąd logowania:', error);
        res.status(500).json({
            message: 'Wystąpił błąd podczas logowania'
        });
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