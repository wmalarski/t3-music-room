import { t } from "@server/trpc";
import { z } from "zod";
import { protectedProcedure } from "./auth";

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
  updateRoom: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        description: z.string(),
        name: z.string().min(3),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.member.findFirstOrThrow({
        where: {
          roomId: input.id,
          role: "owner",
          userId: ctx.session.user.id,
        },
      });

      return ctx.prisma.room.update({
        data: {
          description: input.description,
          name: input.name,
        },
        where: {
          id: input.id,
        },
      });
    }),
  deleteRoom: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const roomId = input.id;
      await ctx.prisma.member.findFirstOrThrow({
        where: {
          roomId,
          role: "owner",
          userId: ctx.session.user.id,
        },
      });

      await ctx.prisma.action.deleteMany({
        where: {
          message: { roomId: input.id },
        },
      });

      return ctx.prisma.$transaction([
        ctx.prisma.room.delete({ where: { id: input.id } }),
        ctx.prisma.member.deleteMany({ where: { roomId } }),
        ctx.prisma.message.deleteMany({ where: { roomId } }),
        ctx.prisma.invite.deleteMany({ where: { roomId } }),
      ]);
    }),
});
