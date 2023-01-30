import pokemon from "constants/pokemon";
import pokemonEvolution from "constants/pokemonEvolution";

export default function TransformGamePokemonRecord(gamePokemon) {
  const { name, types, canAddToSelf } = pokemon[gamePokemon.pokemonId];

  return {
    ...gamePokemon,
    evolutions: (pokemonEvolution[gamePokemon.pokemonId] || []).map((a) => transformEvolution(a)),
    name,
    types,
    canAddToSelf,
  };
}

function transformEvolution({ into, minimumLevel }) {
  const { name, baseStats, types } = pokemon[into];
  return { into, minimumLevel, name, baseStats, types };
}
