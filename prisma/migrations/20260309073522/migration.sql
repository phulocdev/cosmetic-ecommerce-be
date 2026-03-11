/*
  Warnings:

  - You are about to drop the column `dataType` on the `Attribute` table. All the data in the column will be lost.
  - You are about to drop the column `unit` on the `Attribute` table. All the data in the column will be lost.
  - You are about to drop the column `displayName` on the `AttributeValue` table. All the data in the column will be lost.
  - You are about to drop the column `displayOrder` on the `AttributeValue` table. All the data in the column will be lost.
  - You are about to drop the column `hexColor` on the `AttributeValue` table. All the data in the column will be lost.
  - You are about to drop the column `imageUrl` on the `AttributeValue` table. All the data in the column will be lost.
  - You are about to drop the column `displayName` on the `CategoryAttribute` table. All the data in the column will be lost.
  - You are about to drop the column `displayOrder` on the `CategoryAttribute` table. All the data in the column will be lost.
  - You are about to drop the column `filterType` on the `CategoryAttribute` table. All the data in the column will be lost.
  - You are about to drop the column `inheritToChildren` on the `CategoryAttribute` table. All the data in the column will be lost.
  - You are about to drop the column `isCollapsed` on the `CategoryAttribute` table. All the data in the column will be lost.
  - You are about to drop the column `showSearchBox` on the `CategoryAttribute` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Attribute" DROP COLUMN "dataType",
DROP COLUMN "unit";

-- AlterTable
ALTER TABLE "AttributeValue" DROP COLUMN "displayName",
DROP COLUMN "displayOrder",
DROP COLUMN "hexColor",
DROP COLUMN "imageUrl";

-- AlterTable
ALTER TABLE "CategoryAttribute" DROP COLUMN "displayName",
DROP COLUMN "displayOrder",
DROP COLUMN "filterType",
DROP COLUMN "inheritToChildren",
DROP COLUMN "isCollapsed",
DROP COLUMN "showSearchBox";

-- DropEnum
DROP TYPE "FilterDisplayType";
