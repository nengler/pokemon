export default function GetPokemonLevelRange(round) {
  let oddRound = Math.ceil(round - 1) | 1;

  if (oddRound > 11) {
    oddRound = 11;
  }

  const levelRange = {
    1: [3, 4, 5],
    3: [4, 5, 6],
    5: [7, 8, 9],
    7: [9, 10, 11],
    9: [11, 12, 13],
    11: [13, 14, 15],
  };
  return levelRange[oddRound] || [3, 4, 5];
}
