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
    <div className="flex h-screen justify-center items-center">
      <div>
        {isLoggedIn ? (
          <Link href="/play">
            <a className="text-purple-500">{props.game ? "Continue Game" : "Start New Game"}</a>
          </Link>
        ) : (
          <button onClick={() => signIn()}>Login as Guest</button>
        )}
        <div>how to play</div>
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
