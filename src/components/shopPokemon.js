import { useDrag } from "react-dnd";
import GetHp from "util/getHp";
import GetNotHpStat from "util/getNotHpStat";
import Pokemon from "./pokemon";

export default function ShopPokemon({ shopPokemon, canDrag }) {
  const pokemonId = shopPokemon.pokemonId;
  const shopPokemonId = shopPokemon.id;
  const [{ isDragging }, drag, preview] = useDrag(
    () => ({
      type: "Pokemon",
      item: { pokemonId, shopPokemonId },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
      canDrag: () => {
        return canDrag;
      },
    }),
    [canDrag]
  );

  return (
    <div
      className={`${
        isDragging || !canDrag ? "opacity-25" : "opacity-100"
      } w-full text-center`}
    >
      <Pokemon
        connectDragSource={preview}
        pokemonRef={drag}
        name={shopPokemon.name}
        level={shopPokemon.level}
        hp={GetHp(shopPokemon.baseStats.hp, shopPokemon.level)}
        tempHp={GetHp(shopPokemon.baseStats.hp, shopPokemon.level)}
        attack={GetNotHpStat(shopPokemon.baseStats.attack, shopPokemon.level)}
        defense={GetNotHpStat(shopPokemon.baseStats.defense, shopPokemon.level)}
        pokedexId={shopPokemon.pokemonId}
        pokemonTypes={shopPokemon.types}
      />
    </div>
  );
}
