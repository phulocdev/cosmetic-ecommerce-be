/*
  Warnings:

  - The values [SLIDER,DROPDOWN] on the enum `FilterDisplayType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `filterGroup` on the `Attribute` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Attribute` table. All the data in the column will be lost.
  - You are about to drop the column `filterGroup` on the `CategoryAttribute` table. All the data in the column will be lost.
  - You are about to drop the `ProductAttribute` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `VariantImage` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "FacetInheritanceMode" AS ENUM ('INHERIT', 'OVERRIDE', 'MERGE');

-- CreateEnum
CREATE TYPE "AttributeDataType" AS ENUM ('TEXT', 'NUMBER', 'BOOLEAN', 'COLOR');

-- AlterEnum
BEGIN;
CREATE TYPE "FilterDisplayType_new" AS ENUM ('CHECKBOX', 'RANGE', 'SWATCH', 'RADIO', 'TOGGLE');
ALTER TABLE "public"."CategoryAttribute" ALTER COLUMN "filterType" DROP DEFAULT;
ALTER TABLE "CategoryAttribute" ALTER COLUMN "filterType" TYPE "FilterDisplayType_new" USING ("filterType"::text::"FilterDisplayType_new");
ALTER TYPE "FilterDisplayType" RENAME TO "FilterDisplayType_old";
ALTER TYPE "FilterDisplayType_new" RENAME TO "FilterDisplayType";
DROP TYPE "public"."FilterDisplayType_old";
ALTER TABLE "CategoryAttribute" ALTER COLUMN "filterType" SET DEFAULT 'CHECKBOX';
COMMIT;

-- DropForeignKey
ALTER TABLE "ProductAttribute" DROP CONSTRAINT "ProductAttribute_attributeId_fkey";

-- DropForeignKey
ALTER TABLE "ProductAttribute" DROP CONSTRAINT "ProductAttribute_productId_fkey";

-- DropForeignKey
ALTER TABLE "VariantImage" DROP CONSTRAINT "VariantImage_variantId_fkey";

-- AlterTable
ALTER TABLE "Attribute" DROP COLUMN "filterGroup",
DROP COLUMN "type",
ADD COLUMN     "dataType" "AttributeDataType" NOT NULL DEFAULT 'TEXT',
ADD COLUMN     "displayName" TEXT;

-- AlterTable
ALTER TABLE "AttributeValue" ADD COLUMN     "displayName" TEXT,
ADD COLUMN     "displayOrder" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "imageUrl" TEXT;

-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "facetInheritanceMode" "FacetInheritanceMode" NOT NULL DEFAULT 'INHERIT';

-- AlterTable
ALTER TABLE "CategoryAttribute" DROP COLUMN "filterGroup",
ADD COLUMN     "isCollapsed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "showSearchBox" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "ProductImage" ADD COLUMN     "displayOrder" INTEGER DEFAULT 0;

-- AlterTable
ALTER TABLE "ProductVariant" ALTER COLUMN "stockOnHand" DROP NOT NULL,
ALTER COLUMN "stockOnHand" SET DEFAULT 0;

-- DropTable
DROP TABLE "ProductAttribute";

-- DropTable
DROP TABLE "VariantImage";

-- DropEnum
DROP TYPE "AttributeType";
