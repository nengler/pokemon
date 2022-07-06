// import { motion } from "framer-motion";
// import Fist from "public/assets/fist";
// import Pow from "public/assets/pow";

// export default function FightingAnimation({ teamLocation, enemyTeamLocation }) {
//   if (teamLocation === undefined || enemyTeamLocation === undefined) {
//     return;
//   }

//   const enemyCoordinates = getEnemyCoordinates(enemyTeamLocation);
//   const myCoordinates = getMyCoordinates(teamLocation);

//   if (enemyCoordinates === undefined || myCoordinates === undefined) {
//     return null;
//   }

//   const xStartingPosition = 35; //(myCoordinates.right - myCoordinates.left) / 2;
//   const yStartingPosition = 80;

//   let styles = {
//     left: `${xStartingPosition}px`,
//     top: `${yStartingPosition}px`,
//   };

//   return (
//     <motion.div
//       animate={{ opacity: [0, 1, 0, 1] }}
//       transition={{ duration: 0.5 }}
//       className="absolute w-[57px] h-[47px] flex justify-center items-center opacity-0 z-10"
//       style={styles}
//     >
//       <div className="absolute top-0 z-10">
//         <Pow />
//       </div>
//       <div className="z-10">
//         <Fist />
//       </div>
//     </motion.div>
//   );
// }

import { motion } from "framer-motion";
import HandIcon from "public/assets/hand";
const animationDuration = 0.5;

export default function FightingAnimation({ teamLocation, enemyTeamLocation }) {
  if (teamLocation === undefined || enemyTeamLocation === undefined) {
    return;
  }

  const enemyCoordinates = getEnemyCoordinates(enemyTeamLocation);
  const myCoordinates = getMyCoordinates(teamLocation);

  if (enemyCoordinates === undefined || myCoordinates === undefined) {
    return null;
  }

  return (
    <>
      <motion.div
        animate={{ y: [-20, 90, 70] }}
        transition={{ y: { duration: animationDuration, times: [0, 0.3, 0.5] } }}
        className="absolute left-[36px] w-12 flex justify-center items-center z-10"
      >
        <HandIcon flip={teamLocation.dataset.myTeam === "true"} />
      </motion.div>
      <HitEffect y={[50, 30, 40]} x={[50, 0]} />
      <HitEffect y={[50, 40, 50]} x={[70, 100]} />
      <HitEffect y={[90, 70, 80]} x={[50, 90]} />
    </>
  );
}

function HitEffect({ x, y }) {
  return (
    <motion.div
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

const getEnemyCoordinates = (enemyTeamLocation) => {
  const currentEnemyDiv = enemyTeamLocation.children[0];
  const currentEnemyImg = currentEnemyDiv?.querySelector("img");
  return currentEnemyImg?.getBoundingClientRect();
};

const getMyCoordinates = (teamLocation) => {
  const myCurrentDiv = teamLocation.children[0];
  const myCurrentImg = myCurrentDiv?.querySelector("img");
  return myCurrentImg?.getBoundingClientRect();
};
