import { motion } from "framer-motion";
import ThunderIcon from "/public/assets/thunder";
import { useState } from "react";

const styles = {
  left: "45px",
  top: "80px",
};

export default function ElectricAnimation({ teamLocation, enemyTeamLocation }) {
  const [isFirstStage, setIsFirstStage] = useState(true);

  setTimeout(function () {
    setIsFirstStage(false);
  }, 400);

  if (teamLocation === undefined || enemyTeamLocation === undefined) {
    return;
  }

  const enemyCoordinates = getEnemyCoordinates(enemyTeamLocation);
  const myCoordinates = getMyCoordinates(teamLocation);

  if (enemyCoordinates === undefined || myCoordinates === undefined) {
    return null;
  }

  const fillColor = isFirstStage ? "text-[#f8f86e]" : "text-[#ffca3e]";

  return (
    <>
      <motion.div
        animate={{ opacity: [1, 0] }}
        transition={{
          opacity: {
            duration: 0.2,
            repeat: Infinity,
          },
        }}
        className="absolute h-10 w-10 bg-black rounded-full z-10"
        style={styles}
      >
        <div
          style={{
            top: isFirstStage ? "-20px" : "-14px",
            left: isFirstStage ? "50%" : "unset",
            right: isFirstStage ? "unset" : "-10px",
            transform: isFirstStage ? "translateX(-50%)" : "rotate(25deg)",
          }}
          className={`absolute  ${fillColor}`}
        >
          <ThunderIcon />
        </div>

        <div
          style={{
            top: isFirstStage ? "-40px" : "-32px",
            left: isFirstStage ? "50%" : "unset",
            right: isFirstStage ? "unset" : "-23px",
            transform: isFirstStage ? "translateX(-50%)" : "rotate(25deg)",
          }}
          className={`absolute  ${fillColor}`}
        >
          <ThunderIcon />
        </div>

        <div
          style={{
            top: isFirstStage ? "50%" : "-14px",
            left: isFirstStage ? "-20px" : "-11px",
            transform: isFirstStage
              ? "translateY(-50%) rotate(90deg)"
              : "rotate(305deg)",
          }}
          className={`absolute ${fillColor}`}
        >
          <ThunderIcon />
        </div>

        <div
          style={{
            top: isFirstStage ? "50%" : "-30px",
            left: isFirstStage ? "-40px" : "-26px",
            transform: isFirstStage
              ? "translateY(-50%) rotate(90deg)"
              : "rotate(305deg)",
          }}
          className={`absolute ${fillColor}`}
        >
          <ThunderIcon />
        </div>

        <div
          style={{
            right: isFirstStage ? "-20px" : "-9px",
            top: isFirstStage ? "50%" : "unset",
            bottom: isFirstStage ? "unset" : "-16px",
            transform: isFirstStage
              ? "translateY(-50%) rotate(90deg)"
              : "rotate(305deg)",
          }}
          className={`absolute  ${fillColor}`}
        >
          <ThunderIcon />
        </div>

        <div
          style={{
            right: isFirstStage ? "-40px" : "-24px",
            top: isFirstStage ? "50%" : "unset",
            bottom: isFirstStage ? "unset" : "-34px",
            transform: isFirstStage
              ? "translateY(-50%) rotate(90deg)"
              : "rotate(305deg)",
          }}
          className={`absolute  ${fillColor}`}
        >
          <ThunderIcon />
        </div>

        <div
          style={{
            left: isFirstStage ? "50%" : "-9px",
            bottom: isFirstStage ? "-20px" : "-16px",
            transform: isFirstStage ? "translateX(-50%)" : "rotate(25deg)",
          }}
          className={`absolute ${fillColor}`}
        >
          <ThunderIcon />
        </div>

        <div
          style={{
            left: isFirstStage ? "50%" : "-24px",
            bottom: isFirstStage ? "-40px" : "-34px",
            transform: isFirstStage ? "translateX(-50%)" : "rotate(25deg)",
          }}
          className={`absolute  ${fillColor}`}
        >
          <ThunderIcon />
        </div>
      </motion.div>
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