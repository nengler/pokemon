import { shopPokemonNumber, startingGold } from "constants/gameConfig";
import prisma from "lib/prisma";
import CreateNewShopPokemon from "prisma/methods/createNewShopPokemon";
import DeleteCurrentShop from "prisma/queries/deleteCurrentShop";
import { GetBattleTeam } from "prisma/queries/getBattleTeam";
import { simulateBattle } from "util/simulateBattle";
import getRandomTeam from "util/createRandomTeam";

export default async function handler(req, res) {
  let battle = await prisma.battle.findUnique({
    where: {
      id: parseInt(req.query.battleId),
    },
  });

  const diff = new Date() - new Date(battle.createdAt);
  const secondsSearching = Math.floor((diff / 1000) % 60);

  if (secondsSearching >= 4 && battle.isSearching) {
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
    const currentShopPokemon = await prisma.shopPokemon.count({ where: { gameId: game.id } });
    await CreateNewShopPokemon(prisma, game.id, game.round, shopPokemonNumber - currentShopPokemon);

    res.status(200).json({ battle, enemyBattleTeam, battleWinner });
  } else if (battle.isSearching) {
    res.status(200).json({ battle });
  } else {
    res.status(200).json({ battle });
  }
}
