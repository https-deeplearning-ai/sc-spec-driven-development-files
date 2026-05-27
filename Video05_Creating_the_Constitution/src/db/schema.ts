import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const patients = sqliteTable("patients", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  species: text("species").notNull(), // e.g., "chatbot", "coding-assistant", "search-agent"
  modelProvider: text("model_provider").notNull(), // e.g., "anthropic", "openai"
  modelName: text("model_name").notNull(), // e.g., "claude-sonnet-4-20250514", "gpt-4"
  status: text("status", { enum: ["active", "inactive", "critical"] })
    .notNull()
    .default("active"),
  createdAt: text("created_at")
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
  updatedAt: text("updated_at")
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
});

export type Patient = typeof patients.$inferSelect;
export type NewPatient = typeof patients.$inferInsert;
