import { motion } from "framer-motion";
import { getDistanceBetweenElements, getPositionAtCenter, getTeamLocation } from "util/animationMethods";
import NeedleIcon from "/public/assets/needle";
import { imgHeight } from "constants/animationConfig";

export default function BugAnimation({ teamLocation, enemyTeamLocation }) {
  const animationDuration = 0.4;
  const yStartingPosition = imgHeight / 2 - 16;

  const neeldes = [null, null, null];

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
      {neeldes.map((_circle, index) => {
        let styles = {
          left: "calc(50% - 12px)",
          top: `${yStartingPosition}px`,
        };

        const delay = 0.15 * index;

        return (
          <motion.div
            initial={{
              rotate: teamLocation.dataset.myTeam === "true" ? 45 : -45,
            }}
            animate={{
              x: distanceToMove * xFactor,
              opacity: [0, 1, 1, 0],
              y: [0, -55, 0],
              rotate: teamLocation.dataset.myTeam === "true" ? 135 : -135,
            }}
            transition={{
              default: { duration: animationDuration, delay: delay },
              opacity: {
                duration: animationDuration,
                delay: delay,
                times: [0, 0.01, 0.9],
              },
            }}
            className="absolute z-[1]"
            key={index}
            style={styles}
          >
            <NeedleIcon />
          </motion.div>
        );
      })}
    </>
  );
}
