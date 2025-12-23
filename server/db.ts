import { drizzle as drizzleNeon } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "@shared/schema";

const connectionString = process.env.DATABASE_URL;

let db;
let isSqliteFallback = false;
export let sqliteDatabase: any = undefined;
if (connectionString) {
  // Use Neon when DATABASE_URL is provided
  const sql = neon(connectionString);
  db = drizzleNeon(sql, { schema });
} else {
  // Fallback to local SQLite for development when DATABASE_URL is not set
  // Top-level await is used for dynamic imports so this file remains ESM-friendly
  console.warn(
    "DATABASE_URL not set — using local SQLite database at './dev.sqlite' for development.",
  );
  const { default: Database } = await import("better-sqlite3");
  const { drizzle: drizzleSqlite } = await import("drizzle-orm/better-sqlite3");
  const sqlite = new Database("./dev.sqlite");
  // export the raw sqlite instance so other modules can run raw SQL when needed
  sqliteDatabase = sqlite;
  // Ensure basic schema exists for development SQLite fallback
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      username TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS incidents (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type TEXT NOT NULL,
      description TEXT NOT NULL,
      location TEXT NOT NULL,
      latitude TEXT,
      longitude TEXT,
      is_anonymous INTEGER NOT NULL DEFAULT 0,
      reported_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS go_bag_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      category TEXT NOT NULL,
      name TEXT NOT NULL,
      checked INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS evacuation_centers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      distance TEXT NOT NULL,
      capacity TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'Open',
      latitude TEXT,
      longitude TEXT
    );

    CREATE TABLE IF NOT EXISTS households (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS members (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      household_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      contact TEXT,
      last_known_location TEXT,
      status TEXT NOT NULL DEFAULT 'unknown'
    );

    CREATE TABLE IF NOT EXISTS check_ins (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      member_id INTEGER NOT NULL,
      location TEXT,
      is_safe INTEGER NOT NULL DEFAULT 1,
      timestamp DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS hazard_zones (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      type TEXT NOT NULL,
      coordinates TEXT NOT NULL,
      severity TEXT NOT NULL DEFAULT 'medium'
    );

    CREATE TABLE IF NOT EXISTS pois (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      type TEXT NOT NULL,
      latitude TEXT NOT NULL,
      longitude TEXT NOT NULL,
      address TEXT,
      available INTEGER NOT NULL DEFAULT 1
    );
  `);

  db = drizzleSqlite(sqlite, { schema });
  isSqliteFallback = true;
}

export { db, isSqliteFallback };
