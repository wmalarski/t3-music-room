import superjson from "superjson";
import { createRouter } from "./context";
import { invitesRouter } from "./invites";
import { membersRouter } from "./members";

import { roomsRouter } from "./rooms";
import { userRouter } from "./user";

export const appRouter = createRouter()
  .transformer(superjson)
  .merge("user.", userRouter)
  .merge("members.", membersRouter)
  .merge("invites.", invitesRouter)
  .merge("rooms.", roomsRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
