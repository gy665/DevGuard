const express = require('express');
const cors = require('cors');
const apiRoutes = require('./routes/api');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors()); // Allow requests from our frontend
app.use(express.json()); // Allow the server to accept JSON in request bodies



app.use('/api', apiRoutes);

// Health check route
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Vulnerability Scanner API is running!' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Backend server is listening on http://localhost:${PORT}`);
});