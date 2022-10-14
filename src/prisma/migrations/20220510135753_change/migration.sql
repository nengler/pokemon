/*
  Warnings:

  - You are about to drop the column `evolutionLevel` on the `Pokemon` table. All the data in the column will be lost.
  - You are about to drop the column `evolvesFromId` on the `Pokemon` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Pokemon" DROP CONSTRAINT "Pokemon_evolvesFromId_fkey";

-- AlterTable
ALTER TABLE "Pokemon" DROP COLUMN "evolutionLevel",
DROP COLUMN "evolvesFromId";

-- CreateTable
CREATE TABLE "PokemonEvolution" (
    "id" SERIAL NOT NULL,
    "evolutionLevel" INTEGER NOT NULL,
    "evolvesFromId" INTEGER NOT NULL,
    "evolvesToId" INTEGER NOT NULL,

    CONSTRAINT "PokemonEvolution_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PokemonEvolution" ADD CONSTRAINT "PokemonEvolution_evolvesFromId_fkey" FOREIGN KEY ("evolvesFromId") REFERENCES "Pokemon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PokemonEvolution" ADD CONSTRAINT "PokemonEvolution_evolvesToId_fkey" FOREIGN KEY ("evolvesToId") REFERENCES "Pokemon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
