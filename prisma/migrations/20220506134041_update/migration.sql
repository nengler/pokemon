/*
  Warnings:

  - You are about to drop the column `shopId` on the `ShopPokemon` table. All the data in the column will be lost.
  - You are about to drop the `Shop` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `gameId` to the `ShopPokemon` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Shop" DROP CONSTRAINT "Shop_gameId_fkey";

-- DropForeignKey
ALTER TABLE "ShopPokemon" DROP CONSTRAINT "ShopPokemon_shopId_fkey";

-- AlterTable
ALTER TABLE "ShopPokemon" DROP COLUMN "shopId",
ADD COLUMN     "gameId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "Shop";

-- AddForeignKey
ALTER TABLE "ShopPokemon" ADD CONSTRAINT "ShopPokemon_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
