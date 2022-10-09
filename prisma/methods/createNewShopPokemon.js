import isShiny from "util/isShiny";
import GetPokemonLevelRange from "util/getPokemonLevelRange";
import pokemonByShopLevel from "constants/pokemonByShopLevel";
import GetRandomElement from "util/getRandomElement";

export default async function CreateNewShopPokemon(
  prisma,
  gameId,
  currentRound,
  numberOfPokemonNeeded
) {
  const levelRange = GetPokemonLevelRange(currentRound);

  const availablePokemon = Object.keys(pokemonByShopLevel)
    .filter((round) => parseInt(round) <= currentRound)
    .map((round) => pokemonByShopLevel[round])
    .flat();

  const shopPokemonData = Array.from({ length: numberOfPokemonNeeded }).map(
    (_i) => ({
      gameId: gameId,
      isShiny: isShiny(),
      level: GetRandomElement(levelRange),
      pokemonId: GetRandomElement(availablePokemon),
    })
  );

  await prisma.shopPokemon.createMany({
    data: shopPokemonData,
  });
}
