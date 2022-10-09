export default async function DecreaseGameGold(prisma, gameId, amount = 3) {
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
