import { motion } from "framer-motion";
import Icicle from "public/assets/icicle";
import BigIcicle from "public/assets/bigIcicle";
import { Fragment } from "react";

const animationDuration = 0.25;
const getRandomDiviation = () => Math.floor(Math.random() * 180) - 90;
const xFactor = 50;

const icicles = [
  getRandomDiviation(),
  null,
  getRandomDiviation(),
  null,
  getRandomDiviation(),
  null,
  getRandomDiviation(),
];

const bodyIcicles = [null, null, null, null];

export default function IceAnimation({ teamLocation, enemyTeamLocation }) {
  if (teamLocation === undefined || enemyTeamLocation === undefined) {
    return;
  }

  const enemyCoordinates = getEnemyCoordinates(enemyTeamLocation);
  const myCoordinates = getMyCoordinates(teamLocation);

  if (enemyCoordinates === undefined || myCoordinates === undefined) {
    return null;
  }

  const xStartingPosition = enemyCoordinates.right - myCoordinates.left - xFactor;
  const topYStartingPosition = 118;
  const bottomYStartingPosition = 70;
  const bigYStartingPosition = 90;

  const distanceToMove =
    myCoordinates.left + xFactor - ((enemyCoordinates.right - enemyCoordinates.left) / 2 + enemyCoordinates.left);

  return (
    <>
      {icicles.map((icicle, index) => {
        let topStyles = {
          left: `${xStartingPosition}px`,
          top: `${topYStartingPosition}px`,
        };

        let bottomStyles = {
          left: `${xStartingPosition}px`,
          top: `${bottomYStartingPosition}px`,
        };

        let bigStyles = {
          left: `${xStartingPosition - 8}px`,
          top: `${bigYStartingPosition}px`,
        };

        const delay = index * 0.05;

        return (
          <Fragment key={index}>
            {icicle !== null && (
              <motion.div
                animate={{ x: distanceToMove, opacity: [0, 1, 1, 0] }}
                transition={{
                  x: { type: "tween", ease: "linear", duration: animationDuration, delay: delay },
                  y: { duration: animationDuration, delay: delay },
                  opacity: { delay: delay, duration: animationDuration, times: [0, 0.01, 0.99, 1] },
                }}
                className="absolute"
                style={bigStyles}
              >
                <div style={{ transform: `rotate(${icicle}deg)` }}>
                  <BigIcicle />
                </div>
              </motion.div>
            )}

            <motion.div
              animate={{ x: distanceToMove, opacity: [0, 1, 1, 0] }}
              transition={{
                x: { type: "tween", ease: "linear", duration: animationDuration, delay: delay },
                y: { duration: animationDuration, delay: delay },
                opacity: { delay: delay, duration: animationDuration, times: [0, 0.01, 0.99, 1] },
              }}
              className="absolute"
              style={topStyles}
            >
              <Icicle />
            </motion.div>

            <motion.div
              animate={{ x: distanceToMove, opacity: [0, 1, 1, 0] }}
              transition={{
                x: { type: "tween", ease: "linear", duration: animationDuration, delay: delay },
                y: { duration: animationDuration, delay: delay },
                opacity: { delay: delay, duration: animationDuration, times: [0, 0.01, 0.99, 1] },
              }}
              className="absolute"
              style={bottomStyles}
            >
              <Icicle />
            </motion.div>
          </Fragment>
        );
      })}

      {bodyIcicles.map((_icicle, index) => {
        let top = 110;
        let left = 60;
        top -= index * 15;
        if (index % 2 === 1) {
          left = 30;
        }
        const icicleStyles = {
          top: `${top}px`,
          left: `${left}px`,
        };
        return (
          <motion.div
            key={index}
            animate={{ opacity: [0, 1, 1, 0] }}
            transition={{ delay: animationDuration + index * 0.05, duration: 0.3, times: [0, 0.01, 0.9, 1] }}
            className="absolute z-10"
            style={icicleStyles}
          >
            <Icicle />
          </motion.div>
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
