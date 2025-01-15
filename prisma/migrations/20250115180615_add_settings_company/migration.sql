-- CreateTable
CREATE TABLE `Settings` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `migrateAccessKey` VARCHAR(191) NOT NULL,
    `migratePartnerKey` VARCHAR(191) NOT NULL,
    `clisitefRegisterToken` VARCHAR(191) NOT NULL,
    `clisitefPort` VARCHAR(191) NOT NULL,
    `clisitefDefaultMessage` VARCHAR(191) NOT NULL,
    `clisitefApprovalEnviroment` VARCHAR(191) NOT NULL,
    `clisitefEnabledTransactions` VARCHAR(191) NOT NULL,
    `companyId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Settings` ADD CONSTRAINT `Settings_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `Companies`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
