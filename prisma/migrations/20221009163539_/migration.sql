/*
  Warnings:

  - Added the required column `round` to the `Battle` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Battle" ADD COLUMN     "round" INTEGER NOT NULL;
