import { z } from "zod";
import { createProtectedRouter } from "./context";

export const membersRouter = createProtectedRouter()
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
  });
