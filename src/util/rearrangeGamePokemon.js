export default function RearrangeGamePokemon(myPokemonSetter, gamePokemonId, originalSpot, newOrderCol) {
  myPokemonSetter((myPokemon) => {
    const spotHasPokemonInIt = myPokemon.filter((p) => p.orderNum === newOrderCol)[0] !== undefined;

    if (spotHasPokemonInIt) {
      const pokemonClone = structuredClone(myPokemon);
      pokemonClone.filter((p) => p.id === gamePokemonId)[0].orderNum = newOrderCol;

      if (newOrderCol === 5 || newOrderCol === 0) {
        return handleEdges(pokemonClone, gamePokemonId, newOrderCol);
      } else if (Math.abs(originalSpot - newOrderCol) === 1) {
        return handleMoveOneSpot(pokemonClone, gamePokemonId, originalSpot, newOrderCol);
      } else {
        return handleAllOtherSorts(pokemonClone, gamePokemonId, originalSpot, newOrderCol);
      }
    } else {
      return myPokemon.map((p) => {
        if (p.id === gamePokemonId) {
          return { ...p, orderNum: newOrderCol };
        } else {
          return p;
        }
      });
    }
  });
}

function handleEdges(myPokemon, gamePokemonId, newOrderCol) {
  const sort =
    newOrderCol === 5 ? (a, b) => (a.orderNum > b.orderNum ? -1 : 1) : (a, b) => (a.orderNum > b.orderNum ? 1 : -1);
  myPokemon.sort(sort);
  const direction = newOrderCol === 5 ? -1 : 1;

  myPokemon.forEach((p, index) => {
    if (p.id === gamePokemonId) {
      //   return;
    } else if (myPokemon.filter((po) => po.orderNum === p.orderNum).length === 2) {
      myPokemon[index] = { ...p, orderNum: p.orderNum + direction };
    }
  });

  return myPokemon;
}

function handleMoveOneSpot(myPokemon, gamePokemonId, originalSpot, newOrderCol) {
  myPokemon.filter((p) => p.orderNum === newOrderCol && p.id !== gamePokemonId)[0].orderNum = originalSpot;
  return myPokemon;
}

function handleAllOtherSorts(myPokemon, gamePokemonId, originalSpot, newOrderCol) {
  const sort =
    newOrderCol > originalSpot
      ? (a, b) => (a.orderNum > b.orderNum ? -1 : 1)
      : (a, b) => (a.orderNum > b.orderNum ? 1 : -1);
  myPokemon.sort(sort);

  myPokemon.forEach((p, index) => {
    if (
      p.id !== gamePokemonId &&
      p.orderNum !== 0 &&
      p.orderNum !== 5 &&
      myPokemon.filter((po) => po.orderNum === p.orderNum).length === 2
    ) {
      const direction = newOrderCol > originalSpot ? -1 : 1;
      myPokemon[index] = { ...p, orderNum: p.orderNum + direction };
    }
  });

  return myPokemon;
}
