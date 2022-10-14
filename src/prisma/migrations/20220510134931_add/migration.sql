-- AlterTable
ALTER TABLE "Pokemon" ADD COLUMN     "evolutionLevel" INTEGER,
ADD COLUMN     "evolvesFromId" INTEGER;

-- AddForeignKey
ALTER TABLE "Pokemon" ADD CONSTRAINT "Pokemon_evolvesFromId_fkey" FOREIGN KEY ("evolvesFromId") REFERENCES "Pokemon"("id") ON DELETE SET NULL ON UPDATE CASCADE;
