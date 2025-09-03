import { initialColumns } from "../columns.helpers";
import { lmsPgTable } from "../helper";

export const channel = lmsPgTable("channel", (d) => ({
  ...initialColumns,
  createdByClerkUserId: d.text().notNull(),
  title: d.varchar({ length: 256 }).notNull(),
  description: d.text(),
  createdAt: d.timestamp().defaultNow().notNull(),
  isPublished: d.boolean().default(false),
  thumbneilId: d.varchar({ length: 100 }),
}));
