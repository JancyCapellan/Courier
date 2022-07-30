-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NULL,
    `emailVerified` DATETIME(3) NULL,
    `image` VARCHAR(191) NULL,
    `firstName` VARCHAR(191) NOT NULL,
    `lastName` VARCHAR(191) NOT NULL,
    `middleName` VARCHAR(191) NULL,
    `password` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `role` VARCHAR(191) NOT NULL,
    `company` VARCHAR(191) NULL,
    `branchName` VARCHAR(191) NULL,
    `lastSaleDate` DATETIME(3) NULL,
    `lastLogin` DATETIME(3) NULL,
    `preferredLanguage` VARCHAR(191) NOT NULL DEFAULT 'English',
    `licenseId` INTEGER NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    UNIQUE INDEX `User_licenseId_key`(`licenseId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `address` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` VARCHAR(191) NOT NULL,
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

-- CreateTable
CREATE TABLE `Order` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` VARCHAR(191) NOT NULL,
    `timePlaced` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `recieverFirstName` VARCHAR(191) NOT NULL,
    `recieverLastName` VARCHAR(191) NOT NULL,
    `totalItems` INTEGER NOT NULL,
    `totalPrice` INTEGER NOT NULL,
    `paymentType` VARCHAR(191) NOT NULL,
    `statusId` INTEGER NOT NULL,
    `location` ENUM('withShipper', 'BRONXwarehouse', 'CotainerBoat', 'DRwarehouse', 'MIAMIwarehouse', 'withReciever') NOT NULL DEFAULT 'withShipper',
    `pickupDriverId` VARCHAR(191) NULL,
    `pickupDatetime` DATETIME(3) NULL,
    `pickupZoneId` INTEGER NULL,
    `containerId` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pickupZone` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `Name` VARCHAR(191) NOT NULL,
    `Code` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

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
    `recipient` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `OrderItem` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `orderId` INTEGER NOT NULL,
    `productsId` INTEGER NOT NULL,
    `amount` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `product` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `price` INTEGER NOT NULL,
    `type` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `productType` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `type` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `containers` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `statusId` INTEGER NOT NULL,
    `warehouseId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `warehouseSupplies` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `supplyName` VARCHAR(191) NOT NULL,
    `inventoryCount` INTEGER NOT NULL,
    `warehouseId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `warehouseDetails` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `warehouseCode` VARCHAR(191) NOT NULL,
    `warehouseName` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `orderStatus` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `message` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `containerStatus` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `message` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `address` ADD CONSTRAINT `address_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_statusId_fkey` FOREIGN KEY (`statusId`) REFERENCES `orderStatus`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_pickupDriverId_fkey` FOREIGN KEY (`pickupDriverId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_pickupZoneId_fkey` FOREIGN KEY (`pickupZoneId`) REFERENCES `pickupZone`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_containerId_fkey` FOREIGN KEY (`containerId`) REFERENCES `containers`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OrderAddressDuo` ADD CONSTRAINT `OrderAddressDuo_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `Order`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OrderItem` ADD CONSTRAINT `OrderItem_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `Order`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OrderItem` ADD CONSTRAINT `OrderItem_productsId_fkey` FOREIGN KEY (`productsId`) REFERENCES `product`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `product` ADD CONSTRAINT `product_type_fkey` FOREIGN KEY (`type`) REFERENCES `productType`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `containers` ADD CONSTRAINT `containers_statusId_fkey` FOREIGN KEY (`statusId`) REFERENCES `containerStatus`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `containers` ADD CONSTRAINT `containers_warehouseId_fkey` FOREIGN KEY (`warehouseId`) REFERENCES `warehouseDetails`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `warehouseSupplies` ADD CONSTRAINT `warehouseSupplies_warehouseId_fkey` FOREIGN KEY (`warehouseId`) REFERENCES `warehouseDetails`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
