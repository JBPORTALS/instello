import { branchRouter } from "./router/branch";
import { subjectRouter } from "./router/subject";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  branch: branchRouter,
  subject: subjectRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
