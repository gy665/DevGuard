// backend/utils/transformer.js

/**
 * Transforms the raw JSON output from `npm audit` into our standardized format.
 * @param {object} rawAuditData - The raw JSON object from the `npm audit --json` command.
 * @param {string} target - The name of the thing being scanned (e.g., a file name or a repo URL).
 * @param {string} scannerType - The type of scanner used ('file' or 'repository').
 * @returns {object} The standardized vulnerability report.
 */


/**
 * Transforms the raw JSON output from `trivy` into our standardized format.
 * @param {object} rawTrivyData - The raw JSON object from the `trivy image --format json` command.
 * @returns {object} The standardized vulnerability report.
 */


const transformNpmAudit = (rawAuditData, target, scannerType) => {
  const summary = { critical: 0, high: 0, medium: 0, low: 0, total: 0 };
  const vulnerabilities = [];

  // The vulnerabilities are nested inside the 'vulnerabilities' property
  const auditVulnerabilities = rawAuditData.vulnerabilities || {};

  for (const key in auditVulnerabilities) {
    const vuln = auditVulnerabilities[key];

    // Increment summary counters
    summary[vuln.severity]++;
    summary.total++;

    // Find the first source for more info
    const sourceUrl = (vuln.via && vuln.via.length > 0) ? (typeof vuln.via[0] === 'string' ? null : vuln.via[0].url) : null;

    vulnerabilities.push({
      title: vuln.name,
      packageName: vuln.name,
      severity: vuln.severity,
      versionRange: vuln.range,
      description: `A '${vuln.name}' vulnerability was found in package ${vuln.name}. For more details, visit: ${sourceUrl || 'N/A'}`,
      remediation: vuln.fixAvailable ? `Upgrade to version ${vuln.fixAvailable.version}` : 'No simple fix available. Manual investigation required.',
      source: sourceUrl,
    });
  }

  return {
    scanner: scannerType,
    target: target,
    summary,
    vulnerabilities,
  };
};


const transformTrivyOutput = (rawTrivyData) => {
  const summary = { critical: 0, high: 0, medium: 0, low: 0, total: 0 };
  const vulnerabilities = [];

  // Trivy's output can have multiple result sets (e.g., for OS packages, language packages)
  const results = rawTrivyData.Results || [];

  for (const result of results) {
    const resultVulnerabilities = result.Vulnerabilities || [];

    for (const vuln of resultVulnerabilities) {
      const severity = vuln.Severity.toLowerCase();

      // Increment summary counters
      if (summary.hasOwnProperty(severity)) {
        summary[severity]++;
        summary.total++;
      }

      vulnerabilities.push({
        title: vuln.Title || vuln.VulnerabilityID,
        packageName: vuln.PkgName,
        severity: severity,
        versionRange: `Installed: ${vuln.InstalledVersion}`,
        description: vuln.Description || 'No description provided.',
        remediation: vuln.FixedVersion ? `Upgrade to version ${vuln.FixedVersion}` : 'No simple fix available. See source for details.',
        source: vuln.PrimaryURL || null,
      });
    }
  }

  return {
    scanner: 'container',
    target: rawTrivyData.ArtifactName,
    summary,
    vulnerabilities,
  };
};

module.exports = {
  transformNpmAudit,
  transformTrivyOutput,
};