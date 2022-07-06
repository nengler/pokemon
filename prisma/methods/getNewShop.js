import GetRandomPokemon from "prisma/queries/getRandomPokemon";
import GetPokemonLevelRange from "util/getPokemonLevelRange";
import isShiny from "util/isShiny";

const shopItems = 3;

export default async function GetNewShop(prisma, game) {
  const shopPokemon = await prisma.shopPokemon.findMany({ where: { gameId: game.id } });
  const levelRange = GetPokemonLevelRange(game.round);
  for await (const pokemon of shopPokemon) {
    const newPokemon = await GetRandomPokemon(prisma);
    await prisma.shopPokemon.update({
      where: { id: pokemon.id },
      data: {
        pokemonId: newPokemon[0].id,
        isShiny: isShiny(),
        level: levelRange[Math.floor(Math.random() * levelRange.length)],
      },
    });
  }

  let numberOfMissingItems = shopItems - shopPokemon.length;
  if (numberOfMissingItems < 0) {
    numberOfMissingItems = 0;
  }

  const missingItems = Array.apply(null, Array(numberOfMissingItems)).map(function () {});

  for await (const _i of missingItems) {
    const newPokemon = await GetRandomPokemon(prisma);
    await prisma.shopPokemon.create({
      data: {
        pokemonId: newPokemon[0].id,
        isShiny: isShiny(),
        level: levelRange[Math.floor(Math.random() * levelRange.length)],
        gameId: game.id,
      },
    });
  }
}
