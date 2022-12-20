import { getImgCenter } from "constants/animationConfig";
import { motion } from "framer-motion";
import { getDistanceBetweenElements, getPositionAtCenter, getTeamLocation } from "util/animationMethods";
import RockIcon from "./svg/newRock";

export default function RockAnimation({ teamLocation, enemyTeamLocation }) {
  if (teamLocation === undefined || enemyTeamLocation === undefined) {
    return;
  }

  const animationDuration = 0.35;
  const locations = [-20, 0, 20, 0, -20, 15];

  const enemyCoordinates = getTeamLocation(enemyTeamLocation);
  const myCoordinates = getTeamLocation(teamLocation);

  if (enemyCoordinates === undefined || myCoordinates === undefined) {
    return null;
  }

  const enemyCenter = getPositionAtCenter(enemyCoordinates);
  const myCenter = getPositionAtCenter(myCoordinates);

  const distanceToMove = getDistanceBetweenElements(enemyCenter, myCenter);

  return (
    <>
      {locations.map((rock, index) => {
        const cssDistance = `calc(${distanceToMove}px + 50% - 14px + ${rock}px)`;
        let styles = {};

        if (teamLocation.dataset.myTeam === "true") {
          styles.left = cssDistance;
        } else {
          styles.right = cssDistance;
        }

        const delay = index * 0.07;

        return (
          <motion.div
            animate={{
              opacity: [0, 1, 1, 0],
              y: index % 2 === 1 ? [0, getImgCenter(30), getImgCenter(-16)] : [0, getImgCenter(30), getImgCenter(-20)],
            }}
            transition={{
              y: {
                delay: delay,
                duration: animationDuration,
                times: [0, 0.75, 1],
              },
              opacity: {
                delay: delay,
                duration: animationDuration,
                times: [0, 0.01, 0.99, 1],
              },
            }}
            className={`fill-[#be8b3f] stroke-rock-secondary opacity-0 absolute ${
              index % 2 === 1 ? "h-8 w-6" : "h-10 w-8"
            } z-10`}
            key={index}
            style={styles}
          >
            <RockIcon />
          </motion.div>
        );
      })}
    </>
  );
}
