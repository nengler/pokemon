import pokemon from "constants/pokemon";
import pokemonEvolution from "constants/pokemonEvolution";

export default async function GetGamePokemon(prisma, gameId) {
  const gamePokemon = await prisma.gamePokemon.findMany({
    where: {
      gameId: gameId,
    },
  });

  return gamePokemon.map((g) => {
    const { name, types } = pokemon[g.pokemonId];

    return {
      ...g,
      evolutions: pokemonEvolution[g.pokemonId] || [],
      name,
      types,
    };
  });
}
