const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getDashboardData = async (req, res) => {
    // We can use req.user because the authMiddleware ran first and added it!
    const userId = req.user.userId;

    try {
        const userAssets = await prisma.scannedAsset.findMany({
            where: { userId: userId },
            include: {
                scans: {
                    include: {
                        _count: { select: { vulnerabilities: true } }
                    }
                }
            }
        });

        // --- Process the Data ---
        const projects = userAssets.map(asset => {
            const totalVulnerabilities = asset.scans.reduce((sum, scan) => sum + scan._count.vulnerabilities, 0);
            return {
                id: asset.id,
                name: asset.name,
                source: asset.type,
                lastScanned: asset.updatedAt.toLocaleDateString(),
                vulnerabilities: {
                    critical: 0,
                    high: totalVulnerabilities, // For now, put all vulns in 'high' for the chart
                    medium: 0,
                    low: 0,
                }
            };
        });

        const severityOverview = { critical: 5, high: 16, medium: 30, low: 8 }; // Still mock data for now
        const recentActivity = []; // Still mock data for now

        const topProjects = projects
            .sort((a, b) => b.vulnerabilities.high - a.vulnerabilities.high)
            .slice(0, 5)
            .map(p => ({
                name: p.name,
                vulnerabilities: p.vulnerabilities.high,
            }));

        // --- Send the final data object ---
        res.json({
            projects: projects,
            recentActivity: recentActivity,
            severityOverview: severityOverview,
            topProjects: topProjects,
        });

    } catch (error) {
        console.error("[Dashboard] Error fetching real dashboard data:", error);
        res.status(500).json({ error: 'Failed to fetch dashboard data.' });
    }
};

module.exports = { getDashboardData };