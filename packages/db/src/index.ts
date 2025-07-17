import { DrizzleQueryError } from "drizzle-orm/errors";

export { DrizzleQueryError } from "drizzle-orm/errors";
export * from "drizzle-orm/sql";
export { alias } from "drizzle-orm/pg-core";

export function isDrizzleQueryError(
  error: unknown,
): error is DrizzleQueryError & {
  cause: Error & { code: string; constraint: string };
} {
  return (
    error instanceof DrizzleQueryError &&
    typeof error.cause === "object" &&
    "code" in error.cause
  );
}
