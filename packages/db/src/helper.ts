import { pgTableCreator } from "drizzle-orm/pg-core";

export const erpPgTable = pgTableCreator((name) => `erp_${name}`);
export const lmsPgTable = pgTableCreator((name) => `lms_${name}`);
