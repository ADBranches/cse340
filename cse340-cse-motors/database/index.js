// database/index.js
import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;

// Prefer DATABASE_URL (e.g. Render), otherwise fall back to local pieces
let pool;

if (process.env.DATABASE_URL) {
  // Render / external connection string
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    // Optional SSL for some hosts – safe to leave as-is
    ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
  });
} else {
  // Local Postgres using your DB_* env vars
  pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  });
}

export default pool;
