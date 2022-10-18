// TODO: Flesh this out
export default function GetPokemonLevelRange(round) {
  const levelRange = {
    1: [3, 4, 5],
    2: [4, 5, 6],
    3: [5, 6, 7],
  };
  return levelRange[round] || [3, 4, 5];
}
