import isShiny from "util/isShiny";
import GetPokemonLevelRange from "util/getPokemonLevelRange";
import GetRandomElement from "util/getRandomElement";
import GetAvailableShopPokemon from "util/getAvailableShopPokemon";

export default async function CreateNewShopPokemon(prisma, gameId, currentRound, numberOfPokemonNeeded) {
  const levelRange = GetPokemonLevelRange(currentRound);
  const availablePokemon = GetAvailableShopPokemon(currentRound);

  const shopPokemonData = Array.from({ length: numberOfPokemonNeeded }).map((_i) => ({
    gameId: gameId,
    isShiny: isShiny(),
    level: GetRandomElement(levelRange),
    pokemonId: GetRandomElement(availablePokemon),
  }));

  await prisma.shopPokemon.createMany({
    data: shopPokemonData,
  });
}
