export const sessionOptions = {
  password: process.env.SECRET_COOKIE_PASSWORD,
  cookieName: "pokemon-cookie",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
};
