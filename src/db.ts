import { Pool } from "pg";
import dotenv from "dotenv";

const envFile = process.env.NODE_ENV === "test" ? ".env.test" : ".env";
dotenv.config({ path: envFile });

const PORT = parseInt(process.env.DB_PORT ? process.env.DB_PORT : "0");

const pool = new Pool({
  host: process.env.DB_HOST,
  port: PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

export default pool;
