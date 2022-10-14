/*
  Warnings:

  - You are about to drop the column `shopid` on the `ShopPokemon` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[shopId]` on the table `ShopPokemon` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `shopId` to the `ShopPokemon` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ShopPokemon" DROP CONSTRAINT "ShopPokemon_shopid_fkey";

-- DropIndex
DROP INDEX "ShopPokemon_shopid_key";

-- AlterTable
ALTER TABLE "ShopPokemon" DROP COLUMN "shopid",
ADD COLUMN     "shopId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "ShopPokemon_shopId_key" ON "ShopPokemon"("shopId");

-- AddForeignKey
ALTER TABLE "ShopPokemon" ADD CONSTRAINT "ShopPokemon_shopId_fkey" FOREIGN KEY ("shopId") REFERENCES "Shop"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
