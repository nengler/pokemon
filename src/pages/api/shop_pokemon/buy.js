import GetHp from "util/getHp";
import GetNotHpStat from "util/getNotHpStat";
import prisma from "lib/prisma";
import DecreaseGameGold from "prisma/queries/decreaseGameGold";
import pokemon from "constants/pokemon";
import GetGamePokemon from "prisma/methods/getGamePokemon";

export default async function handler(req, res) {
  const body = JSON.parse(req.body);
  let game = await prisma.game.findUnique({
    where: { id: parseInt(body.gameId) },
  });

  if (game.gold < 3) {
    res.status(400);
    return;
  }

  if (req.method === "POST") {
    game = await DecreaseGameGold(prisma, game.id);
    await handleNewPokemonPurchase(game, prisma, body);
  } else if (req.method === "PATCH") {
    let gamePokemon = await prisma.gamePokemon.findUnique({
      where: { id: parseInt(body.gamePokemonId) },
    });

    const shopPokemon = await prisma.shopPokemon.delete({
      where: { id: parseInt(body.shopPokemonId) },
    });

    const pokemonConstant = pokemon[gamePokemon.pokemonId];

    if (pokemonConstant.canAddToSelf.includes(shopPokemon.pokemonid)) {
      res.status(400);
      return;
    }
    game = await DecreaseGameGold(prisma, game.id);
    await handleUpgradePokemonPurchase(prisma, gamePokemon, pokemonConstant, shopPokemon);
  }

  const gamePokemon = await GetGamePokemon(prisma, game.id);

  res.status(200).json({ gamePokemon, gold: game.gold });
}

async function handleNewPokemonPurchase(game, prisma, body) {
  const shopPokemon = await prisma.shopPokemon.delete({
    where: { id: parseInt(body.shopPokemonId) },
  });

  const pokemonConstant = pokemon[shopPokemon.pokemonId];

  await prisma.gamePokemon.create({
    data: {
      pokemonId: shopPokemon.pokemonId,
      hp: GetHp(pokemonConstant.baseStats.hp, shopPokemon.level),
      attack: GetNotHpStat(pokemonConstant.baseStats.attack, shopPokemon.level),
      defense: GetNotHpStat(pokemonConstant.baseStats.defense, shopPokemon.level),
      gameId: game.id,
      level: shopPokemon.level,
      isShiny: shopPokemon.isShiny,
      orderNum: body.order,
    },
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
}

async function handleUpgradePokemonPurchase(prisma, gamePokemon, pokemonConstant, shopPokemon) {
  const newLevel = gamePokemon.level + shopPokemon.level;

  await prisma.gamePokemon.update({
    where: {
      id: gamePokemon.id,
    },
    data: {
      hp: GetHp(pokemonConstant.baseStats.hp, newLevel),
      attack: GetNotHpStat(pokemonConstant.baseStats.attack, newLevel),
      defense: GetNotHpStat(pokemonConstant.baseStats.defense, newLevel),
      level: newLevel,
    },
  });
}
