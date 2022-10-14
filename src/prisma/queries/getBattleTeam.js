import pokemon from "constants/pokemon";

export async function GetBattleTeam(prisma, battleId, gameId) {
  const battlePokemonRecords = await prisma.battleTeam.findMany({
    where: {
      battleId: battleId,
      gameId: gameId,
    },
    orderBy: {
      orderNum: "desc",
    },
  });

  return battlePokemonRecords.map((a) => {
    const { name, types } = pokemon[a.pokemonId];
    return { ...a, ...name, types };
  });
}
