import { motion } from "framer-motion";
import { getDistanceBetweenElements, getPositionAtCenter, getTeamLocation } from "util/animationMethods";

const animationDuration = 0.5;
const balls = [
  { top: 114, left: 0 },
  { top: 50, left: 40 },
  { top: 60, left: 99 },
  { top: 130, left: 55 },
  { top: 80, left: 12 },
  { top: 140, left: 65 },
  { top: 55, left: 88 },
];

export default function DragonAnimation({ teamLocation, enemyTeamLocation }) {
  if (teamLocation === undefined || enemyTeamLocation === undefined) {
    return;
  }

  const enemyCoordinates = getTeamLocation(enemyTeamLocation);
  const myCoordinates = getTeamLocation(teamLocation);

  if (enemyCoordinates === undefined || myCoordinates === undefined) {
    return null;
  }

  const yStartingPosition = 90;

  const enemyCenter = getPositionAtCenter(enemyCoordinates);
  const myCenter = getPositionAtCenter(myCoordinates);

  const xFactor = teamLocation.dataset.myTeam === "true" ? 1 : -1;

  const distanceToMove = getDistanceBetweenElements(enemyCenter, myCenter) * xFactor;

  let styles = {
    top: yStartingPosition,
    width: `${Math.abs(distanceToMove)}px`,
  };

  if (teamLocation.dataset.myTeam === "true") {
    styles.left = "50%";
  } else {
    styles.right = "50%";
  }

  return (
    <>
      {balls.map((ball, index) => {
        const ballStyles = {
          top: `${ball.top}px`,
        };

        if (teamLocation.dataset.myTeam === "true") {
          ballStyles.left = `calc(50% - 4px + ${ball.left}px)`;
        } else {
          ballStyles.right = `calc(50% - 4px + ${ball.left}px)`;
        }

        const ballOffset = teamLocation.dataset.myTeam === "true" ? ball.left : ball.left * -1;
        const ballDistance = distanceToMove / 2 + ballOffset;

        const delay = index * 0.075;
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 1, 0], x: ballDistance }}
            transition={{
              x: { duration: animationDuration, delay: delay },
              opacity: { duration: animationDuration, delay: delay, times: [0, 0.01, 0.8, 1] },
            }}
            style={ballStyles}
            key={index}
            className="w-2 h-2 rounded-full absolute border bg-[#ffe5f1] border-[#ff52a0]"
          />
        );
      })}
      <div className="absolute z-10 overflow-hidden h-6" style={styles}>
        <motion.div
          className="absolute w-full"
          initial={{ right: distanceToMove }}
          animate={{ right: [distanceToMove, 0, 0, distanceToMove * -1] }}
          transition={{ duration: animationDuration, times: [0, 0.2, 0.75, 1] }}
        >
          <Beam yAxis="Top" xAxis={teamLocation.dataset.myTeam === "true" ? "Right" : "Left"} />
          <div className="bg-[#ffebf4] w-full h-2" />
          <Beam yAxis="Bottom" xAxis={teamLocation.dataset.myTeam === "true" ? "Right" : "Left"} />
        </motion.div>
      </div>
    </>
  );
}

function Beam({ yAxis, xAxis }) {
  const border = `border${yAxis}${xAxis}Radius`;

  const roundedCorner = getTailwindRoundedClass(yAxis, xAxis);

  return (
    <motion.div
      className={`w-full h-1 ${roundedCorner} bg-gradient-to-b from-[#ffb8d8] to-[#ff52a0]`}
      initial={{ [border]: "10%" }}
      animate={{ [border]: ["10%", "30%", "50%"] }}
      transition={{
        [border]: {
          duration: animationDuration,
          type: "tween",
          ease: "linear",
          delay: animationDuration / 2,
        },
      }}
    />
  );
}

const getTailwindRoundedClass = (yAxis, xAxis) => {
  if (yAxis === "Top" && xAxis === "Right") {
    return "rounded-tl-[100%]";
  } else if (yAxis === "Top" && xAxis === "Left") {
    return "rounded-tr-[100%]";
  } else if (yAxis === "Bottom" && xAxis === "Right") {
    return "rounded-bl-[100%]";
  } else if (yAxis === "Bottom" && xAxis === "Left") {
    return "rounded-br-[100%]";
  }
};

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
