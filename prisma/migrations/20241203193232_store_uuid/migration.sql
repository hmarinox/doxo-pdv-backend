/*
  Warnings:

  - A unique constraint covering the columns `[storeUUID]` on the table `Stores` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `Stores` ADD COLUMN `storeUUID` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Stores_storeUUID_key` ON `Stores`(`storeUUID`);
