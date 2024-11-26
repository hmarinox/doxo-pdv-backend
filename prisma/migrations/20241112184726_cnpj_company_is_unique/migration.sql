/*
  Warnings:

  - A unique constraint covering the columns `[cnpj]` on the table `Companies` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Companies_cnpj_key` ON `Companies`(`cnpj`);
