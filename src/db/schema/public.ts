import { pgEnum, pgTable, serial, text } from "drizzle-orm/pg-core";

export const localesEnum = pgEnum("locales", ["en", "fr"]);

export const hello = pgTable("hello", {
	id: serial().primaryKey(),
	name: text("name").notNull(),
});