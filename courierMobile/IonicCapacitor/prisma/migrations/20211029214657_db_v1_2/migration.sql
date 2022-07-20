/*
  Warnings:

  - You are about to drop the column `postal_code` on the `address` table. All the data in the column will be lost.
  - You are about to drop the column `productTypeId` on the `product` table. All the data in the column will be lost.
  - You are about to drop the `orderaddresses` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `postalCode` to the `address` table without a default value. This is not possible if the table is not empty.
  - Added the required column `paymentType` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `product` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `orderaddresses` DROP FOREIGN KEY `OrderAddresses_shippedFrom_fkey`;

-- DropForeignKey
ALTER TABLE `orderaddresses` DROP FOREIGN KEY `OrderAddresses_shippedTo_fkey`;

-- DropForeignKey
ALTER TABLE `product` DROP FOREIGN KEY `product_productTypeId_fkey`;

-- AlterTable
ALTER TABLE `address` DROP COLUMN `postal_code`,
    ADD COLUMN `postalCode` INTEGER NOT NULL,
    MODIFY `cellphone` VARCHAR(191) NULL,
    MODIFY `telephone` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `order` ADD COLUMN `paymentType` VARCHAR(191) NOT NULL,
    MODIFY `timePlaced` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `product` DROP COLUMN `productTypeId`,
    ADD COLUMN `type` INTEGER NOT NULL;

-- DropTable
DROP TABLE `orderaddresses`;

-- CreateTable
CREATE TABLE `OrderAddressDuo` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `orderId` INTEGER NOT NULL,
    `address` VARCHAR(191) NOT NULL,
    `address2` VARCHAR(191) NULL,
    `address3` VARCHAR(191) NULL,
    `city` VARCHAR(191) NOT NULL,
    `state` VARCHAR(191) NOT NULL,
    `postalCode` INTEGER NOT NULL,
    `country` VARCHAR(191) NOT NULL,
    `cellphone` VARCHAR(191) NULL,
    `telephone` VARCHAR(191) NULL,
    `default` BOOLEAN NOT NULL DEFAULT false,
    `recipient` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `OrderAddressDuo` ADD CONSTRAINT `OrderAddressDuo_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `Order`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `product` ADD CONSTRAINT `product_type_fkey` FOREIGN KEY (`type`) REFERENCES `productType`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
