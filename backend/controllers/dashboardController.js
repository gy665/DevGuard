// backend/controllers/dashboardController.js

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getDashboardData = async (req, res) => {
    const userId = req.user.userId;

    try {
        // --- Step 1: Fetch all assets and all user vulnerabilities in two efficient queries ---

        const userAssets = await prisma.scannedAsset.findMany({
            where: { userId: userId },
            orderBy: { updatedAt: 'desc' } // Show most recently scanned first
        });

        // This is the most important query. It gets every vulnerability for the user in one go.
        const allVulnerabilities = await prisma.vulnerability.findMany({
            where: {
                scan: {
                    asset: {
                        userId: userId,
                    },
                },
            },
            select: {
                severity: true,
                scan: {
                    select: { assetId: true } // We need this to link a vulnerability back to its project
                }
            }
        });

        // --- Step 2: Calculate the global severity overview from the single list ---

        const severityOverview = allVulnerabilities.reduce((acc, vuln) => {
            const severityKey = vuln.severity.toLowerCase();
            // Check if the key exists (e.g., 'critical', 'high') to avoid errors
            if (acc.hasOwnProperty(severityKey)) {
                acc[severityKey]++;
            }
            return acc;
        }, { critical: 0, high: 0, medium: 0, low: 0 }); // Initialize with all severities


        // --- Step 3: Process assets to calculate per-project vulnerability counts ---

        const projects = userAssets.map(asset => {
            // Filter the big list of vulnerabilities to get only the ones for this specific asset.
            const assetVulnerabilities = allVulnerabilities.filter(v => v.scan.assetId === asset.id);

            // Now, calculate the counts for this single project
            const projectCounts = assetVulnerabilities.reduce((acc, vuln) => {
                const severityKey = vuln.severity.toLowerCase();
                if (acc.hasOwnProperty(severityKey)) {
                    acc[severityKey]++;
                }
                return acc;
            }, { critical: 0, high: 0, medium: 0, low: 0 });

            return {
                id: asset.id,
                name: asset.name,
                source: asset.type,
                lastScanned: asset.updatedAt.toLocaleDateString(),
                // The final, accurate vulnerability counts for this project
                vulnerabilities: projectCounts,
                // A helper property for sorting
                totalVulnerabilities: assetVulnerabilities.length
            };
        });

        // --- Step 4: Calculate the Top 5 Vulnerable Projects based on the real total ---

        const topProjects = projects
            .sort((a, b) => b.totalVulnerabilities - a.totalVulnerabilities) // Sort by the true total
            .slice(0, 5)
            .map(p => ({
                name: p.name,
                vulnerabilities: p.totalVulnerabilities, // Send the total count
            }));

        // --- Step 5: Send the final, fully dynamic data object to the frontend ---
        res.json({
            projects: projects,
            severityOverview: severityOverview, // This is now REAL data
            topProjects: topProjects,
            recentActivity: [], // Keeping this as mock for now as requested
        });

    } catch (error) {
        console.error("[Dashboard] Error fetching real dashboard data:", error);
        res.status(500).json({ error: 'Failed to fetch dashboard data.' });
    }
};


module.exports = { getDashboardData };