import { initialColumns } from "../columns.helpers";
import { erpPgTable } from "../table.helpers";
import { branch } from "./branch";

export const semester = erpPgTable("semester", (t) => ({
  ...initialColumns,
  branchId: t
    .text()
    .notNull()
    .references(() => branch.id, { onDelete: "cascade" }),
  value: t.integer().notNull(),
  isArchived: t.boolean().notNull().default(false),
  acadYear: t
    .varchar({ length: 256 })
    .notNull()
    .$defaultFn(() => `${new Date().getFullYear()}`),
}));
