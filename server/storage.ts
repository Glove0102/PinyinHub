import { songs, type Song, type InsertSong, type User, type InsertUser, users } from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";
import { eq, like, or, desc, sql, and } from "drizzle-orm";
import { db } from "./db";
import ConnectPgSimple from "connect-pg-simple";

const MemoryStore = createMemoryStore(session);

// Storage interface
export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Song methods
  getSong(id: number): Promise<Song | undefined>;
  getSongs(limit?: number, offset?: number): Promise<Song[]>;
  getSongsByUserId(userId: number): Promise<Song[]>;
  searchSongs(query: string): Promise<Song[]>;
  createSong(song: InsertSong): Promise<Song>;
  updateSong(id: number, song: Partial<Song>): Promise<Song | undefined>;
  incrementSongViews(id: number): Promise<void>;
  
  // Artist methods
  getArtists(): Promise<Array<{ artist: string; artistChinese: string | null; songCount: number; totalViews: number }>>;
  getSongsByArtist(artistName: string): Promise<Song[]>;
  
  // Session store
  sessionStore: any;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private songs: Map<number, Song>;
  sessionStore: any;
  private userIdCounter: number;
  private songIdCounter: number;

  constructor() {
    this.users = new Map();
    this.songs = new Map();
    this.userIdCounter = 1;
    this.songIdCounter = 1;
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000, // prune expired entries every 24h
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username.toLowerCase() === username.toLowerCase()
    );
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email.toLowerCase() === email.toLowerCase()
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const now = new Date();
    const user: User = { 
      ...insertUser, 
      id,
      createdAt: now
    };
    this.users.set(id, user);
    return user;
  }

  // Song methods
  async getSong(id: number): Promise<Song | undefined> {
    return this.songs.get(id);
  }

  async getSongs(limit: number = 10, offset: number = 0): Promise<Song[]> {
    return Array.from(this.songs.values())
      .sort((a, b) => {
        // Sort by creation date (newest first)
        return new Date(b.createdAt || new Date()).getTime() - new Date(a.createdAt || new Date()).getTime();
      })
      .slice(offset, offset + limit);
  }

  async getSongsByUserId(userId: number): Promise<Song[]> {
    return Array.from(this.songs.values())
      .filter(song => song.userId === userId)
      .sort((a, b) => {
        // Sort by creation date (newest first)
        return new Date(b.createdAt || new Date()).getTime() - new Date(a.createdAt || new Date()).getTime();
      });
  }

  async searchSongs(query: string): Promise<Song[]> {
    const lowerQuery = query.toLowerCase();
    return Array.from(this.songs.values())
      .filter(song => {
        return (
          song.title.toLowerCase().includes(lowerQuery) ||
          (song.titleChinese && song.titleChinese.includes(lowerQuery)) ||
          song.artist.toLowerCase().includes(lowerQuery) ||
          (song.artistChinese && song.artistChinese.includes(lowerQuery))
        );
      })
      .sort((a, b) => {
        // Sort by view count (most popular first)
        return (b.views || 0) - (a.views || 0);
      });
  }

  async createSong(insertSong: InsertSong): Promise<Song> {
    const id = this.songIdCounter++;
    const now = new Date();
    const song: Song = {
      ...insertSong,
      id,
      simplifiedLyrics: insertSong.lyrics, // Default to same as input lyrics
      pinyinLyrics: [], // Will be populated by OpenAI
      englishLyrics: [], // Will be populated by OpenAI
      views: 0,
      createdAt: now,
      titleChinese: insertSong.titleChinese || null,
      artistChinese: insertSong.artistChinese || null,
      genre: insertSong.genre || null,
      youtubeLink: insertSong.youtubeLink || null,
      spotifyLink: insertSong.spotifyLink || null
    };
    this.songs.set(id, song);
    return song;
  }

  async updateSong(id: number, updates: Partial<Song>): Promise<Song | undefined> {
    const song = this.songs.get(id);
    if (!song) return undefined;
    
    const updatedSong = { ...song, ...updates };
    this.songs.set(id, updatedSong);
    return updatedSong;
  }

  async incrementSongViews(id: number): Promise<void> {
    const song = this.songs.get(id);
    if (song) {
      song.views = (song.views || 0) + 1;
      this.songs.set(id, song);
    }
  }

  async getArtists(): Promise<Array<{ artist: string; artistChinese: string | null; songCount: number; totalViews: number }>> {
    const artistStats = new Map<string, { artist: string; artistChinese: string | null; songCount: number; totalViews: number }>();
    
    Array.from(this.songs.values()).forEach(song => {
      const key = song.artist.toLowerCase();
      if (artistStats.has(key)) {
        const stats = artistStats.get(key)!;
        stats.songCount++;
        stats.totalViews += song.views || 0;
      } else {
        artistStats.set(key, {
          artist: song.artist,
          artistChinese: song.artistChinese,
          songCount: 1,
          totalViews: song.views || 0
        });
      }
    });
    
    return Array.from(artistStats.values()).sort((a, b) => b.songCount - a.songCount);
  }

  async getSongsByArtist(artistName: string): Promise<Song[]> {
    return Array.from(this.songs.values())
      .filter(song => 
        song.artist.toLowerCase() === artistName.toLowerCase() ||
        (song.artistChinese && song.artistChinese === artistName)
      )
      .sort((a, b) => (b.views || 0) - (a.views || 0));
  }
}

export class DatabaseStorage implements IStorage {
  sessionStore: any;

  constructor() {
    // Setup PostgreSQL session store
    const pgStoreFactory = ConnectPgSimple(session);
    this.sessionStore = new pgStoreFactory({
      conObject: {
        connectionString: process.env.DATABASE_URL,
      },
      createTableIfMissing: true,
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async getSong(id: number): Promise<Song | undefined> {
    const [song] = await db.select().from(songs).where(eq(songs.id, id));
    return song;
  }

  async getSongs(limit: number = 10, offset: number = 0): Promise<Song[]> {
    return db.select().from(songs).orderBy(desc(songs.createdAt)).limit(limit).offset(offset);
  }

  async getSongsByUserId(userId: number): Promise<Song[]> {
    return db.select().from(songs).where(eq(songs.userId, userId)).orderBy(desc(songs.createdAt));
  }

  async searchSongs(query: string): Promise<Song[]> {
    const likePattern = `%${query}%`;
    return db.select().from(songs).where(
      or(
        like(songs.title, likePattern),
        like(songs.titleChinese, likePattern),
        like(songs.artist, likePattern),
        like(songs.artistChinese, likePattern)
      )
    ).orderBy(desc(songs.views));
  }

  async createSong(insertSong: InsertSong): Promise<Song> {
    const songData = {
      ...insertSong,
      simplifiedLyrics: insertSong.lyrics,
      pinyinLyrics: [],
      englishLyrics: [],
      youtubeLink: insertSong.youtubeLink || null,
      spotifyLink: insertSong.spotifyLink || null,
      views: 0
    };
    
    const [song] = await db.insert(songs).values(songData).returning();
    return song;
  }

  async updateSong(id: number, updates: Partial<Song>): Promise<Song | undefined> {
    const [updatedSong] = await db
      .update(songs)
      .set(updates)
      .where(eq(songs.id, id))
      .returning();
    
    return updatedSong;
  }

  async incrementSongViews(id: number): Promise<void> {
    await db
      .update(songs)
      .set({
        views: sql`${songs.views} + 1`
      })
      .where(eq(songs.id, id));
  }

  async getArtists(): Promise<Array<{ artist: string; artistChinese: string | null; songCount: number; totalViews: number }>> {
    const result = await db
      .select({
        artist: songs.artist,
        artistChinese: songs.artistChinese,
        songCount: sql<number>`count(*)`,
        totalViews: sql<number>`sum(coalesce(${songs.views}, 0))`
      })
      .from(songs)
      .groupBy(songs.artist, songs.artistChinese)
      .orderBy(sql`count(*) desc`);
    
    return result;
  }

  async getSongsByArtist(artistName: string): Promise<Song[]> {
    return db.select().from(songs).where(
      or(
        eq(songs.artist, artistName),
        eq(songs.artistChinese, artistName)
      )
    ).orderBy(desc(songs.views));
  }
}

// Switch to database storage
export const storage = new DatabaseStorage();
