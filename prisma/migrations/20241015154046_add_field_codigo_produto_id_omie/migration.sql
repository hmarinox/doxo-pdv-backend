/*
  Warnings:

  - A unique constraint covering the columns `[codigo_produto]` on the table `Produtos` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `codigo_produto` to the `Produtos` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Produtos" ADD COLUMN     "codigo_produto" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Produtos_codigo_produto_key" ON "Produtos"("codigo_produto");
