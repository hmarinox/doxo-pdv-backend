-- CreateTable
CREATE TABLE `Products` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `marca` VARCHAR(191) NOT NULL,
    `descricao` VARCHAR(191) NOT NULL,
    `unidade` VARCHAR(191) NOT NULL DEFAULT 'UN',
    `ncm` VARCHAR(191) NOT NULL,
    `valor_unitario` DOUBLE NOT NULL,
    `ean` VARCHAR(191) NULL,
    `codigo` VARCHAR(191) NOT NULL,
    `codigo_produto` BIGINT NOT NULL,
    `codigo_produto_integracao` VARCHAR(191) NOT NULL,
    `peso_bruto` DOUBLE NOT NULL,
    `ageToBuy` INTEGER NOT NULL DEFAULT 0,
    `qtd` DOUBLE NOT NULL,
    `dias_garantia` INTEGER NOT NULL,
    `tagId` VARCHAR(191) NULL,
    `tagChecked` BOOLEAN NULL,
    `datamatrixId` VARCHAR(191) NULL,
    `aliquota_cofins` DOUBLE NOT NULL,
    `aliquota_ibpt` DOUBLE NOT NULL,
    `aliquota_icms` DOUBLE NOT NULL,
    `aliquota_pis` DOUBLE NOT NULL,
    `cest` VARCHAR(191) NULL,
    `cfop` VARCHAR(191) NULL,
    `csosn_icms` VARCHAR(191) NULL,
    `cst_cofins` VARCHAR(191) NULL,
    `cst_icms` VARCHAR(191) NULL,
    `cst_pis` VARCHAR(191) NULL,
    `per_icms_fcp` DOUBLE NOT NULL,
    `red_base_cofins` DOUBLE NOT NULL,
    `red_base_icms` DOUBLE NOT NULL,
    `red_base_pis` DOUBLE NOT NULL,
    `tipoItem` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Products_codigo_produto_key`(`codigo_produto`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Companies` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `cnpj` VARCHAR(191) NOT NULL,
    `ie` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Stores` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `companyId` INTEGER NOT NULL,
    `street` VARCHAR(191) NOT NULL,
    `number` VARCHAR(191) NOT NULL,
    `neighborhood` VARCHAR(191) NOT NULL,
    `city` VARCHAR(191) NOT NULL,
    `state` VARCHAR(191) NOT NULL,
    `country` VARCHAR(191) NOT NULL,
    `zipCode` VARCHAR(191) NOT NULL,
    `complement` VARCHAR(191) NOT NULL,
    `emitModel` INTEGER NOT NULL,
    `ufCode` INTEGER NOT NULL,
    `cityCode` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Pdv` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `macAddress` VARCHAR(191) NOT NULL,
    `storeId` INTEGER NOT NULL,

    UNIQUE INDEX `Pdv_macAddress_key`(`macAddress`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Sales` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `saleId` VARCHAR(191) NOT NULL,
    `pdvId` INTEGER NOT NULL,

    UNIQUE INDEX `Sales_saleId_key`(`saleId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SalesProducts` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `saleId` INTEGER NOT NULL,
    `marca` VARCHAR(191) NOT NULL,
    `descricao` VARCHAR(191) NOT NULL,
    `unidade` VARCHAR(191) NOT NULL DEFAULT 'UN',
    `ncm` VARCHAR(191) NOT NULL,
    `valor_unitario` DOUBLE NOT NULL,
    `ean` VARCHAR(191) NULL,
    `codigo` VARCHAR(191) NOT NULL,
    `codigo_produto` BIGINT NOT NULL,
    `codigo_produto_integracao` VARCHAR(191) NOT NULL,
    `peso_bruto` DOUBLE NOT NULL,
    `ageToBuy` INTEGER NOT NULL DEFAULT 0,
    `qtd` DOUBLE NOT NULL,
    `dias_garantia` INTEGER NOT NULL,
    `tagId` VARCHAR(191) NULL,
    `tagChecked` BOOLEAN NULL,
    `datamatrixId` VARCHAR(191) NULL,
    `aliquota_cofins` DOUBLE NOT NULL,
    `aliquota_ibpt` DOUBLE NOT NULL,
    `aliquota_icms` DOUBLE NOT NULL,
    `aliquota_pis` DOUBLE NOT NULL,
    `cest` VARCHAR(191) NULL,
    `cfop` VARCHAR(191) NULL,
    `csosn_icms` VARCHAR(191) NULL,
    `cst_cofins` VARCHAR(191) NULL,
    `cst_icms` VARCHAR(191) NULL,
    `cst_pis` VARCHAR(191) NULL,
    `per_icms_fcp` DOUBLE NOT NULL,
    `red_base_cofins` DOUBLE NOT NULL,
    `red_base_icms` DOUBLE NOT NULL,
    `red_base_pis` DOUBLE NOT NULL,
    `tipoItem` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `SalesProducts_codigo_produto_key`(`codigo_produto`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TaxReceiptSettings` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `pdvId` INTEGER NOT NULL,
    `taxReceiptSerie` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TaxReceipt` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `saleId` INTEGER NOT NULL,
    `taxReceiptEmitDate` DATETIME(3) NOT NULL,
    `taxReceiptNumber` INTEGER NOT NULL,
    `taxReceiptSerie` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TaxReceiptXML` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `taxReceiptId` INTEGER NOT NULL,
    `MigrateResult` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Employees` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `storeId` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `registrationCode` VARCHAR(191) NOT NULL,
    `level` ENUM('MANAGER', 'COLLABORATOR') NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `level` ENUM('ADMIN', 'OPERATOR') NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Stores` ADD CONSTRAINT `Stores_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `Companies`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SalesProducts` ADD CONSTRAINT `SalesProducts_saleId_fkey` FOREIGN KEY (`saleId`) REFERENCES `Sales`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
