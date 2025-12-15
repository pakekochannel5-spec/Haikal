import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "@shared/schema";

const { Pool } = pg;

export const hasDatabase = Boolean(process.env.DATABASE_URL);

if (!hasDatabase) {
  // Avoid throwing during module import so serverless functions don't fail to initialize
  // when DATABASE_URL is not present; fall back to in-memory behavior in storage.
  console.warn("DATABASE_URL not set — running with in-memory storage fallback.");
}

export const pool = hasDatabase ? new Pool({ connectionString: process.env.DATABASE_URL }) : (undefined as unknown as pg.Pool);
export const db = hasDatabase ? drizzle(pool, { schema }) : ({} as any);
