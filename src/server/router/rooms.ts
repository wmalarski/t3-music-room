import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createProtectedRouter } from "./context";

export const roomsRouter = createProtectedRouter()
  .query("selectMyMemberships", {
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
      const result = await ctx.prisma.room.findFirst({
        where: {
          AND: [
            { id: input.id },
            { members: { some: { id: ctx.session?.user?.id } } },
          ],
        },
      });

      if (!result) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      return ctx.prisma.room.update({
        data: {
          description: input.description,
          name: input.name,
        },
        where: {
          id: input.id,
        },
      });
    },
  })
  .mutation("deleteRoom", {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ ctx, input }) {
      const result = await ctx.prisma.room.findFirst({
        where: {
          AND: [
            { id: input.id },
            { members: { some: { id: ctx.session?.user?.id } } },
          ],
        },
      });

      if (!result) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      return ctx.prisma.room.delete({
        where: {
          id: input.id,
        },
      });
    },
  });
