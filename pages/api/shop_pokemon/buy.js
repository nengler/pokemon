import GetHp from "util/getHp";
import GetNotHpStat from "util/getNotHpStat";
import prisma from "lib/prisma";
import GamePokemonSelect from "prisma/queries/gamePokemonSelect";

export default async function handler(req, res) {
  const body = JSON.parse(req.body);
  let game = await prisma.game.findUnique({ where: { id: parseInt(body.gameId) } });

  if (req.method === "POST") {
    let gamePokemon = {};

    if (game.gold >= 3) {
      game = await prisma.game.update({
        where: {
          id: game.id,
        },
        data: {
          gold: {
            decrement: 3,
          },
        },
      });
      const shopPokemon = await prisma.shopPokemon.delete({
        where: { id: parseInt(body.shopPokemonId) },
        include: { pokemon: true },
      });

      gamePokemon = await prisma.gamePokemon.create({
        data: {
          pokemonId: shopPokemon.pokemonId,
          hp: GetHp(shopPokemon.pokemon.baseHp, shopPokemon.level),
          attack: GetNotHpStat(shopPokemon.pokemon.baseAttack, shopPokemon.level),
          defense: GetNotHpStat(shopPokemon.pokemon.baseDefense, shopPokemon.level),
          gameId: game.id,
          level: shopPokemon.level,
          isShiny: shopPokemon.isShiny,
          orderNum: body.order,
        },
        ...GamePokemonSelect(),
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

    res.status(200).json({ gamePokemon, gold: game.gold });
  } else if (req.method === "PATCH") {
    let gamePokemon = await prisma.gamePokemon.findUnique({
      where: { id: parseInt(body.gamePokemonId) },
      include: { pokemon: true },
    });

    if (game.gold >= 3) {
      game = await prisma.game.update({
        where: {
          id: game.id,
        },
        data: {
          gold: {
            decrement: 3,
          },
        },
      });

      const shopPokemon = await prisma.shopPokemon.delete({
        where: { id: parseInt(body.shopPokemonId) },
      });

      const newLevel = gamePokemon.level + shopPokemon.level;

      gamePokemon = await prisma.gamePokemon.update({
        where: {
          id: gamePokemon.id,
        },
        data: {
          hp: GetHp(gamePokemon.pokemon.baseHp, newLevel),
          attack: GetNotHpStat(gamePokemon.pokemon.baseAttack, newLevel),
          defense: GetNotHpStat(gamePokemon.pokemon.baseDefense, newLevel),
          level: newLevel,
        },
      });
    }
    res.status(200).json({ gamePokemon, gold: game.gold });
  }
}
