import prisma from "lib/prisma";
import MyPokemon from "components/myPokemon";
import ShopPokemon from "components/shopPokemon";
import GetRandomPokemon from "prisma/queries/getRandomPokemon";
import GetShopPokemon from "prisma/queries/getShopPokemon";
import { useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useRouter } from "next/router";

import GetPokemonLevelRange from "util/getPokemonLevelRange";
import isShiny from "util/isShiny";
import GamePokemonSelect from "prisma/queries/gamePokemonSelect";

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
    const pokemonFetch = await fetch(`api/shop_pokemon/new?gameId=${game.id}`);
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
      gameId: game.id,
      myPokemonOrder: myPokemon.map((m) => {
        return { id: m.id, orderNum: m.orderNum };
      }),
    };
    const buyRes = await fetch("/api/shop_pokemon/buy", {
      method: "POST",
      body: JSON.stringify(body),
    });
    const buyData = await buyRes.json();
    setMyPokemon((pokemonArray) => [...pokemonArray, buyData.gamePokemon]);
    setGame({ ...game, gold: buyData.gold });
    updateShopPokemon(shopPokemonId);
    allowPerformAction();
  };

  const upgradePokemon = async (gamePokemonId, shopPokemonId) => {
    disallowPerformAction();
    const body = { shopPokemonId: shopPokemonId, gameId: game.id, gamePokemonId: gamePokemonId };
    const upgradeRes = await fetch("/api/shop_pokemon/buy", {
      method: "PATCH",
      body: JSON.stringify(body),
    });
    const upgradeData = await upgradeRes.json();
    setMyPokemon((pokemonArray) =>
      pokemonArray.map((p) => {
        if (p.id === upgradeData.gamePokemon.id) {
          return {
            ...p,
            level: upgradeData.gamePokemon.level,
            hp: upgradeData.gamePokemon.hp,
            attack: upgradeData.gamePokemon.attack,
            defense: upgradeData.gamePokemon.defense,
          };
        } else {
          return p;
        }
      })
    );
    setGame({ ...game, gold: upgradeData.gold });
    updateShopPokemon(shopPokemonId);
    allowPerformAction();
  };

  const sellPokemon = async (gamePokemonId) => {
    disallowPerformAction();
    const body = { gamePokemonId: gamePokemonId, gameId: game.id };
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
    if (myPokemon.filter((p) => p.orderNum === newOrderCol)[0] !== undefined) {
      const pokemonClone = structuredClone(myPokemon);
      pokemonClone.filter((p) => p.id === gamePokemonId)[0].orderNum = newOrderCol;
      if (newOrderCol === 5 || newOrderCol === 0) {
        const sort =
          newOrderCol === 5
            ? (a, b) => (a.orderNum > b.orderNum ? -1 : 1)
            : (a, b) => (a.orderNum > b.orderNum ? 1 : -1);
        pokemonClone.sort(sort);
        const direction = newOrderCol === 5 ? -1 : 1;

        pokemonClone.forEach((p, index) => {
          if (p.id === gamePokemonId) {
            return;
          } else if (pokemonClone.filter((po) => po.orderNum === p.orderNum).length === 2) {
            pokemonClone[index] = { ...p, orderNum: p.orderNum + direction };
          }
        });
        setMyPokemon(pokemonClone);
      } else if (Math.abs(originalSpot - newOrderCol) === 1) {
        pokemonClone.filter((p) => p.orderNum === newOrderCol && p.id !== gamePokemonId)[0].orderNum = originalSpot;
        setMyPokemon(pokemonClone);
      } else {
        const sort =
          newOrderCol > originalSpot
            ? (a, b) => (a.orderNum > b.orderNum ? -1 : 1)
            : (a, b) => (a.orderNum > b.orderNum ? 1 : -1);
        pokemonClone.sort(sort);

        console.log(JSON.parse(JSON.stringify(pokemonClone)));

        pokemonClone.forEach((p, index) => {
          if (
            p.id !== gamePokemonId &&
            p.orderNum !== 0 &&
            p.orderNum !== 5 &&
            pokemonClone.filter((po) => po.orderNum === p.orderNum).length === 2
          ) {
            const direction = newOrderCol > originalSpot ? -1 : 1;
            pokemonClone[index] = { ...p, orderNum: p.orderNum + direction };
          }
        });

        setMyPokemon(pokemonClone);
      }
    } else {
      setMyPokemon((pokemon) =>
        pokemon.map((p) => {
          if (p.id === gamePokemonId) {
            return { ...p, orderNum: newOrderCol };
          } else {
            return p;
          }
        })
      );
    }
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
      gameId: game.id,
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

  return (
    <div className="max-w-screen-lg mx-auto pt-12">
      <div className="flex gap-2 mb-4">
        <div>Game stats:</div>
        <div>Gold: {game.gold}</div>
        <div>Round: {game.round}</div>
        <div>lives: {game.lives}</div>
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
        disabled={!canPerformAction}
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

export async function getServerSideProps() {
  const userId = 1;
  let game = await prisma.game.findFirst({
    where: {
      userId: userId,
      NOT: {
        lives: 0,
      },
    },
  });

  if (game === null) {
    game = await prisma.game.create({
      data: {
        userId: userId,
        lives: 4,
        round: 1,
        state: 1,
        gold: 10,
      },
    });
  }

  let shopPokemon = await GetShopPokemon(prisma, game.id);

  if (shopPokemon.length === 0) {
    const pokemon1 = await GetRandomPokemon(prisma);
    const pokemon2 = await GetRandomPokemon(prisma);
    const pokemon3 = await GetRandomPokemon(prisma);
    const levelRange = GetPokemonLevelRange(game.round);

    const shopPokemonData = [
      {
        gameId: game.id,
        pokemonId: pokemon1[0].id,
        isShiny: isShiny(),
        level: levelRange[Math.floor(Math.random() * levelRange.length)],
      },
      {
        gameId: game.id,
        pokemonId: pokemon2[0].id,
        isShiny: isShiny(),
        level: levelRange[Math.floor(Math.random() * levelRange.length)],
      },
      {
        gameId: game.id,
        pokemonId: pokemon3[0].id,
        isShiny: isShiny(),
        level: levelRange[Math.floor(Math.random() * levelRange.length)],
      },
    ];

    await prisma.shopPokemon.createMany({
      data: shopPokemonData,
    });

    shopPokemon = await GetShopPokemon(prisma, game.id);
  }

  const myPokemonRecords = await prisma.gamePokemon.findMany({
    where: {
      gameId: game.id,
    },
    ...GamePokemonSelect(),
  });

  return { props: { game, shopPokemon, myPokemonRecords } };
}
