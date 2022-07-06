-- AlterTable
ALTER TABLE "Battle" ADD COLUMN     "isBattleOver" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Game" ALTER COLUMN "round" SET DEFAULT 1;
