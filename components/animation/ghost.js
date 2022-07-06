import { motion } from "framer-motion";

const animationDuration = 0.6;

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
    myCoordinates.left + 48 - ((enemyCoordinates.right - enemyCoordinates.left) / 2 + enemyCoordinates.left);

  let styles = {
    left: `${xStartingPosition}px`,
    top: `${yStartingPosition}px`,
  };

  return (
    <motion.div
      animate={{ x: distanceToMove, opacity: 0 }}
      transition={{
        x: { duration: animationDuration, type: "tween", ease: "linear" },
        opacity: { delay: animationDuration, duration: 0 },
      }}
      className="absolute h-8 w-8 rounded-full bg-ghost-primary flex items-center"
      style={styles}
    >
      <div className="absolute -left-4 h-2 w-2 bg-ghost-secondary border border-ghost-primary rounded-full" />
      <div className="absolute -left-8 h-2 w-2 bg-ghost-secondary border border-ghost-primary rounded-full" />
      <div className="absolute -left-12 h-2 w-2 bg-ghost-secondary border border-ghost-primary rounded-full" />
      <div className="absolute -left-16 opacity-30 h-2 w-2 bg-ghost-secondary border border-ghost-primary rounded-full" />
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
