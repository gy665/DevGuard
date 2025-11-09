const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();
const jwt = require('jsonwebtoken');

// --- REGISTER LOGIC ---
const register = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required.' });
    }
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: { email, password: hashedPassword },
        });
        res.status(201).json({ message: 'User created successfully!', userId: user.id });
    } catch (error) {
        console.error('Registration error:', error);
        if (error.code === 'P2002') {
             return res.status(409).json({ error: 'User with this email already exists.' });
        }
        res.status(500).json({ error: 'Internal server error' });
    }
};

// --- LOGIN LOGIC ---
const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required.' });
    }
    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials.' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials.' });
        }

        // --- GENERATE AND SEND THE TOKEN ---
        const payload = { 
            userId: user.id,
            email: user.email 
        };
        

        

        console.log('[authController] Signing token with secret:', process.env.JWT_SECRET);

        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ 
            message: 'Login successful!',
            token: token,
            user: { id: user.id, email: user.email }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }



};

const verifyToken = (req, res) => {
    
    res.status(200).json({ user: req.user });
};

// Export the functions so the router can use them
module.exports = {
    register,
    login,
    verifyToken,
};
