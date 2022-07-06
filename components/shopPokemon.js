import { useDrag } from "react-dnd";
import GetHp from "util/getHp";
import GetNotHpStat from "util/getNotHpStat";
import Pokemon from "./pokemon";

export default function ShopPokemon({ shopPokemon, canDrag }) {
  const pokemonId = shopPokemon.pokemon.id;
  const shopPokemonid = shopPokemon.id;
  const [{ isDragging }, drag, preview] = useDrag(
    () => ({
      type: "Pokemon",
      item: { pokemonId, shopPokemonid },
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
    <div className={`${isDragging || !canDrag ? "opacity-25" : "opacity-100"} w-full text-center`}>
      <Pokemon
        connectDragSource={preview}
        pokemonRef={drag}
        name={shopPokemon.pokemon.name}
        level={shopPokemon.level}
        hp={GetHp(shopPokemon.pokemon.baseHp, shopPokemon.level)}
        tempHp={GetHp(shopPokemon.pokemon.baseHp, shopPokemon.level)}
        attack={GetNotHpStat(shopPokemon.pokemon.baseAttack, shopPokemon.level)}
        defense={GetNotHpStat(shopPokemon.pokemon.baseDefense, shopPokemon.level)}
        pokedexId={shopPokemon.pokemon.pokedexId}
        pokemonTypes={shopPokemon.pokemon.pokemonTypes}
      />
    </div>
  );
}
