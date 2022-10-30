// TODO: Flesh this out
export default function GetPokemonLevelRange(round) {
  const levelRange = {
    1: [3, 4, 5],
    3: [4, 5, 6],
    5: [5, 6, 7],
    7: [6, 7, 8],
    9: [7, 8, 9],
    11: [8, 9, 10],
  };
  return levelRange[round] || [3, 4, 5];
}
