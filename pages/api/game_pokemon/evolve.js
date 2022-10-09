import pokemon from "constants/pokemon";
import pokemonEvolution from "constants/pokemonEvolution";
import prisma from "lib/prisma";
import TransformGamePokemonRecord from "prisma/methods/transformGamePokemonRecord";
import GetHp from "util/getHp";
import GetNotHpStat from "util/getNotHpStat";

export default async function handler(req, res) {
  const body = JSON.parse(req.body);

  let gamePokemonToEvolve = await prisma.gamePokemon.findUnique({
    where: { id: body.gamePokemonId },
  });

  const newPokemonId = parseInt(body.newPokemonId);
  const evolvesToPokemon = pokemon[newPokemonId];

  const evolutionRecord = pokemonEvolution[gamePokemonToEvolve.pokemonId].find(
    (p) => p.into === parseInt(newPokemonId)
  );

  if (gamePokemonToEvolve.level < evolutionRecord?.minimumLevel) {
    res.status(400);
    return;
  }

  gamePokemonToEvolve = await prisma.gamePokemon.update({
    where: {
      id: body.gamePokemonId,
    },
    data: {
      pokemonId: newPokemonId,
      hp: GetHp(evolvesToPokemon.baseStats.hp, gamePokemonToEvolve.level),
      attack: GetNotHpStat(
        evolvesToPokemon.baseStats.attack,
        gamePokemonToEvolve.level
      ),
      defense: GetNotHpStat(
        evolvesToPokemon.baseStats.defense,
        gamePokemonToEvolve.level
      ),
    },
  });

  res
    .status(200)
    .json({ gamePokemon: TransformGamePokemonRecord(gamePokemonToEvolve) });
}
