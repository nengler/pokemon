import { imgHeight } from "constants/animationConfig";
import { motion } from "framer-motion";
import { getDistanceBetweenElements, getPositionAtCenter, getTeamLocation } from "util/animationMethods";
import AuroraCircle from "/public/assets/auroraCircle";

export default function IceAnimation({ teamLocation, enemyTeamLocation }) {
  if (teamLocation === undefined || enemyTeamLocation === undefined) {
    return;
  }

  const beams = Array(10).fill(null);
  const animationDuration = 0.3;
  const animationDelay = 0.05;
  const yStartingPosition = imgHeight / 2 - 24;

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
      {beams.map((_beam, index) => {
        let styles = {
          left: "calc(50% - 24px)",
          top: `${yStartingPosition}px`,
        };

        const delay = index * animationDelay;

        return (
          <motion.div
            key={index}
            initial={{ scaleX: 0.5 }}
            animate={{ x: distanceToMove * xFactor, opacity: [0, 1, 1, 0] }}
            transition={{
              x: { duration: animationDuration, delay: delay },
              opacity: {
                delay: delay,
                duration: animationDuration,
                times: [0, 0.01, 0.99, 1],
              },
            }}
            className="absolute w-12 opacity-0 z-10"
            style={styles}
          >
            <motion.div
              initial={{ rotate: 0 }}
              animate={{ rotate: 360 }}
              transition={{ rotate: { duration: 0.2, repeat: Infinity } }}
            >
              <div style={{ transform: index >= 5 ? "scale(1.5)" : "scale(1)" }}>
                <AuroraCircle />
              </div>
            </motion.div>
          </motion.div>
        );
      })}
    </>
  );
}
