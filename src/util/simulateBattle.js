import calculateDamage from "./calculateDamage";

export async function simulateBattle(myBattleTeam, enemyBattleTeam) {
  let battleOver = myBattleTeam.length === 0 || enemyBattleTeam.length === 0;

  // console.log(myBattleTeam);
  // console.log(enemyBattleTeam);

  while (!battleOver) {
    const myBattlePokemon = myBattleTeam[0];
    const enemyBattlePokemon = enemyBattleTeam[0];
    // console.log(
    //   `current pokemon facing off: ${myBattlePokemon.name} vs ${enemyBattlePokemon.name}`
    // );

    const calculateMyDamage = await calculateDamage(
      myBattlePokemon.level,
      myBattlePokemon.attack,
      enemyBattlePokemon.defense,
      myBattlePokemon.types,
      enemyBattlePokemon.types
    );

    // console.log(
    //   `damage from ${myBattlePokemon.name} to ${enemyBattlePokemon.name}: ${calculateMyDamage.damageDealt}`
    // );

    enemyBattlePokemon.hp -= calculateMyDamage.damageDealt;

    const calculateEnemyDamage = await calculateDamage(
      enemyBattlePokemon.level,
      enemyBattlePokemon.attack,
      myBattlePokemon.defense,
      enemyBattlePokemon.types,
      myBattlePokemon.types
    );

    myBattlePokemon.hp -= calculateEnemyDamage.damageDealt;
    // console.log(
    //   `damage from ${enemyBattlePokemon.name} to ${myBattlePokemon.name}: ${calculateEnemyDamage.damageDealt}`
    // );

    if (myBattlePokemon.hp <= 0) {
      // console.log(`${myBattlePokemon.name} Fainted`);
      myBattleTeam.shift();
      if (myBattleTeam.length === 0) {
        battleOver = true;
      }
    }

    if (enemyBattlePokemon.hp <= 0) {
      // console.log(`${enemyBattlePokemon.name} Fainted`);
      enemyBattleTeam.shift();
      if (enemyBattleTeam.length === 0) {
        battleOver = true;
      }
    }
  }

  if (myBattleTeam.length === 0 && enemyBattleTeam.length !== 0) {
    // console.log(`enemy Won`);
    let enemyGameId = enemyBattleTeam[0].gameId;
    if (enemyGameId === undefined) {
      enemyGameId = null;
    }
    return enemyGameId;
  } else if (myBattleTeam.length !== 0 && enemyBattleTeam.length === 0) {
    // console.log(`I Won`);
    return myBattleTeam[0].gameId;
  } else {
    // console.log("draw");
    return null;
  }
}
