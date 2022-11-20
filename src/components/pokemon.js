import { DragPreviewImage } from "react-dnd";
import PokemonImage from "util/pokemonImage";
import PokemonType from "./pokemonType";
import TextAnimation from "./battle/textComponent";
import SpawnPokeball from "./battle/spawnPokeball";

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
  isSpawning = false,
  isFighting = false,
  attackAnimation = {},
}) {
  let hpMeter = tempHp / hp;
  if (hpMeter < 0) {
    hpMeter = 0;
  } else {
    hpMeter = hpMeter.toFixed(3);
  }

  let imgStyle = {};

  if (isFighting) {
    imgStyle.filter = "drop-shadow(2px 3px 3px rgba(0,0,0,.1))";
  }
  return (
    <>
      {connectDragSource !== undefined && (
        <DragPreviewImage src={PokemonImage(pokedexId, isShiny)} connect={connectDragSource} />
      )}
      <div ref={pokemonRef}>
        <div>
          {name} lv. {level}
        </div>
        {pokemonTypes.map((pokemonType, index) => (
          <PokemonType key={pokemonType} index={index} pokemonType={pokemonType} shorten />
        ))}
        <div className="flex justify-center relative overflow-hidden">
          <div className={`${flip ? "-scale-x-100" : ""} z-[1]`}>
            <img
              className={`${didDie ? "transition-transform duration-700 translate-y-40" : ""} ${
                isSpawning ? "isSpawningAnimation" : ""
              } 
            w-20 h-20 sm:w-24 sm:h-24 `}
              alt={`${name} Image`}
              src={PokemonImage(pokedexId, isShiny)}
              style={imgStyle}
            />
          </div>
          <TextAnimation attackAnimation={attackAnimation} isMyTeam={flip} />
          {isFighting && (
            <div
              className="absolute bottom-2 w-full h-12 bg-[#dfc3a5] border-[3px] border-[#efdbb5]"
              style={{ borderRadius: "50%" }}
            />
          )}
          {isSpawning && <SpawnPokeball />}
        </div>
        <div className="flex justify-center gap-1 mt-1">
          <span className="bg-red-300 rounded-md flex items-center h-7 px-1.5">{attack}</span>
          <span className="bg-blue-300 rounded-md flex items-center h-7 px-1.5">{defense}</span>
          <div className="relative w-full h-7 flex justify-center border border-green-300 rounded-lg">
            <div
              className={`absolute origin-left w-full left-0 rounded-lg z-0 bg-green-300 h-full transition-transform duration-300`}
              style={{ transform: `scaleX(${hpMeter})` }}
            ></div>
            <span className="absolute">
              {tempHp < 0 ? 0 : tempHp} / {hp}
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
