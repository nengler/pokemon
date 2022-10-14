export default function GetHp(baseHp, level) {
  return Math.floor(0.01 * (2 * baseHp) * level + level + 10);
}
