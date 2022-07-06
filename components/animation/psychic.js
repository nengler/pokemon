import { motion } from "framer-motion";

const xFactor = 20;
const animationDuration = 0.3;
const circles = [0, -30, 30, -15, 30, 0];

export default function PsychicAnimation({ teamLocation, enemyTeamLocation }) {
  if (teamLocation === undefined || enemyTeamLocation === undefined) {
    return;
  }

  const enemyCoordinates = getEnemyCoordinates(enemyTeamLocation);
  const myCoordinates = getMyCoordinates(teamLocation);

  if (enemyCoordinates === undefined || myCoordinates === undefined) {
    return null;
  }

  const xStartingPosition = enemyCoordinates.right - myCoordinates.left - xFactor;
  const yStartingPosition = 62;

  const distanceToMove =
    (myCoordinates.left + xFactor - ((enemyCoordinates.right - enemyCoordinates.left) / 2 + enemyCoordinates.left)) *
    -1;

  return (
    <>
      {circles.map((circle, index) => {
        let styles = {
          left: `${xStartingPosition}px`,
          top: `${yStartingPosition}px`,
        };

        const delay = index * 0.1;

        return (
          <motion.div
            initial={{ scale: 0.4 }}
            animate={{
              x: distanceToMove * -1,
              opacity: [0, 1, 1, 0],
              y: circle,
              scale: 1,
            }}
            transition={{
              default: { duration: animationDuration, delay: delay },
              opacity: { duration: animationDuration, delay: delay, times: [0, 0.01, 0.99, 1] },
            }}
            className="absolute h-12 w-6 border-4 rounded-[50%] border-[#f4bf5d] z-10"
            key={index}
            style={styles}
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
