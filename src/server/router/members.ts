import { t } from "@server/trpc";
import { z } from "zod";
import { protectedProcedure } from "./auth";

export const membersRouter = t.router({
  selectMyMembers: protectedProcedure
    .input(
      z.object({
        take: z.number().min(0).max(100),
        skip: z.number().min(0),
      })
    )
    .query(({ ctx, input }) => {
      return ctx.prisma.$transaction([
        ctx.prisma.member.findMany({
          skip: input.skip,
          take: input.take,
          include: {
            room: true,
          },
          where: {
            userId: ctx.session.user.id,
          },
        }),
        ctx.prisma.member.count({
          where: {
            userId: ctx.session.user.id,
          },
        }),
      ]);
    }),
  selectMemberByRoomId: protectedProcedure
    .input(
      z.object({
        roomId: z.string(),
      })
    )
    .query(({ ctx, input }) => {
      return ctx.prisma.member.findFirstOrThrow({
        include: {
          room: true,
        },
        where: {
          userId: ctx.session.user.id,
          roomId: input.roomId,
        },
      });
    }),
  selectRoomMembers: protectedProcedure
    .input(
      z.object({
        roomId: z.string(),
        take: z.number().min(0).max(100),
        skip: z.number().min(0),
      })
    )
    .query(async ({ ctx, input }) => {
      await ctx.prisma.member.findFirstOrThrow({
        where: {
          roomId: input.roomId,
          userId: ctx.session.user.id,
        },
      });
      return ctx.prisma.member.findMany({
        skip: input.skip,
        take: input.take,
        where: {
          roomId: input.roomId,
        },
        include: {
          user: true,
        },
      });
    }),
});
