export default function TextAnimation({ attackAnimation, isMyTeam }) {
  if (Object.keys(attackAnimation).length === 0) {
    return null;
  }

  const effectColor = getEffectColor(attackAnimation?.effect);

  const positionClass = isMyTeam ? "left-1/4" : "right-1/4";

  return (
    <div className={`transition text-center top-4 moveTextUp absolute ${positionClass}`}>
      <div className={effectColor}>-{attackAnimation.damageDealt}</div>
    </div>
  );
}

const getEffectColor = (effect) => {
  const colors = {
    "Not Very Effective": "text-red-500",
    Effective: "",
    "Super Effective": "text-green-500",
  };

  return colors[effect];
};
