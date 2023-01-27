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
      class: styles.groundBackground,
      color: "#bfa768",
    },
    {
      type: "normal",
      platformImage: "/assets/platforms/normal_platform.png",
      class: styles.normalBackground,
      color: "#dfe0df",
    },
    {
      type: "water",
      platformImage: "/assets/platforms/water_platform.png",
      class: styles.waterBackground,
      color: "#f1f7f8",
    },
  ];

  return backgroundOptions[numberID % backgroundOptions.length];
}
