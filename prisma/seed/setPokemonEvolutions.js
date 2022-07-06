const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const gen1PokemonEvolutions = require("./gen1PokemonEvolutions");

async function main() {
  for await (const pokemonEvolution of gen1PokemonEvolutions) {
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
          evolvesFromId: pokemonEvolution.id,
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
