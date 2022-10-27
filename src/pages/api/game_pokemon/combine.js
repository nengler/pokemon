import prisma from "lib/prisma";
import { withIronSessionApiRoute } from "iron-session/next";
import { sessionOptions } from "lib/session";
import GetHp from "util/getHp";
import GetNotHpStat from "util/getNotHpStat";
import TransformGamePokemonRecord from "prisma/methods/transformGamePokemonRecord";
import pokemon from "constants/pokemon";

export default withIronSessionApiRoute(handler, sessionOptions);

async function handler(req, res) {
  const user = req.session.user;

  if (!user) {
    res.status(401);
    return;
  }

  const body = JSON.parse(req.body);

  console.log(body);

  const gamePokemon1 = await prisma.gamePokemon.findUnique({
    where: { id: parseInt(body.pokemonId1) },
  });
  const gamePokemon2 = await prisma.gamePokemon.findUnique({
    where: { id: parseInt(body.pokemonId2) },
  });

  const [pokemonConstant, highestPokemonId] = getPokemonConstant(gamePokemon1, gamePokemon2);

  if (cantCombinePokemon(pokemonConstant, gamePokemon2)) {
    res.status(400).json({ message: "cant combine pokemon" });
    return;
  }

  const newLevel = gamePokemon1.level + gamePokemon2.level;

  await prisma.gamePokemon.update({
    where: { id: gamePokemon1.id },
    data: {
      pokemonId: highestPokemonId,
      hp: GetHp(pokemonConstant.baseStats.hp, newLevel),
      attack: GetNotHpStat(pokemonConstant.baseStats.attack, newLevel),
      defense: GetNotHpStat(pokemonConstant.baseStats.defense, newLevel),
      level: newLevel,
    },
  });

  await prisma.gamePokemon.delete({ where: { id: parseInt(gamePokemon2.id) } });

  let gamePokemonTeam = [];

  for await (const myPokemon of body.myPokemonOrder) {
    const updatedGamePokemon = await prisma.gamePokemon.update({
      where: {
        id: myPokemon.id,
      },
      data: {
        orderNum: myPokemon.orderNum,
      },
    });

    gamePokemonTeam.push(updatedGamePokemon);
  }

  gamePokemonTeam = gamePokemonTeam.map((g) => TransformGamePokemonRecord(g));

  res.status(200).json({ gamePokemon: gamePokemonTeam });
}

function cantCombinePokemon(pokemonConstant1, gamePokemon2) {
  return !pokemonConstant1.canAddToSelf.includes(gamePokemon2.pokemonId);
}

function getPokemonConstant(gamePokemon1, gamePokemon2) {
  if (gamePokemon1.pokemonId > gamePokemon2.pokemonId) {
    return [pokemon[gamePokemon1.pokemonId], gamePokemon1.pokemonId];
  }
  return [pokemon[gamePokemon2.pokemonId], gamePokemon2.pokemonId];
}
