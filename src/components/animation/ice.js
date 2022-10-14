import { motion } from "framer-motion";
import AuroraCircle from "/public/assets/auroraCircle";

const xFactor = 50;
const beams = Array(10).fill(null);
const animationDuration = 0.3;
const animationDelay = 0.05;
const yStartingPosition = 80;

export default function IceAnimation({ teamLocation, enemyTeamLocation }) {
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
    myCoordinates.left +
    xFactor -
    ((enemyCoordinates.right - enemyCoordinates.left) / 2 +
      enemyCoordinates.left);

  return (
    <>
      {beams.map((_beam, index) => {
        let styles = {
          left: `${xStartingPosition - 8}px`,
          top: `${yStartingPosition}px`,
        };

        const delay = index * animationDelay;

        return (
          <motion.div
            key={index}
            initial={{ scaleX: 0.5 }}
            animate={{ x: distanceToMove, opacity: [0, 1, 1, 0] }}
            transition={{
              x: { duration: animationDuration, delay: delay },
              opacity: {
                delay: delay,
                duration: animationDuration,
                times: [0, 0.01, 0.99, 1],
              },
            }}
            className="absolute w-12 opacity-0 z-10"
            style={styles}
          >
            <motion.div
              initial={{ rotate: 0 }}
              animate={{ rotate: 360 }}
              transition={{ rotate: { duration: 0.2, repeat: Infinity } }}
            >
              <div
                style={{ transform: index >= 5 ? "scale(1.5)" : "scale(1)" }}
              >
                <AuroraCircle />
              </div>
            </motion.div>
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
