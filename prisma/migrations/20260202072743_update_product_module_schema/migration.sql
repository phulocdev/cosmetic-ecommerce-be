/*
  Warnings:

  - You are about to drop the column `skuId` on the `CartItem` table. All the data in the column will be lost.
  - You are about to drop the column `imageUrl` on the `Category` table. All the data in the column will be lost.
  - You are about to drop the column `parentCategoryId` on the `Category` table. All the data in the column will be lost.
  - You are about to drop the column `skuId` on the `InboundTransactionDetail` table. All the data in the column will be lost.
  - You are about to drop the column `skuId` on the `OrderDetail` table. All the data in the column will be lost.
  - You are about to drop the column `skuId` on the `OutboundTransactionDetail` table. All the data in the column will be lost.
  - You are about to drop the column `imageUrl` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `maxStockLevel` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `minStockLevel` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `ProductAttribute` table. All the data in the column will be lost.
  - You are about to drop the column `code` on the `Sku` table. All the data in the column will be lost.
  - You are about to drop the `ProductAttributeSku` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[slug]` on the table `Product` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[productId,attributeId]` on the table `ProductAttribute` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[sku]` on the table `Sku` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `productVariantId` to the `CartItem` table without a default value. This is not possible if the table is not empty.
  - Made the column `updatedAt` on table `Category` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `productVariantId` to the `InboundTransactionDetail` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productVariantId` to the `OrderDetail` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productVariantId` to the `OutboundTransactionDetail` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `attributeId` to the `ProductAttribute` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sku` to the `Sku` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "AttributeType" AS ENUM ('COLOR', 'SIZE', 'TEXT', 'NUMBER', 'BOOLEAN');

-- DropForeignKey
ALTER TABLE "CartItem" DROP CONSTRAINT "CartItem_skuId_fkey";

-- DropForeignKey
ALTER TABLE "Category" DROP CONSTRAINT "Category_parentCategoryId_fkey";

-- DropForeignKey
ALTER TABLE "InboundTransactionDetail" DROP CONSTRAINT "InboundTransactionDetail_skuId_fkey";

-- DropForeignKey
ALTER TABLE "OrderDetail" DROP CONSTRAINT "OrderDetail_skuId_fkey";

-- DropForeignKey
ALTER TABLE "OutboundTransactionDetail" DROP CONSTRAINT "OutboundTransactionDetail_skuId_fkey";

-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "ProductAttribute" DROP CONSTRAINT "ProductAttribute_productId_fkey";

-- DropForeignKey
ALTER TABLE "ProductAttributeSku" DROP CONSTRAINT "ProductAttributeSku_productAttributeId_fkey";

-- DropForeignKey
ALTER TABLE "ProductAttributeSku" DROP CONSTRAINT "ProductAttributeSku_skuId_fkey";

-- DropIndex
DROP INDEX "CartItem_skuId_idx";

-- DropIndex
DROP INDEX "Category_parentCategoryId_idx";

-- DropIndex
DROP INDEX "InboundTransactionDetail_skuId_idx";

-- DropIndex
DROP INDEX "OrderDetail_skuId_idx";

-- DropIndex
DROP INDEX "OutboundTransactionDetail_skuId_idx";

-- DropIndex
DROP INDEX "Sku_code_key";

-- AlterTable
ALTER TABLE "CartItem" DROP COLUMN "skuId",
ADD COLUMN     "productVariantId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Category" DROP COLUMN "imageUrl",
DROP COLUMN "parentCategoryId",
ADD COLUMN     "depth" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "description" TEXT DEFAULT '',
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "metaDescription" TEXT,
ADD COLUMN     "metaTitle" TEXT,
ADD COLUMN     "parentId" TEXT DEFAULT '',
ADD COLUMN     "path" TEXT NOT NULL DEFAULT '/',
ALTER COLUMN "name" DROP DEFAULT,
ALTER COLUMN "updatedAt" SET NOT NULL;

-- AlterTable
ALTER TABLE "InboundTransactionDetail" DROP COLUMN "skuId",
ADD COLUMN     "productVariantId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "OrderDetail" DROP COLUMN "skuId",
ADD COLUMN     "productVariantId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "OutboundTransactionDetail" DROP COLUMN "skuId",
ADD COLUMN     "productVariantId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "imageUrl",
DROP COLUMN "maxStockLevel",
DROP COLUMN "minStockLevel",
ADD COLUMN     "slug" TEXT NOT NULL,
ALTER COLUMN "name" DROP DEFAULT,
ALTER COLUMN "description" DROP NOT NULL,
ALTER COLUMN "status" DROP NOT NULL,
ALTER COLUMN "views" DROP NOT NULL,
ALTER COLUMN "views" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "ProductAttribute" DROP COLUMN "name",
ADD COLUMN     "attributeId" TEXT NOT NULL,
ADD COLUMN     "isRequired" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "Sku" DROP COLUMN "code",
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "lowStockThreshold" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "maxStockThreshold" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "sku" TEXT NOT NULL,
ALTER COLUMN "name" DROP DEFAULT;

-- DropTable
DROP TABLE "ProductAttributeSku";

-- CreateTable
CREATE TABLE "ProductCategory" (
    "productId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProductCategory_pkey" PRIMARY KEY ("productId","categoryId")
);

-- CreateTable
CREATE TABLE "Attribute" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "type" "AttributeType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Attribute_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AttributeValue" (
    "id" TEXT NOT NULL,
    "attributeId" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "hexColor" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AttributeValue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VariantAttributeValue" (
    "id" TEXT NOT NULL,
    "variantId" TEXT NOT NULL,
    "attributeValueId" TEXT NOT NULL,

    CONSTRAINT "VariantAttributeValue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductImage" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "altText" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProductImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VariantImage" (
    "id" TEXT NOT NULL,
    "variantId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "altText" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VariantImage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ProductCategory_categoryId_idx" ON "ProductCategory"("categoryId");

-- CreateIndex
CREATE INDEX "ProductCategory_productId_isPrimary_idx" ON "ProductCategory"("productId", "isPrimary");

-- CreateIndex
CREATE UNIQUE INDEX "Attribute_name_key" ON "Attribute"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Attribute_slug_key" ON "Attribute"("slug");

-- CreateIndex
CREATE INDEX "Attribute_slug_idx" ON "Attribute"("slug");

-- CreateIndex
CREATE INDEX "AttributeValue_attributeId_idx" ON "AttributeValue"("attributeId");

-- CreateIndex
CREATE UNIQUE INDEX "AttributeValue_attributeId_value_key" ON "AttributeValue"("attributeId", "value");

-- CreateIndex
CREATE INDEX "VariantAttributeValue_variantId_idx" ON "VariantAttributeValue"("variantId");

-- CreateIndex
CREATE INDEX "VariantAttributeValue_attributeValueId_idx" ON "VariantAttributeValue"("attributeValueId");

-- CreateIndex
CREATE UNIQUE INDEX "VariantAttributeValue_variantId_attributeValueId_key" ON "VariantAttributeValue"("variantId", "attributeValueId");

-- CreateIndex
CREATE INDEX "ProductImage_productId_idx" ON "ProductImage"("productId");

-- CreateIndex
CREATE INDEX "VariantImage_variantId_idx" ON "VariantImage"("variantId");

-- CreateIndex
CREATE INDEX "CartItem_productVariantId_idx" ON "CartItem"("productVariantId");

-- CreateIndex
CREATE INDEX "Category_parentId_idx" ON "Category"("parentId");

-- CreateIndex
CREATE INDEX "Category_path_idx" ON "Category"("path");

-- CreateIndex
CREATE INDEX "Category_slug_idx" ON "Category"("slug");

-- CreateIndex
CREATE INDEX "Category_isActive_idx" ON "Category"("isActive");

-- CreateIndex
CREATE INDEX "InboundTransactionDetail_productVariantId_idx" ON "InboundTransactionDetail"("productVariantId");

-- CreateIndex
CREATE INDEX "OrderDetail_productVariantId_idx" ON "OrderDetail"("productVariantId");

-- CreateIndex
CREATE INDEX "OutboundTransactionDetail_productVariantId_idx" ON "OutboundTransactionDetail"("productVariantId");

-- CreateIndex
CREATE UNIQUE INDEX "Product_slug_key" ON "Product"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "ProductAttribute_productId_attributeId_key" ON "ProductAttribute"("productId", "attributeId");

-- CreateIndex
CREATE UNIQUE INDEX "Sku_sku_key" ON "Sku"("sku");

-- CreateIndex
CREATE INDEX "Sku_sku_idx" ON "Sku"("sku");

-- CreateIndex
CREATE INDEX "Sku_isActive_idx" ON "Sku"("isActive");

-- CreateIndex
CREATE INDEX "Sku_stockOnHand_idx" ON "Sku"("stockOnHand");

-- AddForeignKey
ALTER TABLE "ProductAttribute" ADD CONSTRAINT "ProductAttribute_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductAttribute" ADD CONSTRAINT "ProductAttribute_attributeId_fkey" FOREIGN KEY ("attributeId") REFERENCES "Attribute"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InboundTransactionDetail" ADD CONSTRAINT "InboundTransactionDetail_productVariantId_fkey" FOREIGN KEY ("productVariantId") REFERENCES "Sku"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_productVariantId_fkey" FOREIGN KEY ("productVariantId") REFERENCES "Sku"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OutboundTransactionDetail" ADD CONSTRAINT "OutboundTransactionDetail_productVariantId_fkey" FOREIGN KEY ("productVariantId") REFERENCES "Sku"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderDetail" ADD CONSTRAINT "OrderDetail_productVariantId_fkey" FOREIGN KEY ("productVariantId") REFERENCES "Sku"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductCategory" ADD CONSTRAINT "ProductCategory_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductCategory" ADD CONSTRAINT "ProductCategory_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AttributeValue" ADD CONSTRAINT "AttributeValue_attributeId_fkey" FOREIGN KEY ("attributeId") REFERENCES "Attribute"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VariantAttributeValue" ADD CONSTRAINT "VariantAttributeValue_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "Sku"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VariantAttributeValue" ADD CONSTRAINT "VariantAttributeValue_attributeValueId_fkey" FOREIGN KEY ("attributeValueId") REFERENCES "AttributeValue"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductImage" ADD CONSTRAINT "ProductImage_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VariantImage" ADD CONSTRAINT "VariantImage_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "Sku"("id") ON DELETE CASCADE ON UPDATE CASCADE;
