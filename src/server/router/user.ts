import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createProtectedRouter } from "./context";

export const userRouter = createProtectedRouter()
  .query("selectUser", {
    resolve({ ctx }) {
      const user = ctx.session?.user;
      if (!user) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }
      return user;
    },
  })
  .mutation("updateUser", {
    input: z.object({
      name: z.string().min(3).optional(),
      image: z.string().optional(),
    }),
    resolve({ ctx, input }) {
      const userId = ctx.session?.user?.id;

      if (!userId) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      return ctx.prisma.user.update({
        data: { image: input.image, name: input.name },
        where: { id: userId },
      });
    },
  });
