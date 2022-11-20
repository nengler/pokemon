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
import { battleStates } from "constants/gameConfig";

export function BattlePokemon({
  flip = false,
  battlePokemon,
  attackAnimation,
  teamLocation,
  enemyTeamLocation,
  status,
}) {
  return (
    <>
      <div className="text-center relative">
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
          didDie={status === battleStates.death}
          isSpawning={status === battleStates.spawning}
          isFighting={true}
          attackAnimation={attackAnimation}
        />
      </div>
      {status === battleStates.spawning && <SpawnPokemonText pokemonName={battlePokemon.name} />}
    </>
  );
}

function SpawnPokemonText({ pokemonName }) {
  const randomNumber = Math.floor(Math.random() * 3);

  if (randomNumber === 0) {
    return <div className="mt-1 text-lg text-center">GOOO {pokemonName}</div>;
  } else if (randomNumber === 1) {
    return <div className="mt-1 text-lg text-center">I believe in you {pokemonName}</div>;
  } else if (randomNumber === 2) {
    return <div className="mt-1 text-lg text-center">ok {pokemonName}, its your turn</div>;
  }
}

function BattleAnimation({ attackAnimation, teamLocation, enemyTeamLocation }) {
  return (
    <>
      {attackAnimation.type === "Fire" && (
        <FireAnimation teamLocation={teamLocation} enemyTeamLocation={enemyTeamLocation} />
      )}
      {attackAnimation.type === "Water" && (
        <WaterAnimation teamLocation={teamLocation} enemyTeamLocation={enemyTeamLocation} />
      )}
      {attackAnimation.type === "Grass" && (
        <GrassAnimation teamLocation={teamLocation} enemyTeamLocation={enemyTeamLocation} />
      )}
      {attackAnimation.type === "Psychic" && (
        <PsychicAnimation teamLocation={teamLocation} enemyTeamLocation={enemyTeamLocation} />
      )}
      {attackAnimation.type === "Poison" && (
        <PoisonAnimation teamLocation={teamLocation} enemyTeamLocation={enemyTeamLocation} />
      )}
      {attackAnimation.type === "Bug" && (
        <BugAnimation teamLocation={teamLocation} enemyTeamLocation={enemyTeamLocation} />
      )}
      {attackAnimation.type === "Normal" && (
        <NormalAnimation teamLocation={teamLocation} enemyTeamLocation={enemyTeamLocation} />
      )}
      {attackAnimation.type === "Flying" && (
        <FlyingAnimation teamLocation={teamLocation} enemyTeamLocation={enemyTeamLocation} />
      )}
      {attackAnimation.type === "Fighting" && (
        <FightingAnimation teamLocation={teamLocation} enemyTeamLocation={enemyTeamLocation} />
      )}
      {attackAnimation.type === "Dragon" && (
        <DragonAnimation teamLocation={teamLocation} enemyTeamLocation={enemyTeamLocation} />
      )}
      {attackAnimation.type === "Ghost" && (
        <GhostAnimation teamLocation={teamLocation} enemyTeamLocation={enemyTeamLocation} />
      )}
      {attackAnimation.type === "Ice" && (
        <IceAnimation teamLocation={teamLocation} enemyTeamLocation={enemyTeamLocation} />
      )}
      {attackAnimation.type === "Rock" && (
        <RockAnimation teamLocation={teamLocation} enemyTeamLocation={enemyTeamLocation} />
      )}
      {attackAnimation.type === "Electric" && (
        <ElectricAnimation teamLocation={teamLocation} enemyTeamLocation={enemyTeamLocation} />
      )}
      {attackAnimation.type === "Ground" && (
        <GroundAnimation teamLocation={teamLocation} enemyTeamLocation={enemyTeamLocation} />
      )}
      {attackAnimation.type === "Steel" && (
        <SteelAnimation teamLocation={teamLocation} enemyTeamLocation={enemyTeamLocation} />
      )}
    </>
  );
}
