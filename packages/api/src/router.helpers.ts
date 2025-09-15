import type { db } from "@instello/db/client";

import type { Context } from "./trpc";

export type DbClient = typeof db;
export type DbTransaction = Parameters<DbClient["transaction"]>[0] extends (
  tx: infer T,
) => unknown
  ? T
  : never;

export type DbLike = DbTransaction;

export function withTx(ctx: Context, tx: DbTransaction) {
  return { ...ctx, db: tx };
}
