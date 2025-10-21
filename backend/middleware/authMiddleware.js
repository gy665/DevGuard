const jwt = require('jsonwebtoken');

// This MUST use the same secret from your .env file
const JWT_SECRET = process.env.JWT_SECRET;

const authMiddleware = (req, res, next) => {
    // The token is sent in the "Authorization" header in the format: "Bearer <token>"
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'No token provided or invalid format.' });
    }

    // Isolate the token from "Bearer <token>"
    const token = authHeader.split(' ')[1];

   try {
        // --- ADD THIS LOG ---
        console.log('[authMiddleware] Verifying token with secret:', JWT_SECRET);

        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded; 
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Invalid or expired token.' });
    }
};

module.exports = authMiddleware;