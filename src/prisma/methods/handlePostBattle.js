import { shopPokemonNumber, startingGold } from "constants/gameConfig";
import DeleteCurrentShop from "prisma/queries/deleteCurrentShop";
import CreateNewShopPokemon from "./createNewShopPokemon";

export default async function handlePostBattle(battleId, battleStatus) {
  let updateBattleObj = {
    isBattleOver: true,
  };
  if (battleStatus === "draw") {
    updateBattleObj.isDraw = true;
  } else {
    updateBattleObj.winnerId = battleStatus;
  }

  const battle = await prisma.battle.update({
    where: {
      id: battleId,
    },
    data: {
      ...updateBattleObj,
    },
  });

  handleUpdatePostGame(prisma, battle.game1Id, battleStatus, battle.isDraw);
  handleUpdatePostGame(prisma, battle.game2Id, battleStatus, battle.isDraw);
  return battle;
}

async function handleUpdatePostGame(prisma, gameId, battleStatus, isDraw) {
  if (!gameId) {
    return;
  }

  let updateData = {
    gold: startingGold,
    round: {
      increment: 1,
    },
  };

  if (battleStatus === gameId) {
    updateData.wins = { increment: 1 };
  } else if (!isDraw) {
    updateData.lives = { decrement: 1 };
  }

  const game = await prisma.game.update({
    where: {
      id: gameId,
    },
    data: updateData,
  });

  await DeleteCurrentShop(prisma, gameId);
  const currentShopPokemon = await prisma.shopPokemon.count({ where: { gameId: gameId } });
  await CreateNewShopPokemon(prisma, gameId, game.round, shopPokemonNumber - currentShopPokemon);
}
