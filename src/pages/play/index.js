import prisma from "lib/prisma";
import MyPokemon from "components/myPokemon";
import ShopPokemon from "components/shopPokemon";
import GetShopPokemon from "prisma/queries/getShopPokemon";
import { useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useRouter } from "next/router";
import { withIronSessionSsr } from "iron-session/next";
import { sessionOptions } from "lib/session";

import CreateNewShopPokemon from "prisma/methods/createNewShopPokemon";
import GetGamePokemon from "prisma/methods/getGamePokemon";
import transformShopPokemonRecords from "prisma/methods/transformShopPokemonRecords";
import RearrangeGamePokemon from "util/rearrangeGamePokemon";
import { GetCurrentGame } from "prisma/queries/getCurrentGame";

const pokemonLength = Array.apply(null, Array(6)).map(function () {});

export default function Home(props) {
  const router = useRouter();
  const [shopPokemon, setShopPokemon] = useState(props.shopPokemon);
  const [game, setGame] = useState(props.game);
  const [myPokemon, setMyPokemon] = useState(props.myPokemonRecords);
  const [canPerformAction, setCanPerformAction] = useState(true);

  const allowPerformAction = () => setCanPerformAction(true);
  const disallowPerformAction = () => setCanPerformAction(false);

  const getNewPokemon = async () => {
    disallowPerformAction();
    const pokemonFetch = await fetch("api/shop_pokemon/new");
    const pokemonData = await pokemonFetch.json();
    setShopPokemon(pokemonData.pokemon);
    setGame({ ...game, gold: pokemonData.gold });
    allowPerformAction();
  };

  const updateShopPokemon = (shopPokemonId) => {
    setShopPokemon((pokemon) =>
      pokemon.map((p) => {
        if (p.id === shopPokemonId) {
          return {};
        } else {
          return p;
        }
      })
    );
  };

  const buyNewPokemon = async (order, shopPokemonId) => {
    disallowPerformAction();
    const body = {
      order: order,
      shopPokemonId: shopPokemonId,
      myPokemonOrder: myPokemon.map((m) => {
        return { id: m.id, orderNum: m.orderNum };
      }),
    };

    const buyRes = await fetch("/api/shop_pokemon/buy", {
      method: "POST",
      body: JSON.stringify(body),
    });
    const buyData = await buyRes.json();
    setMyPokemon(buyData.gamePokemon);
    setGame({ ...game, gold: buyData.gold });
    updateShopPokemon(shopPokemonId);
    allowPerformAction();
  };

  const upgradePokemon = async (gamePokemonId, shopPokemonId) => {
    disallowPerformAction();
    const body = {
      shopPokemonId: shopPokemonId,
      gameId: game.id,
      gamePokemonId: gamePokemonId,
    };
    const upgradeRes = await fetch("/api/shop_pokemon/buy", {
      method: "PATCH",
      body: JSON.stringify(body),
    });
    const upgradeData = await upgradeRes.json();
    setMyPokemon(upgradeData.gamePokemon);
    setGame({ ...game, gold: upgradeData.gold });
    updateShopPokemon(shopPokemonId);
    allowPerformAction();
  };

  const sellPokemon = async (gamePokemonId) => {
    disallowPerformAction();
    const body = { gamePokemonId: gamePokemonId };
    const sellRes = await fetch("/api/game_pokemon/sell", {
      method: "POST",
      body: JSON.stringify(body),
    });
    const sellData = await sellRes.json();
    setGame({ ...game, gold: sellData.gold });
    setMyPokemon((pokemon) => pokemon.filter((p) => p.id !== gamePokemonId));
    allowPerformAction();
  };

  const rearrangeOrder = (gamePokemonId, originalSpot, newOrderCol) => {
    const newPokemonOrder = RearrangeGamePokemon(myPokemon, gamePokemonId, originalSpot, newOrderCol);
    setMyPokemon(newPokemonOrder);
  };

  const evolvePokemon = async (gamePokemonId, newPokemonId) => {
    disallowPerformAction();
    const body = { gamePokemonId: gamePokemonId, newPokemonId: newPokemonId };
    const evolveRes = await fetch("/api/game_pokemon/evolve", {
      method: "POST",
      body: JSON.stringify(body),
    });
    const evolveData = await evolveRes.json();
    setMyPokemon((pokemon) =>
      pokemon.map((p) => {
        if (p.id === evolveData.gamePokemon.id) {
          return evolveData.gamePokemon;
        } else {
          return p;
        }
      })
    );
    allowPerformAction();
  };

  const searchForBattle = async () => {
    disallowPerformAction();
    const body = {
      myPokemonOrder: myPokemon.map((m) => {
        return { id: m.id, orderNum: m.orderNum };
      }),
    };

    const battleRes = await fetch(`/api/battle/new`, {
      method: "post",
      body: JSON.stringify(body),
    });

    const battleData = await battleRes.json();
    console.log(battleData);

    if (battleData.isSearching) {
      waitForBattle(battleData.id);
    }
  };

  const waitForBattle = (battleId) => {
    setTimeout(async function () {
      const battleRes = await fetch(`/api/battle/status?battleId=${battleId}`);
      const battleData = await battleRes.json();
      if (battleData.battle.isSearching) {
        waitForBattle(battleData.battle.id);
      } else if (!battleData.battle.isBattleOver) {
        waitForBattle(battleData.battle.id);
      } else {
        router.push(`battle/${battleId}`);
      }
    }, 1000);
  };

  const combinePokemon = async (pokemonId1, pokemonId2) => {
    disallowPerformAction();
    const body = {
      pokemonId1,
      pokemonId2,
      myPokemonOrder: myPokemon
        .filter((m) => m.id !== pokemonId2)
        .map((m) => {
          return { id: m.id, orderNum: m.orderNum };
        }),
    };

    const combineRes = await fetch("/api/game_pokemon/combine", {
      method: "POST",
      body: JSON.stringify(body),
    });
    const combineData = await combineRes.json();
    setMyPokemon(combineData.gamePokemon);
    allowPerformAction();
  };

  return (
    <div className="max-w-screen-lg mx-auto pt-12">
      <div className="flex gap-2 mb-4">
        <div>Game stats:</div>
        <div>Gold: {game.gold}</div>
        <div>Round: {game.round}</div>
        <div>lives: {game.lives}</div>
        <div>wins: {game.wins}</div>
      </div>

      <DndProvider backend={HTML5Backend}>
        <div className="mb-8">
          <h4 className="text-xl">My Pokemon</h4>
          <div className="flex justify-between items-center">
            {pokemonLength.map((_p, index) => {
              const gamePokemon = myPokemon.filter((pokemon) => pokemon.orderNum === index)[0];
              return (
                <MyPokemon
                  gold={game.gold}
                  gamePokemon={gamePokemon}
                  order={index}
                  key={`${index}-${gamePokemon === undefined ? "undefined" : gamePokemon.id}`}
                  buyNewPokemon={buyNewPokemon}
                  upgradePokemon={upgradePokemon}
                  sellPokemon={sellPokemon}
                  rearrangeOrder={rearrangeOrder}
                  allPokemon={myPokemon}
                  evolvePokemon={evolvePokemon}
                  canPerformAction={canPerformAction}
                  combinePokemon={combinePokemon}
                />
              );
            })}
          </div>
        </div>

        <h4 className="text-lg">Shop Pokemon</h4>
        <div className="flex justify-center gap-8">
          {shopPokemon.map((pokemon, index) => (
            <div
              key={pokemon?.id ? `shop-${pokemon.id}-${pokemon.pokemonId}` : `shopUndefined-${index}`}
              className="h-52 w-32"
            >
              {Object.keys(pokemon).length !== 0 && <ShopPokemon shopPokemon={pokemon} canDrag={canPerformAction} />}
            </div>
          ))}
        </div>
      </DndProvider>
      <button
        disabled={!canPerformAction || game.gold < 1}
        className="bg-gray-100 rounded-lg px-4 h-10 disabled:opacity-30"
        onClick={getNewPokemon}
      >
        Get New Pokemon
      </button>

      <button
        disabled={!canPerformAction}
        onClick={searchForBattle}
        className="disabled:opacity-30 bg-indigo-500 text-white rounded-lg px-4 h-10"
      >
        Battle
      </button>
    </div>
  );
}

export const getServerSideProps = withIronSessionSsr(async function getServerSideProps({ req }) {
  const user = req.session.user;

  if (!user) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const userId = user.id;

  let game = await GetCurrentGame(prisma, userId);

  if (game === null) {
    game = await prisma.game.create({
      data: {
        userId: userId,
      },
    });

    await CreateNewShopPokemon(prisma, game.id, game.round, 3);
  }

  let shopPokemonRecords = await GetShopPokemon(prisma, game.id);
  const shopPokemon = transformShopPokemonRecords(shopPokemonRecords);

  const myPokemonRecords = await GetGamePokemon(prisma, game.id);

  return { props: { game, shopPokemon, myPokemonRecords } };
}, sessionOptions);
