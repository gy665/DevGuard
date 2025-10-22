// backend/utils/transformer.js

/**
 * Transforms the raw JSON output from `npm audit` into our standardized format,
 * which is compatible with the saveScanService.
 * @param {object} rawAuditData - The raw JSON object from the `npm audit --json` command.
 * @param {string} assetName - The name of the asset being scanned (e.g., a repo URL or filename).
 * @param {string} assetType - The type of asset ('REPOSITORY' or 'FILE').
 * @returns {object} A standardized object with assetName, assetType, and a list of vulnerabilities.
 */
const transformNpmAudit = (rawAuditData, assetName, assetType) => {

   const vulnerabilities = [];
  // ...
const auditVulnerabilities = rawAuditData.vulnerabilities || {};



  for (const key in auditVulnerabilities) {
    const vuln = auditVulnerabilities[key];
    // The 'via' array can contain strings or objects. We want the first object's source ID.
    const sourceObject = vuln.via?.find(v => typeof v === 'object');
    const sourceId = sourceObject?.source || key; // Fallback to the object key if no source ID is found

     vulnerabilities.push({
      id: String(sourceId), // Ensure it's a string
      name: vuln.name,
      version: vuln.range,
      severity: vuln.severity,
      description: `Vulnerability in '${vuln.name}'.`,
    });
  }
  // ...
  return { assetName, assetType, vulnerabilities };
};


/**
 * Transforms the raw JSON output from `trivy` into our standardized format,
 * which is compatible with the saveScanService.
 * @param {object} rawTrivyData - The raw JSON object from `trivy image --format json`.
 * @param {string} assetName - The name of the asset being scanned (e.g., 'nginx:latest').
 * @param {string} assetType - The type of asset ('CONTAINER').
 * @returns {object} A standardized object with assetName, assetType, and a list of vulnerabilities.
 */
const transformTrivyOutput = (rawTrivyData, assetName, assetType) => {
  const vulnerabilities = [];
  const results = rawTrivyData.Results || [];

  for (const result of results) {
    const resultVulnerabilities = result.Vulnerabilities || [];

    for (const vuln of resultVulnerabilities) {
      vulnerabilities.push({
        // Mapping to match the saveScanService's expectations
        id: vuln.VulnerabilityID,
        name: vuln.PkgName,
        version: vuln.InstalledVersion,
        severity: vuln.Severity,
        description: vuln.Description || vuln.Title || 'No description provided.',
      });
    }
  }
  
  // Return the exact shape the saveScanService expects
  return {
    assetName: assetName, // Use the name passed into the function
    assetType: assetType, // Use the type passed into the function
    vulnerabilities,
  };
};

module.exports = {
  transformNpmAudit,
  transformTrivyOutput,
};