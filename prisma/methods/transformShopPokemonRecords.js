import pokemon from "constants/pokemon";

export default function (shopPokemonRecords) {
  return shopPokemonRecords.map((s) => {
    return {
      ...s,
      ...pokemon[s.pokemonId],
    };
  });
}
