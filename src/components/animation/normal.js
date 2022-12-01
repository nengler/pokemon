import { motion } from "framer-motion";
import { getDistanceBetweenElements, getPositionAtCenter, getTeamLocation } from "util/animationMethods";
import StarIcon from "/public/assets/star";
import { getImgCenter } from "constants/animationConfig";

export default function NormalAnimation({ teamLocation, enemyTeamLocation }) {
  if (teamLocation === undefined || enemyTeamLocation === undefined) {
    return;
  }

  const animationDuration = 0.5;
  const hitTriggerDelay = 0.25;

  const hitTriggers = [
    { top: `${getImgCenter(20)}px`, left: 0 },
    { top: `${getImgCenter(0)}px`, left: 20 },
    { top: `${getImgCenter(-20)}px`, left: -15 },
  ];

  const stars = [0, 35, -40, 25, 10, -30];
  const yStartingPosition = getImgCenter(-16);

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
      {stars.map((star, index) => {
        let styles = {
          left: "calc(50% - 16px)",
          top: `${yStartingPosition}px`,
        };

        const delay = index * 0.075;

        return (
          <motion.div
            animate={{ x: distanceToMove * xFactor, y: star, opacity: [0, 1, 1, 0] }}
            transition={{
              x: {
                type: "spring",
                stiffness: 70,
                duration: animationDuration,
                delay: delay,
              },
              y: { duration: animationDuration, delay: delay },
              opacity: {
                delay: delay,
                duration: animationDuration,
                times: [0, 0.01, 0.5, 1],
              },
            }}
            className="absolute h-8 w-8 opacity-0"
            key={index}
            style={styles}
          >
            <div style={{ transform: "rotateX(45deg)" }}>
              <StarIcon />
            </div>
          </motion.div>
        );
      })}

      {hitTriggers.map((hit, index) => {
        const cssDistance = `calc(${distanceToMove}px + 50% - 20px + ${hit.left}px)`;
        let styles = {
          top: hit.top,
        };

        if (teamLocation.dataset.myTeam === "true") {
          styles.left = cssDistance;
        } else {
          styles.right = cssDistance;
        }

        return (
          <motion.div
            key={index}
            animate={{ height: [10, 30], width: [10, 30], opacity: [0, 0.45] }}
            transition={{
              height: { delay: hitTriggerDelay + index * 0.1, duration: 0.3 },
              width: { delay: hitTriggerDelay + index * 0.1, duration: 0.3 },
              opacity: { delay: hitTriggerDelay + index * 0.1, duration: 0.3 },
            }}
            style={styles}
            className="absolute bg-transparent rounded-full border-4 border-[#ffd638] opacity-0 z-10"
          />
        );
      })}
    </>
  );
}
