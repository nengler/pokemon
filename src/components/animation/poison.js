import { motion } from "framer-motion";
import { getDistanceBetweenElements, getPositionAtCenter, getTeamLocation } from "util/animationMethods";
import { imgHeight } from "constants/animationConfig";

export default function PoisonAnimation({ teamLocation, enemyTeamLocation }) {
  if (teamLocation === undefined || enemyTeamLocation === undefined) {
    return;
  }

  const poisonShotDuration = 0.4;
  const poisonOpacityDuration = 0.05;
  const bubbleRisingDuration = 0.2;
  const yStartingPosition = imgHeight / 2 - 12;
  const bubbles = [0, -15, 15];

  const enemyCoordinates = getTeamLocation(enemyTeamLocation);
  const myCoordinates = getTeamLocation(teamLocation);

  const enemyCenter = getPositionAtCenter(enemyCoordinates);
  const myCenter = getPositionAtCenter(myCoordinates);

  const distanceToMove = getDistanceBetweenElements(enemyCenter, myCenter);

  if (enemyCoordinates === undefined || myCoordinates === undefined) {
    return null;
  }

  const xFactor = teamLocation.dataset.myTeam === "true" ? 1 : -1;

  let styles = {
    left: "calc(50% - 12px)",
    top: `${yStartingPosition}px`,
  };

  return (
    <>
      <motion.div
        animate={{
          x: distanceToMove * xFactor,
          opacity: 0,
          y: [0, -50, 20],
        }}
        transition={{
          default: { duration: poisonShotDuration },
          opacity: { delay: poisonShotDuration - poisonOpacityDuration, duration: poisonOpacityDuration },
        }}
        className="absolute h-6 w-6 border-4 rounded-full bg-poison-primary border-poison-primary z-10"
        style={styles}
      />
      {bubbles.map((bubble, index) => {
        let circleStyles = {
          top: `${yStartingPosition + 20}px`,
        };

        if (teamLocation.dataset.myTeam === "true") {
          circleStyles.left = `calc(${distanceToMove + bubble}px + 50% - 12px)`;
        } else {
          circleStyles.right = `calc(${distanceToMove + bubble}px + 50% - 12px)`;
        }

        const delay = poisonShotDuration + index * 0.075;

        return (
          <motion.div
            animate={{
              opacity: [0, 1, 1, 0],
              y: -50,
              background: "rgba(255, 255, 255, 0)",
              borderBottomColor: "rgba(255, 255, 255, 0)",
              borderRightColor: "rgba(255, 255, 255, 0)",
              borderLeftColor: "rgba(255, 255, 255, 0)",
            }}
            transition={{
              y: { duration: bubbleRisingDuration, delay: delay },
              default: { delay: delay + 0.15, duration: 0 },
              opacity: { delay: delay, duration: bubbleRisingDuration, times: [0, 0.01, 0.99, 1] },
            }}
            className="absolute h-5 w-5 border-4 opacity-0 rounded-full bg-poison-primary border-poison-primary z-10"
            key={index}
            style={circleStyles}
          />
        );
      })}
    </>
  );
}
