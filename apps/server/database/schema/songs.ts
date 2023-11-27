import {
  mysqlTable,
  bigint,
  varchar,
  uniqueIndex,
  text,
} from "drizzle-orm/mysql-core";

export const songs = mysqlTable("songs", {
  id: bigint("id", { mode: "number" }).primaryKey().autoincrement(),
  title: varchar("name", { length: 256 }),
  artist: varchar("name", { length: 256 }),
  previewUrl: text("preview_url"),
  albumUrl: text("album_url"),
});
