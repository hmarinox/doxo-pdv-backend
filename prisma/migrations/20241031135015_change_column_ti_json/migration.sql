/*
  Warnings:

  - You are about to drop the column `ageToBuy` on the `SalesProducts` table. All the data in the column will be lost.
  - You are about to drop the column `aliquota_cofins` on the `SalesProducts` table. All the data in the column will be lost.
  - You are about to drop the column `aliquota_ibpt` on the `SalesProducts` table. All the data in the column will be lost.
  - You are about to drop the column `aliquota_icms` on the `SalesProducts` table. All the data in the column will be lost.
  - You are about to drop the column `aliquota_pis` on the `SalesProducts` table. All the data in the column will be lost.
  - You are about to drop the column `cest` on the `SalesProducts` table. All the data in the column will be lost.
  - You are about to drop the column `cfop` on the `SalesProducts` table. All the data in the column will be lost.
  - You are about to drop the column `codigo` on the `SalesProducts` table. All the data in the column will be lost.
  - You are about to drop the column `codigo_produto` on the `SalesProducts` table. All the data in the column will be lost.
  - You are about to drop the column `codigo_produto_integracao` on the `SalesProducts` table. All the data in the column will be lost.
  - You are about to drop the column `csosn_icms` on the `SalesProducts` table. All the data in the column will be lost.
  - You are about to drop the column `cst_cofins` on the `SalesProducts` table. All the data in the column will be lost.
  - You are about to drop the column `cst_icms` on the `SalesProducts` table. All the data in the column will be lost.
  - You are about to drop the column `cst_pis` on the `SalesProducts` table. All the data in the column will be lost.
  - You are about to drop the column `datamatrixId` on the `SalesProducts` table. All the data in the column will be lost.
  - You are about to drop the column `descricao` on the `SalesProducts` table. All the data in the column will be lost.
  - You are about to drop the column `dias_garantia` on the `SalesProducts` table. All the data in the column will be lost.
  - You are about to drop the column `ean` on the `SalesProducts` table. All the data in the column will be lost.
  - You are about to drop the column `marca` on the `SalesProducts` table. All the data in the column will be lost.
  - You are about to drop the column `ncm` on the `SalesProducts` table. All the data in the column will be lost.
  - You are about to drop the column `per_icms_fcp` on the `SalesProducts` table. All the data in the column will be lost.
  - You are about to drop the column `peso_bruto` on the `SalesProducts` table. All the data in the column will be lost.
  - You are about to drop the column `qtd` on the `SalesProducts` table. All the data in the column will be lost.
  - You are about to drop the column `red_base_cofins` on the `SalesProducts` table. All the data in the column will be lost.
  - You are about to drop the column `red_base_icms` on the `SalesProducts` table. All the data in the column will be lost.
  - You are about to drop the column `red_base_pis` on the `SalesProducts` table. All the data in the column will be lost.
  - You are about to drop the column `tagChecked` on the `SalesProducts` table. All the data in the column will be lost.
  - You are about to drop the column `tagId` on the `SalesProducts` table. All the data in the column will be lost.
  - You are about to drop the column `tipoItem` on the `SalesProducts` table. All the data in the column will be lost.
  - You are about to drop the column `unidade` on the `SalesProducts` table. All the data in the column will be lost.
  - You are about to drop the column `valor_unitario` on the `SalesProducts` table. All the data in the column will be lost.
  - Added the required column `products` to the `SalesProducts` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `SalesProducts_codigo_produto_key` ON `SalesProducts`;

-- AlterTable
ALTER TABLE `SalesProducts` DROP COLUMN `ageToBuy`,
    DROP COLUMN `aliquota_cofins`,
    DROP COLUMN `aliquota_ibpt`,
    DROP COLUMN `aliquota_icms`,
    DROP COLUMN `aliquota_pis`,
    DROP COLUMN `cest`,
    DROP COLUMN `cfop`,
    DROP COLUMN `codigo`,
    DROP COLUMN `codigo_produto`,
    DROP COLUMN `codigo_produto_integracao`,
    DROP COLUMN `csosn_icms`,
    DROP COLUMN `cst_cofins`,
    DROP COLUMN `cst_icms`,
    DROP COLUMN `cst_pis`,
    DROP COLUMN `datamatrixId`,
    DROP COLUMN `descricao`,
    DROP COLUMN `dias_garantia`,
    DROP COLUMN `ean`,
    DROP COLUMN `marca`,
    DROP COLUMN `ncm`,
    DROP COLUMN `per_icms_fcp`,
    DROP COLUMN `peso_bruto`,
    DROP COLUMN `qtd`,
    DROP COLUMN `red_base_cofins`,
    DROP COLUMN `red_base_icms`,
    DROP COLUMN `red_base_pis`,
    DROP COLUMN `tagChecked`,
    DROP COLUMN `tagId`,
    DROP COLUMN `tipoItem`,
    DROP COLUMN `unidade`,
    DROP COLUMN `valor_unitario`,
    ADD COLUMN `products` JSON NOT NULL;
