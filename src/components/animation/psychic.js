import { motion } from "framer-motion";
import { getDistanceBetweenElements, getPositionAtCenter, getTeamLocation } from "util/animationMethods";

const animationDuration = 0.39;
const circles = [0, -30, 30, -15, 30, 0];
const yStartingPosition = 62;

export default function PsychicAnimation({ teamLocation, enemyTeamLocation }) {
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

  return (
    <>
      {circles.map((circle, index) => {
        let styles = {
          left: "calc(50% - 12px)",
          top: `${yStartingPosition}px`,
        };

        const delay = index * 0.08;

        return (
          <motion.div
            initial={{ scale: 0.4 }}
            animate={{
              x: distanceToMove * xFactor,
              opacity: [0, 1, 1, 0],
              y: circle,
              scale: 1,
            }}
            transition={{
              default: { duration: animationDuration, delay: delay },
              opacity: { duration: animationDuration, delay: delay, times: [0, 0.01, 0.75, 1] },
            }}
            className="absolute h-12 w-6 border-4 rounded-[50%] border-[#f4bf5d] z-10"
            key={index}
            style={styles}
          />
        );
      })}
    </>
  );
}
