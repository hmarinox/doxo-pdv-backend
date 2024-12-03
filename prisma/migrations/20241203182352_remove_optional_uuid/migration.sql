/*
  Warnings:

  - Made the column `pdvUUID` on table `Pdv` required. This step will fail if there are existing NULL values in that column.
  - Made the column `saleUUID` on table `Sales` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `Pdv` MODIFY `pdvUUID` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Sales` MODIFY `saleUUID` VARCHAR(191) NOT NULL;
