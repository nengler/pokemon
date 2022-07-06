export default async function GetShopPokemon(prisma, gameId) {
  return await prisma.shopPokemon.findMany({
    where: {
      gameId: gameId,
    },
    select: {
      id: true,
      pokemonId: true,
      level: true,
      isShiny: true,
      pokemon: {
        select: {
          id: true,
          name: true,
          pokedexId: true,
          baseHp: true,
          baseAttack: true,
          baseDefense: true,
          pokemonTypes: {
            select: {
              type: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      },
    },
  });
}
