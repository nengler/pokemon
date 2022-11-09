import { motion } from "framer-motion";
import { getDistanceBetweenElements, getPositionAtCenter, getTeamLocation } from "util/animationMethods";

const animationLength = 0.35;
const waterPulses = [null, null, null];
const yStartingPosition = 62;

export default function WaterAnimation({ teamLocation, enemyTeamLocation }) {
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
      {waterPulses.map((_water, index) => {
        let styles = {
          left: "calc(50% - 16px)",
          top: `${yStartingPosition}px`,
        };

        const delay = index * 0.175;

        return (
          <motion.div
            animate={{
              x: distanceToMove * xFactor,
              opacity: [0, 1, 1, 0],
              scale: [1, 0.6, 1, 0.9],
            }}
            transition={{
              x: { type: "tween", ease: "linear", duration: animationLength, delay: delay },
              scale: { delay: delay, duration: animationLength },
              opacity: { delay: delay, duration: animationLength, times: [0, 0.01, 0.9, 1] },
            }}
            className="absolute h-20 w-8 border-4 rounded-[50%] border-[#79baed] z-10"
            key={index}
            style={styles}
          ></motion.div>
        );
      })}
    </>
  );
}
