import { sql } from "drizzle-orm";
import { pgTable, text, varchar, serial, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const incidents = pgTable("incidents", {
  id: serial("id").primaryKey(),
  type: text("type").notNull(),
  description: text("description").notNull(),
  location: text("location").notNull(),
  latitude: text("latitude"),
  longitude: text("longitude"),
  isAnonymous: boolean("is_anonymous").notNull().default(false),
  reportedAt: timestamp("reported_at").notNull().defaultNow(),
});

export const insertIncidentSchema = createInsertSchema(incidents).omit({
  id: true,
  reportedAt: true,
});

export type InsertIncident = z.infer<typeof insertIncidentSchema>;
export type Incident = typeof incidents.$inferSelect;

export const goBagItems = pgTable("go_bag_items", {
  id: serial("id").primaryKey(),
  category: text("category").notNull(),
  name: text("name").notNull(),
  checked: boolean("checked").notNull().default(false),
});

export const insertGoBagItemSchema = createInsertSchema(goBagItems).omit({
  id: true,
});

export type InsertGoBagItem = z.infer<typeof insertGoBagItemSchema>;
export type GoBagItem = typeof goBagItems.$inferSelect;

export const evacuationCenters = pgTable("evacuation_centers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  distance: text("distance").notNull(),
  capacity: text("capacity").notNull(),
  status: text("status").notNull().default("Open"),
  latitude: text("latitude"),
  longitude: text("longitude"),
});

export const insertEvacuationCenterSchema = createInsertSchema(evacuationCenters).omit({
  id: true,
});

export type InsertEvacuationCenter = z.infer<typeof insertEvacuationCenterSchema>;
export type EvacuationCenter = typeof evacuationCenters.$inferSelect;
