export default function GamePokemonSelect() {
  return {
    select: {
      id: true,
      pokemonId: true,
      nickname: true,
      hp: true,
      attack: true,
      defense: true,
      level: true,
      isShiny: true,
      orderNum: true,
      pokemon: {
        select: {
          id: true,
          name: true,
          pokedexId: true,
          pokemonTypes: {
            select: {
              type: {
                select: {
                  name: true,
                },
              },
            },
          },
          EvolutionFrom: {
            select: {
              evolutionLevel: true,
              EvolvesTo: {
                select: {
                  id: true,
                  name: true,
                  pokedexId: true,
                  baseHp: true,
                  baseAttack: true,
                  baseDefense: true,
                  pokemonTypes: {
                    select: {
                      type: {
                        select: {
                          name: true,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  };
}
