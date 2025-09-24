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

export async function getClerkUserById(userId: string, ctx: Context) {
  return ctx.clerk.users
    .getUser(userId)
    .then(({ firstName, lastName, imageUrl, hasImage }) => ({
      firstName,
      lastName,
      imageUrl,
      hasImage,
    }));
}
