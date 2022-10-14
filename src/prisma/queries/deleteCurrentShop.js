export default async function DeleteCurrentShop(prisma, gameId) {
  await prisma.shopPokemon.deleteMany({
    where: {
      gameId: gameId,
    },
  });
}
