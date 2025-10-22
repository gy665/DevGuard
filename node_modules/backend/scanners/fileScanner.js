// FINAL DEBUGGING VERSION of fileScanner.js - UPDATED WITH TRANSFORMER AND SAVE SERVICE

const multer = require('multer');
const path = require('path');
const fs = require('fs');
const util = require('util');
const { exec } = require('child_process');
// CHANGE 1: Import the new transformer function
const { transformNpmAudit } = require('../utils/transformer');
// CHANGE 2: Import the save service
const { saveScanResults } = require('../services/saveScanService');

// Promisify the exec function to use async/await
const execPromise = util.promisify(exec);

// --- Multer Configuration (This part is correct and stays) ---
const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const tempScanDir = path.join(uploadDir, `scan-${Date.now()}`);
    fs.mkdirSync(tempScanDir, { recursive: true });
    cb(null, tempScanDir);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage });


// --- Full Scanner Logic with Detailed Error Logging ---

const scanFile = async (req, res) => {
  // CHANGE 3: Get user ID from auth middleware
  const userId = req.user.userId;

  if (!req.file) {
    return res.status(400).json({ error: 'No file was uploaded.' });
  }

  const tempFilePath = req.file.path;
  const originalFileName = req.file.originalname;
  const tempDir = path.dirname(tempFilePath);

  try {
    if (originalFileName === 'package.json') {
      const installCommand = `npm install --prefix ${tempDir}`;
      const auditCommand = `npm audit --json --prefix ${tempDir}`;

      try {
        console.log(`--- DEBUG: Attempting to execute: ${installCommand}`);
        await execPromise(installCommand);
        console.log(`--- DEBUG: SUCCESS - 'npm install' completed.`);

        console.log(`--- DEBUG: Attempting to execute: ${auditCommand}`);
        const { stdout } = await execPromise(auditCommand);
        console.log(`--- DEBUG: SUCCESS - 'npm audit' completed with no vulnerabilities.`);
        
        // CHANGE 4: Transform the successful result before sending
        const rawAuditData = JSON.parse(stdout);
        const standardizedResults = transformNpmAudit(rawAuditData, originalFileName, 'file');
        
        // CHANGE 5: Save results to database
        await saveScanResults(userId, standardizedResults);
        
        res.status(200).json(standardizedResults);

      } catch (error) {
        console.error('--- DEBUG: FAILED during command execution. ---');
        console.error(`> Exit Code: ${error.code}`);
        console.error('\n> STDERR (Standard Error Stream - THIS IS THE MOST IMPORTANT PART):');
        console.error(error.stderr);
        console.error('\n> STDOUT (Standard Output Stream):');
        console.error(error.stdout);

        // Special handling for npm audit's "failure on vulnerabilities"
        if (error.stdout && error.code !== 0) {
            console.log("--- DEBUG: 'npm audit' exited with an error code but provided JSON output. This means vulnerabilities were found. Treating as a success.");
            
            // CHANGE 6: Transform the "vulnerabilities found" result before sending
            try {
                const rawAuditData = JSON.parse(error.stdout);
                const standardizedResults = transformNpmAudit(rawAuditData, originalFileName, 'file');
                
                // CHANGE 7: Save results to database for vulnerabilities case too
                await saveScanResults(userId, standardizedResults);
                
                return res.status(200).json(standardizedResults);
            } catch (jsonError) {
                console.error("--- DEBUG: Failed to parse JSON from npm audit's stdout.", jsonError);
                return res.status(500).json({ error: 'Failed to parse the scanner results.', details: error.stdout });
            }
        }

        // If it was a true failure (e.g., command not found), send a 500
        return res.status(500).json({ error: 'A critical error occurred during command execution.', details: error.stderr });
      }

    } else {
      fs.unlinkSync(tempFilePath); // Clean up for unsupported files
      return res.status(400).json({ error: 'Unsupported file type for scanning.' });
    }
  } catch (error) {
    console.error('--- DEBUG: A critical error occurred during the scan process ---');
    console.error(error);
    return res.status(500).json({ error: 'Failed to scan the file.', details: error.message });
  } finally {
    // Cleanup will run after the response is sent
    if (fs.existsSync(tempDir)) {
      fs.rm(tempDir, { recursive: true, force: true }, (err) => {
        if (err) {
          console.error(`--- DEBUG: Error during cleanup of ${tempDir}:`, err);
        } else {
          console.log(`--- DEBUG: Cleanup of ${tempDir} successful.`);
        }
      });
    }
  }
};


// --- Correct Exports ---
module.exports = {
  upload,
  scanFile,
};