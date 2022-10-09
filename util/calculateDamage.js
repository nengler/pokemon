import typeChart from "./typeChart";

export default async function calculateDamage(
  level,
  attack,
  enemyDefense,
  attackTypes,
  enemyTypes
) {
  let calculateDamageObject = {};
  for await (const attackType of attackTypes) {
    const attackName = attackType;
    let baseDamage = attack - enemyDefense;
    if (baseDamage < 1) {
      baseDamage = 1;
    }

    let typeMultiplier = 1;

    for await (const enemyType of enemyTypes) {
      typeMultiplier *=
        typeChart[attackName.toLowerCase()][enemyType.toLowerCase()];
    }

    const damageDealt = Math.floor(
      (((2 * level + 10) / 250) * (attack / enemyDefense) * 50 + 2) *
        typeMultiplier
    );

    if (
      Object.keys(calculateDamageObject).length === 0 ||
      damageDealt > calculateDamageObject.damageDealt
    ) {
      const effect = getEffectName(typeMultiplier);
      calculateDamageObject = { damageDealt, type: attackName, effect };
    }
  }

  return calculateDamageObject;
}

function getEffectName(multiplier) {
  if (multiplier >= 2) {
    return "Super Effective";
  } else if (multiplier <= 0.5) {
    return "Not Very Effective";
  }

  return "Effective";
}
