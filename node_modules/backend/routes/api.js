const express = require('express');
const router = express.Router();
const { scanContainer } = require('../scanners/containerScanner');
const { upload, scanFile } = require('../scanners/fileScanner');
const { scanRepository } = require('../scanners/repoScanner');

const { register, login, verifyToken } = require('../controllers/authController');
const { getDashboardData } = require('../controllers/dashboardController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/scan/container', authMiddleware, scanContainer);
router.post('/scan/file', authMiddleware, upload.single('scanFile'), scanFile);
router.post('/scan/repository', authMiddleware, scanRepository);


//user authentification

router.post('/auth/register', register);
router.post('/auth/login', login);


router.get('/auth/verify', authMiddleware, verifyToken);



router.get('/dashboard', authMiddleware, getDashboardData);

module.exports = router;