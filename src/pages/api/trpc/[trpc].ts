import { createContext } from "@server/context";
import { appRouter } from "@server/router";
import { createNextApiHandler } from "@trpc/server/adapters/next";

// export API handler
export default createNextApiHandler({
  router: appRouter,
  createContext,
  batching: {
    enabled: true,
  },
});
