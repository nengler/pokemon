import useInterval from "components/useInterval";
import pokemon from "constants/pokemon";
import prisma from "lib/prisma";
import Link from "next/link";
import { useState, useRef } from "react";
import calculateDamage from "util/calculateDamage";
import { withIronSessionSsr } from "iron-session/next";
import { sessionOptions } from "lib/session";
import { GetCurrentGame } from "prisma/queries/getCurrentGame";
import PokeBalls from "components/battle/pokeballs";
import { BattlePokemon } from "components/battle/battlePokemon";
import { battleStates } from "constants/gameConfig";

const animationCheck = {
  logic: "logic",
  fightingAnimations: "Fighting Animations",
  nextPokemon: "NextPokemon",
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
    const myFightingPokemon = myBattlePokemon.filter((p) => p.tempHp > 0)[0];

    const enemyFightingPokemon = enemyBattlePokemon.filter((p) => p.tempHp > 0)[0];

    if (myFightingPokemon === undefined || enemyFightingPokemon === undefined) {
      setIsFighting(false);
      return;
    }

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
        ...calculateMyAttack,
        time: new Date(),
        pokemonId: enemyFightingPokemon.id,
      },
      {
        ...calculateEnemyAttack,
        time: new Date(),
        pokemonId: myFightingPokemon.id,
      },
    ]);

    // return;

    setMyBattlePokemon((pokemon) =>
      pokemon.map((p) => {
        if (p.id === myFightingPokemon.id) {
          if (p.tempHp <= 0) {
            console.log(`${myFightingPokemon.name} fainted`);
          }
          return { ...p, tempHp: myNewHp };
        } else {
          return p;
        }
      })
    );

    setEnemyBattlePokemon((pokemon) =>
      pokemon.map((p) => {
        if (p.id === enemyFightingPokemon.id) {
          if (p.tempHp <= 0) {
            console.log(`${enemyFightingPokemon.name} fainted`);
          }
          return { ...p, tempHp: enemyNewHp };
        } else {
          return p;
        }
      })
    );
  };

  const updateAnimations = () => {
    const myCurrentBattlerId = myCurrentBattler.id;
    const myCurrentBattlerStatus = myCurrentBattler.status;
    const newMyBattlePokemon = myBattlePokemon.map((pokemon) => {
      if (pokemon.tempHp <= 0) {
        if (pokemon.id === myCurrentBattlerId && myCurrentBattlerStatus === battleStates.fighting) {
          myCurrentBattlerStatus = battleStates.death;
        }
        return { ...pokemon, hasFainted: true };
      } else {
        return pokemon;
      }
    });

    setMyBattlePokemon(newMyBattlePokemon);
    setMyCurrentBattler({ id: myCurrentBattlerId, status: myCurrentBattlerStatus });

    const enemyCurrentBattlerId = enemyCurrentBattler.id;
    const enemyCurrentBattlerStatus = enemyCurrentBattler.status;
    let shouldShowNewPokemon = true;
    const newEnemyBattlePokemon = enemyBattlePokemon.map((p) => {
      if (p.tempHp <= 0) {
        shouldShowNewPokemon = true;
        if (p.id === enemyCurrentBattlerId && enemyCurrentBattlerStatus === battleStates.fighting) {
          enemyCurrentBattlerStatus = battleStates.death;
        }
        return { ...p, hasFainted: true };
      } else {
        const seenObject = { seen: shouldShowNewPokemon };
        shouldShowNewPokemon = false;
        return { ...p, ...seenObject };
      }
    });

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
      updateBattlerFunction({ id: notFaintedPokemon.id, status: battleStates.fighting });
    } else {
      updateBattlerFunction({});
    }
  }

  useInterval(
    () => {
      switch (animationType) {
        case animationCheck.logic:
          handlePokemonLogic();
          animationType = animationCheck.fightingAnimations;
          break;
        case animationCheck.fightingAnimations:
          const spawnNextpokemon = updateAnimations();
          if (spawnNextpokemon) {
            animationType = animationCheck.nextPokemon;
          } else {
            animationType = animationCheck.logic;
          }
          break;
        case animationCheck.nextPokemon:
          showNewPokemon();
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
      <div className="flex flex-col">
        <div className="sm:flex justify-center items-center sm:gap-4 lg:gap-16">
          <PokeBalls flip pokemonTeam={myBattlePokemon} />
          <PokeBalls flip={false} pokemonTeam={enemyBattlePokemon} />
        </div>
        <div className="flex mt-5 justify-center gap-4 lg:gap-16">
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
      {!isFighting && (
        <div className="text-center mt-5">
          {props.game.id === props.battle.winnerId ? (
            <>
              <h3 className="text-xl">you won</h3>
              <Link href="/play">
                <a className="text-indigo-500">continue</a>
              </Link>
            </>
          ) : (
            <>
              <h3>you lost</h3>
              <Link href="/play">
                <a className="text-indigo-500">continue</a>
              </Link>
            </>
          )}
        </div>
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
    },
  });

  const game = await GetCurrentGame(prisma, userId);

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
