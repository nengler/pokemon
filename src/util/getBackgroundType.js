import styles from "../styles/background.module.css";

export default function getBackgroundType(numberID) {
  const backgroundOptions = [
    {
      type: "grass",
      platformImage: "/assets/platforms/grass_platform.png",
      class: styles.grassBackground,
      color: "#d8f8d0",
    },
    {
      type: "ground",
      platformImage: "/assets/platforms/ground_platform.png",
      class: styles.rockBackground,
      color: "#c4ad78",
    },
    {
      type: "normal",
      platformImage: "/assets/platforms/normal_platform.png",
      class: styles.whiteBackground,
      color: "#e7e8e7",
    },
    { type: "water", platformImage: "/assets/platforms/water_platform.png", class: "bg-[#f1f7f8]", color: "#f1f7f8" },
  ];

  return backgroundOptions[3];
}
