import { motion } from "framer-motion";
import { getDistanceBetweenElements, getPositionAtCenter, getTeamLocation } from "util/animationMethods";
import { getImgCenter } from "constants/animationConfig";

export default function WaterAnimation({ teamLocation, enemyTeamLocation }) {
  if (teamLocation === undefined || enemyTeamLocation === undefined) {
    return;
  }

  const bubbleScaleOptions = [
    [0.4, 0.6, 0.8],
    [0.5, 1, 1.5],
    [0.6, 0.9, 1.2],
  ];

  const animationLength = 0.55;
  const animationDelay = 0.015;
  const bubbles = Array.apply(null, Array(20)).map(() => Math.floor(Math.random() * 60) - 30);
  const yStartingPosition = getImgCenter(-10);

  const enemyCoordinates = getTeamLocation(enemyTeamLocation);
  const myCoordinates = getTeamLocation(teamLocation);

  if (enemyCoordinates === undefined || myCoordinates === undefined) {
    return null;
  }

  const enemyCenter = getPositionAtCenter(enemyCoordinates);
  const myCenter = getPositionAtCenter(myCoordinates);
  const xFactor = teamLocation.dataset.myTeam === "true" ? 1 : -1;
  const distanceToMove = getDistanceBetweenElements(enemyCenter, myCenter) * xFactor;

  return (
    <>
      {bubbles.map((bubbleOffset, index) => {
        const topOffsetFactor = Math.floor(Math.random() * 10) - 5;
        let styles = {
          left: `calc(50% - 16px + ${20 * xFactor}px)`,
          top: `${yStartingPosition + topOffsetFactor}px`,
        };

        const delay = index * animationDelay;

        return (
          <motion.div
            animate={{
              x: distanceToMove + distanceToMove / 6,
              y: bubbleOffset,
              opacity: [0, 0.8, 0.6, 0],
              scale: bubbleScaleOptions[index % 3],
            }}
            transition={{
              x: { ease: "linear", duration: animationLength, delay: delay },
              opacity: { delay: delay, duration: animationLength, times: [0, 0.01, 0.75, 1] },
              scale: { delay: delay, duration: animationLength, times: [0, 0.5, 1] },
              y: { duration: animationLength, delay: delay },
            }}
            className="absolute h-5 w-5 rounded-[50%] border-2 border-[#9babee] bg-[#f7f9f9] z-10"
            key={index}
            style={styles}
          />
        );
      })}
    </>
  );
}
