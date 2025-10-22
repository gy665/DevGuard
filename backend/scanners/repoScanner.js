// backend/scanners/repoScanner.js

const path = require('path');
const fs = require('fs');
const util = require('util');
const { exec } = require('child_process');
const { transformNpmAudit } = require('../utils/transformer');
const { saveScanResults } = require('../services/saveScanService'); // <-- IMPORT THE NEW SERVICE

const execPromise = util.promisify(exec);

const scanRepository = async (req, res) => {
  const { repoUrl } = req.body;
  const userId = req.user.userId; // <-- Get user ID from authMiddleware

  // 1. --- Input Validation ---
  if (!repoUrl) {
    return res.status(400).json({ error: 'repoUrl is required in the request body.' });
  }

  // A simple regex to validate it looks like a git URL
  const gitUrlRegex = /(?:git|ssh|https?|git@[-\w.]+):(\/\/)?(.*?)(\.git)(\/?|\#[-\d\w._]+?)$/;
  if (!gitUrlRegex.test(repoUrl)) {
      return res.status(400).json({ error: 'Invalid Git repository URL format provided.' });
  }

  // 2. --- Setup Temporary Directory ---
  const tempDir = path.join(__dirname, '..', 'uploads', `repo-${Date.now()}`);

  try {
    // 3. --- Clone the Repository ---
    // Using --depth 1 is a crucial optimization to only get the latest commit, not the whole history
    const cloneCommand = `git clone --depth 1 ${repoUrl} ${tempDir}`;
    console.log(`--- RepoScanner: Executing: ${cloneCommand}`);
    await execPromise(cloneCommand);
    console.log(`--- RepoScanner: Successfully cloned ${repoUrl} to ${tempDir}`);

    // 4. --- Check for a scannable project (e.g., package.json) ---
    const packageJsonPath = path.join(tempDir, 'package.json');
    if (!fs.existsSync(packageJsonPath)) {
      return res.status(400).json({ error: 'Repository does not contain a package.json file at its root.' });
    }

    // 5. --- Run the Scanners (npm install & npm audit) ---
    const installCommand = `npm install --prefix ${tempDir}`;
    const auditCommand = `npm audit --json --prefix ${tempDir}`;

    console.log(`--- RepoScanner: Executing: ${installCommand}`);
    await execPromise(installCommand);
    console.log('--- RepoScanner: npm install completed.');

    let auditResult;
    try {
      console.log(`--- RepoScanner: Executing: ${auditCommand}`);
      const { stdout } = await execPromise(auditCommand);
      auditResult = JSON.parse(stdout);
    } catch (error) {
      // This is the expected case when vulnerabilities are found
      if (error.stdout) {
        console.log('--- RepoScanner: Vulnerabilities found, processing report.');
        auditResult = JSON.parse(error.stdout);
      } else {
        // This is a true error
        throw error;
      }
    }
    
    // 6. --- Transform the Results ---
    const standardizedResults = transformNpmAudit(auditResult, repoUrl, 'repository');
    
    // 7. --- SAVE THE RESULTS TO THE DATABASE ---
    await saveScanResults(userId, standardizedResults);

    // 8. --- Send the results back to the frontend ---
    res.status(200).json(standardizedResults);

  } catch (error) {
    console.error('--- RepoScanner: A critical error occurred during the scan process ---');
    console.error(error);
    res.status(500).json({ error: 'Failed to scan the repository.', details: error.stderr || error.message });
  } finally {
    // 9. --- Cleanup ---
    // This is critical, as repos can be very large.
    if (fs.existsSync(tempDir)) {
      console.log(`--- RepoScanner: Cleaning up directory ${tempDir}`);
      fs.rm(tempDir, { recursive: true, force: true }, (err) => {
        if (err) console.error(`--- RepoScanner: Error during cleanup:`, err);
      });
    }
  }
};

module.exports = {
  scanRepository,
};