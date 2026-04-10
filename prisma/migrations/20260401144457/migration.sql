/*
  Warnings:

  - A unique constraint covering the columns `[cartId,productVariantId]` on the table `CartItem` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `price` to the `CartItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subtotal` to the `CartItem` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Cart" DROP CONSTRAINT "Cart_userId_fkey";

-- DropForeignKey
ALTER TABLE "CartItem" DROP CONSTRAINT "CartItem_cartId_fkey";

-- AlterTable
ALTER TABLE "Cart" ADD COLUMN     "expiresAt" TIMESTAMP(3),
ADD COLUMN     "totalPrice" DECIMAL(10,2) NOT NULL DEFAULT 0,
ADD COLUMN     "version" INTEGER NOT NULL DEFAULT 1,
ALTER COLUMN "userId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "CartItem" ADD COLUMN     "price" DECIMAL(10,2) NOT NULL,
ADD COLUMN     "subtotal" DECIMAL(10,2) NOT NULL;

-- CreateIndex
CREATE INDEX "Cart_expiresAt_idx" ON "Cart"("expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "CartItem_cartId_productVariantId_key" ON "CartItem"("cartId", "productVariantId");

-- AddForeignKey
ALTER TABLE "Cart" ADD CONSTRAINT "Cart_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_cartId_fkey" FOREIGN KEY ("cartId") REFERENCES "Cart"("id") ON DELETE CASCADE ON UPDATE CASCADE;
