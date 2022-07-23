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
  selectCurrentMessage: roomMemberProcedure
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
          actions: {
            take: 1,
            where: {
              userId: ctx.session.user.id,
            },
          },
        },
      });
    }),
  selectMessagesActions: roomMemberProcedure
    .input(
      z.object({
        roomId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const result = await ctx.prisma.action.aggregate({
        _count: {
          likeAt: true,
          messageId: true,
          dislikeAt: true,
        },
        where: {
          message: {
            roomId: input.roomId,
          },
        },
      });

      return result;
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
  endMessage: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const message = await ctx.prisma.message.findFirstOrThrow({
        where: {
          id: input.id,
        },
      });

      await ctx.prisma.member.findFirstOrThrow({
        where: {
          roomId: message.roomId,
          userId: ctx.session.user.id,
        },
      });

      return ctx.prisma.message.update({
        where: {
          id: input.id,
        },
        data: {
          endedAt: new Date(),
        },
      });
    }),
  reactToMessage: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        reaction: z.union([z.literal("like"), z.literal("dislike")]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const message = await ctx.prisma.message.findFirstOrThrow({
        where: {
          id: input.id,
        },
        include: {
          actions: {
            take: 1,
            where: {
              userId: ctx.session.user.id,
            },
          },
        },
      });

      await ctx.prisma.member.findFirstOrThrow({
        where: {
          roomId: message.roomId,
          userId: ctx.session.user.id,
        },
      });

      const actionId = message.actions[0]?.id;

      const reactions =
        input.reaction === "like"
          ? {
              dislikeAt: null,
              likeAt: new Date(),
            }
          : {
              dislikeAt: new Date(),
              likeAt: null,
            };

      if (actionId) {
        return ctx.prisma.action.update({
          data: reactions,
          where: {
            id: actionId,
          },
        });
      }

      return ctx.prisma.action.create({
        data: {
          userId: ctx.session.user.id,
          messageId: message.id,
          ...reactions,
        },
      });
    }),
});
