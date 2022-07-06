import GetShopPokemon from "prisma/queries/getShopPokemon";
import prisma from "lib/prisma";
import GetNewShop from "prisma/methods/getNewShop";

export default async function handler(req, res) {
  let game = await prisma.game.findUnique({ where: { id: parseInt(req.query.gameId) } });
  if (game.gold > 0) {
    game = await prisma.game.update({
      where: {
        id: game.id,
      },
      data: {
        gold: {
          decrement: 1,
        },
      },
    });

    await GetNewShop(prisma, game);
  }

  const newShopPokemon = await GetShopPokemon(prisma, game.id);

  res.status(200).json({ pokemon: newShopPokemon, gold: game.gold });
}
