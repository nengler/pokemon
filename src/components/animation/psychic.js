import { imgHeight } from "constants/animationConfig";
import { motion } from "framer-motion";
import { getDistanceBetweenElements, getPositionAtCenter, getTeamLocation } from "util/animationMethods";

export default function PsychicAnimation({ teamLocation, enemyTeamLocation }) {
  if (teamLocation === undefined || enemyTeamLocation === undefined) {
    return;
  }

  const animationDuration = 0.5;
  const animationDelay = 0.05;
  const circles = [0, -30, 30, -15, 30, 0, 40, -20];
  const yStartingPosition = imgHeight / 2 - 24;

  const enemyCoordinates = getTeamLocation(enemyTeamLocation);
  const myCoordinates = getTeamLocation(teamLocation);

  if (enemyCoordinates === undefined || myCoordinates === undefined) {
    return null;
  }

  const enemyCenter = getPositionAtCenter(enemyCoordinates);
  const myCenter = getPositionAtCenter(myCoordinates);

  const distanceBetween = getDistanceBetweenElements(enemyCenter, myCenter);
  const distanceToMove = distanceBetween + distanceBetween / 3;

  const xFactor = teamLocation.dataset.myTeam === "true" ? 1 : -1;

  return (
    <>
      {circles.map((circle, index) => {
        let styles = {
          left: "calc(50% - 12px)",
          top: `${yStartingPosition}px`,
        };

        const delay = index * animationDelay;

        return (
          <motion.div
            initial={{ scale: 0.5 }}
            animate={{
              x: distanceToMove * xFactor,
              opacity: [0, 1, 1, 0],
              y: circle,
              scale: 1,
            }}
            transition={{
              default: { duration: animationDuration, delay: delay },
              x: { duration: animationDuration, delay: delay, ease: "linear" },
              opacity: { duration: animationDuration, delay: delay, times: [0, 0.01, 0.7, 1] },
            }}
            className="z-[1] absolute h-12 w-6 border-4 rounded-[50%] border-[#f4bf5d] z-10"
            key={index}
            style={styles}
          />
        );
      })}
    </>
  );
}
