import { useDrag, useDrop } from "react-dnd";
import { useState, useRef } from "react";
import Pokemon from "./pokemon";
import GetHp from "util/getHp";

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
}) {
  const clickOutside = useRef();
  const evolveButtonRef = useRef();

  const handleOutsideClicks = (event) => {
    if (
      !clickOutside.current?.contains(event.target) &&
      evolveButtonRef.current !== event.target
    ) {
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

  const pokemonDropped = ({ shopPokemonId }) => {
    if (gamePokemon === undefined) {
      buyNewPokemon(order, shopPokemonId);
    } else {
      upgradePokemon(gamePokemon.id, shopPokemonId);
    }
  };

  const pokemonCanDrop = ({ pokemonId }) => {
    return (
      gold >= 3 &&
      (gamePokemon === undefined || pokemonId === gamePokemon.pokemonId)
    );
  };

  const gamePokemonDropped = ({ gamePokemonId, originalSpot }) => {
    if (originalSpot !== order) {
      rearrangeOrder(gamePokemonId, originalSpot, order);
    }
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

  const gamePokemonId = gamePokemon?.id;
  const [dragCollectables, drag, preview] = useDrag(() => ({
    type: "GamePokemon",
    item: { gamePokemonId, originalSpot: order },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    canDrag: () => {
      return canPerformAction;
    },
  }));

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

  const canEvolveInto =
    gamePokemon?.evolutions.filter((e) => e.minimumLevel <= gamePokemon.level)
      .length > 0;

  return (
    <div
      ref={gamePokemonDrop}
      className={`h-64 transition-colors ${
        dragCollectables.isDragging || !canPerformAction ? "opacity-50" : ""
      } ${collectables.isOver ? "bg-green-500" : ""}`}
    >
      <div
        ref={drop}
        className={`w-36 h-56 border-b border-gray-300 flex flex-col justify-end pb-1 transition-colors ${
          canDrop && isOver ? "bg-green-500" : ""
        } `}
      >
        {gamePokemon !== undefined && (
          <div className="text-center w-full">
            <Pokemon
              connectDragSource={preview}
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

      {gamePokemon !== undefined && (
        <div className="flex justify-center mt-2">
          <button
            onClick={sellGamePokemon}
            className="bg-red-600 text-red-50 px-3 rounded-lg h-6"
          >
            Sell
          </button>

          {canEvolveInto && (
            <>
              <div className="relative inline-block ml-1">
                <button
                  ref={evolveButtonRef}
                  onClick={checkEvolution}
                  className="bg-green-600 text-green-50 px-3 rounded-lg h-6"
                >
                  Evolve
                </button>
                {showEvolutions && (
                  <div
                    ref={clickOutside}
                    className="bg-white shadow-xl p-4 rounded-lg flex gap-2 absolute left-1/2 -translate-x-1/2 top-8"
                  >
                    {canEvolveInto.map((e) => (
                      <div
                        onClick={() => choseEvolution(e.into)}
                        className="w-32 flex flex-col items-center text-center hover:bg-purple-50 cursor-pointer"
                        key={e.into}
                      >
                        <Pokemon
                          name={e.EvolvesTo.name}
                          level={gamePokemon.level}
                          hp={GetHp(e.EvolvesTo.baseHp, gamePokemon.level)}
                          attack={GetHp(
                            e.EvolvesTo.baseAttack,
                            gamePokemon.level
                          )}
                          defense={GetHp(
                            e.EvolvesTo.baseDefense,
                            gamePokemon.level
                          )}
                          pokedexId={e.EvolvesTo.pokedexId}
                          isShiny={gamePokemon.isShiny}
                          tempHp={GetHp(e.EvolvesTo.baseHp, gamePokemon.level)}
                          pokemonTypes={e.EvolvesTo.pokemonTypes}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
