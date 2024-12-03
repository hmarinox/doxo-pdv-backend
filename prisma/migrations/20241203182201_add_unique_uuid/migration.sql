/*
  Warnings:

  - You are about to drop the column `saleId` on the `Sales` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[pdvUUID]` on the table `Pdv` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[saleUUID]` on the table `Sales` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX `Sales_saleId_key` ON `Sales`;

-- AlterTable
ALTER TABLE `Pdv` ADD COLUMN `pdvUUID` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `Sales` DROP COLUMN `saleId`,
    ADD COLUMN `saleUUID` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Pdv_pdvUUID_key` ON `Pdv`(`pdvUUID`);

-- CreateIndex
CREATE UNIQUE INDEX `Sales_saleUUID_key` ON `Sales`(`saleUUID`);
