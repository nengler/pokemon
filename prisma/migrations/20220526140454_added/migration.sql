-- DropForeignKey
ALTER TABLE "BattleTeam" DROP CONSTRAINT "BattleTeam_gameId_fkey";

-- AlterTable
ALTER TABLE "BattleTeam" ALTER COLUMN "gameId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "BattleTeam" ADD CONSTRAINT "BattleTeam_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE SET NULL ON UPDATE CASCADE;
