import { branchRouter } from "./router/branch";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  branch: branchRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
