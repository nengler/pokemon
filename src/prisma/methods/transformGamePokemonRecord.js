import pokemon from "constants/pokemon";
import pokemonEvolution from "constants/pokemonEvolution";

export default function TransformGamePokemonRecord(gamePokemon) {
  const { name, types, canAddToSelf } = pokemon[gamePokemon.pokemonId];

  return {
    ...gamePokemon,
    evolutions: pokemonEvolution[gamePokemon.pokemonId] || [],
    name,
    types,
    canAddToSelf,
  };
}
