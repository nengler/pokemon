import GetShopPokemon from "prisma/queries/getShopPokemon";
import prisma from "lib/prisma";
import { GetNewShopPokemon } from "prisma/methods/getNewShopPokemon";
import DeleteCurrentShop from "prisma/queries/deleteCurrentShop";

export default async function handler(req, res) {
  let game = await prisma.game.findUnique({
    where: { id: parseInt(req.query.gameId) },
  });

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

    await DeleteCurrentShop(prisma, game.id);
    await GetNewShopPokemon(prisma, game.id, game.round, 3);
  }

  const newShopPokemon = await GetShopPokemon(prisma, game.id);

  res.status(200).json({ pokemon: newShopPokemon, gold: game.gold });
}
