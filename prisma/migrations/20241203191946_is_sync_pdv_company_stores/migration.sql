-- AlterTable
ALTER TABLE `Companies` ADD COLUMN `isSync` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `Pdv` ADD COLUMN `isSync` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `Stores` ADD COLUMN `isSync` BOOLEAN NOT NULL DEFAULT false;
