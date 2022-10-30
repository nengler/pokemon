import { DragPreviewImage } from "react-dnd";
import PokemonImage from "util/pokemonImage";
import PokemonType from "./pokemonType";

export default function Pokemon({
  pokemonRef,
  level,
  name,
  pokedexId,
  isShiny,
  hp,
  tempHp,
  attack,
  defense,
  pokemonTypes,
  connectDragSource,
  flip = false,
  didDie = false,
}) {
  let hpMeter = tempHp / hp;
  if (hpMeter < 0) {
    hpMeter = 0;
  } else {
    hpMeter = hpMeter.toFixed(3);
  }
  return (
    <>
      {connectDragSource !== undefined && (
        <DragPreviewImage src={PokemonImage(pokedexId, isShiny)} connect={connectDragSource} />
      )}
      <div ref={pokemonRef}>
        <div>{name}</div>
        {pokemonTypes.map((pokemonType, index) => (
          <PokemonType key={pokemonType} index={index} pokemonType={pokemonType} />
        ))}
        <div className={`flex justify-center ${didDie ? "transition-transform duration-700 translate-y-40" : ""}`}>
          <img
            className={`${flip ? "-scale-x-100" : ""} w-24 h-24 z-[1]`}
            alt={`${name} Image`}
            src={PokemonImage(pokedexId, isShiny)}
          />
        </div>
        <div className="mb-1">Level {level}</div>

        <div className="flex justify-center gap-2 mt-1">
          <span className="bg-red-300 rounded-lg flex items-center py-0.5 px-1">{attack}</span>
          <span className="bg-blue-300 rounded-lg flex items-center py-0.5 px-1.5">{defense}</span>
        </div>
        <div className="relative w-28 h-6 mt-1 mx-auto flex justify-center border border-green-300 rounded-lg">
          <div
            className={`absolute origin-left w-full left-0 rounded-lg z-0 bg-green-300 h-6 transition-transform`}
            style={{ transform: `scaleX(${hpMeter})` }}
          ></div>
          <span className="absolute">
            {tempHp} / {hp}
          </span>
        </div>
      </div>
    </>
  );
}
