-- DropIndex
DROP INDEX "ProductVariant_barcode_key";

-- AlterTable
ALTER TABLE "ProductImage" ALTER COLUMN "displayOrder" SET DEFAULT 1;

-- AlterTable
ALTER TABLE "ProductVariant" ALTER COLUMN "barcode" DROP NOT NULL,
ALTER COLUMN "barcode" SET DEFAULT '';
