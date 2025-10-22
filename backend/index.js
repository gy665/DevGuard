const path = require('path'); // Import the built-in 'path' module

// --- THIS IS THE FIX ---
// We tell dotenv to look for the .env file in the *current* directory (which is /backend).
// `__dirname` is a special variable in Node.js that gives you the path to the current file's folder.
require('dotenv').config();


const express = require('express');
const cors = require('cors');
const apiRoutes = require('./routes/api');

// --- ADD THIS LOG TO PROVE THE FIX ---
console.log(`[SERVER START] Is JWT_SECRET loaded? ${process.env.JWT_SECRET ? '✅ Yes' : '❌ No, it is UNDEFINED!'}`);



const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors({
  origin: 'http://localhost:5173' // <-- IMPORTANT: Use your frontend's actual port
}));

app.use(express.json());

// Routes
app.use('/api', apiRoutes);

app.get('/', (req, res) => {
  res.status(200).json({ message: 'Vulnerability Scanner API is running!' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`[SERVER START] Backend server is listening on http://localhost:${PORT}`);
});