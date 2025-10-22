// scanners/containerScanner.js

const util = require('util');
const { exec } = require('child_process');
// Import our new centralized transformer
const { transformTrivyOutput } = require('../utils/transformer');
// Import the save service
const { saveScanResults } = require('../services/saveScanService');

// Promisify exec for async/await
const execPromise = util.promisify(exec);

const scanContainer = async (req, res) => {
    const { imageName } = req.body;
    // Get user ID from auth middleware
    const userId = req.user.userId;

    if (!imageName) {
        return res.status(400).json({ error: 'Image name is required' });
    }

    // Basic sanitization: prevent command chaining with `&&` or `;`
    // A more robust library like `shell-quote` is recommended for production
    const sanitizedImageName = imageName.split(' ')[0].replace(/;/g, '').replace(/&/g, '');

    const command = `trivy image --format json ${sanitizedImageName}`;

    console.log(`--- ContainerScanner: Executing: ${command}`);

    try {
        // Use await for cleaner, modern asynchronous handling
        const { stdout } = await execPromise(command);

        // Unlike npm audit, Trivy often exits with code 0 even if vulnerabilities are found.
        // The catch block is for true execution errors (e.g., Trivy not installed, image not found).
        
        const rawTrivyData = JSON.parse(stdout);
       const standardizedResults = transformTrivyOutput(rawTrivyData, sanitizedImageName, 'CONTAINER');
        
        // Now the save service will receive the correct, defined values
        await saveScanResults(userId, standardizedResults);
        
        res.status(200).json(standardizedResults);

    } catch (error) {
        console.error('--- ContainerScanner: A critical error occurred during the scan process ---');
        console.error(error);

        // Provide the actual error message from Trivy if available
        return res.status(500).json({
            error: 'Failed to scan container image',
            details: error.stderr || 'An unknown error occurred. Ensure Docker is running and Trivy is installed.'
        });
    }
};

module.exports = {
    scanContainer,
};