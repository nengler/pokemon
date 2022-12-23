import { motion } from "framer-motion";
import { getDistanceBetweenElements, getPositionAtCenter, getTeamLocation } from "util/animationMethods";
import NeedleIcon from "./svg/needle";
import { imgHeight } from "constants/animationConfig";
import Image from "next/image";
import { Fragment } from "react";

export default function BugAnimation({ teamLocation, enemyTeamLocation }) {
  const animationDuration = 0.3;
  const animationDelay = 0.21;
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
        const delay = animationDelay * index;

        let styles = {
          left: "calc(50% - 12px)",
          top: `${yStartingPosition}px`,
        };

        let hitStyles = {
          top: "calc(50% - 16px)",
          left: `calc(50% - 16px + ${distanceToMove * xFactor}px)`,
          "--fadeindelay": `${delay + animationDuration}s`,
        };

        return (
          <Fragment key={index}>
            <div className="absolute h-8 w-8 fadeInFadeOuAnimation" style={hitStyles}>
              <Image src="/assets/hit.png" width={32} height={32} />
            </div>

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
              className="absolute z-[2]"
              style={styles}
            >
              <NeedleIcon />
            </motion.div>
          </Fragment>
        );
      })}
    </>
  );
}
