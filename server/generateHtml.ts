import { storage } from './storage';
import { generateSongHtml } from './htmlGenerator';
import fs from 'fs/promises';
import path from 'path';

async function generateAllSongHtml() {
  try {
    console.log('Starting to generate HTML for all songs...');
    
    // Ensure the directory exists
    const dirPath = path.join(process.cwd(), 'public', 'songs');
    await fs.mkdir(dirPath, { recursive: true });
    
    // Write a simple test file
    const testFilePath = path.join(dirPath, 'test-generated.html');
    await fs.writeFile(testFilePath, '<html><body>Test file generated at ' + new Date().toISOString() + '</body></html>', 'utf-8');
    console.log(`Wrote test file to ${testFilePath}`);
    
    // Get all songs
    const songs = await storage.getSongs(100, 0);
    console.log(`Found ${songs.length} songs`);
    
    // Generate HTML for each song
    for (const song of songs) {
      try {
        console.log(`Processing song ID: ${song.id}, Title: ${song.title}`);
        
        // Create a simple HTML file for the song
        const slug = `${song.id}-${song.title.toLowerCase().replace(/\s+/g, '-')}`;
        const simpleHtmlPath = path.join(dirPath, `${slug}.html`);
        
        const simpleHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${song.title} by ${song.artist} | PinyinHub</title>
  <meta name="description" content="Learn ${song.title} by ${song.artist} with Pinyin transliteration and English translation.">
</head>
<body>
  <h1>${song.title}</h1>
  <h2>${song.artist}</h2>
  <p>View this song in the <a href="/songs/${song.id}">PinyinHub application</a>.</p>
  <div>
    <h3>Original Lyrics</h3>
    <pre>${song.lyrics}</pre>
  </div>
</body>
</html>`;
        
        await fs.writeFile(simpleHtmlPath, simpleHtml, 'utf-8');
        console.log(`Created simple HTML file at ${simpleHtmlPath}`);
        
        // Try to generate the full HTML version
        try {
          const htmlPath = await generateSongHtml(song);
          console.log(`Generated full HTML for song ${song.id} at ${htmlPath}`);
        } catch (htmlError) {
          console.error(`Error generating full HTML for song ${song.id}:`, htmlError);
        }
      } catch (songError) {
        console.error(`Error processing song ${song.id}:`, songError);
      }
    }
    
    console.log('Finished generating HTML for all songs');
  } catch (error) {
    console.error('Error in generateAllSongHtml:', error);
  }
}

// Export the function so it can be run from routes
export { generateAllSongHtml };

// We'll call this function from the API routes instead of trying to run it directly
// as we're using ESM modules which don't have require.main