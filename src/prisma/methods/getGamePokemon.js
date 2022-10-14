import TransformGamePokemonRecord from "./transformGamePokemonRecord";

export default async function GetGamePokemon(prisma, gameId) {
  const gamePokemon = await prisma.gamePokemon.findMany({
    where: {
      gameId: gameId,
    },
  });

  return gamePokemon.map((g) => TransformGamePokemonRecord(g));
}
