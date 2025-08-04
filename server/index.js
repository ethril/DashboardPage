require('dotenv').config(); // Ładowanie zmiennych środowiskowych z pliku .env
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const familyRoutes = require('./routes/familyRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
// Użycie routes z familyRoutes
app.use('/api', familyRoutes);
// Użycie routes z userRoutes
app.use('/api', userRoutes);

// Testowy endpoint API
app.get('/api/health', (req, res) => {
    res.json({ message: 'API is working!' });
});

// Start serwera
app.listen(PORT, '0.0.0.0',() => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
