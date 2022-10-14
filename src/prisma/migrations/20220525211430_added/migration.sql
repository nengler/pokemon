/*
  Warnings:

  - Added the required column `battleId` to the `BattleTeam` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "BattleTeam" ADD COLUMN     "battleId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "BattleTeam" ADD CONSTRAINT "BattleTeam_battleId_fkey" FOREIGN KEY ("battleId") REFERENCES "Battle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
