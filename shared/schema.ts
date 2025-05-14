import { pgTable, text, serial, integer, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User model
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
});

// Song model
export const songs = pgTable("songs", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  titleChinese: text("title_chinese"),
  artist: text("artist").notNull(),
  artistChinese: text("artist_chinese"),
  lyrics: text("lyrics").notNull(),          // Original Chinese lyrics
  simplifiedLyrics: text("simplified_lyrics"), // Simplified Chinese version
  pinyinLyrics: jsonb("pinyin_lyrics"),      // Pinyin transliteration (array of lines with pinyin and chinese)
  englishLyrics: jsonb("english_lyrics"),    // English translation (array of lines)
  userId: integer("user_id").notNull().references(() => users.id),
  genre: text("genre"),
  views: integer("views").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertSongSchema = createInsertSchema(songs).pick({
  title: true,
  titleChinese: true,
  artist: true,
  artistChinese: true,
  lyrics: true,
  genre: true,
  userId: true,
});

// Line type for pinyin display
export type PinyinLine = {
  pinyin: string;
  chinese: string;
};

// Types for client usage
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertSong = z.infer<typeof insertSongSchema>;
export type Song = typeof songs.$inferSelect;
