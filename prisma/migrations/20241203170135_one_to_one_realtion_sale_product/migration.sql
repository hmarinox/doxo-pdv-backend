/*
  Warnings:

  - A unique constraint covering the columns `[saleId]` on the table `SalesProducts` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `SalesProducts_saleId_key` ON `SalesProducts`(`saleId`);
