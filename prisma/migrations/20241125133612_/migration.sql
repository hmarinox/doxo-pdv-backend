/*
  Warnings:

  - A unique constraint covering the columns `[taxReceiptSerie]` on the table `Pdv` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Pdv_taxReceiptSerie_key` ON `Pdv`(`taxReceiptSerie`);
