import { t } from "@server/trpc";
import { z } from "zod";
import { roomMemberProcedure } from "./auth";

export const messagesRouter = t.router({
  createMessage: roomMemberProcedure
    .input(
      z.object({
        roomId: z.string(),
        text: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.message.create({
        data: {
          data: input.text,
          userId: ctx.session.user.id,
          roomId: input.roomId,
        },
      });
    }),
});
