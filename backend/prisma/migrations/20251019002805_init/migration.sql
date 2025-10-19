-- CreateEnum
CREATE TYPE "AssetType" AS ENUM ('REPOSITORY', 'FILE', 'CONTAINER');

-- CreateEnum
CREATE TYPE "ScanStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'FAILED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScannedAsset" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "AssetType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "ScannedAsset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Scan" (
    "id" TEXT NOT NULL,
    "status" "ScanStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finishedAt" TIMESTAMP(3),
    "assetId" TEXT NOT NULL,

    CONSTRAINT "Scan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vulnerability" (
    "id" TEXT NOT NULL,
    "vulnerabilityId" TEXT NOT NULL,
    "packageName" TEXT NOT NULL,
    "severity" TEXT NOT NULL,
    "installedVersion" TEXT NOT NULL,
    "fixedInVersion" TEXT,
    "description" TEXT,
    "scanId" TEXT NOT NULL,

    CONSTRAINT "Vulnerability_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "ScannedAsset" ADD CONSTRAINT "ScannedAsset_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Scan" ADD CONSTRAINT "Scan_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "ScannedAsset"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vulnerability" ADD CONSTRAINT "Vulnerability_scanId_fkey" FOREIGN KEY ("scanId") REFERENCES "Scan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
