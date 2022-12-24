import { getImgCenter } from "constants/animationConfig";
import { motion } from "framer-motion";
import Image from "next/image";
import { getDistanceBetweenElements, getPositionAtCenter, getTeamLocation } from "util/animationMethods";
import PlusCircle from "./svg/plusCircle";

export default function SteelAnimation({ teamLocation, enemyTeamLocation }) {
  if (teamLocation === undefined || enemyTeamLocation === undefined) {
    return;
  }

  const yStartingPosition = getImgCenter(-24);
  const growingDuration = 0.35;
  const movingDuration = 0.35;

  const enemyCoordinates = getTeamLocation(enemyTeamLocation);
  const myCoordinates = getTeamLocation(teamLocation);

  if (enemyCoordinates === undefined || myCoordinates === undefined) {
    return null;
  }

  const enemyCenter = getPositionAtCenter(enemyCoordinates);
  const myCenter = getPositionAtCenter(myCoordinates);

  const xFactor = teamLocation.dataset.myTeam === "true" ? 1 : -1;

  const distanceToMove = getDistanceBetweenElements(enemyCenter, myCenter) * xFactor;

  const xOffset = 60 * xFactor;

  const styles = {
    left: `calc(50% - 24px + ${xOffset}px)`,
    top: `${yStartingPosition}px`,
  };

  const hitStyles = {
    top: "calc(50% - 16px)",
    left: `calc(50% - 16px + ${distanceToMove * xFactor}px)`,
    "--fadeindelay": `550ms`,
  };

  return (
    <>
      <div className="absolute h-8 w-8 fadeInFadeOuAnimation" style={hitStyles}>
        <Image src="/assets/hit.png" width={32} height={32} />
      </div>
      <motion.div
        initial={{ scale: 0.5 }}
        animate={{
          scale: [0.5, 1.3, 1],
          x: distanceToMove - xOffset,
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
            times: [0, 0.3, 0.6, 1],
            duration: growingDuration + movingDuration,
          },
          rotate: { delay: growingDuration, duration: 0.25, repeat: Infinity },
        }}
        className="absolute h-12 w-12 rounded-full z-10 opacity-0 flex justify-center items-center text-steel-secondary bg-steel-primary"
        style={styles}
      >
        <PlusCircle />
      </motion.div>
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
