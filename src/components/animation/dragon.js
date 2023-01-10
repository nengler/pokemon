// import { motion } from "framer-motion";
// import { getDistanceBetweenElements, getPositionAtCenter, getTeamLocation } from "util/animationMethods";
// import { imgHeight } from "constants/animationConfig";

// function topOffset(offset) {
//   return imgHeight / 2 + offset;
// }

// export default function DragonAnimation({ teamLocation, enemyTeamLocation }) {
//   if (teamLocation === undefined || enemyTeamLocation === undefined) {
//     return;
//   }

//   const animationDuration = 0.5;

//   const balls = [
//     { top: topOffset(24), left: 0 },
//     { top: topOffset(-20), left: 40 },
//     { top: topOffset(-10), left: 99 },
//     { top: topOffset(40), left: 55 },
//     { top: topOffset(-10), left: 12 },
//     { top: topOffset(30), left: 65 },
//     { top: topOffset(-35), left: 88 },
//   ];

//   const enemyCoordinates = getTeamLocation(enemyTeamLocation);
//   const myCoordinates = getTeamLocation(teamLocation);

//   if (enemyCoordinates === undefined || myCoordinates === undefined) {
//     return null;
//   }

//   const yStartingPosition = topOffset(-8);

//   const enemyCenter = getPositionAtCenter(enemyCoordinates);
//   const myCenter = getPositionAtCenter(myCoordinates);

//   const xFactor = teamLocation.dataset.myTeam === "true" ? 1 : -1;

//   const distanceToMove = getDistanceBetweenElements(enemyCenter, myCenter) * xFactor;

//   let styles = {
//     top: yStartingPosition,
//     width: `${Math.abs(distanceToMove)}px`,
//   };

//   if (teamLocation.dataset.myTeam === "true") {
//     styles.left = "50%";
//   } else {
//     styles.right = "50%";
//   }

//   return (
//     <>
//       {balls.map((ball, index) => {
//         const ballStyles = {
//           top: `${ball.top}px`,
//         };

//         if (teamLocation.dataset.myTeam === "true") {
//           ballStyles.left = `calc(50% - 4px + ${ball.left}px)`;
//         } else {
//           ballStyles.right = `calc(50% - 4px + ${ball.left}px)`;
//         }

//         const ballOffset = teamLocation.dataset.myTeam === "true" ? ball.left : ball.left * -1;
//         const ballDistance = distanceToMove / 2 + ballOffset;

//         const delay = index * 0.075;
//         return (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: [0, 1, 1, 0], x: ballDistance }}
//             transition={{
//               x: { duration: animationDuration, delay: delay },
//               opacity: { duration: animationDuration, delay: delay, times: [0, 0.01, 0.8, 1] },
//             }}
//             style={ballStyles}
//             key={index}
//             className="w-2 h-2 rounded-full absolute border bg-[#ffe5f1] border-[#ff52a0]"
//           />
//         );
//       })}
//       <div className="absolute z-10 overflow-hidden h-6" style={styles}>
//         <motion.div
//           className="absolute w-full"
//           initial={{ right: distanceToMove }}
//           animate={{ right: [distanceToMove, 0, 0, distanceToMove * -1] }}
//           transition={{ duration: animationDuration, times: [0, 0.2, 0.75, 1] }}
//         >
//           <Beam
//             animationDuration={animationDuration}
//             yAxis="Top"
//             xAxis={teamLocation.dataset.myTeam === "true" ? "Right" : "Left"}
//           />
//           <div className="bg-[#ffebf4] w-full h-2" />
//           <Beam
//             animationDuration={animationDuration}
//             yAxis="Bottom"
//             xAxis={teamLocation.dataset.myTeam === "true" ? "Right" : "Left"}
//           />
//         </motion.div>
//       </div>
//     </>
//   );
// }

// function Beam({ yAxis, xAxis, animationDuration }) {
//   const border = `border${yAxis}${xAxis}Radius`;

//   const roundedCorner = getTailwindRoundedClass(yAxis, xAxis);

//   return (
//     <motion.div
//       className={`w-full h-1 ${roundedCorner} bg-gradient-to-b from-[#ffb8d8] to-[#ff52a0]`}
//       initial={{ [border]: "10%" }}
//       animate={{ [border]: ["10%", "30%", "50%"] }}
//       transition={{
//         [border]: {
//           duration: animationDuration,
//           type: "tween",
//           ease: "linear",
//           delay: animationDuration / 2,
//         },
//       }}
//     />
//   );
// }

// const getTailwindRoundedClass = (yAxis, xAxis) => {
//   if (yAxis === "Top" && xAxis === "Right") {
//     return "rounded-tl-[100%]";
//   } else if (yAxis === "Top" && xAxis === "Left") {
//     return "rounded-tr-[100%]";
//   } else if (yAxis === "Bottom" && xAxis === "Right") {
//     return "rounded-bl-[100%]";
//   } else if (yAxis === "Bottom" && xAxis === "Left") {
//     return "rounded-br-[100%]";
//   }
// };

import { motion } from "framer-motion";
import { getDistanceBetweenElements, getPositionAtCenter, getTeamLocation } from "util/animationMethods";
import { getImgCenter } from "constants/animationConfig";

export default function DragonAnimation({ teamLocation, enemyTeamLocation }) {
  if (teamLocation === undefined || enemyTeamLocation === undefined) {
    return;
  }

  const animationDuration = 0.3;
  const animationDelay = 0.008;
  const baseBurstDelay = 0.1;

  const balls = Array.apply(null, Array(20)).map(function () {});

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

  return (
    <>
      {balls.map((_, index) => {
        const burstDelay = Math.floor(index / 5) * baseBurstDelay;
        const delay = index * animationDelay + burstDelay;

        const [centerOffset, randomEffectsClasses] = getRandomEffects();

        const styles = {
          top: getImgCenter(-centerOffset) + (Math.floor(Math.random() * 20) - 10),
          left: `calc(50% - ${20}px)`,
        };

        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 1, 0], x: distanceToMove + distanceToMove / 5 }}
            transition={{
              x: { duration: animationDuration, delay: delay, ease: "linear" },
              opacity: { duration: animationDuration, delay: delay, times: [0, 0.01, 0.8, 1] },
            }}
            style={styles}
            key={index}
            className={`${randomEffectsClasses} z-[1] rounded-full absolute border-8 bg-[#d9bb59] border-[#4721d3]`}
          />
        );
      })}
    </>
  );
}
