export function getDistanceBetweenElements(aPosition, bPosition) {
  return Math.hypot(aPosition.x - bPosition.x, aPosition.y - bPosition.y);
}

export function getPositionAtCenter({ left, width, top, height }) {
  return {
    x: left + width / 2,
    y: top + height / 2,
  };
}

export const getTeamLocation = (teamLocation) => {
  const currentPokemonDiv = teamLocation.children[0];
  const currentPokemonImg = currentPokemonDiv?.querySelector("div[data-pokemon-image='true']");
  return currentPokemonImg?.getBoundingClientRect();
};
