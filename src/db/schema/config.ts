import { pgEnum } from "drizzle-orm/pg-core";

export const localesEnum = pgEnum("locales", ["en", "fr"]);

// export const deputies = pgTable("deputies", {
// 	id: text("id").primaryKey(),
// 	firstName: text("first_name").notNull(),
// 	lastName: text("last_name").notNull(),
// 	birthDate: date("birth_date").notNull(),
// 	deathDate: date("death_date"),
// 	officialLink: text("official_link").notNull(),
// });

// export const usersTable = pgTable("users", {
// 	id: integer().primaryKey().generatedAlwaysAsIdentity(),
// 	name: varchar({ length: 255 }).notNull(),
// 	age: integer().notNull(),
// 	email: varchar({ length: 255 }).notNull().unique(),
// });