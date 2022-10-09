import { motion } from "framer-motion";
import RockIcon from "public/assets/newRock";

const animationDuration = 0.35;
const locations = [50, 45, 60, 50, 30, 64];

export default function RockAnimation({ teamLocation, enemyTeamLocation }) {
  if (teamLocation === undefined || enemyTeamLocation === undefined) {
    return;
  }

  const enemyCoordinates = getEnemyCoordinates(enemyTeamLocation);
  const myCoordinates = getMyCoordinates(teamLocation);

  if (enemyCoordinates === undefined || myCoordinates === undefined) {
    return null;
  }

  const yStartingPosition = 0;

  return (
    <>
      {locations.map((rock, index) => {
        let styles = {
          left: `${rock}px`,
          top: `${yStartingPosition}px`,
        };

        const delay = index * 0.07;

        return (
          <motion.div
            animate={{
              opacity: [0, 1, 1, 0],
              y: index % 2 === 1 ? [0, 100, 75] : [0, 100, 85],
            }}
            transition={{
              y: {
                delay: delay,
                duration: animationDuration,
                times: [0, 0.75, 1],
              },
              opacity: {
                delay: delay,
                duration: animationDuration,
                times: [0, 0.01, 0.99, 1],
              },
            }}
            className={`fill-[#be8b3f] stroke-rock-secondary opacity-0 absolute ${
              index % 2 === 1 ? "h-8 w-6" : "h-10 w-8"
            } z-10`}
            key={index}
            style={styles}
          >
            <RockIcon />
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
