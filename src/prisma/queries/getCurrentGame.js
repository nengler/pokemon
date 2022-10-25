export async function GetCurrentGame(prisma, userId) {
  if (!userId) {
    return null;
  }

  return await prisma.game.findFirst({
    where: {
      userId: userId,
      NOT: {
        lives: 0,
      },
    },
  });
}
