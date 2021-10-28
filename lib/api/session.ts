// original file found at:
// https://github.dev/vvo/next-iron-session/blob/master/examples/next-typescript/lib/useUser.ts
// this file is a wrapper with defaults to be used in both API routes and `getServerSideProps` functions
import { NextApiRequest, NextApiResponse } from "next"
import { Session, withIronSession } from "next-iron-session"

// optionally add stronger typing for next-specific implementation
export type NextIronRequest = NextApiRequest & { session: Session }
export type NextIronHandler = (
  req: NextIronRequest,
  res: NextApiResponse,
) => void | Promise<void>

export const withSession = (handler: NextIronHandler) =>
  withIronSession(handler, {
    password:
      process.env.NODE_ENV === "production"
        ? (process.env.SECRET_COOKIE_PASSWORD as string)
        : "U7EgrfyiNWzL542URk4w7UKcD7viDCw2DL1tDyG",
    cookieName: "next-iron-session/examples/next.js",
    cookieOptions: {
      // the next line allows to use the session in non-https environments like
      // Next.js dev mode (http://localhost:3000)
      secure: process.env.NODE_ENV === "production",
    },
  })
