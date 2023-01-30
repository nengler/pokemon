import { getImgCenter } from "constants/animationConfig";
import { motion } from "framer-motion";
import { Fragment } from "react";
import { getDistanceBetweenElements, getPositionAtCenter, getTeamLocation } from "util/animationMethods";

export default function IceAnimation({ teamLocation, enemyTeamLocation }) {
  if (teamLocation === undefined || enemyTeamLocation === undefined) {
    return;
  }

  const beams = Array(9).fill(null);
  const animationDuration = 0.4;
  const animationDelay = 0.05;
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
      {beams.map((_beam, index) => {
        const topStyles = {
          left: "calc(50% - 16px)",
          top: `${yStartingPosition + 15}px`,
        };

        const bottomStyles = {
          left: "calc(50% - 16px)",
          top: `${yStartingPosition - 15}px`,
        };

        const delay = index * animationDelay;

        return (
          <Fragment key={index}>
            <motion.div
              animate={{ x: distanceToMove * xFactor, opacity: [0, 1, 1, 0] }}
              transition={{
                x: { duration: animationDuration, delay: delay, ease: "linear" },
                opacity: {
                  delay: delay,
                  duration: animationDuration,
                  times: [0, 0.01, 0.7, 1],
                },
              }}
              className={`absolute flex justify-center w-8 h-8 z-10`}
              style={topStyles}
            >
              <IceBeamSVG />
            </motion.div>

            <motion.div
              animate={{ x: distanceToMove * xFactor, opacity: [0, 1, 1, 0] }}
              transition={{
                x: { duration: animationDuration, delay: delay, ease: "linear" },
                opacity: {
                  delay: delay,
                  duration: animationDuration,
                  times: [0, 0.01, 0.9, 1],
                },
              }}
              className={`absolute flex justify-center w-8 h-8 z-10`}
              style={bottomStyles}
            >
              <IceBeamSVG />
            </motion.div>
          </Fragment>
        );
      })}
    </>
  );
}

function IceBeamSVG() {
  return (
    <svg
      width="32"
      height="32"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        fill: "#d5e3ea",
        stroke: "#acbbe0",
        strokeWidth: "2px",
        transform: "scale(.75)",
      }}
    >
      <path d="M0 16 L16 0 L32 16 L16 32 Z" />
    </svg>
  );
}
