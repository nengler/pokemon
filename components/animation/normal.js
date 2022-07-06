import { motion } from "framer-motion";
import StarIcon from "public/assets/star";

const animationDuration = 0.5;
const hitTriggerDelay = 0.3;

const hitTriggers = [null, null, null];
const stars = [0, 35, -40, 25, 10, -30];

export default function NormalAnimation({ teamLocation, enemyTeamLocation }) {
  if (teamLocation === undefined || enemyTeamLocation === undefined) {
    return;
  }

  const enemyCoordinates = getEnemyCoordinates(enemyTeamLocation);
  const myCoordinates = getMyCoordinates(teamLocation);

  if (enemyCoordinates === undefined || myCoordinates === undefined) {
    return null;
  }

  const xStartingPosition = enemyCoordinates.right - myCoordinates.left - 48;
  const yStartingPosition = 90; //enemyCoordinates.bottom - enemyCoordinates.top / 2;

  const distanceToMove =
    myCoordinates.left + 48 - ((enemyCoordinates.right - enemyCoordinates.left) / 2 + enemyCoordinates.left);

  return (
    <>
      {stars.map((star, index) => {
        let styles = {
          left: `${xStartingPosition}px`,
          top: `${yStartingPosition}px`,
        };

        const delay = index * 0.05;

        return (
          <motion.div
            animate={{ x: distanceToMove, y: star, opacity: [0, 1, 1, 0] }}
            transition={{
              x: { type: "spring", stiffness: 70, duration: animationDuration, delay: delay },
              y: { duration: animationDuration, delay: delay },
              opacity: { delay: delay, duration: animationDuration },
            }}
            className="absolute h-5 w-5 opacity-0"
            key={index}
            style={styles}
          >
            <div style={{ transform: "rotateX(45deg)" }}>
              <StarIcon />
            </div>
          </motion.div>
        );
      })}

      {hitTriggers.map((_hit, index) => {
        let top = "100px";
        if (index === 1) {
          top = "50px";
        } else if (index === 2) {
          top = "70px";
        }

        let left = "50px";
        if (index === 1) {
          left = "30px";
        } else if (index === 2) {
          left = "80px";
        }

        let styles = {
          top: top,
          left: left,
        };

        return (
          <motion.div
            key={index}
            animate={{ height: [10, 30], width: [10, 30], opacity: [0, 0.5] }}
            transition={{
              height: { delay: hitTriggerDelay + index * 0.1, duration: 0.3 },
              width: { delay: hitTriggerDelay + index * 0.1, duration: 0.3 },
              opacity: { delay: hitTriggerDelay + index * 0.1, duration: 0.3 },
            }}
            style={styles}
            className="absolute bg-transparent rounded-full border-4 border-[#ffd638] opacity-0 z-10"
          />
        );
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
