export default function GetNotHpStat(baseStat, level) {
  return Math.floor(0.01 * (2 * baseStat) * level + 5);
}
