import { t } from "@server/trpc";
import { TRPCError } from "@trpc/server";

export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.session || !ctx.session.user?.id || !ctx.session.user?.email) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({
    ctx: {
      ...ctx,
      session: {
        ...ctx.session,
        user: {
          ...ctx.session.user,
          id: ctx.session.user.id,
          email: ctx.session.user.email,
        },
      },
    },
  });
});
