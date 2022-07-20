import { t } from "@server/trpc";
import { invitesRouter } from "./invites";
import { membersRouter } from "./members";
import { messagesRouter } from "./messages";
import { roomsRouter } from "./rooms";
import { userRouter } from "./user";

export const appRouter = t.router({
  user: userRouter,
  members: membersRouter,
  invites: invitesRouter,
  rooms: roomsRouter,
  messages: messagesRouter,
});

export type AppRouter = typeof appRouter;
