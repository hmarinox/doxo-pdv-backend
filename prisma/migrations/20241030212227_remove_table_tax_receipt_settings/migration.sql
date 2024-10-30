/*
  Warnings:

  - You are about to drop the `TaxReceiptSettings` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `taxReceiptSerie` to the `Pdv` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `TaxReceiptSettings` DROP FOREIGN KEY `TaxReceiptSettings_pdvId_fkey`;

-- AlterTable
ALTER TABLE `Pdv` ADD COLUMN `taxReceiptSerie` INTEGER NOT NULL;

-- DropTable
DROP TABLE `TaxReceiptSettings`;
