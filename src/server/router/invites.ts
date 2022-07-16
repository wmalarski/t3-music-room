import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createProtectedRouter } from "./context";

export const invitesRouter = createProtectedRouter()
  .mutation("createInvite", {
    input: z.object({
      roomId: z.string(),
      email: z.string(),
    }),
    async resolve({ ctx, input }) {
      await ctx.prisma.member.findFirstOrThrow({
        where: {
          roomId: input.roomId,
          userId: ctx.session?.user?.id,
        },
      });

      return ctx.prisma.invite.create({
        data: { email: input.email, roomId: input.roomId },
      });
    },
  })
  .mutation("acceptInvite", {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ ctx, input }) {
      const email = ctx.session?.user?.email;
      const userId = ctx.session?.user?.id;

      if (!email || !userId) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      const invite = await ctx.prisma.invite.findFirstOrThrow({
        where: { id: input.id, email },
      });

      const member = await ctx.prisma.member.create({
        data: { role: "user", roomId: invite.roomId, userId },
        include: { room: true },
      });

      await ctx.prisma.invite.delete({
        where: { id: input.id },
      });

      return member;
    },
  })
  .mutation("rejectInvite", {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ ctx, input }) {
      const email = ctx.session?.user?.email;

      if (!email) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      await ctx.prisma.invite.findFirstOrThrow({
        where: { id: input.id, email },
      });

      return ctx.prisma.invite.delete({
        where: { id: input.id },
      });
    },
  })
  .mutation("deleteInvite", {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ ctx, input }) {
      const invite = await ctx.prisma.invite.findFirstOrThrow({
        where: { id: input.id },
      });

      await ctx.prisma.member.findFirstOrThrow({
        where: {
          roomId: invite.roomId,
          userId: ctx.session?.user?.id,
        },
      });

      return ctx.prisma.invite.delete({
        where: { id: input.id },
      });
    },
  });
