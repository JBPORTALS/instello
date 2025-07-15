import { branchRouter } from "./router/branch";
import { organizationRouter } from "./router/organization";
import { subjectRouter } from "./router/subject";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  organization: organizationRouter,
  branch: branchRouter,
  subject: subjectRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
