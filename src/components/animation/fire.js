import { motion } from "framer-motion";
import Flame from "/public/assets/flame";

const animationDuration = 0.6;

const fires = [
  { top: 2, left: 0 },
  { top: 15, left: 5 },
  { top: -5, left: -5 },
  { top: 10, left: -10 },
  { top: 5, left: 5 },
];

export default function FireAnimation({ teamLocation, enemyTeamLocation }) {
  if (teamLocation === undefined || enemyTeamLocation === undefined) {
    return;
  }

  const enemyCoordinates = getEnemyCoordinates(enemyTeamLocation);
  const myCoordinates = getMyCoordinates(teamLocation);

  if (enemyCoordinates === undefined || myCoordinates === undefined) {
    return null;
  }

  const xStartingPosition = enemyCoordinates.right - myCoordinates.left - 48;
  const yStartingPosition = 90;

  const distanceToMove =
    myCoordinates.left + 48 - ((enemyCoordinates.right - enemyCoordinates.left) / 2 + enemyCoordinates.left);

  return (
    <>
      {fires.map((fire, index) => {
        let styles = {
          left: `${xStartingPosition}px`,
          top: `${yStartingPosition}px`,
        };

        const delay = index * 0.05;

        return (
          <motion.div
            animate={{
              x: distanceToMove + fire.left,
              y: fire.top,
              opacity: [0, 1, 1, 0],
            }}
            transition={{
              x: {
                type: "spring",
                stiffness: 60,
                duration: animationDuration,
                delay: delay,
              },
              y: { duration: animationDuration, delay: delay },
              opacity: {
                duration: animationDuration,
                delay: delay,
                times: [0, 0.01, 0.99, 1],
              },
            }}
            className="absolute h-5 w-5  fill-red-500 z-10 opacity-0"
            key={index}
            style={styles}
          >
            <Flame />
          </motion.div>
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
