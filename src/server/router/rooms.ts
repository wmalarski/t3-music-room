import { t } from "@server/trpc";
import { z } from "zod";
import { protectedProcedure, roomOwnerProcedure } from "./auth";

export const roomsRouter = t.router({
  createRoom: protectedProcedure
    .input(
      z.object({
        description: z.string(),
        name: z.string().min(3),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const room = await ctx.prisma.room.create({
        data: {
          description: input.description,
          name: input.name,
        },
      });
      const member = await ctx.prisma.member.create({
        data: {
          role: "owner",
          roomId: room.id,
          userId: ctx.session.user.id,
        },
      });

      return { room, member };
    }),
  updateRoom: roomOwnerProcedure
    .input(
      z.object({
        roomId: z.string(),
        description: z.string(),
        name: z.string().min(3),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.room.update({
        data: {
          description: input.description,
          name: input.name,
        },
        where: {
          id: input.roomId,
        },
      });
    }),
  deleteRoom: roomOwnerProcedure
    .input(
      z.object({
        roomId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.action.deleteMany({
        where: {
          message: {
            roomId: input.roomId,
          },
        },
      });

      return ctx.prisma.$transaction([
        ctx.prisma.room.delete({
          where: {
            id: input.roomId,
          },
        }),
        ctx.prisma.member.deleteMany({
          where: {
            roomId: input.roomId,
          },
        }),
        ctx.prisma.message.deleteMany({
          where: {
            roomId: input.roomId,
          },
        }),
        ctx.prisma.invite.deleteMany({
          where: {
            roomId: input.roomId,
          },
        }),
      ]);
    }),
});
