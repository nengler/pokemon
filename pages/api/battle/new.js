import prisma from "lib/prisma";

export default async function handler(req, res) {
  const body = JSON.parse(req.body);

  const game = await prisma.game.findUnique({
    where: { id: parseInt(body.gameId) },
  });

  for await (const myPokemon of body.myPokemonOrder) {
    await prisma.gamePokemon.update({
      where: {
        id: myPokemon.id,
      },
      data: {
        orderNum: myPokemon.orderNum,
      },
    });
  }

  const gamePokemon = await prisma.gamePokemon.findMany({
    where: {
      gameId: game.id,
    },
  });

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

  if (battle === null) {
    battle = await prisma.battle.create({
      data: {
        game1Id: game.id,
        round: game.round,
      },
    });

    await prisma.BattleTeam.createMany({
      data: gamePokemon.map((g) => {
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
