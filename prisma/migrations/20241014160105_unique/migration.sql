/*
  Warnings:

  - A unique constraint covering the columns `[ean]` on the table `Produtos` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Produtos_ean_key" ON "Produtos"("ean");
