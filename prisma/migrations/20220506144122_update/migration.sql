/*
  Warnings:

  - You are about to drop the column `order` on the `GamePokemon` table. All the data in the column will be lost.
  - Added the required column `orderNum` to the `GamePokemon` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "GamePokemon" DROP COLUMN "order",
ADD COLUMN     "orderNum" INTEGER NOT NULL;
