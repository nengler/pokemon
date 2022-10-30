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
        <div className=" overflow-hidden">
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
          />
        </div>
      </div>
      <TextAnimation attackAnimation={attackAnimation} />
    </>
  );
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

function TextAnimation({ attackAnimation }) {
  if (!attackAnimation) {
    return null;
  }

  const effectColor = getEffectColor(attackAnimation?.effect);

  return (
    <div className="text-animation transition text-center mt-2">
      <div className="">-{attackAnimation.damageDealt}</div>
      <div className={effectColor}>{attackAnimation.effect}</div>
    </div>
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
