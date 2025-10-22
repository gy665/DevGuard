/*
  Warnings:

  - A unique constraint covering the columns `[userId,name,type]` on the table `ScannedAsset` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ScannedAsset_userId_name_type_key" ON "ScannedAsset"("userId", "name", "type");
