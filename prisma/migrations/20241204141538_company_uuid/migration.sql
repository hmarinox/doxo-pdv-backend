/*
  Warnings:

  - A unique constraint covering the columns `[companyUUID]` on the table `Companies` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `Companies` ADD COLUMN `companyUUID` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Companies_companyUUID_key` ON `Companies`(`companyUUID`);
