import GetShopPokemon from "prisma/queries/getShopPokemon";
import prisma from "lib/prisma";
import DeleteCurrentShop from "prisma/queries/deleteCurrentShop";
import DecreaseGameGold from "prisma/queries/decreaseGameGold";
import CreateNewShopPokemon from "prisma/methods/createNewShopPokemon";
import transformShopPokemonRecords from "prisma/methods/transformShopPokemonRecords";

export default async function handler(req, res) {
  let game = await prisma.game.findUnique({
    where: { id: parseInt(req.query.gameId) },
  });

  if (game.gold > 0) {
    game = await DecreaseGameGold(prisma, game.id, 1);
    await DeleteCurrentShop(prisma, game.id);
    await CreateNewShopPokemon(prisma, game.id, game.round, 3);
  }

  const newShopPokemon = await GetShopPokemon(prisma, game.id);
  const shopPokemon = transformShopPokemonRecords(newShopPokemon);

  res.status(200).json({ pokemon: shopPokemon, gold: game.gold });
}
