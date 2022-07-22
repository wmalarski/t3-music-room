import { t } from "@server/trpc";
import { z } from "zod";
import { protectedProcedure, roomMemberProcedure } from "./auth";

export const messagesRouter = t.router({
  selectMessages: roomMemberProcedure
    .input(
      z.object({
        roomId: z.string(),
        take: z.number().min(0).max(100),
        skip: z.number().min(0),
      })
    )
    .query(({ ctx, input }) => {
      return ctx.prisma.$transaction([
        ctx.prisma.message.findMany({
          skip: input.skip,
          take: input.take,
          where: {
            roomId: input.roomId,
          },
          orderBy: {
            createdAt: "asc",
          },
          include: {
            user: true,
          },
        }),
        ctx.prisma.message.count({
          where: {
            roomId: input.roomId,
          },
        }),
      ]);
    }),
  selectCurrentMessages: roomMemberProcedure
    .input(
      z.object({
        roomId: z.string(),
      })
    )
    .query(({ ctx, input }) => {
      return ctx.prisma.message.findFirst({
        where: {
          roomId: input.roomId,
          endedAt: null,
        },
        orderBy: {
          createdAt: "asc",
        },
        include: {
          user: true,
        },
      });
    }),
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
  deleteMessage: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const message = await ctx.prisma.message.findFirstOrThrow({
        where: {
          id: input.id,
          endedAt: null,
        },
      });

      await ctx.prisma.member.findFirstOrThrow({
        where: {
          roomId: message.roomId,
          userId: ctx.session.user.id,
        },
      });

      return ctx.prisma.message.delete({
        where: {
          id: input.id,
        },
      });
    }),
});
