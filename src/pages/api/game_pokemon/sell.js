import prisma from "lib/prisma";
import { withIronSessionApiRoute } from "iron-session/next";
import { sessionOptions } from "lib/session";
import { GetCurrentGame } from "prisma/queries/getCurrentGame";
import { sellPokemonAmount } from "constants/gameConfig";

export default withIronSessionApiRoute(handler, sessionOptions);

async function handler(req, res) {
  const user = req.session.user;

  if (!user) {
    res.status(401);
    return;
  }

  const body = JSON.parse(req.body);
  let game = await GetCurrentGame(prisma, user.id);

  game = await prisma.game.update({
    where: {
      id: game.id,
    },
    data: {
      gold: {
        increment: sellPokemonAmount,
      },
    },
  });

  await prisma.gamePokemon.delete({ where: { id: parseInt(body.gamePokemonId) } });

  res.status(200).json({ gold: game.gold });
}
