-- DropForeignKey
ALTER TABLE "Battle" DROP CONSTRAINT "Battle_winnerId_fkey";

-- AlterTable
ALTER TABLE "Battle" ALTER COLUMN "winnerId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Battle" ADD CONSTRAINT "Battle_winnerId_fkey" FOREIGN KEY ("winnerId") REFERENCES "Game"("id") ON DELETE SET NULL ON UPDATE CASCADE;
