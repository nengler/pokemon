import { motion } from "framer-motion";
import NeedleIcon from "/public/assets/needle";

const baseXFactor = 60;
const animationDuration = 0.4;
const yStartingPosition = 90;

const neeldes = [null, null, null];

export default function BugAnimation({ teamLocation, enemyTeamLocation }) {
  if (teamLocation === undefined || enemyTeamLocation === undefined) {
    return;
  }

  const enemyCoordinates = getEnemyCoordinates(enemyTeamLocation);
  const myCoordinates = getMyCoordinates(teamLocation);

  if (enemyCoordinates === undefined || myCoordinates === undefined) {
    return null;
  }

  const xFactor =
    teamLocation.dataset.myTeam === "true"
      ? 1 * baseXFactor
      : 0.5 * baseXFactor;

  const xStartingPosition =
    enemyCoordinates.right - myCoordinates.left - xFactor;

  const distanceToMove =
    myCoordinates.left +
    xFactor -
    ((enemyCoordinates.right - enemyCoordinates.left) / 2 +
      enemyCoordinates.left);

  return (
    <>
      {neeldes.map((_circle, index) => {
        let styles = {
          left: `${xStartingPosition}px`,
          top: `${yStartingPosition}px`,
        };

        const delay = 0.15 * index;

        return (
          <motion.div
            initial={{
              rotate: teamLocation.dataset.myTeam === "true" ? -45 : 45,
            }}
            animate={{
              x: distanceToMove,
              opacity: [0, 1, 1, 0],
              y: [0, -55, 0],
              rotate: teamLocation.dataset.myTeam === "true" ? -135 : 135,
            }}
            transition={{
              default: { duration: animationDuration, delay: delay },
              opacity: {
                duration: animationDuration,
                delay: delay,
                times: [0, 0.01, 0.9],
              },
            }}
            className="absolute"
            key={index}
            style={styles}
          >
            <NeedleIcon />
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
