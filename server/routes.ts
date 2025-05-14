
import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./auth";
import { insertSongSchema, Song } from "@shared/schema";
import { processChineseLyrics, getBidirectionalTranslation } from "./openai";
import { generateSongHtml, updateSongHtml } from "./htmlGenerator";
import { generateAllSongHtml } from "./generateHtml";
import fs from 'fs/promises';
import path from 'path';
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
      
      // Generate static HTML page for SEO
      if (updatedSong) {
        try {
          console.log("Starting HTML generation process");
          console.log("Song data:", JSON.stringify(updatedSong, null, 2));
          
          const htmlPath = await generateSongHtml(updatedSong);
          console.log(`Generated static HTML for song ${updatedSong.id} at ${htmlPath}`);
          
          // Write a simple test file as a sanity check
          const testFilePath = path.join(process.cwd(), 'public', 'songs', `test-song-${updatedSong.id}.html`);
          await fs.writeFile(testFilePath, `<html><body>Test file for song ${updatedSong.id}</body></html>`, 'utf-8');
          console.log(`Wrote test file to ${testFilePath}`);
          
          // Add the HTML path to the response data
          const responseData = {
            ...updatedSong,
            htmlPath
          };
          
          res.status(201).json(responseData);
        } catch (error) {
          const htmlError = error as Error;
          console.error("Error generating static HTML:", htmlError);
          console.error(htmlError.stack);
          // Still return the song data even if HTML generation fails
          res.status(201).json(updatedSong);
        }
      } else {
        res.status(201).json(updatedSong);
      }
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
  
  // Generate HTML for all songs
  app.post("/api/songs/generate-html", isAuthenticated, async (req, res) => {
    try {
      // Start the HTML generation process
      await generateAllSongHtml();
      
      res.json({ message: "HTML generation process completed" });
    } catch (error) {
      console.error("Error generating HTML:", error);
      res.status(500).json({ message: "Error generating HTML" });
    }
  });
  
  // Update existing songs with proper bilingual translations (both Chinese and English for titles and artists)
  app.post("/api/songs/update-translations", isAuthenticated, async (req, res) => {
    try {
      // Get all songs
      const songs = await storage.getSongs(100, 0);
      
      // Process each song that needs translation
      const results = [];
      
      for (const song of songs) {
        // Always try to get translations if any field is missing
        if (
          !song.titleChinese || !song.artistChinese ||
          (song.title === song.titleChinese) ||
          (song.artist === song.artistChinese)
        ) {
          // Get translations
          const translations = await getBidirectionalTranslation(
            song.title,
            song.artist
          );
          
          // Update fields with translations to ensure we have both languages
          const updates: Partial<Song> = {};
          
          // Always update the Chinese and English titles if we have translations
          if (translations.titleChinese) {
            updates.titleChinese = translations.titleChinese;
          }
          
          if (translations.titleEnglish && (!song.title || song.title === song.titleChinese)) {
            updates.title = translations.titleEnglish;
          }
          
          if (translations.artistChinese) {
            updates.artistChinese = translations.artistChinese;
          }
          
          if (translations.artistEnglish && (!song.artist || song.artist === song.artistChinese)) {
            updates.artist = translations.artistEnglish;
          }
          
          // Only update if there are changes to make
          if (Object.keys(updates).length > 0) {
            const updatedSong = await storage.updateSong(song.id, updates);
            
            // If song was updated and has complete information, update its HTML page
            if (updatedSong && updatedSong.pinyinLyrics && updatedSong.englishLyrics) {
              try {
                await updateSongHtml(updatedSong);
                console.log(`Updated static HTML for song ${updatedSong.id}`);
              } catch (htmlError) {
                console.error(`Error updating HTML for song ${updatedSong.id}:`, htmlError);
              }
            }
            
            results.push(updatedSong);
          }
        }
      }
      
      res.json({ 
        message: `Updated ${results.length} songs with bilingual translations`, 
        updatedSongs: results 
      });
    } catch (error) {
      console.error("Error updating translations:", error);
      res.status(500).json({ message: "Error updating translations" });
    }
  });

  return httpServer;
}
