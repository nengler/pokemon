import { motion } from "framer-motion";

const baseXFactor = 50;
const bubbles = [55, 40, 72, 30, 45];

export default function PoisonAnimation({ teamLocation, enemyTeamLocation }) {
  if (teamLocation === undefined || enemyTeamLocation === undefined) {
    return;
  }

  const enemyCoordinates = getEnemyCoordinates(enemyTeamLocation);
  const myCoordinates = getMyCoordinates(teamLocation);

  if (enemyCoordinates === undefined || myCoordinates === undefined) {
    return null;
  }

  const xFactor = teamLocation.dataset.myTeam === "true" ? 1 * baseXFactor : 0.5 * baseXFactor;

  const xStartingPosition = enemyCoordinates.right - myCoordinates.left - xFactor;
  const yStartingPosition = 100; //enemyCoordinates.bottom - enemyCoordinates.top / 2;

  const distanceToMove =
    (myCoordinates.left + xFactor - ((enemyCoordinates.right - enemyCoordinates.left) / 2 + enemyCoordinates.left)) *
    -1;

  let styles = {
    left: `${xStartingPosition}px`,
    top: `${yStartingPosition}px`,
  };

  return (
    <>
      <motion.div
        animate={{
          x: distanceToMove * -1,
          opacity: 0,
          y: [0, -50, 10],
        }}
        transition={{
          default: { duration: 0.15 },
          opacity: { delay: 0.15, duration: 0.05 },
        }}
        className="absolute h-6 w-6 border-4 rounded-full bg-poison-primary border-poison-primary z-10"
        style={styles}
      />
      {bubbles.map((bubble, index) => {
        let circleStyles = {
          left: `${bubble}px`,
          top: `${yStartingPosition}px`,
        };

        const delay = 0.2 + index * 0.075;

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
              y: { duration: 0.25, delay: delay },
              default: { delay: delay + 0.15, duration: 0 },
              opacity: { delay: delay, duration: 0.25, times: [0, 0.01, 0.99, 1] },
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
