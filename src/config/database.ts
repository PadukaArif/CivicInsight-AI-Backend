import { Database } from "bun:sqlite"
import fs from "fs"
import path from "path"

const dbPath = process.env.DATABASE_PATH || "civic.db";

// Ensure database parent directory exists
const dir = path.dirname(dbPath);
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

export const db = new Database(dbPath, {strict: true})