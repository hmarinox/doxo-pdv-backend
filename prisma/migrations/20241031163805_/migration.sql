/*
  Warnings:

  - Added the required column `taxReceiptKey` to the `TaxReceipt` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `TaxReceipt` ADD COLUMN `taxReceiptKey` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `TaxReceiptXML` MODIFY `MigrateResult` LONGTEXT NOT NULL;
