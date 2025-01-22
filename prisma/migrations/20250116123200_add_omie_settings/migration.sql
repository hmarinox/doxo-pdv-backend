/*
  Warnings:

  - Added the required column `omieAppKey` to the `Settings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `omieAppSecret` to the `Settings` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Settings` ADD COLUMN `omieAppKey` VARCHAR(191) NOT NULL,
    ADD COLUMN `omieAppSecret` VARCHAR(191) NOT NULL;
