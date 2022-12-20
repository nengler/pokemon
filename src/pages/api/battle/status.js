import prisma from "lib/prisma";
import { GetBattleTeam } from "prisma/queries/getBattleTeam";
import { simulateBattle } from "util/simulateBattle";
import createRandomTeam from "util/createRandomTeam";
import handlePostBattle from "prisma/methods/handlePostBattle";

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

    await createRandomTeam(battle.id, battle.round);

    const enemyBattleTeam = await GetBattleTeam(prisma, battle.id, null);
    const myBattleTeam = await GetBattleTeam(prisma, battle.id, battle.game1Id);

    const battleStatus = await simulateBattle(myBattleTeam, enemyBattleTeam);
    battle = await handlePostBattle(battle.id, battleStatus);

    res.status(200).json({ battle });
  } else if (battle.isSearching) {
    res.status(200).json({ battle });
  } else {
    res.status(200).json({ battle });
  }
}
