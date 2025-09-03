import * as erpRouter from "./erp-router";
import * as lmsRouter from "./lms-router";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  erp: { ...erpRouter },
  lms: { ...lmsRouter },
});

// export type definition of API
export type AppRouter = typeof appRouter;
