import { pgTable, text, integer, varchar } from "drizzle-orm/pg-core";

export const monthlyReports = pgTable("monthly_reports", {
  userId: varchar("userId", { length: 256 }).notNull(),
  month: varchar("month", { length: 7 }).notNull(),
  totalSpent: integer("totalSpent").notNull(),
  topCategory: text("topCategory").notNull(),
  overBudgetCategories: text("overBudgetCategories").array().notNull(),
});
