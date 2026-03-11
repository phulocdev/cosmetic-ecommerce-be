/*
  Warnings:

  - You are about to drop the column `facetInheritanceMode` on the `Category` table. All the data in the column will be lost.
  - You are about to drop the column `isFilterable` on the `CategoryAttribute` table. All the data in the column will be lost.
  - You are about to drop the column `isRequired` on the `CategoryAttribute` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "CategoryAttribute_categoryId_isFilterable_idx";

-- AlterTable
ALTER TABLE "Category" DROP COLUMN "facetInheritanceMode";

-- AlterTable
ALTER TABLE "CategoryAttribute" DROP COLUMN "isFilterable",
DROP COLUMN "isRequired";
