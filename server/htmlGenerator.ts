import fs from 'fs/promises';
import path from 'path';
import { Song } from '@shared/schema';

/**
 * Generates SEO-friendly static HTML for a song
 * @param song The song data
 * @returns The path to the generated HTML file
 */
export async function generateSongHtml(song: Song): Promise<string> {
  // Create a clean URL-friendly slug
  const slug = createSlug(song.id, song.title, song.titleChinese);
  
  // Format the song data for the HTML
  const formattedSong = formatSongData(song);
  
  // Generate HTML content
  const htmlContent = generateSongHtmlContent(formattedSong);
  
  // Ensure the directory exists
  const dirPath = path.join(process.cwd(), 'public', 'songs');
  await fs.mkdir(dirPath, { recursive: true });
  
  // Write the HTML file
  const filePath = path.join(dirPath, `${slug}.html`);
  await fs.writeFile(filePath, htmlContent, 'utf-8');
  
  // Return the path to access the file
  return `/songs/${slug}.html`;
}

/**
 * Creates a URL-friendly slug for the song
 */
function createSlug(id: number, title: string, titleChinese: string | null): string {
  // Start with the ID for uniqueness
  let baseSlug = `${id}-`;
  
  // Use Chinese title if available, otherwise English
  const slugTitle = titleChinese || title;
  
  // Convert to lowercase and replace spaces/special chars with hyphens
  const cleaned = slugTitle
    .toLowerCase()
    .replace(/[^\w\s\u4e00-\u9fff]/g, '') // Keep alphanumeric and Chinese characters
    .replace(/\s+/g, '-'); // Replace spaces with hyphens
  
  return baseSlug + cleaned;
}

/**
 * Format song data for HTML display
 */
function formatSongData(song: Song) {
  // Extract the primary title and artist (prefer Chinese if available)
  const primaryTitle = song.titleChinese || song.title;
  const secondaryTitle = song.titleChinese && song.title !== song.titleChinese ? song.title : null;
  
  const primaryArtist = song.artistChinese || song.artist;
  const secondaryArtist = song.artistChinese && song.artist !== song.artistChinese ? song.artist : null;
  
  // Format pinyin lines for HTML display
  const formattedPinyinLyrics = song.pinyinLyrics ? 
    song.pinyinLyrics.map(line => ({
      pinyin: line.pinyin,
      chinese: line.chinese
    })) : [];
  
  // Format English lyrics for HTML display
  const formattedEnglishLyrics = song.englishLyrics || [];
  
  return {
    id: song.id,
    primaryTitle,
    secondaryTitle,
    primaryArtist,
    secondaryArtist,
    simplifiedLyrics: song.simplifiedLyrics || song.lyrics,
    pinyinLyrics: formattedPinyinLyrics,
    englishLyrics: formattedEnglishLyrics,
    genre: song.genre || 'Chinese Music',
    views: song.views || 0,
    createdAt: song.createdAt || new Date()
  };
}

/**
 * Generate the HTML content for the song
 */
function generateSongHtmlContent(song: any): string {
  // Create a properly formatted date
  const formattedDate = new Date(song.createdAt).toISOString().split('T')[0];
  
  // Format SEO meta tags
  const metaTitle = song.secondaryTitle 
    ? `${song.primaryTitle} (${song.secondaryTitle}) - ${song.primaryArtist} | PinyinHub`
    : `${song.primaryTitle} - ${song.primaryArtist} | PinyinHub`;
  
  const metaDescription = `Learn ${song.primaryTitle} by ${song.primaryArtist} with Pinyin transliteration and English translation. Perfect for Chinese language learners.`;
  
  // Create a comma-separated list of lyrics for search indexing (first 200 chars)
  const lyricsPreview = song.simplifiedLyrics.substring(0, 200).split('\n').join(', ');
  
  // Generate HTML with proper indentation
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${metaTitle}</title>
  
  <!-- SEO Meta Tags -->
  <meta name="description" content="${metaDescription}">
  <meta name="keywords" content="Chinese songs, pinyin, lyrics, ${song.primaryTitle}, ${song.primaryArtist}, learn Chinese">
  
  <!-- Open Graph Tags -->
  <meta property="og:title" content="${metaTitle}">
  <meta property="og:description" content="${metaDescription}">
  <meta property="og:type" content="music.song">
  <meta property="og:url" content="https://pinyinhub.replit.app/songs/${song.id}">
  <meta property="og:site_name" content="PinyinHub">
  <meta property="music:musician" content="${song.primaryArtist}">
  
  <!-- Twitter Card Tags -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${metaTitle}">
  <meta name="twitter:description" content="${metaDescription}">
  
  <!-- Structured Data - Song -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "MusicComposition",
    "name": "${song.primaryTitle}",
    "alternativeHeadline": "${song.secondaryTitle || ''}",
    "composer": {
      "@type": "Person",
      "name": "${song.primaryArtist}"
    },
    "inLanguage": "zh-CN",
    "datePublished": "${formattedDate}",
    "musicCompositionForm": "${song.genre}",
    "lyrics": {
      "@type": "CreativeWork",
      "text": "${song.simplifiedLyrics.substring(0, 500)}..."
    }
  }
  </script>
  
  <!-- App Link -->
  <link rel="canonical" href="https://pinyinhub.replit.app/songs/${song.id}">
  
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
    }
    header {
      text-align: center;
      border-bottom: 1px solid #eee;
      padding-bottom: 20px;
      margin-bottom: 30px;
    }
    h1 {
      margin-bottom: 5px;
      color: #2563eb;
    }
    .subtitle {
      color: #4b5563;
      font-size: 1.2rem;
      margin-top: 0;
    }
    .artist {
      font-size: 1.1rem;
      color: #4b5563;
    }
    .section {
      margin-bottom: 30px;
    }
    .section-title {
      font-size: 1.2rem;
      margin-bottom: 15px;
      font-weight: bold;
      color: #1f2937;
    }
    .lyrics-container {
      display: flex;
      flex-direction: column;
      gap: 15px;
    }
    .lyrics-line {
      display: flex;
      flex-direction: column;
      gap: 5px;
    }
    .pinyin {
      color: #4b5563;
    }
    .chinese {
      font-size: 1.2rem;
    }
    .english {
      color: #6b7280;
      font-style: italic;
    }
    .app-link {
      display: block;
      text-align: center;
      margin-top: 40px;
      padding: 15px;
      background-color: #2563eb;
      color: white;
      text-decoration: none;
      border-radius: 5px;
      font-weight: bold;
    }
    .metadata {
      font-size: 0.8rem;
      color: #6b7280;
      margin-top: 30px;
      text-align: center;
    }
  </style>
</head>
<body>
  <header>
    <h1>${song.primaryTitle}</h1>
    ${song.secondaryTitle ? `<p class="subtitle">${song.secondaryTitle}</p>` : ''}
    <p class="artist">
      ${song.primaryArtist}
      ${song.secondaryArtist ? ` (${song.secondaryArtist})` : ''}
    </p>
  </header>
  
  <main>
    <div class="section">
      <h2 class="section-title">Lyrics with Pinyin</h2>
      <div class="lyrics-container">
        ${song.pinyinLyrics.map(line => `
        <div class="lyrics-line">
          <div class="pinyin">${line.pinyin}</div>
          <div class="chinese">${line.chinese}</div>
        </div>
        `).join('')}
      </div>
    </div>
    
    <div class="section">
      <h2 class="section-title">English Translation</h2>
      <div class="lyrics-container">
        ${song.englishLyrics.map(line => `
        <div class="english">${line}</div>
        `).join('')}
      </div>
    </div>
    
    <a href="https://pinyinhub.replit.app/songs/${song.id}" class="app-link">
      View This Song in the PinyinHub App
    </a>
  </main>
  
  <footer>
    <p class="metadata">
      Added on ${new Date(song.createdAt).toLocaleDateString()} | 
      Views: ${song.views} | 
      Genre: ${song.genre || 'Chinese Music'}
    </p>
  </footer>
  
  <!-- Hidden lyrics content for search engines -->
  <div style="display:none" aria-hidden="true">
    ${lyricsPreview}
  </div>
</body>
</html>`;
}

/**
 * Update an existing song's HTML page
 */
export async function updateSongHtml(song: Song): Promise<void> {
  // Simply regenerate the HTML
  await generateSongHtml(song);
}