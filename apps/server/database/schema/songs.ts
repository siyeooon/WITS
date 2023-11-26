import {
  mysqlTable,
  bigint,
  varchar,
  uniqueIndex,
} from "drizzle-orm/mysql-core";

export const songs = mysqlTable("songs", {
  id: bigint("id", { mode: "number" }).primaryKey().autoincrement(),
  name: varchar("name", { length: 256 }),
});
