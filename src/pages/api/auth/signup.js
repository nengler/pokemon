import { withIronSessionApiRoute } from "iron-session/next";
import prisma from "lib/prisma";
import { sessionOptions } from "lib/session";

export default withIronSessionApiRoute(signupRoute, sessionOptions);

async function signupRoute(req, res) {
  const user = await prisma.user.create({ data: {} });
  req.session.user = { id: user.id };
  await req.session.save();
  res.send({ ok: true });
}
