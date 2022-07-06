-- DropForeignKey
ALTER TABLE "Battle" DROP CONSTRAINT "Battle_game2Id_fkey";

-- AlterTable
ALTER TABLE "Battle" ALTER COLUMN "game2Id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Battle" ADD CONSTRAINT "Battle_game2Id_fkey" FOREIGN KEY ("game2Id") REFERENCES "Game"("id") ON DELETE SET NULL ON UPDATE CASCADE;
