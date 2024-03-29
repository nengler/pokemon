import { motion } from "framer-motion";
import { getDistanceBetweenElements, getPositionAtCenter, getTeamLocation } from "util/animationMethods";
import { imgHeight } from "constants/animationConfig";
import Flame from "./svg/flame";

export default function FireAnimation({ teamLocation, enemyTeamLocation }) {
  const animationDuration = 0.65;
  const animationDelay = 0.02;
  const yStartingPosition = imgHeight / 2 - 10;

  const fires = [
    { top: 2, left: 0 },
    { top: 15, left: 5 },
    { top: -5, left: -5 },
    { top: 10, left: -30 },
    { top: -15, left: -20 },
    { top: 0, left: 0 },
  ];

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
  const xFactor = teamLocation.dataset.myTeam === "true" ? 1 : -1;

  const distanceToMove = getDistanceBetweenElements(enemyCenter, myCenter);

  return (
    <>
      {fires.map((fire, index) => {
        let styles = {
          left: "calc(50% - 10px)",
          top: `${yStartingPosition}px`,
        };

        const delay = index * animationDelay;

        return (
          <motion.div
            animate={{
              x: distanceToMove * xFactor + fire.left * xFactor,
              y: fire.top,
              opacity: [0, 1, 1, 0],
              scale: [1, 1, 1.3, 0],
            }}
            transition={{
              x: {
                type: "spring",
                stiffness: 60,
                duration: animationDuration * 0.6,
                delay: delay,
              },
              y: { duration: animationDuration, delay: delay },
              opacity: {
                duration: animationDuration,
                delay: delay,
                times: [0, 0.01, 1, 1],
                scale: [0, 0.4, 0.6, 1],
              },
            }}
            className="absolute h-5 w-5 fill-red-500 z-10 opacity-0"
            key={index}
            style={styles}
          >
            <Flame />
          </motion.div>
        );
      })}
    </>
  );
}
