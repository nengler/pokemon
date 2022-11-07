import prisma from "lib/prisma";
import { withIronSessionApiRoute } from "iron-session/next";
import { sessionOptions } from "lib/session";
import { GetCurrentGame } from "prisma/queries/getCurrentGame";
import changeFreezeStatus from "prisma/methods/changeFreezeStatus";

export default withIronSessionApiRoute(handler, sessionOptions);

async function handler(req, res) {
  const user = req.session.user;

  if (!user) {
    res.status(401);
    return;
  }

  const body = JSON.parse(req.body);

  const game = await GetCurrentGame(prisma, user.id);

  let gamePokemonArray = [];

  for await (const myPokemon of body.myPokemonOrder) {
    const pokemon = await prisma.gamePokemon.update({
      where: {
        id: myPokemon.id,
      },
      data: {
        orderNum: myPokemon.orderNum,
      },
    });
    gamePokemonArray.push(pokemon);
  }

  await changeFreezeStatus(prisma, game.id, body.frozen, body.notFrozen);

  let battle = await prisma.battle.findFirst({
    where: {
      isSearching: true,
      winnerId: null,
      round: game.round,
    },
    select: {
      id: true,
      game1Id: true,
    },
  });

  // TODO: ddd logic for if the battle does not equal null
  if (battle === null) {
    battle = await prisma.battle.create({
      data: {
        game1Id: game.id,
        round: game.round,
      },
    });

    await prisma.BattleTeam.createMany({
      data: gamePokemonArray.map((g) => {
        return {
          pokemonId: g.pokemonId,
          hp: g.hp,
          attack: g.attack,
          defense: g.defense,
          level: g.level,
          orderNum: g.orderNum,
          isShiny: g.isShiny,
          gameId: game.id,
          battleId: battle.id,
        };
      }),
    });
  }

  res.status(200).json(battle);
}
