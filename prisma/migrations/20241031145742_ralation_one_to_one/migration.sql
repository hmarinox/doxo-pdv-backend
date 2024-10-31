/*
  Warnings:

  - A unique constraint covering the columns `[taxReceiptId]` on the table `TaxReceiptXML` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `TaxReceiptXML_taxReceiptId_key` ON `TaxReceiptXML`(`taxReceiptId`);
