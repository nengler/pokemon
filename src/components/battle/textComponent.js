import { getImgCenter } from "constants/animationConfig";

const heightOffset = getImgCenter(0);

export default function TextAnimation({ attackAnimation, isMyTeam }) {
  if (Object.keys(attackAnimation).length === 0) {
    return null;
  }

  const effectColor = getEffectColor(attackAnimation?.effect);

  const positionClass = isMyTeam ? "right-4" : "left-4";

  return (
    <div
      style={{ top: `${heightOffset}px` }}
      className={`transition text-center moveTextUp absolute z-[1] ${positionClass}`}
    >
      <div className={effectColor}>-{attackAnimation.damageDealt}</div>
    </div>
  );
}

const getEffectColor = (effect) => {
  const colors = {
    "Not Very Effective": "text-red-600",
    Effective: "",
    "Super Effective": "text-green-600",
  };

  return colors[effect];
};
