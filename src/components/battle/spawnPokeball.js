import { useEffect, useState } from "react";
import Image from "next/image";
import openPokeball from "../../../public/assets/open_pokeball.png";
import closedPokeball from "../../../public/assets/closed_pokeball.png";

const pokeballAnimation = {
  first: "First",
  second: "Second",
  done: "Done",
};

export default function SpawnPokeball() {
  const [pokeballState, setPokeballState] = useState(pokeballAnimation.first);

  useEffect(() => {
    setTimeout(function () {
      setPokeballState(pokeballAnimation.second);
    }, 150);

    setTimeout(function () {
      setPokeballState(pokeballAnimation.done);
    }, 450);
  }, []);

  return (
    <div className="absolute bottom-6">
      {pokeballState === pokeballAnimation.first && <Image src={closedPokeball} width={15} height={15} />}
      {pokeballState === pokeballAnimation.second && <Image src={openPokeball} width={15} height={20} />}
    </div>
  );
}
