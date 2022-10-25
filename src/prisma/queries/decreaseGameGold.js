import { purchasePokemonCost } from "constants/gameConfig";

export default async function DecreaseGameGold(prisma, gameId, amount = purchasePokemonCost) {
  return await prisma.game.update({
    where: {
      id: gameId,
    },
    data: {
      gold: {
        decrement: amount,
      },
    },
  });
}
