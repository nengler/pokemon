import BugAnimation from "components/animation/bug";
import DragonAnimation from "components/animation/dragon";
import ElectricAnimation from "components/animation/eletric";
import FightingAnimation from "components/animation/fighting";
import FireAnimation from "components/animation/fire";
import FlyingAnimation from "components/animation/flying";
import GhostAnimation from "components/animation/ghost";
import GrassAnimation from "components/animation/grass";
import GroundAnimation from "components/animation/ground";
import IceAnimation from "components/animation/ice";
import NormalAnimation from "components/animation/normal";
import PoisonAnimation from "components/animation/poison";
import PsychicAnimation from "components/animation/psychic";
import RockAnimation from "components/animation/rock";
import SteelAnimation from "components/animation/steel";
import WaterAnimation from "components/animation/water";
import Pokemon from "components/pokemon";
import useInterval from "components/useInterval";
import pokemon from "constants/pokemon";
import prisma from "lib/prisma";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import calculateDamage from "util/calculateDamage";

let intervalIteration = 0;

export default function Battle(props) {
  const [myBattlePokemon, setMyBattlePokemon] = useState(
    props.battlePokemon.filter((b) => b.gameId === props.game.id)
  );
  const [enemyBattlePokemon, setEnemyBattlePokemon] = useState(
    props.battlePokemon.filter((b) => b.gameId !== props.game.id)
  );
  const [isFighting, setIsFighting] = useState(true);
  const myTeamRef = useRef();
  const enemyTeamRef = useRef();

  const [fightingAnimations, setFightingAnimations] = useState([]);

  const handlePokemonLogic = async () => {
    const myFightingPokemon = myBattlePokemon.filter((p) => p.tempHp > 0)[0];

    const enemyFightingPokemon = enemyBattlePokemon.filter(
      (p) => p.tempHp > 0
    )[0];

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
    const enemyNewHp =
      enemyFightingPokemon.tempHp - calculateMyAttack.damageDealt;

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
    setMyBattlePokemon((pokemon) =>
      pokemon.map((p) => {
        if (p.tempHp <= 0) {
          return { ...p, hasFainted: true };
        } else {
          return p;
        }
      })
    );

    setEnemyBattlePokemon((pokemon) =>
      pokemon.map((p) => {
        if (p.tempHp <= 0) {
          return { ...p, hasFainted: true };
        } else {
          return p;
        }
      })
    );

    setFightingAnimations([]);
  };

  useInterval(
    () => {
      intervalIteration++;
      if (intervalIteration % 2 === 1) {
        handlePokemonLogic();
      } else {
        updateAnimations();
      }
    },
    isFighting ? 750 : null
  );

  return (
    <>
      <div className="flex gap-8 mt-10 h-80">
        <div
          ref={myTeamRef}
          data-my-team="true"
          className="w-full flex justify-end "
        >
          {myBattlePokemon
            .filter((p) => p.hasFainted !== true)
            .map((m, index) => (
              <div
                key={m.id}
                className={`w-32 transition-transform absolute`}
                style={{ transform: `translateX(${index * -160}px)` }}
              >
                <BattlePokemon
                  battlePokemon={m}
                  attackAnimation={
                    fightingAnimations.filter((f) => f.pokemonId === m.id)[0]
                  }
                  teamLocation={myTeamRef.current}
                  enemyTeamLocation={enemyTeamRef.current}
                  flip={true}
                />
              </div>
            ))}
        </div>

        <div ref={enemyTeamRef} data-my-team="false" className="w-full flex ">
          {enemyBattlePokemon
            .filter((p) => p.hasFainted !== true)
            .map((m, index) => (
              <div
                key={m.id}
                className={`w-32 transition-transform absolute`}
                style={{ transform: `translateX(${index * 160}px)` }}
              >
                <BattlePokemon
                  battlePokemon={m}
                  attackAnimation={
                    fightingAnimations.filter((f) => f.pokemonId === m.id)[0]
                  }
                  enemyTeamLocation={myTeamRef.current}
                  teamLocation={enemyTeamRef.current}
                />
              </div>
            ))}
        </div>
      </div>
      <div className="text-center">
        {!isFighting &&
          (props.game.id === props.battle.winnerId ? (
            <>
              <h3 className="text-xl">You Won</h3>
              <Link href="/">
                <a className="text-indigo-500">Continue</a>
              </Link>
            </>
          ) : (
            <>
              <h3>You Lost</h3>
              <Link href="/">
                <a className="text-indigo-500">Continue</a>
              </Link>
            </>
          ))}
      </div>
    </>
  );
}

const getEffectColor = (effect) => {
  const colors = {
    "Not Very Effective": "text-red-500",
    Effective: "",
    "Super Effective": "text-green-500",
  };

  return colors[effect];
};

function BattleAnimation({ attackAnimation, teamLocation, enemyTeamLocation }) {
  const [showAnimation, setShowAnimation] = useState(false);
  useEffect(() => {
    setShowAnimation(true);

    setTimeout(function () {
      setShowAnimation(false);
    }, 800);
  }, []);

  const effectColor = getEffectColor(attackAnimation.effect);

  return (
    <>
      {attackAnimation.type === "Fire" && (
        <FireAnimation
          teamLocation={teamLocation}
          enemyTeamLocation={enemyTeamLocation}
        />
      )}
      {attackAnimation.type === "Water" && (
        <WaterAnimation
          teamLocation={teamLocation}
          enemyTeamLocation={enemyTeamLocation}
        />
      )}
      {attackAnimation.type === "Grass" && (
        <GrassAnimation
          teamLocation={teamLocation}
          enemyTeamLocation={enemyTeamLocation}
        />
      )}
      {attackAnimation.type === "Psychic" && (
        <PsychicAnimation
          teamLocation={teamLocation}
          enemyTeamLocation={enemyTeamLocation}
        />
      )}
      {attackAnimation.type === "Poison" && (
        <PoisonAnimation
          teamLocation={teamLocation}
          enemyTeamLocation={enemyTeamLocation}
        />
      )}
      {attackAnimation.type === "Bug" && (
        <BugAnimation
          teamLocation={teamLocation}
          enemyTeamLocation={enemyTeamLocation}
        />
      )}
      {attackAnimation.type === "Normal" && (
        <NormalAnimation
          teamLocation={teamLocation}
          enemyTeamLocation={enemyTeamLocation}
        />
      )}
      {attackAnimation.type === "Flying" && (
        <FlyingAnimation
          teamLocation={teamLocation}
          enemyTeamLocation={enemyTeamLocation}
        />
      )}
      {attackAnimation.type === "Fighting" && (
        <FightingAnimation
          teamLocation={teamLocation}
          enemyTeamLocation={enemyTeamLocation}
        />
      )}
      {attackAnimation.type === "Dragon" && (
        <DragonAnimation
          teamLocation={teamLocation}
          enemyTeamLocation={enemyTeamLocation}
        />
      )}
      {attackAnimation.type === "Ghost" && (
        <GhostAnimation
          teamLocation={teamLocation}
          enemyTeamLocation={enemyTeamLocation}
        />
      )}
      {attackAnimation.type === "Ice" && (
        <IceAnimation
          teamLocation={teamLocation}
          enemyTeamLocation={enemyTeamLocation}
        />
      )}
      {attackAnimation.type === "Rock" && (
        <RockAnimation
          teamLocation={teamLocation}
          enemyTeamLocation={enemyTeamLocation}
        />
      )}
      {attackAnimation.type === "Electric" && (
        <ElectricAnimation
          teamLocation={teamLocation}
          enemyTeamLocation={enemyTeamLocation}
        />
      )}
      {attackAnimation.type === "Ground" && (
        <GroundAnimation
          teamLocation={teamLocation}
          enemyTeamLocation={enemyTeamLocation}
        />
      )}
      {attackAnimation.type === "Steel" && (
        <SteelAnimation
          teamLocation={teamLocation}
          enemyTeamLocation={enemyTeamLocation}
        />
      )}
      <div
        className={`absolute -bottom-12 whitespace-nowrap ${
          showAnimation ? "opacity-100" : "opacity-0"
        } transition`}
      >
        <div className="">-{attackAnimation.damageDealt}</div>
        <div className={effectColor}>{attackAnimation.effect}</div>
      </div>
    </>
  );
}

function BattlePokemon({
  flip = false,
  battlePokemon,
  attackAnimation,
  teamLocation,
  enemyTeamLocation,
}) {
  return (
    <div className="text-center">
      {attackAnimation !== undefined && (
        <BattleAnimation
          key={attackAnimation.time}
          attackAnimation={attackAnimation}
          teamLocation={teamLocation}
          enemyTeamLocation={enemyTeamLocation}
        />
      )}
      <Pokemon
        level={battlePokemon.level}
        name={battlePokemon.name}
        pokedexId={battlePokemon.pokemonId}
        isShiny={battlePokemon.isShiny}
        tempHp={battlePokemon.tempHp}
        hp={battlePokemon.hp}
        attack={battlePokemon.attack}
        defense={battlePokemon.defense}
        pokemonTypes={battlePokemon.types}
        flip={flip}
      />
    </div>
  );
}

export async function getServerSideProps(context) {
  const battleId = parseInt(context.params.id);
  const userId = 1;

  const battle = await prisma.battle.findUnique({
    where: {
      id: battleId,
    },
    select: {
      winnerId: true,
      id: true,
    },
  });

  const game = await prisma.game.findFirst({
    where: {
      userId: userId,
      NOT: {
        lives: 0,
      },
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
        name,
        types,
      };
    })
  );

  return { props: { game, battlePokemon, battle } };
}
