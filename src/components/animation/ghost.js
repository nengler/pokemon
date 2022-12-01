import { imgHeight } from "constants/animationConfig";
import { motion } from "framer-motion";
import { getDistanceBetweenElements, getPositionAtCenter, getTeamLocation } from "util/animationMethods";

export default function GhostAnimation({ teamLocation, enemyTeamLocation }) {
  const animationDuration = 0.6;

  const beforeClasses =
    "before:content-[''] before:absolute before:top-[50%] before:left-[50%] before:w-6 before:h-6 before:rounded-[50%] before:bg-[#5f0a68] before:-translate-x-1/2 before:-translate-y-1/2";
  const afterClasses =
    "after:content-[''] after:absolute after:top-[50%] after:left-[50%] after:w-3 after:h-3 after:rounded-[50%] after:bg-black after:-translate-x-1/2 after:-translate-y-1/2";

  const yStartingPosition = imgHeight / 2 - 18;

  if (teamLocation === undefined || enemyTeamLocation === undefined) {
    return;
  }

  const enemyCoordinates = getTeamLocation(enemyTeamLocation);
  const myCoordinates = getTeamLocation(teamLocation);

  if (enemyCoordinates === undefined || myCoordinates === undefined) {
    return null;
  }

  const enemyCenter = getPositionAtCenter(enemyCoordinates);
  const myCenter = getPositionAtCenter(myCoordinates);

  const distanceToMove = getDistanceBetweenElements(enemyCenter, myCenter);

  const xFactor = teamLocation.dataset.myTeam === "true" ? 1 : -1;

  let styles = {
    left: "calc(50% - 18px)",
    top: `${yStartingPosition}px`,
  };

  return (
    <motion.div
      animate={{ x: distanceToMove * xFactor, opacity: [0, 1, 0.5, 1, 0], y: [0, -15, 0, -15] }}
      transition={{
        x: { duration: animationDuration, type: "tween", ease: "linear" },
        y: { type: "tween", ease: "linear" },
        opacity: { duration: animationDuration, times: [0, 0.01, 0.5, 0.86, 1] },
      }}
      className={`z-[1] absolute h-9 w-9 rounded-full bg-ghost-primary after:content-[''] ${beforeClasses} ${afterClasses}`}
      style={styles}
    />
  );
}
