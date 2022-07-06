import useInterval from "components/useInterval";
import { motion } from "framer-motion";
import RockIcon from "public/assets/rock";
import { useState } from "react";

const animationDuration = 0.35;
const getRandomDiviation = () => Math.floor(Math.random() * 50) + 15;

const locations = [50, 45, 60, 50, 20, 64, 40];

export default function RockAnimation({ teamLocation, enemyTeamLocation }) {
  const [rocks, setRocks] = useState([locations[0]]);

  useInterval(
    () => {
      setRocks([...rocks, locations[rocks.length]]);
    },
    rocks.length < 6 ? 70 : null
  );

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
      {rocks.map((rock, index) => {
        let styles = {
          left: `${rock}px`,
          top: `${yStartingPosition}px`,
        };

        return (
          <motion.div
            animate={{
              opacity: 0,
              y: index % 2 === 1 ? [0, 100, 75] : [0, 100, 85],
            }}
            transition={{
              y: { duration: animationDuration, times: [0, 0.75, 1] },
              opacity: { delay: animationDuration, duration: 0 },
            }}
            className={`absolute ${index % 2 === 1 ? "h-8 w-6" : "h-10 w-8"} z-10`}
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
