import { getImgCenter } from "constants/animationConfig";
import { motion } from "framer-motion";
import { getDistanceBetweenElements, getPositionAtCenter, getTeamLocation } from "util/animationMethods";

export default function GhostAnimation({ teamLocation, enemyTeamLocation }) {
  const animationDuration = 0.55;
  const hitDuration = 0.2;
  const hitRotations = Array.apply(null, Array(6)).map(function () {});

  const beforeClasses =
    "before:content-[''] before:absolute before:top-[50%] before:left-[50%] before:w-6 before:h-6 before:rounded-[50%] before:bg-[#5f0a68] before:-translate-x-1/2 before:-translate-y-1/2";
  const afterClasses =
    "after:content-[''] after:absolute after:top-[50%] after:left-[50%] after:w-3 after:h-3 after:rounded-[50%] after:bg-black after:-translate-x-1/2 after:-translate-y-1/2";

  const yStartingPosition = getImgCenter(-18);

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

  const xFactor = teamLocation.dataset.myTeam === "true" ? 1 : -1;
  const distanceToMove = getDistanceBetweenElements(enemyCenter, myCenter) * xFactor;

  const styles = {
    left: "calc(50% - 18px)",
    top: `${yStartingPosition + 10}px`,
  };

  const hitStyles = {
    top: `${getImgCenter(-8)}px`,
    left: `calc(50% - 16px + ${distanceToMove}px)`,
  };

  const hitXFactor = {
    0: 0.1,
    1: 0.8,
    2: 0.6,
    3: 0,
    4: -1.1,
    5: -0.5,
  };

  const hitYFactor = {
    0: -1.1,
    1: -0.4,
    2: 0.1,
    3: 0.6,
    4: 0.2,
    5: -0.8,
  };

  return (
    <>
      <motion.div
        initial={{ y: 0 }}
        animate={{ x: distanceToMove, opacity: [0, 1, 0.5, 1, 0], y: [-20, 0, -10, -20, 0, 10, -5, 0] }}
        transition={{
          x: { duration: animationDuration, type: "tween", ease: "linear" },
          y: { duration: animationDuration },
          opacity: { duration: animationDuration, times: [0, 0.01, 0.5, 0.86, 1] },
        }}
        className={`z-[1] blur-sm absolute h-9 w-9 rounded-full bg-ghost-primary after:content-[''] ${beforeClasses} ${afterClasses}`}
        style={styles}
      />

      {hitRotations.map((hit, index) => {
        //[10, 55, 100, 180, 250, 330]

        const xMovement = 40 * hitXFactor[index];
        const yMovement = 40 * hitYFactor[index];

        console.log(xMovement, yMovement);

        return (
          <motion.div
            key={index}
            className="w-4 h-4 bg-ghost-primary blur-sm absolute z-[2] rounded-full"
            initial={{ x: xMovement / 10, y: yMovement / 10, opacity: 0 }}
            animate={{ x: xMovement, y: yMovement, opacity: 1 }}
            style={hitStyles}
            transition={{
              default: { duration: hitDuration, delay: animationDuration },
            }}
          />
        );
      })}
    </>
  );
}
