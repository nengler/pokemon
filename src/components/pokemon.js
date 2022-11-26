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
  flip = true,
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

  const imgClasses = () => {
    let classes = [];

    if (didDie) {
      classes.push(["transition-transform", "duration-700", "translate-y-40"]);
    }

    if (isSpawning) {
      classes.push("isSpawningAnimation");
    }

    if (isFighting) {
      classes.push(...["w-28", "h-28"]);
    } else {
      classes.push(...["w-24", "h-24", "sm:w-28", "sm:h-28"]);
    }

    return classes.join(" ");
  };

  return (
    <div ref={pokemonRef}>
      <div className="flex justify-center relative overflow-hidden">
        <div className="z-[1] relative">
          <div className={`${flip ? "-scale-x-100" : ""}`}>
            <img
              className={imgClasses()}
              alt={`${name} Image`}
              src={PokemonImage(pokedexId, isShiny)}
              style={imgStyle}
            />
          </div>
          <div className="absolute top-0 right-0">lv. {level}</div>
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

      <div className="flex justify-between gap-1">
        <div>
          {pokemonTypes.map((pokemonType, index) => (
            <PokemonType key={pokemonType} index={index} pokemonType={pokemonType} shorten />
          ))}
        </div>
        <div>
          <span className="bg-red-300 rounded-md inline-block mr-1 items-center h-6 px-1.5">{attack}</span>
          <span className="bg-blue-300 rounded-md inline-block items-center h-6 px-1.5">{defense}</span>
        </div>
      </div>
      <div className="relative w-full h-6 flex justify-center border border-green-300 rounded-lg mt-1">
        <div
          className={`absolute origin-left w-full left-0 rounded-lg z-0 bg-green-300 h-full transition-transform duration-300`}
          style={{ transform: `scaleX(${hpMeter})` }}
        ></div>
        <span className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2">
          {tempHp < 0 ? 0 : tempHp} / {hp}
        </span>
      </div>
    </div>
  );
}
