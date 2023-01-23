import PokemonImage from "util/pokemonImage";
import PokemonType from "./pokemonType";
import TextAnimation from "./battle/textComponent";
import SpawnPokeball from "./battle/spawnPokeball";
import styles from "../styles/myPokemon.module.css";

export default function Pokemon({
  pokemonRef,
  level,
  name,
  pokedexId,
  isShopPokemon = false,
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
  let imgStyle = {};

  if (isFighting) {
    imgStyle.filter = "drop-shadow(2px 3px 3px rgba(0,0,0,.1))";
  }

  const imgClasses = () => {
    let classes = [];

    if (didDie) {
      classes.push(...["transition-transform", "duration-700", "translate-y-40"]);
    }

    if (isSpawning) {
      classes.push("isSpawningAnimation");
    }

    if (isFighting) {
      classes.push(...["w-32", "h-32"]);
    } else if (isShopPokemon) {
      classes.push(styles.shopPokemonDimensions);
    } else {
      classes.push(styles.pokemonDimensions);
    }

    return classes.join(" ");
  };

  return (
    <div ref={pokemonRef}>
      <div className="flex justify-center relative overflow-hidden">
        <div className="z-[1] relative">
          <div className={`${flip ? "-scale-x-100" : ""}`}>
            <div
              data-pokemon-image={true}
              className={imgClasses()}
              alt={`${name} Image`}
              style={{
                ...imgStyle,
                backgroundImage: `url(${PokemonImage(pokedexId, isShiny)})`,
                backgroundSize: "100% 100%",
              }}
            />
          </div>
          <div className={`leading-4 absolute top-0 ${flip ? "left-0" : "right-0"}`}>lv. {level}</div>
          <div className={`absolute top-0 z-0 ${flip ? "right-0" : "left-0"}`}>
            {pokemonTypes.map((pokemonType, index) => (
              <PokemonType key={pokemonType} index={index} pokemonType={pokemonType} shorten />
            ))}
          </div>
        </div>
        <TextAnimation attackAnimation={attackAnimation} isMyTeam={flip} />
        {isSpawning && <SpawnPokeball />}
      </div>

      <div className="flex gap-1 justify-center">
        <span className="bg-red-300 rounded-md inline-block h-6 px-1">{attack}</span>
        <span className="bg-blue-300 rounded-md inline-block h-6 px-1">{defense}</span>
        <HpMeter hp={hp} tempHp={tempHp} />
      </div>
    </div>
  );
}

function HpMeter({ tempHp, hp }) {
  let hpMeter = tempHp / hp;
  if (hpMeter < 0) {
    hpMeter = 0;
  } else {
    hpMeter = hpMeter.toFixed(3);
  }

  return (
    <div className="min-w-[30px] relative px-1 h-6 flex justify-center items-center border border-green-300 rounded-lg overflow-hidden">
      <div
        className={`absolute origin-bottom w-full left-0 z-0 bg-green-300 h-full transition-transform duration-300`}
        style={{ transform: `scaleY(${hpMeter})` }}
      />
      <span className="z-[1]">{tempHp < 0 ? 0 : tempHp}</span>
    </div>
  );
}
