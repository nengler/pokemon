export async function GetBattleTeam(prisma, battleId, gameId) {
  return await prisma.battleTeam.findMany({
    where: {
      battleId: battleId,
      gameId: gameId,
    },
    orderBy: {
      orderNum: "desc",
    },
    select: {
      id: true,
      hp: true,
      attack: true,
      defense: true,
      level: true,
      isShiny: true,
      orderNum: true,
      gameId: true,
      pokemon: {
        select: {
          id: true,
          name: true,
          pokedexId: true,
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
