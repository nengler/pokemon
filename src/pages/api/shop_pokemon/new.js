import GetShopPokemon from "prisma/queries/getShopPokemon";
import prisma from "lib/prisma";
import DeleteCurrentShop from "prisma/queries/deleteCurrentShop";
import DecreaseGameGold from "prisma/queries/decreaseGameGold";
import CreateNewShopPokemon from "prisma/methods/createNewShopPokemon";
import transformShopPokemonRecords from "prisma/methods/transformShopPokemonRecords";
import { withIronSessionApiRoute } from "iron-session/next";
import { sessionOptions } from "lib/session";
import { GetCurrentGame } from "prisma/queries/getCurrentGame";
import { rerollCost, shopPokemonNumber } from "constants/gameConfig";
import changeFreezeStatus from "prisma/methods/changeFreezeStatus";

export default withIronSessionApiRoute(handler, sessionOptions);

async function handler(req, res) {
  const user = req.session.user;

  if (!user) {
    res.status(401);
    return;
  }

  const { frozen = [], notFrozen = [] } = JSON.parse(req.body);

  let game = await GetCurrentGame(prisma, user.id);

  if (game.gold > rerollCost) {
    game = await DecreaseGameGold(prisma, game.id, rerollCost);
    const numberOfFrozen = await changeFreezeStatus(prisma, game.id, frozen, notFrozen);
    await DeleteCurrentShop(prisma, game.id);
    console.log(game.id, shopPokemonNumber, numberOfFrozen);
    await CreateNewShopPokemon(prisma, game.id, game.round, shopPokemonNumber - numberOfFrozen);
  }

  const newShopPokemon = await GetShopPokemon(prisma, game.id);
  const shopPokemon = transformShopPokemonRecords(newShopPokemon);

  res.status(200).json({ pokemon: shopPokemon, gold: game.gold });
}
