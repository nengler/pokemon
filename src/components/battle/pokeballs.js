import PokemonImage from "util/pokemonImage";

export default function PokeBalls({ flip, pokemonTeam }) {
  return (
    <div className={`w-full h-12 flex items-center justify-end sm:justify-start ${flip ? "flex-row-reverse " : ""}`}>
      {pokemonTeam.map((pokemon) => {
        const { name, isShiny, pokemonId, hasFainted, id, seen } = pokemon;
        return (
          <div className={`h-12 w-12 relative ${hasFainted ? "grayscale" : ""}`} key={id}>
            <img
              className={`${flip ? "-scale-x-100" : ""} h-12 w-12 absolute`}
              alt="poke ball"
              src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png"
            />
            {seen && (
              <img
                className={`${flip ? "-scale-x-100" : ""} h-12 w-12 absolute`}
                alt={`${name} Image`}
                src={PokemonImage(pokemonId, isShiny)}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
