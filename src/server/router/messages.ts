import { t } from "@server/trpc";
import { z } from "zod";
import { protectedProcedure } from "./auth";

export const messagesRouter = t.router({
  createMessage: protectedProcedure
    .input(
      z.object({
        roomId: z.string(),
        text: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.member.findFirstOrThrow({
        where: {
          roomId: input.roomId,
          userId: ctx.session.user.id,
        },
      });

      return ctx.prisma.message.create({
        data: {
          data: input.text,
          userId: ctx.session.user.id,
          roomId: input.roomId,
        },
      });
    }),
});
