import { motion } from "framer-motion";

const baseXFactor = 64;
const animationLength = 0.35;
const waterPulses = [null, null, null];

export default function WaterAnimation({ teamLocation, enemyTeamLocation }) {
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
  const yStartingPosition = 62; //enemyCoordinates.bottom - enemyCoordinates.top / 2;

  const distanceToMove =
    (myCoordinates.left + xFactor - ((enemyCoordinates.right - enemyCoordinates.left) / 2 + enemyCoordinates.left)) *
    -1;

  return (
    <>
      {waterPulses.map((_water, index) => {
        let styles = {
          left: `${xStartingPosition}px`,
          top: `${yStartingPosition}px`,
        };

        const delay = index * 0.175;

        return (
          <motion.div
            animate={{
              x: distanceToMove * -1,
              opacity: [0, 1, 1, 0],
              scale: [1, 0.6, 1, 0.9],
            }}
            transition={{
              x: { type: "tween", ease: "linear", duration: animationLength, delay: delay },
              scale: { delay: delay, duration: animationLength },
              opacity: { delay: delay, duration: animationLength, times: [0, 0.01, 0.99, 1] },
            }}
            className="absolute h-20 w-8 border-4 rounded-[50%] border-[#79baed] z-10"
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
