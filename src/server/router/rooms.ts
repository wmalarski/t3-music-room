import { z } from "zod";
import { createProtectedRouter } from "./context";

export const roomsRouter = createProtectedRouter()
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
      await ctx.prisma.member.findFirstOrThrow({
        where: {
          roomId: input.id,
          role: "owner",
          userId: ctx.session?.user?.id,
        },
      });

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
      await ctx.prisma.member.findFirstOrThrow({
        where: {
          roomId,
          role: "owner",
          userId: ctx.session?.user?.id,
        },
      });

      await ctx.prisma.action.deleteMany({ where: { message: { roomId } } });

      return ctx.prisma.$transaction([
        ctx.prisma.room.delete({ where: { id: input.id } }),
        ctx.prisma.member.deleteMany({ where: { roomId } }),
        ctx.prisma.message.deleteMany({ where: { roomId } }),
      ]);
    },
  });
