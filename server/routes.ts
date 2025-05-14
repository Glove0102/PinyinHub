import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./auth";
import { insertSongSchema } from "@shared/schema";
import { processChineseLyrics, getBidirectionalTranslation } from "./openai";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication routes
  setupAuth(app);
  
  // Create HTTP server
  const httpServer = createServer(app);

  // API Routes
  // Get all songs with pagination
  app.get("/api/songs", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const offset = parseInt(req.query.offset as string) || 0;
      
      const songs = await storage.getSongs(limit, offset);
      res.json(songs);
    } catch (error) {
      res.status(500).json({ message: "Error fetching songs" });
    }
  });

  // Search songs
  app.get("/api/songs/search", async (req, res) => {
    try {
      const query = req.query.q as string;
      if (!query) {
        return res.status(400).json({ message: "Search query is required" });
      }
      
      const songs = await storage.searchSongs(query);
      res.json(songs);
    } catch (error) {
      res.status(500).json({ message: "Error searching songs" });
    }
  });

  // Get song by ID
  app.get("/api/songs/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid song ID" });
      }
      
      const song = await storage.getSong(id);
      if (!song) {
        return res.status(404).json({ message: "Song not found" });
      }
      
      // Increment view count
      await storage.incrementSongViews(id);
      
      res.json(song);
    } catch (error) {
      res.status(500).json({ message: "Error fetching song" });
    }
  });

  // Create a new song (authenticated users only)
  app.post("/api/songs", isAuthenticated, async (req, res) => {
    try {
      // Validate request
      const songData = insertSongSchema.parse({
        ...req.body,
        userId: (req.user as Express.User).id
      });
      
      // Get bidirectional translations for title and artist if needed
      const translations = await getBidirectionalTranslation(
        songData.title,
        songData.artist
      );
      
      // Apply translations
      if (translations.titleChinese && !songData.titleChinese) {
        songData.titleChinese = translations.titleChinese;
      }
      
      if (translations.artistChinese && !songData.artistChinese) {
        songData.artistChinese = translations.artistChinese;
      }
      
      // Create song record
      const song = await storage.createSong(songData);
      
      // Process lyrics with OpenAI
      const processedLyrics = await processChineseLyrics(songData.lyrics);
      
      // Update song with processed data
      const updatedSong = await storage.updateSong(song.id, {
        simplifiedLyrics: processedLyrics.simplifiedLyrics,
        pinyinLyrics: processedLyrics.pinyinLyrics,
        englishLyrics: processedLyrics.englishLyrics
      });
      
      res.status(201).json(updatedSong);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid song data", errors: error.errors });
      }
      console.error("Error creating song:", error);
      res.status(500).json({ message: "Error creating song" });
    }
  });

  // Get songs by current user
  app.get("/api/user/songs", isAuthenticated, async (req, res) => {
    try {
      const songs = await storage.getSongsByUserId((req.user as Express.User).id);
      res.json(songs);
    } catch (error) {
      res.status(500).json({ message: "Error fetching user songs" });
    }
  });

  return httpServer;
}
