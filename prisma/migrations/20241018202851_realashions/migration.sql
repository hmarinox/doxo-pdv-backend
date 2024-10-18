-- AddForeignKey
ALTER TABLE `Pdv` ADD CONSTRAINT `Pdv_storeId_fkey` FOREIGN KEY (`storeId`) REFERENCES `Stores`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TaxReceiptSettings` ADD CONSTRAINT `TaxReceiptSettings_pdvId_fkey` FOREIGN KEY (`pdvId`) REFERENCES `Pdv`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TaxReceipt` ADD CONSTRAINT `TaxReceipt_saleId_fkey` FOREIGN KEY (`saleId`) REFERENCES `Sales`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TaxReceiptXML` ADD CONSTRAINT `TaxReceiptXML_taxReceiptId_fkey` FOREIGN KEY (`taxReceiptId`) REFERENCES `TaxReceipt`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Employees` ADD CONSTRAINT `Employees_storeId_fkey` FOREIGN KEY (`storeId`) REFERENCES `Stores`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
