import * as lmsRouter from "./lms-router";
import * as erpRouter from "./router";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  erp: { ...erpRouter },
  lms: { ...lmsRouter },
});

// export type definition of API
export type AppRouter = typeof appRouter;
