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
import Image from "next/image";
import styles from "../../styles/battle.module.css";
import SoundPopover from "components/soundPopover";

const animationCheck = {
  logic: "logic",
  fightingAnimations: "Fighting Animations",
  nextPokemon: "Next Pokemon",
  spawningPokemon: "Spawning Pokemon",
};

let animationType = animationCheck.nextPokemon;

function getBackgroundType(battleId) {
  const backgroundOptions = [
    { type: "grass", platformImage: "/assets/platforms/grass_platform.png", class: styles.grassBackground },
    { type: "ground", platformImage: "/assets/platforms/ground_platform.png", class: styles.rockBackground },
    { type: "normal", platformImage: "/assets/platforms/normal_platform.png", class: styles.whiteBackground },
    { type: "water", platformImage: "/assets/platforms/water_platform.png", class: "bg-[#f1f7f8]" },
  ];

  return backgroundOptions[battleId % backgroundOptions.length];
}

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
  const backgroundType = getBackgroundType(props.battle.id);

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

    props.childPlaySound(calculateMyAttack.type);
    return;

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

  function playPostFightSong() {
    const { battle, game } = props;
    if (battle.winnerId === game.id) {
      props.childPlaySong("victory");
    } else if (battle.isDraw) {
      props.childPlaySong("defeat", false);
    } else {
      props.childPlaySong("tie", false);
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
            playPostFightSong();
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
    <div className={`${backgroundType.class} w-screen h-screen`}>
      <div className="fadeFromBlack" />
      <div className="flex flex-col p-4 ">
        <div className="sm:flex justify-center items-center sm:gap-8 md:gap-16 lg:gap-32 relative">
          <PokeBalls flip pokemonTeam={myBattlePokemon} />
          <PokeBalls flip={false} pokemonTeam={enemyBattlePokemon} />
          <div className="absolute right-0 top-0">
            <SoundPopover musicSlider={props.musicSlider} soundSlider={props.soundSlider} />
          </div>
        </div>
        <div className="flex mt-[10vh] justify-center gap-8 md:gap-16 lg:gap-32">
          <div ref={myTeamRef} data-my-team="true" className="w-40 md:w-48 relative">
            <Platform image={backgroundType.platformImage} />
            {myCurrentPokemon && (
              <BattlePokemon
                battlePokemon={myCurrentPokemon}
                attackAnimation={fightingAnimations.find((f) => f.pokemonId === myCurrentPokemon.id)}
                teamLocation={myTeamRef.current}
                enemyTeamLocation={enemyTeamRef.current}
                flip={true}
                status={myCurrentBattler.status}
                spawnSound={props.spawnPokemonSound}
              />
            )}
          </div>

          <div ref={enemyTeamRef} data-my-team="false" className="w-40 md:w-48 relative">
            <Platform image={backgroundType.platformImage} />
            {enemyCurrentPokemon && (
              <BattlePokemon
                battlePokemon={enemyCurrentPokemon}
                attackAnimation={fightingAnimations.find((f) => f.pokemonId === enemyCurrentPokemon.id)}
                enemyTeamLocation={myTeamRef.current}
                teamLocation={enemyTeamRef.current}
                status={enemyCurrentBattler.status}
                spawnSound={props.spawnPokemonSound}
              />
            )}
          </div>
        </div>
      </div>
      {!isFighting && <PostGameScreen battle={props.battle} game={props.game} />}
    </div>
  );
}

function Platform({ image }) {
  return (
    <div className="absolute top-16 w-full scale-y-150 md:scale-125">
      <Image src={image} width={256} height={70} />
    </div>
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

  const getHeaderText = () => {
    if (didWin) {
      return beatGame ? "you beat the game" : "you won";
    } else if (battle.isDraw) {
      return "its a draw";
    } else {
      return "you lost";
    }
  };

  const getButtonText = () => {
    if (didWin) {
      return beatGame ? "main menu" : "continue";
    } else if (battle.isDraw) {
      return "continue";
    } else {
      return gameOver ? "rip" : "continue";
    }
  };

  return (
    <>
      <div className="text-center mt-5">
        <h3 className="text-xl">{getHeaderText()}</h3>
        <button onClick={handleClick} className="text-indigo-500">
          {getButtonText()}
        </button>
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
      isDraw: true,
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
