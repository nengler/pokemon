import { imgHeight } from "constants/animationConfig";
import { motion } from "framer-motion";
import { getDistanceBetweenElements, getPositionAtCenter, getTeamLocation } from "util/animationMethods";
import HandIcon from "/public/assets/hand";
const animationDuration = 0.5;
let styles = {};

const centerOfImg = imgHeight / 2 - 24;

export default function FightingAnimation({ teamLocation, enemyTeamLocation }) {
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

  const cssDistance = `calc(${distanceToMove}px + 50% - 24px)`;
  const isMyTeam = teamLocation.dataset.myTeam === "true";

  if (isMyTeam) {
    styles.left = cssDistance;
  } else {
    styles.right = cssDistance;
  }

  return (
    <>
      <motion.div
        initial={{ y: centerOfImg - 90 }}
        animate={{ y: [centerOfImg - 90, centerOfImg + 20, centerOfImg] }}
        transition={{
          y: { duration: animationDuration, times: [0, 0.3, 0.5] },
        }}
        style={styles}
        className="absolute w-12 h-12 flex justify-center items-center z-10"
      >
        <HandIcon flip={!isMyTeam} />
      </motion.div>
      <HitEffect isMyTeam={isMyTeam} distanceToMove={distanceToMove} y={[50, 30, 40]} x={[0, -35]} />
      <HitEffect isMyTeam={isMyTeam} distanceToMove={distanceToMove} y={[50, 40, 70]} x={[-15, -60]} />
      <HitEffect isMyTeam={isMyTeam} distanceToMove={distanceToMove} y={[90, 70, 80]} x={[15, 30]} />
    </>
  );
}

function HitEffect({ x, y, distanceToMove, isMyTeam }) {
  let hitEffectStyles = {};
  const cssDistanceHitEffect = `calc(${distanceToMove}px + 50% - 8px)`;

  if (isMyTeam) {
    hitEffectStyles.left = cssDistanceHitEffect;
  } else {
    hitEffectStyles.right = cssDistanceHitEffect;
  }

  return (
    <motion.div
      style={hitEffectStyles}
      className="w-4 h-4 rounded-full bg-[#e9e202] absolute opacity-0 z-10"
      animate={{ y: y, x: x, opacity: [0, 1, 1, 0] }}
      transition={{
        default: {
          type: "tween",
          ease: "linear",
          delay: 0.3 * animationDuration,
          duration: animationDuration * 0.7,
          times: [0, 0.01, 0.65, 1],
        },
      }}
    />
  );
}
