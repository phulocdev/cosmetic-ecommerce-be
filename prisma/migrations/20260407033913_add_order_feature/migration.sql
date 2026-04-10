/*
  Warnings:

  - A unique constraint covering the columns `[idempotencyKey]` on the table `Order` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "ShippingInfo_email_key";

-- DropIndex
DROP INDEX "ShippingInfo_phoneNumber_key";

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "cancelReason" TEXT DEFAULT '',
ADD COLUMN     "idempotencyKey" TEXT,
ADD COLUMN     "shippingFee" DECIMAL(10,2) NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "ShippingInfo" ALTER COLUMN "email" SET DEFAULT '',
ALTER COLUMN "phoneNumber" SET DEFAULT '';

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "password" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Order_idempotencyKey_key" ON "Order"("idempotencyKey");

-- CreateIndex
CREATE INDEX "Order_createdAt_id_idx" ON "Order"("createdAt", "id");
