import type {
  SignedInAuthObject,
  SignedOutAuthObject,
} from "@clerk/backend/internal";
import type { CheckAuthorizationParamsFromSessionClaims } from "@clerk/types";
import { createClerkClient } from "@clerk/backend";
import { eq } from "@instello/db";
import { db } from "@instello/db/client";
import { branch, semester } from "@instello/db/schema";
import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import z, { ZodError } from "zod/v4";

/**
 * YOU PROBABLY DON'T NEED TO EDIT THIS FILE, UNLESS:
 * 1. You want to modify request context (see Part 1)
 * 2. You want to create a new middleware or type of procedure (see Part 3)
 *
 * tl;dr - this is where all the tRPC server stuff is created and plugged in.
 * The pieces you will need to use are documented accordingly near the end
 */

/**
 * Replace this with an object if you want to pass things to createContextInner
 */
interface AuthContextProps {
  auth: SignedInAuthObject | SignedOutAuthObject;
  headers: Headers;
}

/**
 * 1. CONTEXT
 *
 * This section defines the "contexts" that are available in the backend API.
 *
 * These allow you to access things when processing a request, like the database, the session, etc.
 *
 * This helper generates the "internals" for a tRPC context. The API handler and RSC clients each
 * wrap this and provides the required context.
 *
 * @see https://trpc.io/docs/server/context
 */
export const createTRPCContext = ({ auth, headers }: AuthContextProps) => {
  const source = headers.get("x-trpc-source");
  console.log(`>>> Request recieved from ${source ?? "UNKNOWN"}`);
  const clerk = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });

  return {
    auth,
    db,
    clerk,
    headers,
  };
};

export type Context = Awaited<ReturnType<typeof createTRPCContext>>;

/**
 * 2. INITIALIZATION
 *
 * This is where the trpc api is initialized, connecting the context and
 * transformer
 */
const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter: ({ shape, error }) => ({
    ...shape,
    data: {
      ...shape.data,
      zodError: error.cause instanceof ZodError ? error.cause.flatten() : null,
    },
  }),
});

/**
 * Create a server-side caller
 * @see https://trpc.io/docs/server/server-side-calls
 */
export const createCallerFactory = t.createCallerFactory;

/**
 * 3. ROUTER & PROCEDURE (THE IMPORTANT BIT)
 *
 * These are the pieces you use to build your tRPC API. You should import these
 * a lot in the /src/server/api/routers folder
 */

/**
 * This is how you create new routers and subrouters in your tRPC API
 * @see https://trpc.io/docs/router
 */
export const createTRPCRouter = t.router;

/**
 * Middleware for timing procedure execution and adding an articifial delay in development.
 *
 * You can remove this if you don't like it, but it can help catch unwanted waterfalls by simulating
 * network latency that would occur in production but not in local development.
 */
const timingMiddleware = t.middleware(async ({ next, path }) => {
  const start = Date.now();

  if (t._config.isDev) {
    // artificial delay in dev 100-500ms
    const waitMs = Math.floor(Math.random() * 400) + 100;
    await new Promise((resolve) => setTimeout(resolve, waitMs));
  }

  const result = await next();

  const end = Date.now();
  console.log(`[TRPC] ${path} took ${end - start}ms to execute`);

  return result;
});

/**
 * Middleware to check if the user has the required organization permissions
 * before allowing access to a procedure.
 *
 * Use this **before input validation** in your tRPC procedure chain.
 *
 * @param required - A single permission or an array of required permissions
 * @returns Middleware that throws a FORBIDDEN error if permissions are missing
 */
export const hasPermission = (
  isAuthorizedParams: CheckAuthorizationParamsFromSessionClaims<string>,
) =>
  t.middleware(async ({ next, ctx }) => {
    if (!ctx.auth.has(isAuthorizedParams)) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Permission not granted",
      });
    }

    return next();
  });

/**
 * Public (unauthed) procedure
 *
 * This is the base piece you use to build new queries and mutations on your
 * tRPC API. It does not guarantee that a user querying is authorized, but you
 * can still access user session data if they are logged in
 */
export const publicProcedure = t.procedure.use(timingMiddleware);

/**
 * Protected (authenticated) procedure
 *
 * If you want a query or mutation to ONLY be accessible to logged in users, use this. It verifies
 * the session is valid and guarantees `ctx.auth` is not null.
 *
 * @see https://trpc.io/docs/procedures
 */
export const protectedProcedure = t.procedure
  .use(timingMiddleware)
  .use(({ ctx, next }) => {
    if (!ctx.auth.userId) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }

    return next({
      ctx: {
        ...ctx,
        // infers the `auth.userId` as non-nullable
        auth: { ...ctx.auth, userId: ctx.auth.userId },
      },
    });
  });

/**
 * Organization context procedure
 *
 * If you want a query or mutation to ONLY be accessible to selected organization users, use this. It verifies
 * the auth.orgId (Active organization Id) is valid and guarantees `ctx.auth.orgId` is not null.
 *
 * @see https://trpc.io/docs/procedures
 */
export const organizationProcedure = t.procedure
  .concat(protectedProcedure)
  .use(({ ctx, next }) => {
    if (!ctx.auth.orgId) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "No organization has been selected. Select one or create one",
      });
    }

    return next({
      ctx: {
        ...ctx,
        // infers the `auth.orgId` as non-nullable
        auth: { ...ctx.auth, orgId: ctx.auth.orgId },
      },
    });
  });

/**
 * Branch context procedure
 *
 * If you want a query or mutation to ONLY be accessible to selected organization and within selected branch's active semester, use this. It verifies
 * the branch weather it has active semester or not. On top of it it verifies the `ctx.auth.userId` as well as `ctx.auth.orgId`.
 *
 * @info When using this procedure no need to validate input of `branchId` becuase it will pass down.
 * @see https://trpc.io/docs/procedures
 */
export const branchProcedure = t.procedure
  .concat(protectedProcedure)
  .concat(organizationProcedure)
  .input(z.object({ branchId: z.string() }))
  .use(async ({ ctx, input, next }) => {
    const branchCookieRaw = ctx.headers
      .get("cookie")
      ?.split(";")
      .map((v) => v.trim())
      .find((v) => v.startsWith("semester"))
      ?.split("=")[1];

    if (!branchCookieRaw)
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "No branch cookie has been found",
      });

    const branchCookie = JSON.parse(branchCookieRaw) as Record<string, number>;

    const semesterRaw = branchCookie[input.branchId];
    const semesterId = z.coerce.string().parse(semesterRaw);

    const _branch = await ctx.db.query.branch.findFirst({
      where: eq(branch.id, input.branchId),
    });

    if (!_branch) {
      throw new TRPCError({ code: "NOT_FOUND", message: "Branch not found." });
    }

    const _semester = await ctx.db.query.semester.findFirst({
      where: eq(semester.id, semesterId),
    });

    if (!_semester) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Semester not found.",
      });
    }

    return next({
      ctx: {
        ...ctx,
        auth: { ...ctx.auth, activeSemester: _semester },
      },
    });
  });
