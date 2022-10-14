module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bug: { primary: "#A8B820", secondary: "#353a03" },
        dark: { primary: "#705848", secondary: "#fcf6f2" },
        dragon: { primary: "#7038F8", secondary: "#f4f0ff" },
        electric: { primary: "#F8D030", secondary: "#5b4901" },
        fairy: { primary: "#F0B6BC", secondary: "#910815" },
        fighting: { primary: "#C03028", secondary: "#feeceb" },
        fire: { primary: "#F08030", secondary: "#4d2000" },
        flying: { primary: "#A890F0", secondary: "#2b0896" },
        ghost: { primary: "#705898", secondary: "#f0e9fb" },
        grass: { primary: "#78C850", secondary: "hsl(100, 84%, 15%)" },
        ground: { primary: "#E0C068", secondary: "#5c4505" },
        ice: { primary: "#98D8D8", secondary: "#105050" },
        normal: { primary: "#A8A878", secondary: "#35350d" },
        poison: { primary: "#A040A0", secondary: "#fef0fe" },
        psychic: { primary: "#F85888", secondary: "#4d0017" },
        rock: { primary: "#B8A038", secondary: "#392f05" },
        steel: {
          primary: "#B8B8D0",
          secondary: "#39397f",
          tertiary: "#e5e7eb",
        },
        water: { primary: "#6890F0", secondary: "#001a57" },
      },
    },
  },
};
