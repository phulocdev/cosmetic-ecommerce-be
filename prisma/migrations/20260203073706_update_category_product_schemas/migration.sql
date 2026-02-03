-- CreateEnum
CREATE TYPE "FilterDisplayType" AS ENUM ('CHECKBOX', 'RADIO', 'SLIDER', 'SWATCH', 'DROPDOWN', 'TOGGLE');

-- AlterTable
ALTER TABLE "Attribute" ADD COLUMN     "filterGroup" TEXT,
ADD COLUMN     "isGlobalFilter" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "unit" TEXT;

-- CreateTable
CREATE TABLE "CategoryAttribute" (
    "id" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "attributeId" TEXT NOT NULL,
    "displayName" TEXT,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "filterType" "FilterDisplayType" NOT NULL DEFAULT 'CHECKBOX',
    "isFilterable" BOOLEAN NOT NULL DEFAULT true,
    "isRequired" BOOLEAN NOT NULL DEFAULT false,
    "inheritToChildren" BOOLEAN NOT NULL DEFAULT true,
    "filterGroup" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CategoryAttribute_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FilterCache" (
    "id" TEXT NOT NULL,
    "categoryPath" TEXT NOT NULL,
    "filterHash" TEXT NOT NULL,
    "aggregatedData" JSONB NOT NULL,
    "productCount" INTEGER NOT NULL DEFAULT 0,
    "variantCount" INTEGER NOT NULL DEFAULT 0,
    "computeTimeMs" INTEGER NOT NULL DEFAULT 0,
    "lastComputedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FilterCache_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CategoryAttribute_categoryId_isFilterable_idx" ON "CategoryAttribute"("categoryId", "isFilterable");

-- CreateIndex
CREATE INDEX "CategoryAttribute_attributeId_idx" ON "CategoryAttribute"("attributeId");

-- CreateIndex
CREATE UNIQUE INDEX "CategoryAttribute_categoryId_attributeId_key" ON "CategoryAttribute"("categoryId", "attributeId");

-- CreateIndex
CREATE INDEX "FilterCache_categoryPath_idx" ON "FilterCache"("categoryPath");

-- CreateIndex
CREATE INDEX "FilterCache_expiresAt_idx" ON "FilterCache"("expiresAt");

-- CreateIndex
CREATE INDEX "FilterCache_lastComputedAt_idx" ON "FilterCache"("lastComputedAt");

-- CreateIndex
CREATE UNIQUE INDEX "FilterCache_categoryPath_filterHash_key" ON "FilterCache"("categoryPath", "filterHash");

-- CreateIndex
CREATE INDEX "Attribute_isGlobalFilter_idx" ON "Attribute"("isGlobalFilter");

-- CreateIndex
CREATE INDEX "ProductVariant_sellingPrice_idx" ON "ProductVariant"("sellingPrice");

-- AddForeignKey
ALTER TABLE "CategoryAttribute" ADD CONSTRAINT "CategoryAttribute_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CategoryAttribute" ADD CONSTRAINT "CategoryAttribute_attributeId_fkey" FOREIGN KEY ("attributeId") REFERENCES "Attribute"("id") ON DELETE CASCADE ON UPDATE CASCADE;
