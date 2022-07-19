import { t } from "@server/trpc";
import { TRPCError } from "@trpc/server";
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
      return ctx.prisma.$transaction([
        ctx.prisma.member.findMany({
          skip: input.skip,
          take: input.take,
          where: {
            roomId: input.roomId,
          },
          include: {
            user: true,
          },
        }),
        ctx.prisma.member.count({
          where: {
            roomId: input.roomId,
          },
        }),
      ]);
    }),
  deleteMember: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const member = await ctx.prisma.member.findFirstOrThrow({
        where: {
          id: input.id,
        },
      });

      const myMember = await ctx.prisma.member.findFirstOrThrow({
        where: {
          roomId: member.roomId,
          userId: ctx.session.user.id,
          role: "owner",
        },
      });

      if (myMember.id === input.id) {
        throw new TRPCError({ code: "BAD_REQUEST" });
      }

      return ctx.prisma.member.delete({
        where: {
          id: input.id,
        },
      });
    }),
});
