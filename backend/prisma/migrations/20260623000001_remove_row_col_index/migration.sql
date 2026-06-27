/*
  Warnings:

  - You are about to drop the column colIndex on the Compartment table. All the data in the column will be lost.
  - You are about to drop the column owIndex on the Compartment table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Compartment" DROP COLUMN "colIndex",
DROP COLUMN "rowIndex";
