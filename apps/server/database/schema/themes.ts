import {
  mysqlTable,
  bigint,
  varchar,
  uniqueIndex,
} from "drizzle-orm/mysql-core";
import { songs } from "./songs";

export const themes = mysqlTable("themes", {
  id: bigint("id", { mode: "number" }).primaryKey().autoincrement(),
  name: varchar("name", { length: 256 }),
});

export const songsToThemes = mysqlTable("songs_to_themes", {
  userId: bigint("song_id", { mode: "number" })
    .notNull()
    .references(() => songs.id),
  groupId: bigint("theme_id", { mode: "number" })
    .notNull()
    .references(() => themes.id),
});
