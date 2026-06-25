import { Database } from "bun:sqlite"

const dbPath = process.env.DATABASE_PATH || "civic.db";
export const db = new Database(dbPath, {strict: true})