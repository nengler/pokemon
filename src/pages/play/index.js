import prisma from "lib/prisma";
import MyPokemon from "components/myPokemon";
import ShopPokemon from "components/shopPokemon";
import GetShopPokemon from "prisma/queries/getShopPokemon";
import { useEffect, useState } from "react";
import { DndProvider } from "react-dnd";
import MouseBackEnd from "react-dnd-mouse-backend";
import { TouchBackend } from "react-dnd-touch-backend";
import { useRouter } from "next/router";
import { withIronSessionSsr } from "iron-session/next";
import { sessionOptions } from "lib/session";

import CreateNewShopPokemon from "prisma/methods/createNewShopPokemon";
import GetGamePokemon from "prisma/methods/getGamePokemon";
import transformShopPokemonRecords from "prisma/methods/transformShopPokemonRecords";
import RearrangeGamePokemon from "util/rearrangeGamePokemon";
import { GetCurrentGame } from "prisma/queries/getCurrentGame";
import { maxTeamSize, shopPokemonNumber } from "constants/gameConfig";
import WheelTransition from "components/play/wheelTransition";
import RandomBlocksTransition from "components/play/randomBlocksTransition";
import GetRandomElement from "util/getRandomElement";
import SoundPopover from "components/soundPopover";
import Image from "next/image";
import getBackgroundType from "util/getBackgroundType";
import { usePreview } from "react-dnd-preview";
import PokemonImage from "util/pokemonImage";
import styles from "../../styles/myPokemon.module.css";

const pokemonLength = Array.apply(null, Array(maxTeamSize)).map(function () {});
const shopLength = Array.apply(null, Array(shopPokemonNumber)).map(function () {});

const MyPreview = () => {
  const preview = usePreview();

  if (!preview.display) {
    return null;
  }
  const { item, style } = preview;
  return (
    <div className="z-[2]" style={style}>
      <div
        className={`${styles.pokemonDimensions} -scale-x-100`}
        style={{
          backgroundImage: `url(${PokemonImage(item.pokemonId, false)})`,
          backgroundSize: "100% 100%",
        }}
      />
    </div>
  );
};

export default function Home(props) {
  const backgroundType = getBackgroundType(props.game.id * props.game.round);
  const pageAnimation = () => {
    const animations = [<WheelTransition />, <RandomBlocksTransition />];
    return GetRandomElement(animations);
  };

  const actionStates = {
    ALLOW_ACTION: "allow_action",
    UPDATING_POKEMON: "updating_pokemon",
    SEARCHING_FOR_BATTLE: "searching_for_battle",
  };

  const router = useRouter();
  const [shopPokemon, setShopPokemon] = useState(props.shopPokemon);
  const [game, setGame] = useState(props.game);
  const [myPokemon, setMyPokemon] = useState(props.myPokemonRecords);
  const [actionState, setActionState] = useState(
    props.waitingForBattle ? actionStates.SEARCHING_FOR_BATTLE : actionStates.ALLOW_ACTION
  );
  const [pageTransition, setPageTransition] = useState({ isRunning: false, timeout: 2500, animation: pageAnimation() });

  const canPerformAction = actionState === actionStates.ALLOW_ACTION;

  const allowPerformAction = () => setActionState(actionStates.ALLOW_ACTION);
  const updatingPokemon = () => setActionState(actionStates.UPDATING_POKEMON);
  const searchingForBattle = () => setActionState(actionStates.SEARCHING_FOR_BATTLE);

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
    updatingPokemon();

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

  const buyNewPokemon = async (order, shopPokemonId, pokemonId) => {
    updatingPokemon();
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
    props.spawnPokemonSound(pokemonId);
  };

  const sellPokemon = async (gamePokemonId) => {
    updatingPokemon();
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
    RearrangeGamePokemon(setMyPokemon, gamePokemonId, originalSpot, newOrderCol);
  };

  const upgradePokemon = async (gamePokemonId, shopPokemonId) => {
    updatingPokemon();
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
    setMyPokemon((pokemon) =>
      pokemon.map((p) => {
        if (p.id === upgradeData.gamePokemon.id) {
          return { ...upgradeData.gamePokemon, orderNum: p.orderNum };
        } else {
          return p;
        }
      })
    );
    setGame({ ...game, gold: upgradeData.gold });
    updateShopPokemon(shopPokemonId);
    allowPerformAction();
  };

  const evolvePokemon = async (gamePokemonId, newPokemonId) => {
    updatingPokemon();
    const body = { gamePokemonId: gamePokemonId, newPokemonId: newPokemonId };
    const evolveRes = await fetch("/api/game_pokemon/evolve", {
      method: "POST",
      body: JSON.stringify(body),
    });
    const evolveData = await evolveRes.json();
    setMyPokemon((pokemon) =>
      pokemon.map((p) => {
        if (p.id === evolveData.gamePokemon.id) {
          return { ...evolveData.gamePokemon, orderNum: p.orderNum };
        } else {
          return p;
        }
      })
    );
    allowPerformAction();
    props.spawnPokemonSound(evolveData.gamePokemon.pokemonId);
  };

  const searchForBattle = async () => {
    searchingForBattle();
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
      startPageTransition(battleData.id);
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
        startPageTransition(battleId);
      }
    }, 1000);
  };

  function startPageTransition(battleId) {
    const songToPlay = Math.floor(Math.random() * 2) === 0 ? "gym_battle_1" : "gym_battle_3";
    props.childPlaySong(songToPlay);
    setTimeout(() => {
      setPageTransition({ ...pageTransition, isRunning: true });
    }, 500);
    setTimeout(() => {
      router.push(`battle/${battleId}`);
    }, 3000);
  }

  const combinePokemon = async (pokemonId1, pokemonId2) => {
    updatingPokemon();
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
    <div className={`${backgroundType.class} min-w-screen min-h-screen`}>
      <meta name="theme-color" content={pageTransition.isRunning ? "#111827" : backgroundType.color} />
      <div
        className="max-w-screen-lg mx-auto py-3 lg:pt-12 px-3 fadeInAnimation"
        style={{ "--fadeinduration": "750ms" }}
      >
        <div className="flex justify-between">
          <div className="flex gap-2 sm:gap-4">
            <div className="flex gap-1">
              {game.gold} coin{game.gold !== 1 && "s"}
            </div>
            <div>round: {game.round}</div>
            <div>lives: {game.lives}</div>
            <div>wins: {game.wins}/10</div>
          </div>

          <SoundPopover musicSlider={props.musicSlider} soundSlider={props.soundSlider} />
        </div>

        <DndProvider backend={props.isMobile ? TouchBackend : MouseBackEnd}>
          <MyPreview />
          <div className="mb-6">
            <div className="flex flex-wrap justify-between gap-3 md:gap-8">
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
                    platformImage={backgroundType.platformImage}
                  />
                );
              })}
            </div>
          </div>

          <div className="mb-2 flex items-baseline gap-1">
            <h4 className="text-lg">shop pokemon </h4>
            <span>(3 coins)</span>
          </div>
          <div className="flex justify-between md:justify-center md:gap-8">
            {shopLength.map((_, index) => {
              const shopMon = shopPokemon[index];
              return (
                <div
                  key={shopMon?.id ? `shop-${shopMon.id}-${shopMon.pokemonId}` : `shopUndefined-${index}`}
                  className={`${
                    !canPerformAction ? "opacity-50" : ""
                  } w-[23vw] h-[calc(23vw_+_52px)] md:w-32 md:h-[180px] relative`}
                >
                  <div className="absolute bottom-16 w-full scale-y-150 md:scale-125">
                    <Image src={backgroundType.platformImage} width={256} height={70} />
                  </div>
                  {shopMon && Object.keys(shopMon).length !== 0 && (
                    <ShopPokemon
                      changeFrozenState={changeFrozenState}
                      shopPokemon={shopMon}
                      canPerformAction={canPerformAction}
                      canPurchase={game.gold >= 3}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </DndProvider>
        <div className="mt-10">
          {actionState === actionStates.SEARCHING_FOR_BATTLE && (
            <div className="text-center text-indigo-500 underline">Searching for opponent</div>
          )}
          <div className=" gap-3 flex justify-end">
            <button disabled={!canPerformAction || game.gold < 1} className="btn btn-secondary" onClick={getNewPokemon}>
              get new pokemon (1 coin)
            </button>

            <button disabled={!canPerformAction} onClick={searchForBattle} className="btn btn-primary">
              battle
            </button>
          </div>
        </div>
      </div>
      {pageTransition.isRunning && pageTransition.animation}
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
