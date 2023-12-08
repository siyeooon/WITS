import {
  mysqlTable,
  bigint,
  varchar,
  uniqueIndex,
  text,
} from "drizzle-orm/mysql-core";

export const songs = mysqlTable("songs", {
  id: bigint("id", { mode: "number" }).primaryKey().autoincrement(),
  title: varchar("name", { length: 64 }).notNull(),
  artist: varchar("name", { length: 64 }).notNull(),
  previewUrl: text("preview_url").notNull(),
  albumUrl: text("album_url").notNull(),
});
