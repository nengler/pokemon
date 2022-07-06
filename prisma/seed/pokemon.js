const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const gen1Pokemon = require("./gen1Pokemon");
const gen1PokemonEvolutions = require("./gen1PokemonEvolutions");

async function main() {
  for await (const pokemon1 of gen1Pokemon) {
    const attack =
      pokemon1.base.Attack > pokemon1.base["Sp. Attack"] ? pokemon1.base.Attack : pokemon1.base["Sp. Attack"];
    const defense =
      pokemon1.base.Defense > pokemon1.base["Sp. Defense"] ? pokemon1.base.Defense : pokemon1.base["Sp. Defense"];

    const pokemon = await prisma.pokemon.create({
      data: {
        name: pokemon1.name.english,
        baseHp: pokemon1.base.HP,
        baseAttack: attack,
        baseDefense: defense,
        roundPurchaseable: 1,
        pokedexId: pokemon1.id,
      },
    });

    const types = pokemon1.type;
    for await (const typeName of types) {
      const typeObj = await prisma.type.upsert({
        where: {
          name: typeName,
        },
        update: {},
        create: {
          name: typeName,
        },
      });

      await prisma.pokemonType.create({
        data: {
          pokemonId: pokemon.id,
          typeId: typeObj.id,
        },
      });
    }
  }

  for await (const pokemonEvolution of gen1PokemonEvolutions) {
    const evolvesFromPokemon = await prisma.pokemon.findUnique({
      where: {
        pokedexId: pokemonEvolution.id,
      },
    });
    for await (const evol of pokemonEvolution.evolution) {
      const pokemonEvolvedInto = await prisma.pokemon.findFirst({
        where: {
          name: {
            startsWith: evol.into,
            mode: "insensitive", // Default value: default
          },
        },
      });

      await prisma.pokemonEvolution.create({
        data: {
          evolutionLevel: evol["minimum-level"],
          evolvesFromId: evolvesFromPokemon.id,
          evolvesToId: pokemonEvolvedInto.id,
        },
      });
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
