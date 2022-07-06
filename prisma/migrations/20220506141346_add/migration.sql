/*
  Warnings:

  - Added the required column `isShiny` to the `GamePokemon` table without a default value. This is not possible if the table is not empty.
  - Added the required column `isShiny` to the `ShopPokemon` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "GamePokemon" ADD COLUMN     "isShiny" BOOLEAN NOT NULL;

-- AlterTable
ALTER TABLE "ShopPokemon" ADD COLUMN     "isShiny" BOOLEAN NOT NULL;
