import prisma from "lib/prisma";
import GamePokemonSelect from "prisma/queries/gamePokemonSelect";
import GetHp from "util/getHp";
import GetNotHpStat from "util/getNotHpStat";

export default async function handler(req, res) {
  const body = JSON.parse(req.body);

  let gamePokemonToEvolve = await prisma.gamePokemon.findUnique({
    where: { id: body.gamePokemonId },
    select: {
      level: true,
      pokemon: {
        select: {
          id: true,
        },
      },
    },
  });

  const evolvesToPokemon = await prisma.pokemon.findUnique({
    where: { id: body.newPokemonId },
  });

  const evolutionRecord = await prisma.PokemonEvolution.findFirst({
    where: {
      evolvesFromId: gamePokemonToEvolve.pokemon.id,
      evolvesToId: evolvesToPokemon.id,
    },
  });

  if (evolutionRecord !== undefined && gamePokemonToEvolve.level >= evolutionRecord.evolutionLevel) {
    gamePokemonToEvolve = await prisma.gamePokemon.update({
      where: {
        id: body.gamePokemonId,
      },
      data: {
        pokemonId: evolvesToPokemon.id,
        hp: GetHp(evolvesToPokemon.baseHp, gamePokemonToEvolve.level),
        attack: GetNotHpStat(evolvesToPokemon.baseAttack, gamePokemonToEvolve.level),
        defense: GetNotHpStat(evolvesToPokemon.baseDefense, gamePokemonToEvolve.level),
      },
      ...GamePokemonSelect(),
    });
  }

  res.status(200).json({ gamePokemon: gamePokemonToEvolve });
}
