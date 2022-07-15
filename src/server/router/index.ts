import superjson from "superjson";
import { createRouter } from "./context";

import { authRouter } from "./auth";
import { exampleRouter } from "./example";
import { roomsRouter } from "./rooms";

export const appRouter = createRouter()
  .transformer(superjson)
  .merge("example.", exampleRouter)
  .merge("auth.", authRouter)
  .merge("rooms.", roomsRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
