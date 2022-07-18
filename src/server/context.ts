/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { authOptions as nextAuthOptions } from "@pages/api/auth/[...nextauth]";
import * as trpc from "@trpc/server";
import * as trpcNext from "@trpc/server/adapters/next";
import { NextApiRequest, NextApiResponse } from "next";
import {
  Session,
  unstable_getServerSession as getServerSession,
} from "next-auth";
import { prisma } from "./db/client";

type CreateContextOptions = {
  session: Session | null;
};

export const createContextInner = (opts: CreateContextOptions) => {
  return {
    req: undefined as NextApiRequest | undefined,
    res: undefined as NextApiResponse | undefined,
    session: opts.session,
    prisma,
  };
};

export type Context = trpc.inferAsyncReturnType<typeof createContextInner>;

export const createContext = async (
  opts: trpcNext.CreateNextContextOptions
): Promise<Context> => {
  const req = opts?.req;
  const res = opts?.res;

  const session =
    req && res && (await getServerSession(req, res, nextAuthOptions));

  return {
    req,
    res,
    session,
    prisma,
  };
};
