import { motion } from "framer-motion";
import PlusCircle from "/public/assets/plusCircle";

const xFactor = 50;
const yStartingPosition = 80;
const growingDuration = 0.25;
const movingDuration = 0.35;

export default function SteelAnimation({ teamLocation, enemyTeamLocation }) {
  if (teamLocation === undefined || enemyTeamLocation === undefined) {
    return;
  }

  const enemyCoordinates = getEnemyCoordinates(enemyTeamLocation);
  const myCoordinates = getMyCoordinates(teamLocation);

  if (enemyCoordinates === undefined || myCoordinates === undefined) {
    return null;
  }

  const xStartingPosition =
    enemyCoordinates.right - myCoordinates.left - xFactor;

  const distanceToMove =
    (myCoordinates.left +
      xFactor -
      ((enemyCoordinates.right - enemyCoordinates.left) / 2 +
        enemyCoordinates.left)) *
    -1;

  const styles = {
    left: `${xStartingPosition}px`,
    top: `${yStartingPosition}px`,
  };

  return (
    <motion.div
      initial={{ scale: 0.5 }}
      animate={{
        scale: [0.5, 1.3, 1],
        x: distanceToMove * -1,
        opacity: [0, 1, 1, 0],
        rotate: 360,
      }}
      transition={{
        scale: { duration: growingDuration, times: [0, 0.8, 1] },
        x: {
          delay: growingDuration + 0.1,
          duration: movingDuration,
          type: "spring",
        },
        opacity: {
          times: [0, 0.3, 0.8, 1],
          duration: growingDuration + movingDuration,
        },
        rotate: { delay: growingDuration, duration: 0.25, repeat: Infinity },
      }}
      className="absolute h-12 w-12 rounded-full z-10 opacity-0 flex justify-center items-center text-steel-secondary bg-steel-primary"
      style={styles}
    >
      <PlusCircle />
    </motion.div>
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
