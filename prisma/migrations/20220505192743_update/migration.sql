/*
  Warnings:

  - Added the required column `roundPurchaseable` to the `Pokemon` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Pokemon" ADD COLUMN     "roundPurchaseable" INTEGER NOT NULL;
