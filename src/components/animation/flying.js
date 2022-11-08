import { motion } from "framer-motion";
import { Fragment } from "react";
import { getDistanceBetweenElements, getPositionAtCenter, getTeamLocation } from "util/animationMethods";
const blades = [10, 120, 75, 300, 150, 100, 70];
const topYStartingPosition = 100;
const bottomYStartingPosition = 60;
const animationDuration = 0.3;
const animationDelay = 0.07;

export default function FlyingAnimation({ teamLocation, enemyTeamLocation }) {
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
      {blades.map((blade, index) => {
        const topStyles = {
          left: "calc(50% - 16px)",
          top: `${topYStartingPosition}px`,
        };

        const bottomStyles = {
          left: "calc(50% - 16px)",
          top: `${bottomYStartingPosition}px`,
        };

        const delay = index * animationDelay;

        return (
          <Fragment key={index}>
            <BladeDiv
              distanceToMove={distanceToMove * xFactor}
              delay={delay}
              styles={topStyles}
              bladeRotation={blade}
            />
            <BladeDiv
              distanceToMove={distanceToMove * xFactor}
              delay={delay}
              styles={bottomStyles}
              bladeRotation={blade}
            />
          </Fragment>
        );
      })}
    </>
  );
}

function BladeDiv({ distanceToMove, bladeRotation, styles, delay }) {
  return (
    <motion.div
      initial={{ rotate: bladeRotation }}
      animate={{
        x: distanceToMove,
        opacity: [0, 1, 1, 0],
        rotate: bladeRotation + 360,
      }}
      transition={{
        // rotate: { delay: delay, duration: 0.15, repeat: Infinity },
        default: { delay: delay, duration: animationDuration },
        opacity: { delay: delay, duration: animationDuration, times: [0, 0.01, 0.8, 1] },
      }}
      className="absolute h-8 w-8 rounded-full border-[#b4b9b9] border-t-8 opacity-0 border-r-8 z-10 
      after:content-[''] after:-top-1 after:-right-1 after:absolute after:left-0 after:bottom-0 after:border-r-4 after:border-t-4 after:rounded-full"
      style={styles}
    />
  );
}
