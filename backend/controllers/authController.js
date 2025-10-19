const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();
const saltRounds = 10;



const register = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required.' });
    }

    try {
        // Check if user already exists
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(409).json({ error: 'User with this email already exists.' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create new user
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
            },
        });

        // Don't send the password back
        const { password: _, ...userWithoutPassword } = user;
        
        console.log(`--- AuthController: User registered successfully: ${email}`);
        res.status(201).json({ 
            message: 'User created successfully!', 
            user: userWithoutPassword 
        });

    } catch (error) {
        console.error('--- AuthController: Registration error ---');
        console.error(error);
        res.status(500).json({ 
            error: 'Internal server error during registration',
            details: error.message 
        });
    }
};

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

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid credentials.' });
        }
        
        // --- 2. GENERATE THE JWT ---
        const payload = { 
            userId: user.id, 
            email: user.email 
        };

        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' }); // Token expires in 1 hour

        console.log(`--- AuthController: User logged in successfully: ${email}`);
        
        // --- 3. SEND THE TOKEN BACK ---
        res.status(200).json({ 
            message: 'Login successful!',
            token: token, // The new token
            user: { id: user.id, email: user.email }
        });

    } catch (error) {
        console.error('--- AuthController: Login error ---');
        console.error(error);
        res.status(500).json({ 
            error: 'Internal server error during login',
            details: error.message 
        });
    }
};

module.exports = {
    register,
    login,
};