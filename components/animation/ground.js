// import { motion } from "framer-motion";
// import EarthPower from "public/assets/earthPower";
// import { Fragment } from "react";

// const earthPowers = [null, null];
// const effects = [-100, -120, -35, -50, -90, -55, -105, -90, -115, -50];

// const animationDuration = 0.25;
// const effectAnimationDuration = 0.4;
// const scaleDuration = effectAnimationDuration / 2;
// const getDimensions = () => Math.floor(Math.random() * 10) + 15;

// export default function GroundAnimation({ teamLocation, enemyTeamLocation }) {
//   if (teamLocation === undefined || enemyTeamLocation === undefined) {
//     return;
//   }

//   const enemyCoordinates = getEnemyCoordinates(enemyTeamLocation);
//   const myCoordinates = getMyCoordinates(teamLocation);

//   if (enemyCoordinates === undefined || myCoordinates === undefined) {
//     return null;
//   }

//   return (
//     <>
//       {earthPowers.map((_e, index) => {
//         const left = index * 65 + 10;
//         let styles = {
//           left: `${left}px`,
//           top: "90px",
//         };

//         const delay = index * 0.25;

//         return (
//           <Fragment key={index}>
//             <motion.div
//               initial={{ scaleY: 0.4 }}
//               animate={{ scaleY: 2, opacity: [0, 1, 1, 0] }}
//               transition={{
//                 scaleY: { duration: animationDuration, delay: delay },
//                 opacity: { duration: animationDuration, delay: delay, times: [0, 0.01, 0.75, 1] },
//               }}
//               className="absolute w-10 origin-bottom opacity-0"
//               style={styles}
//             >
//               <EarthPower />
//             </motion.div>
//             {effects.map((effect, index) => {
//               const dimensions = getDimensions();
//               const effectStyles = {
//                 left: `${left + 12}px`,
//                 top: "70px",
//                 width: `${dimensions}px`,
//                 height: `${dimensions}px`,
//               };
//               const xDirection = 15 + index * 5;
//               if (index % 2 === 1) {
//                 xDirection *= -1;
//               }

//               let backgroundColor = "bg-[#EC6F59]";
//               if (index % 3 === 0) {
//                 backgroundColor = "bg-[#FAD15C]";
//               }

//               const effectDelay = delay + 0.35 * animationDuration;
//               return (
//                 <motion.div
//                   initial={{ scale: 1 }}
//                   animate={{ opacity: [0, 1, 1, 0], x: xDirection, y: [0, effect, 0], scale: [1, 0.5] }}
//                   transition={{
//                     default: {
//                       duration: effectAnimationDuration,
//                       delay: effectDelay,
//                       type: "spring",
//                       mass: dimensions / 15,
//                     },
//                     scale: { duration: scaleDuration, delay: effectDelay + scaleDuration },
//                     opacity: { duration: effectAnimationDuration, delay: effectDelay, times: [0, 0.01, 0.75, 1] },
//                   }}
//                   key={index}
//                   className={`absolute  ${backgroundColor} rounded-xl opacity-0`}
//                   style={effectStyles}
//                 />
//               );
//             })}
//           </Fragment>
//         );
//       })}
//     </>
//   );
// }

const earthShotWidth = 20;
const earthShots = Array(6).fill(null);
const xOffset = 60;
const yStartingPosition = 90;
export default function GroundAnimation({ teamLocation, enemyTeamLocation }) {
  if (teamLocation === undefined || enemyTeamLocation === undefined) {
    return;
  }

  const enemyCoordinates = getEnemyCoordinates(enemyTeamLocation);
  const myCoordinates = getMyCoordinates(teamLocation);

  if (enemyCoordinates === undefined || myCoordinates === undefined) {
    return null;
  }

  const xStartingPosition = enemyCoordinates.right - myCoordinates.left - xOffset;

  const distanceToMove =
    (myCoordinates.left + xOffset - ((enemyCoordinates.right - enemyCoordinates.left) / 2 + enemyCoordinates.left)) *
    -1;

  return (
    <>
      {earthShots.map((_earthShot, index) => {
        const offset = (Math.abs(distanceToMove) / earthShots.length) * index;
        const styles = {
          top: `${yStartingPosition}px`,
          left: `${offset + xStartingPosition}px`,
        };
        return <div style={styles} key={index} className="absolute w-5 h-5 bg-ground-primary rounded-full"></div>;
      })}
    </>
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
