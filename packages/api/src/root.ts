import { branchRouter } from "./router/branch";
import { organizationRouter } from "./router/organization";
import { studentRouter } from "./router/student";
import { subjectRouter } from "./router/subject";
import { timetableRouter } from "./router/timetable";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  organization: organizationRouter,
  branch: branchRouter,
  subject: subjectRouter,
  student: studentRouter,
  timetable: timetableRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
