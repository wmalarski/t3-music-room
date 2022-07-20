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

export const roomMemberProcedure = protectedProcedure.use(
  async ({ ctx, rawInput, next }) => {
    const roomId = (rawInput as { roomId: string }).roomId;
    if (!z.string().safeParse(roomId).success) {
      throw new TRPCError({ code: "BAD_REQUEST" });
    }

    const member = await ctx.prisma.member.findFirstOrThrow({
      where: {
        roomId: (rawInput as { roomId: string }).roomId,
        userId: ctx.session.user.id,
      },
    });
    if (!member) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }

    return next({ ctx: { ...ctx, member } });
  }
);

export const roomOwnerProcedure = roomMemberProcedure.use(({ ctx, next }) => {
  if (ctx.member.role !== "owner") {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  return next();
});
