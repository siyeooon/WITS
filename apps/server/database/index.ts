import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";

import * as schema from "./schema";

const poolConnection = mysql.createPool({
  host: process.env.DB_HOST!,
  port: Number(process.env.DB_PORT!),
  user: process.env.DB_USERNAME!,
  password: process.env.DB_PASSWORD!,
  database: process.env.DB_DATABASE!,
});

const db = drizzle(poolConnection, { schema: schema, mode: "default" });

export { db, schema };
