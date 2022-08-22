-- CreateEnum
CREATE TYPE "OrderLocation" AS ENUM ('withShipper', 'BRONXwarehouse', 'CotainerBoat', 'DRwarehouse', 'MIAMIwarehouse', 'withReciever');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "middleName" TEXT,
    "password" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "company" TEXT,
    "branchName" TEXT,
    "lastSaleDate" TIMESTAMP(3),
    "lastLogin" TIMESTAMP(3),
    "preferredLanguage" TEXT NOT NULL DEFAULT 'English',
    "licenseId" INTEGER,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "address" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "address2" TEXT,
    "address3" TEXT,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "postalCode" INTEGER NOT NULL,
    "country" TEXT NOT NULL,
    "cellphone" TEXT,
    "telephone" TEXT,
    "default" BOOLEAN NOT NULL DEFAULT false,
    "recipient" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "address_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "timePlaced" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "recieverFirstName" TEXT NOT NULL,
    "recieverLastName" TEXT NOT NULL,
    "totalItems" INTEGER NOT NULL,
    "totalPrice" INTEGER NOT NULL,
    "paymentType" TEXT NOT NULL,
    "statusId" INTEGER NOT NULL,
    "location" "OrderLocation" NOT NULL DEFAULT 'withShipper',
    "pickupDriverId" TEXT,
    "pickupDatetime" TIMESTAMP(3),
    "pickupZoneId" INTEGER,
    "containerId" INTEGER,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pickupZone" (
    "id" SERIAL NOT NULL,
    "Name" TEXT NOT NULL,
    "Code" TEXT NOT NULL,

    CONSTRAINT "pickupZone_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderAddressDuo" (
    "id" SERIAL NOT NULL,
    "orderId" INTEGER NOT NULL,
    "address" TEXT NOT NULL,
    "address2" TEXT,
    "address3" TEXT,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "postalCode" INTEGER NOT NULL,
    "country" TEXT NOT NULL,
    "cellphone" TEXT,
    "telephone" TEXT,
    "recipient" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "OrderAddressDuo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderItem" (
    "id" SERIAL NOT NULL,
    "orderId" INTEGER NOT NULL,
    "productsId" INTEGER NOT NULL,
    "amount" INTEGER NOT NULL,

    CONSTRAINT "OrderItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "type" INTEGER NOT NULL,

    CONSTRAINT "product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "productType" (
    "id" SERIAL NOT NULL,
    "type" TEXT NOT NULL,

    CONSTRAINT "productType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "containers" (
    "id" SERIAL NOT NULL,
    "statusId" INTEGER NOT NULL,
    "warehouseId" INTEGER NOT NULL,

    CONSTRAINT "containers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "warehouseSupplies" (
    "id" SERIAL NOT NULL,
    "supplyName" TEXT NOT NULL,
    "inventoryCount" INTEGER NOT NULL,
    "warehouseId" INTEGER NOT NULL,

    CONSTRAINT "warehouseSupplies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "warehouseDetails" (
    "id" SERIAL NOT NULL,
    "warehouseCode" TEXT NOT NULL,
    "warehouseName" TEXT NOT NULL,

    CONSTRAINT "warehouseDetails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "orderStatus" (
    "id" SERIAL NOT NULL,
    "message" TEXT NOT NULL,

    CONSTRAINT "orderStatus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "containerStatus" (
    "id" SERIAL NOT NULL,
    "message" TEXT NOT NULL,

    CONSTRAINT "containerStatus_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_licenseId_key" ON "User"("licenseId");

-- AddForeignKey
ALTER TABLE "address" ADD CONSTRAINT "address_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "orderStatus"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_pickupDriverId_fkey" FOREIGN KEY ("pickupDriverId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_pickupZoneId_fkey" FOREIGN KEY ("pickupZoneId") REFERENCES "pickupZone"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_containerId_fkey" FOREIGN KEY ("containerId") REFERENCES "containers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderAddressDuo" ADD CONSTRAINT "OrderAddressDuo_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_productsId_fkey" FOREIGN KEY ("productsId") REFERENCES "product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product" ADD CONSTRAINT "product_type_fkey" FOREIGN KEY ("type") REFERENCES "productType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "containers" ADD CONSTRAINT "containers_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "containerStatus"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "containers" ADD CONSTRAINT "containers_warehouseId_fkey" FOREIGN KEY ("warehouseId") REFERENCES "warehouseDetails"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "warehouseSupplies" ADD CONSTRAINT "warehouseSupplies_warehouseId_fkey" FOREIGN KEY ("warehouseId") REFERENCES "warehouseDetails"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
