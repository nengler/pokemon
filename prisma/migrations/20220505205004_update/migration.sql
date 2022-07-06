/*
  Warnings:

  - You are about to drop the column `pokemon1_id` on the `Shop` table. All the data in the column will be lost.
  - You are about to drop the column `pokemon2_id` on the `Shop` table. All the data in the column will be lost.
  - You are about to drop the column `pokemon3_id` on the `Shop` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Shop" DROP CONSTRAINT "Shop_pokemon1_id_fkey";

-- DropForeignKey
ALTER TABLE "Shop" DROP CONSTRAINT "Shop_pokemon2_id_fkey";

-- DropForeignKey
ALTER TABLE "Shop" DROP CONSTRAINT "Shop_pokemon3_id_fkey";

-- AlterTable
ALTER TABLE "Shop" DROP COLUMN "pokemon1_id",
DROP COLUMN "pokemon2_id",
DROP COLUMN "pokemon3_id";

-- CreateTable
CREATE TABLE "ShopPokemon" (
    "id" SERIAL NOT NULL,
    "pokemonId" INTEGER NOT NULL,
    "shopid" INTEGER NOT NULL,

    CONSTRAINT "ShopPokemon_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ShopPokemon_pokemonId_key" ON "ShopPokemon"("pokemonId");

-- CreateIndex
CREATE UNIQUE INDEX "ShopPokemon_shopid_key" ON "ShopPokemon"("shopid");

-- AddForeignKey
ALTER TABLE "ShopPokemon" ADD CONSTRAINT "ShopPokemon_shopid_fkey" FOREIGN KEY ("shopid") REFERENCES "Shop"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShopPokemon" ADD CONSTRAINT "ShopPokemon_pokemonId_fkey" FOREIGN KEY ("pokemonId") REFERENCES "Pokemon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
