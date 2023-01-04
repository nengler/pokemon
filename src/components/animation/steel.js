import { getImgCenter } from "constants/animationConfig";
import { motion } from "framer-motion";
import Image from "next/image";
import { getDistanceBetweenElements, getPositionAtCenter, getTeamLocation } from "util/animationMethods";
import PlusCircle from "./svg/plusCircle";

export default function SteelAnimation({ teamLocation, enemyTeamLocation }) {
  if (teamLocation === undefined || enemyTeamLocation === undefined) {
    return;
  }

  const yStartingPosition = getImgCenter(-24);
  const growingDuration = 0.4;
  const movingDuration = 0.35;

  const enemyCoordinates = getTeamLocation(enemyTeamLocation);
  const myCoordinates = getTeamLocation(teamLocation);

  if (enemyCoordinates === undefined || myCoordinates === undefined) {
    return null;
  }

  const enemyCenter = getPositionAtCenter(enemyCoordinates);
  const myCenter = getPositionAtCenter(myCoordinates);

  const xFactor = teamLocation.dataset.myTeam === "true" ? 1 : -1;

  const distanceToMove = getDistanceBetweenElements(enemyCenter, myCenter) * xFactor;

  const xOffset = 60 * xFactor;

  const styles = {
    left: `calc(50% - 24px + ${xOffset}px)`,
    top: `${yStartingPosition}px`,
  };

  const hitStyles = {
    top: "calc(50% - 16px)",
    left: `calc(50% - 16px + ${distanceToMove}px)`,
    "--fadeindelay": `550ms`,
    "--fadeinduration": `300ms`,
  };

  return (
    <>
      <div className="absolute h-8 w-8 fadeInFadeOuAnimation" style={hitStyles}>
        <Image src="/assets/hit.png" width={32} height={32} />
      </div>
      <motion.div
        initial={{ scale: 0.3 }}
        animate={{
          scale: [0.3, 1.3, 1],
          x: distanceToMove - xOffset + distanceToMove / 4,
          opacity: [0, 1, 0.8, 0],
          rotate: 1080,
        }}
        transition={{
          scale: { duration: growingDuration, times: [0, 0.8, 1] },
          x: {
            delay: growingDuration + 0.1,
            duration: movingDuration,
            type: "spring",
          },
          opacity: {
            times: [0, 0.3, 0.7, 1],
            duration: growingDuration + movingDuration,
          },
          rotate: { delay: growingDuration, duration: movingDuration },
        }}
        className="absolute h-12 w-12 rounded-full z-10 opacity-0 flex justify-center items-center text-steel-secondary bg-steel-primary"
        style={styles}
      >
        <PlusCircle />
      </motion.div>
    </>
  );
}
