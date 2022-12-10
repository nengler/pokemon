import useInterval from "components/useInterval";
import pokemon from "constants/pokemon";
import prisma from "lib/prisma";
import { useState, useRef } from "react";
import calculateDamage from "util/calculateDamage";
import { withIronSessionSsr } from "iron-session/next";
import { sessionOptions } from "lib/session";
import PokeBalls from "components/battle/pokeballs";
import { BattlePokemon } from "components/battle/battlePokemon";
import { battleStates } from "constants/gameConfig";
import { useRouter } from "next/router";

const animationCheck = {
  logic: "logic",
  fightingAnimations: "Fighting Animations",
  nextPokemon: "Next Pokemon",
  spawningPokemon: "Spawning Pokemon",
};

let animationType = animationCheck.nextPokemon;

export default function Battle(props) {
  const [myBattlePokemon, setMyBattlePokemon] = useState(props.battlePokemon.filter((b) => b.gameId === props.game.id));
  const [enemyBattlePokemon, setEnemyBattlePokemon] = useState(
    props.battlePokemon.filter((b) => b.gameId !== props.game.id).map((b, index) => ({ ...b, seen: index === 0 }))
  );
  const [myCurrentBattler, setMyCurrentBattler] = useState({});
  const [enemyCurrentBattler, setEnemyCurrentBattler] = useState({});

  const [isFighting, setIsFighting] = useState(true);
  const myTeamRef = useRef();
  const enemyTeamRef = useRef();

  const [fightingAnimations, setFightingAnimations] = useState([]);

  const handlePokemonLogic = async () => {
    const myFightingPokemon = myBattlePokemon.find((p) => p.tempHp > 0);
    const enemyFightingPokemon = enemyBattlePokemon.find((p) => p.tempHp > 0);

    const calculateMyAttack = await calculateDamage(
      myFightingPokemon.level,
      myFightingPokemon.attack,
      enemyFightingPokemon.defense,
      myFightingPokemon.types,
      enemyFightingPokemon.types
    );

    const calculateEnemyAttack = await calculateDamage(
      enemyFightingPokemon.level,
      enemyFightingPokemon.attack,
      myFightingPokemon.defense,
      enemyFightingPokemon.types,
      myFightingPokemon.types
    );

    const myNewHp = myFightingPokemon.tempHp - calculateEnemyAttack.damageDealt;
    const enemyNewHp = enemyFightingPokemon.tempHp - calculateMyAttack.damageDealt;

    // console.log(`${myFightingPokemon.name} took ${calculateEnemyAttack.damageDealt} Damage`);
    // console.log(`${enemyFightingPokemon.name} took ${calculateMyAttack.damageDealt} Damage`);

    setFightingAnimations([
      {
        type: calculateMyAttack.type,
        damageDealt: calculateEnemyAttack.damageDealt,
        effect: calculateEnemyAttack.effect,
        time: new Date(),
        pokemonId: myFightingPokemon.id,
      },
      {
        type: calculateEnemyAttack.type,
        damageDealt: calculateMyAttack.damageDealt,
        effect: calculateMyAttack.effect,
        time: new Date(),
        pokemonId: enemyFightingPokemon.id,
      },
    ]);

    props.childPlaySound("/assets/acid_armor.mp3");

    // return;

    setMyBattlePokemon((pokemon) =>
      pokemon.map((p) => {
        if (p.id === myFightingPokemon.id) {
          return { ...p, tempHp: myNewHp };
        } else {
          return p;
        }
      })
    );

    setEnemyBattlePokemon((pokemon) =>
      pokemon.map((p) => {
        if (p.id === enemyFightingPokemon.id) {
          return { ...p, tempHp: enemyNewHp };
        } else {
          return p;
        }
      })
    );
  };

  const handleMyFightingUpdate = (battler, battlePokemon) => {
    let { id, status } = battler;
    const newMyBattlePokemon = battlePokemon.map((pokemon) => {
      if (pokemon.tempHp <= 0) {
        if (pokemon.id === id && status === battleStates.fighting) {
          status = battleStates.death;
        }
        return { ...pokemon, hasFainted: true };
      } else {
        return pokemon;
      }
    });

    return [id, status, newMyBattlePokemon];
  };

  const handleEnemyFightingUpdate = (battler, battlePokemon) => {
    let { id, status } = battler;
    let shouldShowNewPokemon = true;
    const newEnemyBattlePokemon = battlePokemon.map((p) => {
      if (p.tempHp <= 0) {
        shouldShowNewPokemon = true;
        if (p.id === id && status === battleStates.fighting) {
          status = battleStates.death;
        }
        return { ...p, hasFainted: true };
      } else {
        const seenObject = { seen: shouldShowNewPokemon };
        shouldShowNewPokemon = false;
        return { ...p, ...seenObject };
      }
    });

    return [id, status, newEnemyBattlePokemon];
  };

  const updateFightingAnimations = () => {
    const [myCurrentBattlerId, myCurrentBattlerStatus, newMyBattlePokemon] = handleMyFightingUpdate(
      myCurrentBattler,
      myBattlePokemon
    );

    setMyBattlePokemon(newMyBattlePokemon);
    setMyCurrentBattler({ id: myCurrentBattlerId, status: myCurrentBattlerStatus });

    const [enemyCurrentBattlerId, enemyCurrentBattlerStatus, newEnemyBattlePokemon] = handleEnemyFightingUpdate(
      enemyCurrentBattler,
      enemyBattlePokemon
    );

    setEnemyBattlePokemon(newEnemyBattlePokemon);
    setEnemyCurrentBattler({ id: enemyCurrentBattlerId, status: enemyCurrentBattlerStatus });

    setFightingAnimations([]);

    return myCurrentBattlerStatus === battleStates.death || enemyCurrentBattlerStatus === battleStates.death;
  };

  function showNewPokemon() {
    if (myCurrentBattler.status === battleStates.death || !myCurrentBattler.status) {
      updateCurrentBattler(myBattlePokemon, setMyCurrentBattler);
    }

    if (enemyCurrentBattler.status === battleStates.death || !myCurrentBattler.status) {
      updateCurrentBattler(enemyBattlePokemon, setEnemyCurrentBattler);
    }
  }

  function updateCurrentBattler(battlePokemon, updateBattlerFunction) {
    const notFaintedPokemon = battlePokemon.find((m) => !m.hasFainted);
    if (notFaintedPokemon) {
      updateBattlerFunction({ id: notFaintedPokemon.id, status: battleStates.spawning });
    } else {
      updateBattlerFunction({});
    }
  }

  function spawnNewPokemon() {
    if (myCurrentBattler.status === battleStates.spawning) {
      setMyCurrentBattler({ ...myCurrentBattler, status: battleStates.fighting });
    }

    if (enemyCurrentBattler.status === battleStates.spawning) {
      setEnemyCurrentBattler({ ...enemyCurrentBattler, status: battleStates.fighting });
    }
  }

  const isFightOver = () => {
    const myFightingPokemon = myBattlePokemon.find((p) => p.tempHp > 0);
    const enemyFightingPokemon = enemyBattlePokemon.find((p) => p.tempHp > 0);
    return myFightingPokemon === undefined || enemyFightingPokemon === undefined;
  };

  useInterval(
    () => {
      switch (animationType) {
        case animationCheck.logic:
          handlePokemonLogic();
          animationType = animationCheck.fightingAnimations;
          break;
        case animationCheck.fightingAnimations:
          const spawnNextpokemon = updateFightingAnimations();
          if (spawnNextpokemon) {
            animationType = animationCheck.nextPokemon;
          } else {
            animationType = animationCheck.logic;
          }
          break;
        case animationCheck.nextPokemon:
          showNewPokemon();
          if (isFightOver()) {
            props.childPlaySong("victory");
            setIsFighting(false);
          } else {
            animationType = animationCheck.spawningPokemon;
          }
          break;
        case animationCheck.spawningPokemon:
          spawnNewPokemon();
          animationType = animationCheck.logic;
          break;
      }
    },
    isFighting ? 750 : null
  );

  const myCurrentPokemon = myBattlePokemon.find((p) => p.id === myCurrentBattler.id);
  const enemyCurrentPokemon = enemyBattlePokemon.find((p) => p.id === enemyCurrentBattler.id);

  return (
    <>
      <div className="flex flex-col p-4">
        <div className="sm:flex justify-center items-center sm:gap-8 lg:gap-16">
          <PokeBalls flip pokemonTeam={myBattlePokemon} />
          <PokeBalls flip={false} pokemonTeam={enemyBattlePokemon} />
        </div>
        <div className="flex mt-[10vh] justify-center gap-8 lg:gap-16">
          <div ref={myTeamRef} data-my-team="true" className="w-40">
            {myCurrentPokemon && (
              <BattlePokemon
                battlePokemon={myCurrentPokemon}
                attackAnimation={fightingAnimations.find((f) => f.pokemonId === myCurrentPokemon.id)}
                teamLocation={myTeamRef.current}
                enemyTeamLocation={enemyTeamRef.current}
                flip={true}
                status={myCurrentBattler.status}
              />
            )}
          </div>

          <div ref={enemyTeamRef} data-my-team="false" className="w-40">
            {enemyCurrentPokemon && (
              <BattlePokemon
                battlePokemon={enemyCurrentPokemon}
                attackAnimation={fightingAnimations.find((f) => f.pokemonId === enemyCurrentPokemon.id)}
                enemyTeamLocation={myTeamRef.current}
                teamLocation={enemyTeamRef.current}
                status={enemyCurrentBattler.status}
              />
            )}
          </div>
        </div>
      </div>
      {!isFighting && <PostGameScreen battle={props.battle} game={props.game} />}
    </>
  );
}

function PostGameScreen({ game, battle }) {
  const didWin = game.id === battle.winnerId;
  const gameOver = game.lives === 0;
  const beatGame = game.wins > 9;
  const router = useRouter();
  const [fadeOut, shouldFadeOut] = useState(false);

  const handleClick = () => {
    if (beatGame || gameOver) {
      router.push("/");
      return;
    }

    shouldFadeOut(true);
    setTimeout(() => {
      router.push("/play");
    }, 500);
  };

  return (
    <>
      <div className="text-center mt-5">
        {didWin ? (
          <>
            <h3 className="text-xl">{beatGame ? "you beat the game" : "you won"}</h3>
            <button onClick={handleClick} className="text-indigo-500">
              {beatGame ? "main menu" : "continue"}
            </button>
          </>
        ) : (
          <>
            <h3>you lost</h3>
            <button onClick={handleClick} className="text-indigo-500">
              {gameOver ? "rip" : "continue"}
            </button>
          </>
        )}
      </div>
      {fadeOut && (
        <div
          style={{ "--fadeinduration": "500ms" }}
          className="white h-screen w-screen fixed fadeInAnimation bg-white top-0"
        />
      )}
    </>
  );
}

export const getServerSideProps = withIronSessionSsr(async function getServerSideProps(context) {
  const user = context.req.session.user;

  if (!user) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const battleId = parseInt(context.params.id);
  const userId = user.id;

  const battle = await prisma.battle.findUnique({
    where: {
      id: battleId,
    },
    select: {
      winnerId: true,
      id: true,
      game1Id: true,
      game2Id: true,
    },
  });

  const possibleGameIds = [battle.game1Id, battle.game2Id].filter((a) => a);

  const game = await prisma.game.findFirst({
    where: {
      id: { in: possibleGameIds },
      userId: userId,
    },
  });

  let battlePokemon = await prisma.battleTeam.findMany({
    where: {
      battleId: battle.id,
    },
    orderBy: {
      orderNum: "desc",
    },
  });

  battlePokemon = await Promise.all(
    battlePokemon.map(async (p) => {
      const { name, types } = pokemon[p.pokemonId];
      return {
        ...p,
        tempHp: p.hp,
        hasFainted: false,
        seen: p.gameId === game.id,
        name,
        types,
      };
    })
  );

  return { props: { game, battlePokemon, battle } };
}, sessionOptions);
