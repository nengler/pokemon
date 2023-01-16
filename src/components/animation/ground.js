import { motion } from "framer-motion";
import { getDistanceBetweenElements, getPositionAtCenter, getTeamLocation } from "util/animationMethods";
import { getImgCenter } from "constants/animationConfig";

export default function GroundAnimation({ teamLocation, enemyTeamLocation }) {
  if (teamLocation === undefined || enemyTeamLocation === undefined) {
    return;
  }

  const earthShots = Array(12).fill(null);
  const yStartingPosition = getImgCenter(-10);
  const animationDuration = 0.35;
  const animationDelay = 0.035;

  const enemyCoordinates = getTeamLocation(enemyTeamLocation);
  const myCoordinates = getTeamLocation(teamLocation);

  if (enemyCoordinates === undefined || myCoordinates === undefined) {
    return null;
  }

  const enemyCenter = getPositionAtCenter(enemyCoordinates);
  const myCenter = getPositionAtCenter(myCoordinates);

  const xFactor = teamLocation.dataset.myTeam === "true" ? 1 : -1;
  const distanceToMove = getDistanceBetweenElements(enemyCenter, myCenter) * xFactor;

  const getYRotation = (index) => {
    const splitter = earthShots.length / 2;
    const bottom = 40;
    const top = -40;
    const totalDistance = bottom - top;
    const iteration = Math.floor(index / splitter);
    const b = (index % splitter) + 1;
    const offset = (b / (splitter + 1)) * totalDistance;
    const timeToPeak = 0.5 - 0.5 * (b / (splitter + 1));

    if (iteration === 0) {
      const ranges = [bottom, bottom - offset, top];
      return [ranges, 0];
    } else if (iteration === 1) {
      const ranges = [bottom - offset, top, top + offset];
      const times = [0, timeToPeak, 1];
      return [ranges, times];
    }
  };

  return (
    <>
      {earthShots.map((_earthShot, index) => {
        let styles = {
          left: "calc(50% - 10px)",
          top: `${yStartingPosition}px`,
        };

        const [yRotation, yTimes] = getYRotation(index);

        const delay = index * animationDelay;
        return (
          <motion.div
            animate={{ x: distanceToMove, opacity: [0, 1, 1, 0], y: yRotation }}
            transition={{
              x: {
                ease: "linear",
                duration: animationDuration,
                delay: delay,
              },
              y: {
                ease: "linear",
                duration: animationDuration,
                delay: delay,
                times: yTimes,
              },
              opacity: {
                duration: animationDuration,
                delay: delay,
                times: [0, 0.01, 0.99, 1],
              },
            }}
            className="absolute w-8 h-8 bg-[#e1c9aa] rounded-full z-[1]"
            key={index}
            style={styles}
          />
        );
      })}
    </>
  );
}
