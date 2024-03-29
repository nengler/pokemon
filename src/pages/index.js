import SoundPopover from "components/soundPopover";
import { withIronSessionSsr } from "iron-session/next";
import prisma from "lib/prisma";
import { sessionOptions } from "lib/session";
import Link from "next/link";
import { GetCurrentGame } from "prisma/queries/getCurrentGame";
import { useState } from "react";

export default function Home(props) {
  const [isLoggedIn, setIsLoggedIn] = useState(props.isLoggedIn);
  const signIn = async () => {
    const loginRes = await fetch("/api/auth/signup", {
      method: "POST",
    });

    const loginData = await loginRes.json();
    setIsLoggedIn(loginData.ok);
  };

  return (
    <div className="flex h-screen justify-center ">
      <div className="text-center mt-[30vh]">
        <h1 className="text-7xl">an untitled</h1>
        <h1 className="text-5xl mb-6 text-indigo-500 underline decoration-wavy">pokemon game</h1>
        <div className="flex items-center gap-2">
          {isLoggedIn ? (
            <Link href="/play">
              <a className="btn btn-primary link-button">{props.game ? "continue game" : "start new game"}</a>
            </Link>
          ) : (
            <button className="btn btn-primary" onClick={() => signIn()}>
              login as guest
            </button>
          )}
          <Link href="/how-to-play">
            <a className="btn btn-secondary link-button">how to play</a>
          </Link>
          <div className="inline-block">
            <SoundPopover musicSlider={props.musicSlider} soundSlider={props.soundSlider} />
          </div>
        </div>
      </div>
    </div>
  );
}

export const getServerSideProps = withIronSessionSsr(async function getServerSideProps({ req }) {
  const user = req.session.user;
  const game = await GetCurrentGame(prisma, user?.id);

  return {
    props: { isLoggedIn: user !== undefined, game },
  };
}, sessionOptions);
