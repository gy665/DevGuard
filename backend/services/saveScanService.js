const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const saveScanResults = async (userId, scanData) => {
    console.log(`--- SaveService: Saving scan for user ${userId} | asset '${scanData.assetName}'`);

    try {
        const result = await prisma.$transaction(async (tx) => {
            // 1. Find or Create the Scanned Asset using our new unique key
            const asset = await tx.scannedAsset.upsert({
                where: {
                    // This now matches the @@unique([userId, name, type]) constraint in your schema
                    userId_name_type: {
                        userId: userId,
                        name: scanData.assetName,
                        type: scanData.assetType.toUpperCase(), // Ensure type is uppercase like in the enum
                    },
                },
                update: {}, // We don't need to update anything on the asset itself
                create: {
                    name: scanData.assetName,
                    type: scanData.assetType.toUpperCase(),
                    userId: userId,
                },
            });

            // 2. ALWAYS create a new Scan record for this scan instance
            const scan = await tx.scan.create({
                data: {
                    assetId: asset.id,
                    status: 'COMPLETED', // Use uppercase to match enum
                    finishedAt: new Date(),
                },
            });

            // 3. Create all Vulnerability records and link them to this new Scan
            if (scanData.vulnerabilities.length > 0) {
                // IMPORTANT: Map the fields from your transformer to your Prisma schema fields
                const vulnerabilitiesToCreate = scanData.vulnerabilities.map(vuln => ({
                    scanId: scan.id,
                    vulnerabilityId: vuln.id,       // e.g., "CVE-2023-1234"
                    packageName: vuln.name,         // e.g., "express"
                    severity: vuln.severity.toUpperCase(),
                    installedVersion: vuln.version, // The version with the vulnerability
                    // Add other fields if your transformer provides them
                    // fixedInVersion: vuln.fixedIn,
                    description: vuln.description,
                }));

                await tx.vulnerability.createMany({
                    data: vulnerabilitiesToCreate,
                });
            }

            console.log(`--- SaveService: Success! Saved Scan ID ${scan.id} for Asset ID ${asset.id}`);
            return { asset, scan };
        });

        return result;

    } catch (error) {
        console.error("--- SaveService: CRITICAL ERROR during database transaction. Rolling back.", error);
        throw new Error('Failed to save scan results to the database.');
    }
};

module.exports = { saveScanResults };

