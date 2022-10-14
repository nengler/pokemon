/*
  Warnings:

  - A unique constraint covering the columns `[pokedexId]` on the table `Pokemon` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `pokedexId` to the `Pokemon` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Pokemon" ADD COLUMN     "pokedexId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Pokemon_pokedexId_key" ON "Pokemon"("pokedexId");
