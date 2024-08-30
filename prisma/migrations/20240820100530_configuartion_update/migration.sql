/*
  Warnings:

  - You are about to drop the column `hight` on the `Configuration` table. All the data in the column will be lost.
  - Added the required column `height` to the `Configuration` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Configuration" DROP COLUMN "hight",
ADD COLUMN     "height" INTEGER NOT NULL;
