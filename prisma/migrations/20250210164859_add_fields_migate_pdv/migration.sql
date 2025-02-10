-- AlterTable
ALTER TABLE `Pdv` ADD COLUMN `migrateEmiId` VARCHAR(191) NULL,
    ADD COLUMN `migrateEmiNome` VARCHAR(191) NULL,
    ADD COLUMN `migrateEmiVersao` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `Settings` MODIFY `clisitefPort` VARCHAR(191) NOT NULL DEFAULT 'AUTO_USB';
