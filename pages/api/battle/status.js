import Pokemon from "constants/pokemon";
import pokemonByShopLevel from "constants/pokemonByShopLevel";
import prisma from "lib/prisma";
import CreateNewShopPokemon from "prisma/methods/createNewShopPokemon";
import DeleteCurrentShop from "prisma/queries/deleteCurrentShop";
import { GetBattleTeam } from "prisma/queries/getBattleTeam";
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
      gold: 10,
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
    await CreateNewShopPokemon(prisma, game.id, game.round, 3);

    res.status(200).json({ battle, enemyBattleTeam, battleWinner });
  } else if (battle.isSearching) {
    res.status(200).json({ battle });
  } else {
    res.status(200).json({ battle });
  }
}

async function getRandomTeam(battleId, currentRound) {
  const teamSize = [0, 1, 2];

  const levelRange = GetPokemonLevelRange(1);

  const availablePokemon = Object.keys(pokemonByShopLevel)
    .filter((round) => parseInt(round) <= currentRound)
    .map((round) => pokemonByShopLevel[round])
    .flat();

  const pokemonData = await Promise.all(
    teamSize.map(async (order) => {
      const randomPokemonId = GetRandomElement(availablePokemon);
      const level = levelRange[Math.floor(Math.random() * levelRange.length)];
      const randomPokemon = Pokemon[randomPokemonId];

      return {
        pokemonId: randomPokemonId,
        battleId: battleId,
        hp: GetHp(randomPokemon.baseStats.hp, level),
        attack: GetNotHpStat(randomPokemon.baseStats.attack, level),
        defense: GetNotHpStat(randomPokemon.baseStats.defense, level),
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
