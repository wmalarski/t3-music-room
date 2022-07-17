import { t } from "@server/trpc";
import { z } from "zod";
import { protectedProcedure } from "./auth";

export const userRouter = t.router({
  selectUser: protectedProcedure.query(({ ctx }) => {
    return ctx.session.user;
  }),
  updateUser: protectedProcedure
    .input(
      z.object({
        name: z.string().min(3).optional(),
        image: z.string().optional(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.user.update({
        data: {
          image: input.image,
          name: input.name,
        },
        where: {
          id: ctx.session.user.id,
        },
      });
    }),
});
