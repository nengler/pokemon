export default async function changeFreezeStatus(prisma, gameId, frozenIds, notFrozenIds) {
  console.log(frozenIds);
  const frozenPokemon = await prisma.shopPokemon.updateMany({
    where: {
      gameId: gameId,
      id: { in: frozenIds },
    },
    data: { isFrozen: true },
  });
  await prisma.shopPokemon.updateMany({
    where: {
      gameId: gameId,
      id: { in: notFrozenIds },
    },
    data: { isFrozen: false },
  });

  console.log(frozenPokemon);

  return frozenPokemon.count;
}
