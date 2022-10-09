import isShiny from "util/isShiny";
import GetPokemonLevelRange from "util/getPokemonLevelRange";
import pokemonByShopLevel from "constants/pokemonByShopLevel";
import GetRandomElement from "util/getRandomElement";

export async function GetNewShopPokemon(prisma, gameId, currentRound, numberOfPokemonNeeded) {
    let shopPokemonData = [];
    const levelRange = GetPokemonLevelRange(currentRound);

    const availableRounds = Object.keys(pokemonByShopLevel).filter(round => parseInt(round) <= currentRound);
    const availablePokemon = []

    for await (const round of availableRounds) {
        availablePokemon.push(...pokemonByShopLevel[round]);
    }

    for await (const _i of Array.from({ length: numberOfPokemonNeeded})) {
        shopPokemonData.push({
            gameId:  gameId,
          isShiny: isShiny(),
          level: GetRandomElement(levelRange),
          pokemonId: GetRandomElement(availablePokemon),
        })
    }

  
      await prisma.shopPokemon.createMany({
        data: shopPokemonData,
      });
}