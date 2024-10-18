-- DropIndex
DROP INDEX "Produtos_ean_key";

-- AlterTable
ALTER TABLE "Produtos" ALTER COLUMN "ean" DROP NOT NULL;
