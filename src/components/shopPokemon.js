import { DragPreviewImage, useDrag } from "react-dnd";
import GetHp from "util/getHp";
import GetNotHpStat from "util/getNotHpStat";
import PokemonImage from "util/pokemonImage";
import Pokemon from "./pokemon";

export default function ShopPokemon({ shopPokemon, canPurchase, canPerformAction, changeFrozenState }) {
  const { pokemonId, id: shopPokemonId, isFrozen } = shopPokemon;
  const [{ isDragging }, drag, preview] = useDrag(
    () => ({
      type: "Pokemon",
      item: { pokemonId, shopPokemonId },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
      canDrag: () => {
        return canPerformAction && canPurchase;
      },
    }),
    [canPerformAction, canPurchase]
  );

  return (
    <div className={`${isDragging || !canPerformAction ? "opacity-25" : "opacity-100"} w-full text-center`}>
      <div className={`pb-1 rounded-lg ${isFrozen ? "bg-cyan-100" : ""}`}>
        {preview !== undefined && (
          <DragPreviewImage src={PokemonImage(shopPokemon.pokemonId, shopPokemon.isShiny)} connect={preview} />
        )}
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
      <button onClick={() => changeFrozenState(shopPokemonId, !isFrozen)} className="btn sm btn-freeze">
        {shopPokemon.isFrozen ? "unfreeze" : "freeze"}
      </button>
    </div>
  );
}
