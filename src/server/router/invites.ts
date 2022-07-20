import { t } from "@server/trpc";
import { z } from "zod";
import { protectedProcedure, roomMemberProcedure } from "./auth";

export const invitesRouter = t.router({
  selectRoomInvites: roomMemberProcedure
    .input(
      z.object({
        roomId: z.string(),
        take: z.number().min(0).max(100),
        skip: z.number().min(0),
      })
    )
    .query(({ ctx, input }) => {
      return ctx.prisma.$transaction([
        ctx.prisma.invite.findMany({
          skip: input.skip,
          take: input.take,
          where: {
            roomId: input.roomId,
          },
        }),
        ctx.prisma.invite.count({
          where: {
            roomId: input.roomId,
          },
        }),
      ]);
    }),
  selectUserInvites: protectedProcedure
    .input(
      z.object({
        take: z.number().min(0).max(100),
        skip: z.number().min(0),
      })
    )
    .query(({ ctx, input }) => {
      return ctx.prisma.$transaction([
        ctx.prisma.invite.findMany({
          skip: input.skip,
          take: input.take,
          where: {
            email: ctx.session.user.email,
          },
        }),
        ctx.prisma.invite.count({
          where: {
            email: ctx.session.user.email,
          },
        }),
      ]);
    }),
  createInvite: roomMemberProcedure
    .input(
      z.object({
        roomId: z.string(),
        email: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.invite.create({
        data: {
          email: input.email,
          roomId: input.roomId,
        },
      });
    }),
  acceptInvite: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const invite = await ctx.prisma.invite.findFirstOrThrow({
        where: {
          id: input.id,
          email: ctx.session.user.email,
        },
      });

      const member = await ctx.prisma.member.create({
        data: {
          role: "user",
          roomId: invite.roomId,
          userId: ctx.session.user.id,
        },
        include: {
          room: true,
        },
      });

      await ctx.prisma.invite.delete({
        where: {
          id: input.id,
        },
      });

      return member;
    }),
  rejectInvite: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.invite.findFirstOrThrow({
        where: {
          id: input.id,
          email: ctx.session.user.email,
        },
      });

      return ctx.prisma.invite.delete({
        where: {
          id: input.id,
        },
      });
    }),
  deleteInvite: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const invite = await ctx.prisma.invite.findFirstOrThrow({
        where: {
          id: input.id,
        },
      });

      await ctx.prisma.member.findFirstOrThrow({
        where: {
          roomId: invite.roomId,
          userId: ctx.session.user.id,
        },
      });

      return ctx.prisma.invite.delete({
        where: {
          id: input.id,
        },
      });
    }),
});
