export default function PokemonType({ pokemonType, index, shorten = false }) {
  const pokemonTypeMap = {
    Bug: "bg-bug-primary text-bug-secondary",
    Dark: "bg-dark-primary text-dark-secondary",
    Dragon: "bg-dragon-primary text-dragon-secondary",
    Electric: "bg-electric-primary text-electric-secondary",
    Fairy: "bg-fairy-primary text-fairy-secondary",
    Fighting: "bg-fighting-primary text-fighting-secondary",
    Fire: "bg-fire-primary text-fire-secondary",
    Flying: "bg-flying-primary text-flying-secondary",
    Ghost: "bg-ghost-primary text-ghost-secondary",
    Grass: "bg-grass-primary text-grass-secondary",
    Ground: "bg-ground-primary text-ground-secondary",
    Ice: "bg-ice-primary text-ice-secondary",
    Normal: "bg-normal-primary text-normal-secondary",
    Poison: "bg-poison-primary text-poison-secondary",
    Psychic: "bg-psychic-primary text-psychic-secondary",
    Rock: "bg-rock-primary text-rock-secondary",
    Steel: "bg-steel-primary text-steel-secondary",
    Water: "bg-water-primary text-water-secondary",
  };

  const spacing = index > 0 ? " ml-1" : "";
  const firstLetter = pokemonType.charAt(0);
  const restOfString = pokemonType.substr(1);

  return (
    <span className={`${pokemonTypeMap[pokemonType]} ${spacing} rounded-lg px-1 h-6 inline-block`}>
      {firstLetter}
      <span className="hidden">{restOfString}</span>
    </span>
  );
}
