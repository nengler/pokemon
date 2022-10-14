import prisma from "lib/prisma";

export default async function handler(req, res) {
  const body = JSON.parse(req.body);

  const game = await prisma.game.update({
    where: {
      id: body.gameId,
    },
    data: {
      gold: {
        increment: 1,
      },
    },
  });

  await prisma.gamePokemon.delete({ where: { id: parseInt(body.gamePokemonId) } });

  res.status(200).json({ gold: game.gold });
}
