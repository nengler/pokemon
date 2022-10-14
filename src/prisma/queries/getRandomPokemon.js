export default async function GetRandomPokemon(prisma) {
  return await prisma.$queryRaw`SELECT "Pokemon".id, "Pokemon"."baseHp", "Pokemon"."baseAttack", "Pokemon"."baseDefense" FROM "Pokemon" ORDER BY RANDOM() LIMIT 1`;
}
