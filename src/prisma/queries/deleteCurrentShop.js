export default async function DeleteCurrentShop(prisma, gameId) {
  return await prisma.shopPokemon.deleteMany({
    where: {
      gameId: gameId,
      isFrozen: false,
    },
  });
}
