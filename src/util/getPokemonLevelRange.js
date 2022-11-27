export default function GetPokemonLevelRange(round) {
  let oddRound = Math.ceil(round - 1) | 1;

  if (oddRound > 11) {
    oddRound = 11;
  }

  const levelRange = {
    1: [3, 4, 5],
    3: [4, 5, 6],
    5: [5, 6, 7],
    7: [6, 7, 8],
    9: [7, 8, 9],
    11: [8, 9, 10],
  };
  return levelRange[oddRound] || [3, 4, 5];
}
