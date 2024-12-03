/*
  Warnings:

  - A unique constraint covering the columns `[saleId]` on the table `TaxReceipt` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `TaxReceipt_saleId_key` ON `TaxReceipt`(`saleId`);
