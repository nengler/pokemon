import { motion } from "framer-motion";

const poisonShotDuration = 0.4;
const poisonOpacityDuration = 0.05;
const bubbleRisingDuration = 0.2;
const yStartingPosition = 100;
const bubbles = [5, -15, 10];

export default function PoisonAnimation({ teamLocation, enemyTeamLocation }) {
  if (teamLocation === undefined || enemyTeamLocation === undefined) {
    return;
  }

  const enemyCoordinates = getEnemyCoordinates(enemyTeamLocation);
  const myCoordinates = getMyCoordinates(teamLocation);

  const enemyCenter = getPositionAtCenter(enemyCoordinates);
  const myCenter = getPositionAtCenter(myCoordinates);

  const distanceToMove = getDistanceBetweenElements(enemyCenter, myCenter);

  if (enemyCoordinates === undefined || myCoordinates === undefined) {
    return null;
  }

  const xFactor = teamLocation.dataset.myTeam === "true" ? 1 : -1;

  let styles = {
    left: "calc(50% - 12px)",
    top: `${yStartingPosition}px`,
  };

  return (
    <>
      <motion.div
        animate={{
          x: distanceToMove * xFactor,
          opacity: 0,
          y: [0, -50, 10],
        }}
        transition={{
          default: { duration: poisonShotDuration },
          opacity: { delay: poisonShotDuration - poisonOpacityDuration, duration: poisonOpacityDuration },
        }}
        className="absolute h-6 w-6 border-4 rounded-full bg-poison-primary border-poison-primary z-10"
        style={styles}
      />
      {bubbles.map((bubble, index) => {
        let circleStyles = {
          left: `calc(${distanceToMove + bubble}px + 50% - 12px)`,
          top: `${yStartingPosition}px`,
        };

        const delay = poisonShotDuration + index * 0.075;

        return (
          <motion.div
            animate={{
              opacity: [0, 1, 1, 0],
              y: -50,
              background: "rgb(255, 255, 255)",
              borderBottomColor: "rgb(255, 255, 255)",
              borderRightColor: "rgb(255, 255, 255)",
              borderLeftColor: "rgb(255, 255, 255)",
            }}
            transition={{
              y: { duration: bubbleRisingDuration, delay: delay },
              default: { delay: delay + 0.15, duration: 0 },
              opacity: { delay: delay, duration: bubbleRisingDuration, times: [0, 0.01, 0.99, 1] },
            }}
            className="absolute h-5 w-5 border-4 opacity-0 rounded-full bg-poison-primary border-poison-primary z-10"
            key={index}
            style={circleStyles}
          />
        );
      })}
    </>
  );
}

function getDistanceBetweenElements(aPosition, bPosition) {
  return Math.hypot(aPosition.x - bPosition.x, aPosition.y - bPosition.y);
}

function getPositionAtCenter({ left, width, top, height }) {
  return {
    x: left + width / 2,
    y: top + height / 2,
  };
}

const getEnemyCoordinates = (enemyTeamLocation) => {
  const currentEnemyDiv = enemyTeamLocation.children[0];
  const currentEnemyImg = currentEnemyDiv?.querySelector("img");
  return currentEnemyImg?.getBoundingClientRect();
};

const getMyCoordinates = (teamLocation) => {
  const myCurrentDiv = teamLocation.children[0];
  const myCurrentImg = myCurrentDiv?.querySelector("img");
  return myCurrentImg?.getBoundingClientRect();
};
