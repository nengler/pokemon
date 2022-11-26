import prisma from "lib/prisma";
import MyPokemon from "components/myPokemon";
import ShopPokemon from "components/shopPokemon";
import GetShopPokemon from "prisma/queries/getShopPokemon";
import { useEffect, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";
import { useRouter } from "next/router";
import { withIronSessionSsr } from "iron-session/next";
import { sessionOptions } from "lib/session";

import CreateNewShopPokemon from "prisma/methods/createNewShopPokemon";
import GetGamePokemon from "prisma/methods/getGamePokemon";
import transformShopPokemonRecords from "prisma/methods/transformShopPokemonRecords";
import RearrangeGamePokemon from "util/rearrangeGamePokemon";
import { GetCurrentGame } from "prisma/queries/getCurrentGame";
import { shopPokemonNumber } from "constants/gameConfig";

const pokemonLength = Array.apply(null, Array(6)).map(function () {});
const shopLength = Array.apply(null, Array(4)).map(function () {});

export default function Home(props) {
  const router = useRouter();
  const [shopPokemon, setShopPokemon] = useState(props.shopPokemon);
  const [game, setGame] = useState(props.game);
  const [myPokemon, setMyPokemon] = useState(props.myPokemonRecords);
  const [canPerformAction, setCanPerformAction] = useState(props.waitingForBattle ? false : true);

  const allowPerformAction = () => setCanPerformAction(true);
  const disallowPerformAction = () => setCanPerformAction(false);

  useEffect(() => {
    if (props.waitingForBattle?.id) {
      waitForBattle(props.waitingForBattle.id);
    }
  }, []);

  const pokemonFrozenStatus = () => {
    return {
      frozen: shopPokemon.filter((s) => s.isFrozen === true).map((s) => s.id),
      notFrozen: shopPokemon.filter((s) => s.isFrozen === false).map((s) => s.id),
    };
  };

  const getNewPokemon = async () => {
    disallowPerformAction();

    const pokemonFetch = await fetch("api/shop_pokemon/new", {
      method: "POST",
      body: JSON.stringify(pokemonFrozenStatus()),
    });
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
      ...pokemonFrozenStatus(),
    };

    const battleRes = await fetch(`/api/battle/new`, {
      method: "post",
      body: JSON.stringify(body),
    });

    const battleData = await battleRes.json();

    if (battleData.isSearching || !battleData.isBattleOver) {
      waitForBattle(battleData.id);
    } else {
      router.push(`battle/${battleData.id}`);
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

  const changeFrozenState = (shopPokemonId, isFrozen) => {
    setShopPokemon((pokemon) =>
      pokemon.map((p) => {
        if (p.id === shopPokemonId) {
          return { ...p, isFrozen };
        } else {
          return p;
        }
      })
    );
  };

  return (
    <div className="max-w-screen-lg mx-auto pt-12 px-3">
      <div className="flex gap-2 mb-4">
        <div>gold: {game.gold}</div>
        <div>round: {game.round}</div>
        <div>lives: {game.lives}</div>
        <div>wins: {game.wins}</div>
      </div>

      <DndProvider backend={props.isMobile ? TouchBackend : HTML5Backend}>
        <div className="mb-8">
          <div className="flex flex-wrap justify-between">
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

        <h4 className="text-lg">shop pokemon</h4>
        <div className="flex justify-center gap-8">
          {shopLength.map((_, index) => {
            const shopMon = shopPokemon[index];
            return (
              <div
                key={shopMon?.id ? `shop-${shopMon.id}-${shopMon.pokemonId}` : `shopUndefined-${index}`}
                className="w-28"
              >
                {shopMon && Object.keys(shopMon).length !== 0 && (
                  <ShopPokemon changeFrozenState={changeFrozenState} shopPokemon={shopMon} canDrag={canPerformAction} />
                )}
              </div>
            );
          })}
        </div>
      </DndProvider>
      <div className="mt-10 gap-3 flex justify-end">
        <button disabled={!canPerformAction || game.gold < 1} className="btn btn-secondary" onClick={getNewPokemon}>
          get new pokemon
        </button>

        <button disabled={!canPerformAction} onClick={searchForBattle} className="btn btn-primary">
          battle
        </button>
      </div>
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

    await CreateNewShopPokemon(prisma, game.id, game.round, shopPokemonNumber);
  }

  const shopPokemonRecords = await GetShopPokemon(prisma, game.id);
  const shopPokemon = transformShopPokemonRecords(shopPokemonRecords);

  const myPokemonRecords = await GetGamePokemon(prisma, game.id);

  const waitingForBattle = await prisma.battle.findFirst({
    where: {
      game1Id: game.id,
      round: game.round,
      isSearching: true,
    },
    select: {
      id: true,
    },
  });

  const isMobile = Boolean(
    req.headers["user-agent"].match(/Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i)
  );

  return { props: { game, shopPokemon, myPokemonRecords, waitingForBattle: waitingForBattle, isMobile } };
}, sessionOptions);
