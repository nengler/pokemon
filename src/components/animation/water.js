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

  const animationLength = 0.35;
  const animationDelay = 0.03;
  const bubbles = Array.apply(null, Array(18)).map(() => Math.floor(Math.random() * 60) - 30);
  const yStartingPosition = getImgCenter(-8);

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
              x: distanceToMove * xFactor + distanceToMove / 4,
              y: bubbleOffset,
              opacity: [0, 0.8, 0.6, 0],
              scale: bubbleScaleOptions[index % 3],
            }}
            transition={{
              x: { ease: "linear", duration: animationLength, delay: delay },
              opacity: { delay: delay, duration: animationLength, times: [0, 0.01, 0.65, 1] },
              scale: { delay: delay, duration: animationLength, times: [0, 0.5, 1] },
              y: { duration: animationLength, delay: delay },
            }}
            className="absolute h-4 w-4 rounded-[50%] border border-[#d6ddf8] bg-[#f7f9f9] z-10"
            key={index}
            style={styles}
          />
        );
      })}
    </>
  );
}
