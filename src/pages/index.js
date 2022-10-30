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
    console.log(loginData);
    setIsLoggedIn(loginData.ok);
  };

  return (
    <div className="flex h-screen justify-center mt-[30vh]">
      <div className="text-center">
        <h1 className="text-5xl mb-6 text-indigo-500 underline decoration-wavy">untitled pokemon game</h1>
        {isLoggedIn ? (
          <Link href="/play">
            <a className="btn btn-primary link-button">{props.game ? "continue game" : "start new game"}</a>
          </Link>
        ) : (
          <button
            className="bg-indigo-500 text-white rounded-lg px-4 h-10 inline-flex justify-center items-center"
            onClick={() => signIn()}
          >
            login as guest
          </button>
        )}
        <Link href="/how-to-play">
          <a className="ml-3 btn btn-secondary link-button">how to play</a>
        </Link>
      </div>
    </div>
  );
}

export const getServerSideProps = withIronSessionSsr(async function getServerSideProps({ req }) {
  const user = req.session.user;
  const game = await GetCurrentGame(prisma, user.id);

  return {
    props: { isLoggedIn: user !== undefined, game },
  };
}, sessionOptions);
