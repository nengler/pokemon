import { motion } from "framer-motion";
import { getDistanceBetweenElements, getPositionAtCenter, getTeamLocation } from "util/animationMethods";
import { getImgCenter } from "constants/animationConfig";

export default function DragonAnimation({ teamLocation, enemyTeamLocation }) {
  if (teamLocation === undefined || enemyTeamLocation === undefined) {
    return;
  }

  const animationDuration = 0.4;
  const animationDelay = 0.007;
  const baseBurstDelay = 0.1;

  const balls = Array.apply(null, Array(4)).map(function () {});

  const enemyCoordinates = getTeamLocation(enemyTeamLocation);
  const myCoordinates = getTeamLocation(teamLocation);

  if (enemyCoordinates === undefined || myCoordinates === undefined) {
    return null;
  }

  const enemyCenter = getPositionAtCenter(enemyCoordinates);
  const myCenter = getPositionAtCenter(myCoordinates);

  const xFactor = teamLocation.dataset.myTeam === "true" ? 1 : -1;

  const distanceToMove = getDistanceBetweenElements(enemyCenter, myCenter) * xFactor;

  const getRandomEffects = () => {
    let classes = [];

    const blurNumber = Math.floor(Math.random() * 3);
    if (blurNumber === 0) {
      classes.push("blur-sm");
    } else if (blurNumber === 1) {
      classes.push("blur-[2px]");
    }

    const sizeNumber = Math.floor(Math.random() * 3);
    let centerOffset = 0;
    if (sizeNumber === 0) {
      classes = [...classes, "h-10", "w-10"];
      centerOffset = 20;
    } else if (sizeNumber === 1) {
      classes = [...classes, "h-8", "w-8"];
      centerOffset = 16;
    } else {
      classes = [...classes, "h-6", "w-6"];
      centerOffset = 12;
    }

    return [centerOffset, classes.join(" ")];
  };

  let currentDelay = 0;

  return (
    <>
      {balls.map((_, index) => {
        if (index !== 0) {
          currentDelay += baseBurstDelay;
        }
        const arraySize = index !== balls.length - 1 ? 2 : 10;
        return Array.apply(null, Array(arraySize)).map((__, burstArray) => {
          if (burstArray !== 0) {
            currentDelay += animationDelay;
          }

          const [centerOffset, randomEffectsClasses] = getRandomEffects();

          const styles = {
            top: getImgCenter(-centerOffset) + (Math.floor(Math.random() * 20) - 10),
            left: `calc(50% - ${20}px)`,
          };

          return (
            <motion.div
              key={currentDelay}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 1, 0], x: distanceToMove + distanceToMove / 5 }}
              transition={{
                x: { duration: animationDuration, delay: currentDelay, type: "spring", stiffness: 65 },
                opacity: { duration: animationDuration, delay: currentDelay, times: [0, 0.01, 0.6, 1] },
              }}
              style={styles}
              className={`${randomEffectsClasses} z-[1] rounded-full absolute border-8 bg-[#d9bb59] border-[#4721d3]`}
            />
          );
        });
      })}
    </>
  );
}
