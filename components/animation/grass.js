import { motion } from "framer-motion";
const razorLeafs = [null, null, null];

export default function GrassAnimation({ teamLocation, enemyTeamLocation }) {
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
      {razorLeafs.map((_water, index) => {
        let styles = {
          left: `${xStartingPosition}px`,
          top: `${index % 2 === 0 ? 90 : 62}px`,
        };

        const delay = index * 0.15;

        return (
          <motion.div
            animate={{
              x: distanceToMove * -1,
              opacity: [0, 1, 1, 0],
              rotate: 1080,
              y: [0, index % 2 === 0 ? 60 : -60, 0],
            }}
            transition={{
              default: { delay: delay, duration: 0.4 },
              opacity: { delay: delay, duration: 0.4, times: [0, 0.01, 0.99, 1] },
            }}
            className="absolute h-12 w-12 rounded-full border-grass-secondary border-t-8 opacity-0 border-r-8 z-10"
            key={index}
            style={styles}
          ></motion.div>
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
