import { getImgCenter } from "constants/animationConfig";
import { motion } from "framer-motion";
import { getDistanceBetweenElements, getPositionAtCenter, getTeamLocation } from "util/animationMethods";
import Image from "next/image";

export default function RockAnimation({ teamLocation, enemyTeamLocation }) {
  if (teamLocation === undefined || enemyTeamLocation === undefined) {
    return;
  }

  const risingDuration = 0.45;
  const movingDuration = 0.2;
  const idlePause = 0.05;
  const animationDelay = 0.1;
  const rocks = [0, -40, 40];

  const enemyCoordinates = getTeamLocation(enemyTeamLocation);
  const myCoordinates = getTeamLocation(teamLocation);

  if (enemyCoordinates === undefined || myCoordinates === undefined) {
    return null;
  }

  const enemyCenter = getPositionAtCenter(enemyCoordinates);
  const myCenter = getPositionAtCenter(myCoordinates);

  const xFactor = teamLocation.dataset.myTeam === "true" ? 1 : -1;
  const distanceToMove = getDistanceBetweenElements(enemyCenter, myCenter) * xFactor;
  const yStartingPosition = getImgCenter(-24);

  const roundToTwoDecimals = (number) => Number(number.toFixed(2));

  return (
    <>
      {rocks.map((rock, index) => {
        const cssDistance = `calc(50% - 24px + ${rock}px)`;
        let styles = { top: `${yStartingPosition}px`, left: cssDistance };

        const risingDelay = index !== 0 ? animationDelay : 0;
        const movingDelay = index === 0 ? animationDelay : 0;

        return (
          <motion.div
            initial={{ y: 100 }}
            animate={{
              opacity: [0, 1, 1, 0],
              y: index === 0 ? -20 : 15,
              x: distanceToMove + distanceToMove / 4,
            }}
            transition={{
              x: {
                duration: movingDuration,
                delay: roundToTwoDecimals(risingDuration + movingDelay + risingDelay + idlePause),
              },
              y: {
                delay: risingDelay,
                duration: roundToTwoDecimals(risingDuration + movingDelay),
                ease: "linear",
              },
              opacity: {
                delay: risingDelay,
                duration: roundToTwoDecimals(risingDuration + movingDelay + risingDelay + idlePause + movingDuration),
                times: [0, 0.01, 0.95, 1],
              },
            }}
            className="absolute h-12 w-12 z-[2]"
            key={index}
            style={styles}
          >
            <Image src="/assets/rock.png" height={48} width={48} />
          </motion.div>
        );
      })}
    </>
  );
}
