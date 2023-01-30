import { motion } from "framer-motion";
import { Fragment } from "react";
import { getDistanceBetweenElements, getPositionAtCenter, getTeamLocation } from "util/animationMethods";
import { getImgCenter } from "constants/animationConfig";
import Image from "next/image";

export default function FlyingAnimation({ teamLocation, enemyTeamLocation }) {
  const blades = [10, 120, 75, 180, 30, 135, 70, 150, 10, 90];
  const animationDelay = 0.03;
  const topYStartingPosition = getImgCenter(-16) - 18;
  const bottomYStartingPosition = getImgCenter(-16) + 18;
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

  const distanceBetween = getDistanceBetweenElements(enemyCenter, myCenter);
  const distanceToMove = distanceBetween + distanceBetween / 4;
  const xFactor = teamLocation.dataset.myTeam === "true" ? 1 : -1;

  const hitStyles = {
    top: "calc(50% - 16px)",
    left: `calc(50% - 16px + ${distanceBetween * xFactor}px)`,
    "--fadeindelay": `200ms`,
    "--fadeinduration": `900ms`,
  };

  return (
    <>
      <div className="absolute h-8 w-8 fadeInFadeOuAnimation" style={hitStyles}>
        <Image src="/assets/hit.png" width={32} height={32} />
      </div>

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
  const animationDuration = 0.25;

  const flyingHelperVariables = {
    "--animationDelay": `${delay}s`,
    "--startingRotation": `${bladeRotation}deg`,
    "--endingRotation": `${bladeRotation + 900}deg`,
  };

  return (
    <motion.div
      animate={{
        x: distanceToMove,
        opacity: [0, 1, 1, 0],
      }}
      transition={{
        default: { delay: delay, duration: animationDuration, ease: "linear" },
        opacity: { delay: delay, duration: animationDuration, times: [0, 0.01, 0.8, 1] },
      }}
      style={styles}
      className="absolute h-8 w-8 opacity-0 z-10 "
    >
      <div
        className="absolute h-8 w-8 rounded-full border-[#b4b9b9] border-t-8 border-r-8
      after:content-[''] after:-top-1 after:-right-1 after:absolute after:left-0 after:bottom-0 after:border-r-4 after:border-t-4 after:rounded-full
      flyingAnimationHelper "
        style={flyingHelperVariables}
      />
    </motion.div>
  );
}
