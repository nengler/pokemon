import pokemonByShopLevel from "../constants/pokemonByShopLevel";

export default function GetAvailableShopPokemon(currentRound) {
  return Object.keys(pokemonByShopLevel)
    .filter((round) => parseInt(round) <= currentRound)
    .map((round) => pokemonByShopLevel[round])
    .flat();
}
