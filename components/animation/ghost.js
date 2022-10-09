import { motion } from "framer-motion";

const animationDuration = 0.6;

const beforeClasses =
  "before:content-[''] before:absolute before:top-[50%] before:left-[50%] before:w-6 before:h-6 before:rounded-[50%] before:bg-[#5f0a68] before:-translate-x-1/2 before:-translate-y-1/2";
const afterClasses =
  "after:content-[''] after:absolute after:top-[50%] after:left-[50%] after:w-3 after:h-3 after:rounded-[50%] after:bg-black after:-translate-x-1/2 after:-translate-y-1/2";

export default function GhostAnimation({ teamLocation, enemyTeamLocation }) {
  if (teamLocation === undefined || enemyTeamLocation === undefined) {
    return;
  }

  const enemyCoordinates = getEnemyCoordinates(enemyTeamLocation);
  const myCoordinates = getMyCoordinates(teamLocation);

  if (enemyCoordinates === undefined || myCoordinates === undefined) {
    return null;
  }

  const xStartingPosition = enemyCoordinates.right - myCoordinates.left - 48;
  const yStartingPosition = 90; //enemyCoordinates.bottom - enemyCoordinates.top / 2;

  const distanceToMove =
    myCoordinates.left +
    48 -
    ((enemyCoordinates.right - enemyCoordinates.left) / 2 +
      enemyCoordinates.left);

  let styles = {
    left: `${xStartingPosition}px`,
    top: `${yStartingPosition}px`,
  };

  return (
    <motion.div
      animate={{ x: distanceToMove, opacity: 0, y: [0, -15, 0, -15] }}
      transition={{
        x: { duration: animationDuration, type: "tween", ease: "linear" },
        y: { type: "tween", ease: "linear" },
        opacity: { delay: animationDuration, duration: 0 },
      }}
      className={`absolute h-9 w-9 rounded-full bg-ghost-primary after:content-[''] ${beforeClasses} ${afterClasses}`}
      style={styles}
    ></motion.div>
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
