import { shopPokemonNumber, startingGold } from "constants/gameConfig";
import pokemon from "constants/pokemon";
import prisma from "lib/prisma";
import CreateNewShopPokemon from "prisma/methods/createNewShopPokemon";
import DeleteCurrentShop from "prisma/queries/deleteCurrentShop";
import { GetBattleTeam } from "prisma/queries/getBattleTeam";
import GetAvailableShopPokemon from "util/getAvailableShopPokemon";
import GetHp from "util/getHp";
import GetNotHpStat from "util/getNotHpStat";
import GetPokemonLevelRange from "util/getPokemonLevelRange";
import GetRandomElement from "util/getRandomElement";
import isShiny from "util/isShiny";
import { simulateBattle } from "util/simulateBattle";

export default async function handler(req, res) {
  let battle = await prisma.battle.findUnique({
    where: {
      id: parseInt(req.query.battleId),
    },
  });

  const diff = new Date() - new Date(battle.createdAt);
  const secondsSearching = Math.floor((diff / 1000) % 60);

  if (secondsSearching >= 3 && battle.isSearching) {
    battle = await prisma.battle.update({
      where: {
        id: battle.id,
      },
      data: {
        isSearching: false,
      },
    });

    await getRandomTeam(battle.id, battle.round);

    const enemyBattleTeam = await GetBattleTeam(prisma, battle.id, null);
    const myBattleTeam = await GetBattleTeam(prisma, battle.id, battle.game1Id);

    const battleWinner = await simulateBattle(myBattleTeam, enemyBattleTeam);

    battle = await prisma.battle.update({
      where: {
        id: battle.id,
      },
      data: {
        winnerId: battleWinner,
        isBattleOver: true,
      },
    });

    let updateData = {
      gold: startingGold,
      round: {
        increment: 1,
      },
    };

    if (battleWinner === null) {
      updateData.lives = { decrement: 1 };
    } else {
      updateData.wins = { increment: 1 };
    }

    const game = await prisma.game.update({
      where: {
        id: battle.game1Id,
      },
      data: updateData,
    });

    await DeleteCurrentShop(prisma, game.id);
    await CreateNewShopPokemon(prisma, game.id, game.round, shopPokemonNumber);

    res.status(200).json({ battle, enemyBattleTeam, battleWinner });
  } else if (battle.isSearching) {
    res.status(200).json({ battle });
  } else {
    res.status(200).json({ battle });
  }
}

async function getRandomTeam(battleId, currentRound) {
  let teamPokemon = [];
  const allowedPokemonToGet = 3;
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

    console.log(teamPokemon);

    teamPokemon.sort((a, b) => {
      a.level < b.level;
    });
  });

  const pokemonData = await Promise.all(
    teamPokemon.map(async (t, order) => {
      const pokemonConstant = pokemon[t.pokemonId];
      return {
        pokemonId: t.pokemonId,
        battleId: battleId,
        hp: GetHp(pokemonConstant.baseStats.hp, t.level),
        attack: GetNotHpStat(pokemonConstant.baseStats.attack, t.level),
        defense: GetNotHpStat(pokemonConstant.baseStats.defense, t.level),
        orderNum: order,
        level: t.level,
        isShiny: isShiny(),
      };
    })
  );

  await prisma.battleTeam.createMany({
    data: pokemonData,
  });
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
