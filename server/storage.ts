import { songs, type Song, type InsertSong, type User, type InsertUser, users } from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

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
  
  // Session store
  sessionStore: session.SessionStore;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private songs: Map<number, Song>;
  sessionStore: session.SessionStore;
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
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      })
      .slice(offset, offset + limit);
  }

  async getSongsByUserId(userId: number): Promise<Song[]> {
    return Array.from(this.songs.values())
      .filter(song => song.userId === userId)
      .sort((a, b) => {
        // Sort by creation date (newest first)
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
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
      createdAt: now
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
}

export const storage = new MemStorage();
