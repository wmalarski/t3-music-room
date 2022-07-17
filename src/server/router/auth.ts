import { t } from "@server/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.session || !ctx.session.user?.id || !ctx.session.user?.email) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({
    ctx: {
      ...ctx,
      session: {
        ...ctx.session,
        user: {
          ...ctx.session.user,
          id: ctx.session.user.id,
          email: ctx.session.user.email,
        },
      },
    },
  });
});

export const roomProtectedProcedure = protectedProcedure
  .input(
    z.object({
      roomId: z.string(),
    })
  )
  .use(async ({ ctx, input, next }) => {
    const member = await ctx.prisma.member.findFirstOrThrow({
      where: {
        roomId: input.roomId,
        userId: ctx.session.user.id,
      },
    });
    return next({ ctx: { ...ctx, member } });
  });
