import { motion } from "framer-motion";
import { getDistanceBetweenElements, getPositionAtCenter, getTeamLocation } from "util/animationMethods";
import { imgHeight } from "constants/animationConfig";

const earthShots = Array(3).fill(null);
const yStartingPosition = imgHeight / 2 - 10;
const animationDuration = 0.4;

export default function GroundAnimation({ teamLocation, enemyTeamLocation }) {
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
      {earthShots.map((_earthShot, index) => {
        let styles = {
          left: "calc(50% - 10px)",
          top: `${yStartingPosition}px`,
        };

        const delay = index * 0.2;

        return (
          <motion.div
            animate={{ x: distanceToMove * xFactor, opacity: [0, 1, 1, 0] }}
            transition={{
              x: {
                ease: "easeOut",
                duration: animationDuration,
                delay: delay,
              },
              y: { duration: animationDuration, delay: delay },
              opacity: {
                duration: animationDuration,
                delay: delay,
                times: [0, 0.01, 0.5, 1],
              },
            }}
            className="absolute w-5 h-5 bg-ground-primary rounded-full border border-ground-secondary z-[1]"
            key={index}
            style={styles}
          />
        );
      })}
    </>
  );
}
