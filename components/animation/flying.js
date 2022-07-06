import { motion } from "framer-motion";
import Tornado from "public/assets/tornado";

const yFactor = 30;
const animationDuration = 0.7;
const tornados = [null, null];

export default function FlyingAnimation({ teamLocation, enemyTeamLocation }) {
  if (teamLocation === undefined || enemyTeamLocation === undefined) {
    return;
  }

  const enemyCoordinates = getEnemyCoordinates(enemyTeamLocation);
  const myCoordinates = getMyCoordinates(teamLocation);

  if (enemyCoordinates === undefined || myCoordinates === undefined) {
    return null;
  }

  const xStartingPosition = enemyCoordinates.right - myCoordinates.left - 64;

  const distanceToMove =
    (myCoordinates.left + 64 - ((enemyCoordinates.right - enemyCoordinates.left) / 2 + enemyCoordinates.left)) * -1;

  return (
    <>
      {tornados.map((_tornado, index) => {
        let styles = {
          left: `${xStartingPosition}px`,
          top: `90px`,
        };

        return (
          <motion.div
            animate={{
              x: distanceToMove * -1,
              opacity: 0,
              rotateY: [0, 0, 360, 360, 0, 0],
              y: [0, index % 2 === 0 ? yFactor : -yFactor, 0],
            }}
            transition={{
              default: { duration: animationDuration },
              opacity: { delay: animationDuration, duration: 0 },
              rotate: { times: [0, 0.1, 0.2, 0.3, 0.6, 1], duration: animationDuration },
              y: { times: [0, 0.5, 0.8], duration: animationDuration },
            }}
            className="absolute h-12 w-12 z-10"
            key={index}
            style={styles}
          >
            <Tornado />
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
