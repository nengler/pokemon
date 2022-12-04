import GetAvailableShopPokemon from "../util/getAvailableShopPokemon";
import GetHp from "../util/getHp";
import GetNotHpStat from "../util/getNotHpStat";
import GetPokemonLevelRange from "../util/getPokemonLevelRange";
import GetRandomElement from "../util/getRandomElement";
import isShiny from "../util/isShiny";
import pokemonEvolution from "../constants/pokemonEvolution";
import pokemon from "../constants/pokemon";
import prisma from "../lib/prisma";
import { maxTeamSize, shopPokemonNumber } from "../constants/gameConfig";

export default async function getRandomTeam(battleId, currentRound) {
  let teamPokemon = [];

  // iterate for each round
  Array.from({ length: currentRound }).forEach((_, round) => {
    const currentRound = round + 1;
    let numberPokemonCanGrab = currentRound < 3 ? 3 : 4;
    const levelRange = GetPokemonLevelRange(currentRound);
    teamPokemon = combineDuplicates(teamPokemon);
    const availablePokemon = GetAvailableShopPokemon(currentRound);
    if (currentRound >= 3) {
      teamPokemon = removeWeakerPokemon(teamPokemon, Math.max(...levelRange));
    }

    const randomShopPokemon = Array.from({ length: shopPokemonNumber * 2 }, () => ({
      pokemonId: GetRandomElement(availablePokemon),
      level: GetRandomElement(levelRange),
    }));

    randomShopPokemon.sort(byLevel);

    // add pokemon to team until team is full
    while (numberPokemonCanGrab > 0 && randomShopPokemon.length > 0 && teamPokemon.length < maxTeamSize) {
      teamPokemon.push(randomShopPokemon.shift());
      numberPokemonCanGrab--;
    }

    const pokemonIdsOnTeam = teamPokemon.map((t) => t.pokemonId);

    // add duplicates to team
    randomShopPokemon.forEach((randomP) => {
      if (numberPokemonCanGrab > 0 && pokemonIdsOnTeam.includes(randomP.pokemonId)) {
        numberPokemonCanGrab--;
        const teamPokemonIndex = teamPokemon.findIndex((t) => t.pokemonId === randomP.pokemonId);
        teamPokemon[teamPokemonIndex] = {
          ...teamPokemon[teamPokemonIndex],
          level: teamPokemon[teamPokemonIndex].level + randomP.level,
        };
      }
    });
  });

  teamPokemon.sort(byLevel);

  const pokemonData = await Promise.all(
    teamPokemon.map(async (t, order) => {
      const { pokemonId, level } = t;

      const pokemonId2 = getMostEvolvedPokemon(pokemonId, level);

      const pokemonConstant = pokemon[pokemonId2];
      return {
        pokemonId: pokemonId2,
        battleId: battleId,
        hp: GetHp(pokemonConstant.baseStats.hp, level),
        attack: GetNotHpStat(pokemonConstant.baseStats.attack, level),
        defense: GetNotHpStat(pokemonConstant.baseStats.defense, level),
        orderNum: order,
        level: level,
        isShiny: isShiny(),
      };
    })
  );

  await prisma.battleTeam.createMany({
    data: pokemonData,
  });
}

function byLevel(a, b) {
  return a.level < b.level ? 1 : -1;
}

function getMostEvolvedPokemon(pokemonId, level) {
  const evolutions = pokemonEvolution[pokemonId];

  if (evolutions === undefined) {
    return pokemonId;
  }

  const canEvolveInto = evolutions.filter((e) => level >= e.minimumLevel);

  if (canEvolveInto.length === 0) {
    return pokemonId;
  }

  const randomEvolution = GetRandomElement(canEvolveInto);
  return randomEvolution.into;
}

function combineDuplicates(pokemonTeam) {
  let newPokemonArray = [];

  pokemonTeam.forEach((p) => {
    const existsInNewArray = newPokemonArray.findIndex((n) => n.pokemonId === p.pokemonId);
    if (existsInNewArray === -1) {
      newPokemonArray.push(p);
    } else {
      const pokemonAtIndex = newPokemonArray[existsInNewArray];
      newPokemonArray[existsInNewArray] = { ...pokemonAtIndex, level: pokemonAtIndex.level + p.level };
    }
  });

  return newPokemonArray;
}

function removeWeakerPokemon(teamPokemon, levelMin) {
  teamPokemon.sort(byLevel);
  const lastTwoPokemon = teamPokemon.slice(-2);
  const numberBelowMin = lastTwoPokemon.filter((t) => t.level < levelMin).length;
  return teamPokemon.slice(0, teamPokemon.length - numberBelowMin);
}
