// import { motion } from "framer-motion";
// import { getDistanceBetweenElements, getPositionAtCenter, getTeamLocation } from "util/animationMethods";

// export default function GrassAnimation({ teamLocation, enemyTeamLocation }) {
//   if (teamLocation === undefined || enemyTeamLocation === undefined) {
//     return;
//   }

//   const razorLeafs = [null, null, null];
//   const animationDelay = 0.15;
//   const animationDuration = 0.4;

//   const enemyCoordinates = getTeamLocation(enemyTeamLocation);
//   const myCoordinates = getTeamLocation(teamLocation);

//   if (enemyCoordinates === undefined || myCoordinates === undefined) {
//     return null;
//   }

//   const enemyCenter = getPositionAtCenter(enemyCoordinates);
//   const myCenter = getPositionAtCenter(myCoordinates);

//   const distanceToMove = getDistanceBetweenElements(enemyCenter, myCenter);

//   const xFactor = teamLocation.dataset.myTeam === "true" ? 1 : -1;

//   return (
//     <>
//       {razorLeafs.map((_, index) => {
//         let styles = {
//           left: "calc(50%  - 24px)",
//           top: "calc(50%  - 24px)", //`${index % 2 === 0 ? 90 : 62}px`,
//         };

//         const delay = index * animationDelay;

//         return (
//           <motion.div
//             animate={{
//               x: distanceToMove * xFactor,
//               opacity: [0, 1, 1, 0],
//               rotate: 1080,
//               y: [0, index % 2 === 0 ? 80 : -80, 0],
//             }}
//             transition={{
//               default: { delay: delay, duration: animationDuration },
//               opacity: { delay: delay, duration: animationDuration, times: [0, 0.01, 0.7, 1] },
//             }}
//             className="absolute h-12 w-12 rounded-full border-grass-secondary border-t-8 opacity-0 border-r-8 z-10"
//             key={index}
//             style={styles}
//           />
//         );
//       })}
//     </>
//   );
// }

import { getImgCenter } from "constants/animationConfig";
import { motion } from "framer-motion";
import Image from "next/image";
import { getDistanceBetweenElements, getPositionAtCenter, getTeamLocation } from "util/animationMethods";

export default function GrassAnimation({ teamLocation, enemyTeamLocation }) {
  if (teamLocation === undefined || enemyTeamLocation === undefined) {
    return;
  }

  const razorLeafs = [null, null];
  const animationDuration = 0.65;
  const startingYPostion = getImgCenter(-24);

  const enemyCoordinates = getTeamLocation(enemyTeamLocation);
  const myCoordinates = getTeamLocation(teamLocation);

  if (enemyCoordinates === undefined || myCoordinates === undefined) {
    return null;
  }

  const enemyCenter = getPositionAtCenter(enemyCoordinates);
  const myCenter = getPositionAtCenter(myCoordinates);
  const xFactor = teamLocation.dataset.myTeam === "true" ? 1 : -1;
  const distanceToMove = getDistanceBetweenElements(enemyCenter, myCenter) * xFactor;

  const hitStyles = {
    top: `${getImgCenter(-16)}px`,
    left: `calc(50% - 16px + ${distanceToMove}px)`,
    "--fadeindelay": `450ms`,
    "--fadeinduration": `300ms`,
  };

  return (
    <>
      <div className="absolute h-8 w-8 fadeInFadeOuAnimation" style={hitStyles}>
        <Image src="/assets/hit.png" width={32} height={32} />
      </div>
      {razorLeafs.map((_, index) => {
        let styles = {
          left: "calc(50%  - 24px)",
          top: `${startingYPostion}px`,
        };

        const leafYMultiplier = index % 2 === 0 ? 1 : -1;

        return (
          <motion.div
            initial={{ scaleY: 0.5 }}
            animate={{
              x: distanceToMove + distanceToMove / 3,
              opacity: [0, 1, 1, 0],
              rotate: 1080,
              y: [0, 60 * leafYMultiplier, 0, 30 * leafYMultiplier * -1],
            }}
            transition={{
              x: { duration: animationDuration, ease: "linear" },
              y: { duration: animationDuration, times: [0, 0.4, 0.75, 1], ease: "linear" },
              rotate: { duration: animationDuration },
              opacity: { duration: animationDuration, times: [0, 0.01, 0.85, 1] },
            }}
            className="absolute h-12 w-12 rounded-full border-grass-secondary border-t-8 opacity-0 border-r-8 z-10"
            key={index}
            style={styles}
          />
        );
      })}
    </>
  );
}
