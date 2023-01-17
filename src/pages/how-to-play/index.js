import pokemonByShopLevel from "constants/pokemonByShopLevel";
import pokemon from "constants/pokemon";
import PokemonImage from "util/pokemonImage";
import GetPokemonLevelRange from "util/getPokemonLevelRange";
import { Fragment } from "react";
import Link from "next/link";
import SoundPopover from "components/soundPopover";

export default function HowToPlay({ pokemonByShop, soundSlider, musicSlider }) {
  return (
    <>
      <nav className="shadow-lg shadow-indigo-100 sticky top-0 bg-white">
        <div className="max-w-screen-lg px-4 py-3 mx-auto flex justify-between items-center">
          <div className="text-lg text-indigo-500 font-bold underline decoration-wavy">untitled pokemon game</div>
          <div className="flex items-center gap-2">
            <Link href="/">
              <a className="text-indigo-500 hover:underline transition">home</a>
            </Link>
            <SoundPopover soundSlider={soundSlider} musicSlider={musicSlider} />
          </div>
        </div>
      </nav>
      <div className="max-w-screen-md mx-auto px-4 mt-4">
        <h1 className="text-5xl mb-4 text-indigo-500">how to play</h1>
        <div className="mb-5">
          <h3 className="text-2xl mb-2 text-indigo-500">shop</h3>
          <p className="mb-1">
            every turn youll be given 10 gold to purchase pokemon or search the pokemon to find new pokemon.
          </p>
          <p className="mb-1">purchasing a pokemon costs 3 gold and rolling the shop costs 1 gold.</p>
          <p>
            after you've used all your gold, you can search for a battle. you win by getting 10 wins before losing 4
            times
          </p>
        </div>
        <div>
          <h3 className="text-2xl mb-2 text-indigo-500">pokemon by shop level</h3>
          {Object.keys(pokemonByShop).map((shopLevel) => {
            const { pokemon: pokemonAtShopLevel, levelRange } = pokemonByShop[shopLevel];
            return (
              <div className="mb-5" key={shopLevel}>
                <div className="flex items-baseline gap-3">
                  <h4 className="text-xl">{shopLevel}.</h4>
                  <span>
                    levels of all pokemon from shop -{" "}
                    {levelRange.map((level, index) => (
                      <Fragment key={level}>
                        {index > 0 && ", "}
                        {index === levelRange.length - 1 && levelRange.length > 1 && "or "}
                        {level}
                      </Fragment>
                    ))}
                  </span>
                </div>
                <div className="flex flex-wrap">
                  {pokemonAtShopLevel.map((pokemon) => (
                    <div key={pokemon.id}>
                      <img alt={`${pokemon.name}`} src={PokemonImage(pokemon.id, false)} />
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

export const getServerSideProps = () => {
  const pokemonByShop = {};
  for (const [shopLevel, pokemonIds] of Object.entries(pokemonByShopLevel)) {
    pokemonByShop[shopLevel] = {
      pokemon: pokemonIds.map((id) => {
        const { name, types } = pokemon[id];
        return { id, name, types };
      }),
      levelRange: GetPokemonLevelRange(shopLevel),
    };
  }
  return { props: { pokemonByShop } };
};
