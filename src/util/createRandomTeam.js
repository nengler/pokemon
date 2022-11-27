import GetAvailableShopPokemon from "util/getAvailableShopPokemon";
import GetHp from "util/getHp";
import GetNotHpStat from "util/getNotHpStat";
import GetPokemonLevelRange from "util/getPokemonLevelRange";
import GetRandomElement from "util/getRandomElement";
import isShiny from "util/isShiny";
import pokemonEvolution from "constants/pokemonEvolution";
import pokemon from "constants/pokemon";

export default async function getRandomTeam(battleId, currentRound) {
  let teamPokemon = [];
  const allowedPokemonToGet = 4;
  const maxTeamSize = 6;

  Array.from({ length: currentRound }).forEach((_, round) => {
    const currentRound = round + 1;
    let numberPokemonCanGrab = 3;
    const levelRange = GetPokemonLevelRange(currentRound);
    teamPokemon = combineDuplicates(teamPokemon);
    const availablePokemon = GetAvailableShopPokemon(currentRound);

    Array.from({ length: 2 }).forEach((_a) => {
      const randomPokemon = Array.from({ length: allowedPokemonToGet }, () => ({
        pokemonId: GetRandomElement(availablePokemon),
        level: GetRandomElement(levelRange),
      }));

      while (numberPokemonCanGrab > 0 && randomPokemon.length > 0 && teamPokemon.length < maxTeamSize) {
        teamPokemon.push(randomPokemon.shift());
        numberPokemonCanGrab--;
      }

      const pokemonIdsOnTeam = teamPokemon.map((t) => t.pokemonId);
      randomPokemon.forEach((randomP) => {
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

    teamPokemon.sort((a, b) => {
      a.level < b.level;
    });
  });

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
  const duplicateObj = {};

  pokemonTeam.forEach((t) => {
    duplicateObj[t.pokemonId] = (duplicateObj[t.pokemonId] || 0) + 1;
  });

  const duplicateIds = Object.keys(duplicateObj)
    .filter((key) => duplicateObj[key] > 1)
    .map((a) => parseInt(a));

  let newTeam = [];

  duplicateIds.forEach((id) => {
    const duplicateTeamPokemon = pokemonTeam.filter((t) => t.pokemonId === id);
    const combinedPokemon = duplicateTeamPokemon.reduce(
      (previousValue, currentValue) => ({ ...previousValue, level: previousValue.level + currentValue.level }),
      {
        pokemonId: duplicateTeamPokemon[0].pokemonId,
        level: 0,
      }
    );
    newTeam.push(combinedPokemon);
  });

  newTeam.push(...pokemonTeam.filter((t) => !duplicateIds.includes(t.pokemonId)));

  return newTeam;
}
