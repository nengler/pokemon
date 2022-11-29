export async function GetCurrentGame(prisma, userId, isBattling = false) {
  if (!userId) {
    return null;
  }

  let winObject = {
    wins: {
      lt: 10,
    },
  };

  if (isBattling) {
    winObject = {
      wins: {
        lte: 10,
      },
    };
  }

  return await prisma.game.findFirst({
    where: {
      userId: userId,
      ...winObject,
      NOT: {
        lives: 0,
      },
    },
  });
}
