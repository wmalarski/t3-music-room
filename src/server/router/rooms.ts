import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createProtectedRouter } from "./context";

export const roomsRouter = createProtectedRouter()
  .query("selectMyMembers", {
    input: z.object({
      take: z.number().min(0).max(100),
      skip: z.number().min(0),
    }),
    resolve({ ctx, input }) {
      const userId = ctx.session?.user?.id;
      return ctx.prisma.$transaction([
        ctx.prisma.member.findMany({
          skip: input.skip,
          take: input.take,
          include: { room: true },
          where: { userId },
        }),
        ctx.prisma.member.count({
          where: { userId },
        }),
      ]);
    },
  })
  .query("selectMemberByRoomId", {
    input: z.object({
      id: z.string(),
    }),
    resolve({ ctx, input }) {
      const userId = ctx.session?.user?.id;
      return ctx.prisma.member.findFirstOrThrow({
        include: { room: true },
        where: { userId, roomId: input.id },
      });
    },
  })
  .mutation("createRoom", {
    input: z.object({
      description: z.string(),
      name: z.string().min(3),
    }),
    async resolve({ ctx, input }) {
      const userId = ctx.session?.user?.id || "";

      const room = await ctx.prisma.room.create({
        data: { description: input.description, name: input.name },
      });
      const member = await ctx.prisma.member.create({
        data: { role: "owner", roomId: room.id, userId },
      });

      return { room, member };
    },
  })
  .mutation("updateRoom", {
    input: z.object({
      id: z.string(),
      description: z.string(),
      name: z.string().min(3),
    }),
    async resolve({ ctx, input }) {
      const result = await ctx.prisma.member.findFirst({
        where: {
          roomId: input.id,
          role: "owner",
          userId: ctx.session?.user?.id,
        },
      });

      if (!result) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      return ctx.prisma.room.update({
        data: { description: input.description, name: input.name },
        where: { id: input.id },
      });
    },
  })
  .mutation("deleteRoom", {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ ctx, input }) {
      const roomId = input.id;
      const result = await ctx.prisma.member.findFirst({
        where: {
          roomId,
          role: "owner",
          userId: ctx.session?.user?.id,
        },
      });

      if (!result) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      await ctx.prisma.action.deleteMany({ where: { message: { roomId } } });

      return ctx.prisma.$transaction([
        ctx.prisma.room.delete({ where: { id: input.id } }),
        ctx.prisma.member.deleteMany({ where: { roomId } }),
        ctx.prisma.message.deleteMany({ where: { roomId } }),
      ]);
    },
  });
