import { useDrag, useDrop } from "react-dnd";
import { useState, useRef, useEffect } from "react";
import Pokemon from "./pokemon";
import GetHp from "util/getHp";
import styles from "../styles/myPokemon.module.css";
import Image from "next/image";

export default function MyPokemon({
  gamePokemon,
  gold,
  order,
  buyNewPokemon,
  upgradePokemon,
  sellPokemon,
  rearrangeOrder,
  allPokemon,
  evolvePokemon,
  canPerformAction,
  combinePokemon,
  platformImage,
}) {
  const clickOutside = useRef();
  const evolveButtonRef = useRef();
  const gamePokemonId = gamePokemon?.id;
  const pokemonId = gamePokemon?.pokemonId;

  const handleOutsideClicks = (event) => {
    if (!clickOutside.current?.contains(event.target) && evolveButtonRef.current !== event.target) {
      setShowEvolutions(false);
      document.removeEventListener("mousedown", handleOutsideClicks);
    }
  };

  const [showEvolutions, setShowEvolutions] = useState(false);

  const setShowEvolutionsTrue = () => {
    setShowEvolutions(true);
    document.addEventListener("mousedown", handleOutsideClicks);
  };

  const setShowEvolutionsFalse = () => {
    setShowEvolutions(false);
    document.removeEventListener("mousedown", handleOutsideClicks);
  };

  const pokemonDropped = (props) => {
    if (gamePokemon === undefined) {
      buyNewPokemon(order, props.shopPokemonId, props.pokemonId);
    } else {
      upgradePokemon(gamePokemon.id, props.shopPokemonId);
    }
  };

  const pokemonCanDrop = ({ pokemonId }) => {
    return gold >= 3 && (gamePokemon === undefined || gamePokemon?.canAddToSelf?.includes(pokemonId));
  };

  const gamePokemonDropped = (props) => {
    const { gamePokemonId: gamePokemonIdDropped, pokemonId: pokemonIdDropped, originalSpot } = props;
    if (gamePokemonIdDropped === gamePokemonId) {
      return;
    }

    if (!gamePokemon) {
      rearrangeOrder(gamePokemonIdDropped, originalSpot, order);
      return;
    } else if (gamePokemon.canAddToSelf.includes(pokemonIdDropped)) {
      combinePokemon(gamePokemonId, gamePokemonIdDropped);
      return;
    }
    rearrangeOrder(gamePokemonIdDropped, originalSpot, order);
  };

  const sellGamePokemon = () => {
    if (canPerformAction) {
      sellPokemon(gamePokemon.id);
    }
  };

  const [{ canDrop, isOver }, drop] = useDrop(
    () => ({
      accept: "Pokemon",
      canDrop: (props) => pokemonCanDrop(props),
      drop: (props) => pokemonDropped(props),
      collect: (monitor, props) => ({
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(props),
      }),
    }),
    [allPokemon]
  );

  const [dragCollectables, drag, preview] = useDrag(
    () => ({
      type: "GamePokemon",
      item: { gamePokemonId, pokemonId, originalSpot: order },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
      canDrag: () => {
        return canPerformAction;
      },
    }),
    [allPokemon, canPerformAction]
  );

  const [collectables, gamePokemonDrop] = useDrop(
    () => ({
      accept: "GamePokemon",
      drop: (props) => gamePokemonDropped(props),
      collect: (monitor, props) => ({
        isOver: monitor.isOver(),
      }),
    }),
    [allPokemon]
  );

  const checkEvolution = () => {
    if (!canPerformAction) {
      return;
    }

    if (gamePokemon.evolutions.length === 1) {
      evolvePokemon(gamePokemon.id, gamePokemon.evolutions[0].into);
    } else if (showEvolutions) {
      setShowEvolutionsFalse();
    } else if (!showEvolutions) {
      setShowEvolutionsTrue();
    }
  };

  const choseEvolution = (evolvesToId) => {
    evolvePokemon(gamePokemon.id, evolvesToId);
    setShowEvolutionsFalse();
  };

  const canEvolveInto = gamePokemon?.evolutions.filter((e) => e.minimumLevel <= gamePokemon.level);
  console.log(canEvolveInto);

  useEffect(() => {
    preview(<img />);
  }, []);

  return (
    <div
      ref={gamePokemonDrop}
      className={`${styles.width} sm:mt-4 transition-colors ${
        dragCollectables.isDragging || !canPerformAction ? "opacity-50" : ""
      } ${collectables.isOver ? "bg-green-500" : ""}`}
    >
      <div
        ref={drop}
        className={`h-[34vw] md:h-40 flex flex-col justify-end transition-colors relative ${
          canDrop && isOver ? "bg-green-500" : ""
        } `}
      >
        <div className="absolute bottom-10 w-full scale-y-150 md:scale-125">
          <Image src={platformImage} width={256} height={70} />
        </div>
        {gamePokemon !== undefined && (
          <div className="text-center w-full">
            <Pokemon
              evolvesAt={gamePokemon.evolutions[0]?.minimumLevel}
              pokemonRef={drag}
              name={gamePokemon.name}
              level={gamePokemon.level}
              hp={gamePokemon.hp}
              tempHp={gamePokemon.hp}
              attack={gamePokemon.attack}
              defense={gamePokemon.defense}
              pokedexId={gamePokemon.pokemonId}
              isShiny={gamePokemon.isShiny}
              pokemonTypes={gamePokemon.types}
            />
          </div>
        )}
      </div>

      {gamePokemon !== undefined ? (
        <div className="flex justify-center mt-1">
          <button onClick={sellGamePokemon} className="bg-red-600 text-red-50 btn sm">
            sell
          </button>

          {canEvolveInto.length > 0 && (
            <>
              <div className="relative inline-block ml-1">
                <button ref={evolveButtonRef} onClick={checkEvolution} className="bg-green-600 text-green-50 btn sm">
                  evolve
                </button>
                {showEvolutions && (
                  <div
                    ref={clickOutside}
                    className="bg-white z-[2] shadow-xl p-4 rounded-lg flex gap-2 absolute left-1/2 -translate-x-1/2 top-8"
                  >
                    {canEvolveInto.map((e) => (
                      <div
                        onClick={() => choseEvolution(e.into)}
                        className="w-32 flex flex-col items-center text-center hover:bg-purple-50 cursor-pointer"
                        key={e.into}
                      >
                        <Pokemon
                          name={e.name}
                          level={gamePokemon.level}
                          hp={GetHp(e.baseStats.hp, gamePokemon.level)}
                          attack={GetHp(e.baseStats.attack, gamePokemon.level)}
                          defense={GetHp(e.baseStats.defense, gamePokemon.level)}
                          pokedexId={e.into}
                          isShiny={gamePokemon.isShiny}
                          tempHp={GetHp(e.baseStats.hp, gamePokemon.level)}
                          pokemonTypes={e.types}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      ) : (
        <div className="text-center">order #: {6 - order}</div>
      )}
    </div>
  );
}
