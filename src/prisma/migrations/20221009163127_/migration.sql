/*
  Warnings:

  - You are about to drop the `Pokemon` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PokemonEvolution` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PokemonType` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Type` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "BattleTeam" DROP CONSTRAINT "BattleTeam_pokemonId_fkey";

-- DropForeignKey
ALTER TABLE "GamePokemon" DROP CONSTRAINT "GamePokemon_pokemonId_fkey";

-- DropForeignKey
ALTER TABLE "PokemonEvolution" DROP CONSTRAINT "PokemonEvolution_evolvesFromId_fkey";

-- DropForeignKey
ALTER TABLE "PokemonEvolution" DROP CONSTRAINT "PokemonEvolution_evolvesToId_fkey";

-- DropForeignKey
ALTER TABLE "PokemonType" DROP CONSTRAINT "PokemonType_pokemonId_fkey";

-- DropForeignKey
ALTER TABLE "PokemonType" DROP CONSTRAINT "PokemonType_typeId_fkey";

-- DropForeignKey
ALTER TABLE "ShopPokemon" DROP CONSTRAINT "ShopPokemon_pokemonId_fkey";

-- DropTable
DROP TABLE "Pokemon";

-- DropTable
DROP TABLE "PokemonEvolution";

-- DropTable
DROP TABLE "PokemonType";

-- DropTable
DROP TABLE "Type";
