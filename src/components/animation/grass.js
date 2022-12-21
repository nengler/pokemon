import { motion } from "framer-motion";
import { getDistanceBetweenElements, getPositionAtCenter, getTeamLocation } from "util/animationMethods";

export default function GrassAnimation({ teamLocation, enemyTeamLocation }) {
  if (teamLocation === undefined || enemyTeamLocation === undefined) {
    return;
  }

  const razorLeafs = [null, null, null];

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
      {razorLeafs.map((_water, index) => {
        let styles = {
          left: "calc(50%  - 24px)",
          top: "calc(50%  - 24px)", //`${index % 2 === 0 ? 90 : 62}px`,
        };

        const delay = index * 0.15;

        return (
          <motion.div
            animate={{
              x: distanceToMove * xFactor,
              opacity: [0, 1, 1, 0],
              rotate: 1080,
              y: [0, index % 2 === 0 ? 80 : -80, 0],
            }}
            transition={{
              default: { delay: delay, duration: 0.4 },
              opacity: { delay: delay, duration: 0.4, times: [0, 0.01, 0.7, 1] },
            }}
            className="absolute h-12 w-12 rounded-full border-grass-secondary border-t-8 opacity-0 border-r-8 z-10"
            key={index}
            style={styles}
          />
        );
      })}
    </>
  );
}
