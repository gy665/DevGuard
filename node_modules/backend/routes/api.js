const express = require('express');
const router = express.Router();
const { scanContainer } = require('../scanners/containerScanner');
const { upload, scanFile } = require('../scanners/fileScanner');
const { scanRepository } = require('../scanners/repoScanner');

router.post('/scan/container', scanContainer);
router.post('/scan/file', upload.single('scanFile'), scanFile);
router.post('/scan/repository', scanRepository);

module.exports = router;