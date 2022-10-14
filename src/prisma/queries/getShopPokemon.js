export default async function GetShopPokemon(prisma, gameId) {
  return await prisma.shopPokemon.findMany({
    where: {
      gameId: gameId,
    },
  });
}
