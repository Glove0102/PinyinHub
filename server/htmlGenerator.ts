import fs from 'fs/promises';
import path from 'path';
import { Song } from '@shared/schema';

/**
 * Get a background image based on song ID
 */
export function getBackgroundImage(id: number): string {
  const images = [
    "https://images.unsplash.com/photo-1516280440614-37939bbacd81?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
    "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
    "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
    "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=1000"
  ];
  return images[id % images.length];
}

/**
 * Converts Chinese characters to pinyin representation for filename
 * Simple implementation - for proper implementation would need a full library
 */
function simplifyForFilename(text: string): string {
  // Replace spaces and special characters with hyphens
  return text
    .toLowerCase()
    .replace(/[^\w\u4e00-\u9fff]/g, '-') // Replace non-alphanumeric/Chinese chars with hyphens
    .replace(/\s+/g, '-')                // Replace spaces with hyphens
    .replace(/-+/g, '-')                 // Replace multiple hyphens with single hyphen
    .replace(/^-|-$/g, '');              // Remove leading/trailing hyphens
}

/**
 * Generates SEO-friendly static HTML for a song
 * @param song The song data
 * @returns The path to the generated HTML file
 */
export async function generateSongHtml(song: Song): Promise<string> {
  try {
    console.log('Starting HTML generation for song:', song.id);

    // Create a clean URL-friendly slug using pinyin name
    // If titleChinese exists, use it; otherwise use title
    const sourceTitle = song.titleChinese || song.title;
    const slug = `${song.id}-${simplifyForFilename(sourceTitle)}`;
    console.log('Generated slug:', slug);

    // Format the song data for the HTML
    const formattedSong = formatSongData(song);

    // Generate HTML content
    const htmlContent = generateSongHtmlContent(formattedSong);
    console.log('Generated HTML content, length:', htmlContent.length);

    // Ensure the directory exists
    const dirPath = path.join(process.cwd(), 'public', 'songs');
    console.log('Directory path:', dirPath);
    await fs.mkdir(dirPath, { recursive: true });

    // Write the HTML file
    const filePath = path.join(dirPath, `${slug}.html`);
    console.log('Writing HTML file to:', filePath);
    await fs.writeFile(filePath, htmlContent, 'utf-8');
    console.log('Successfully wrote HTML file');

    // Return the path to access the file
    const urlPath = `/songs/${slug}.html`;
    console.log('HTML URL path:', urlPath);
    return urlPath;
  } catch (error) {
    console.error('Error generating HTML for song:', song.id, error);
    throw error;
  }
}

/**
 * Format song data for HTML display
 */
function formatSongData(song: Song) {
  console.log("Formatting song data for HTML:", song.id);

  // Extract the primary title and artist (prefer Chinese if available)
  const primaryTitle = song.titleChinese || song.title;
  const secondaryTitle = song.titleChinese && song.title !== song.titleChinese ? song.title : null;

  const primaryArtist = song.artistChinese || song.artist;
  const secondaryArtist = song.artistChinese && song.artist !== song.artistChinese ? song.artist : null;

  console.log("Checking pinyinLyrics:", typeof song.pinyinLyrics, Array.isArray(song.pinyinLyrics), song.pinyinLyrics);

  // Format pinyin lines for HTML display - handle all possible cases safely
  let formattedPinyinLyrics: Array<{pinyin: string, chinese: string}> = [];
  if (song.pinyinLyrics) {
    if (Array.isArray(song.pinyinLyrics)) {
      formattedPinyinLyrics = song.pinyinLyrics.map((line: any) => {
        if (typeof line === 'object' && line !== null) {
          return {
            pinyin: line.pinyin || '',
            chinese: line.chinese || ''
          };
        }
        return { pinyin: '', chinese: '' };
      });
    } else if (typeof song.pinyinLyrics === 'string') {
      // If it's a string (due to JSON parsing issue), try to parse it
      try {
        const parsed = JSON.parse(song.pinyinLyrics as unknown as string);
        if (Array.isArray(parsed)) {
          formattedPinyinLyrics = parsed.map((line: any) => ({
            pinyin: line.pinyin || '',
            chinese: line.chinese || ''
          }));
        }
      } catch (e) {
        console.error("Error parsing pinyinLyrics:", e);
      }
    }
  }

  // Format English lyrics for HTML display - handle all possible cases safely
  let formattedEnglishLyrics: string[] = [];
  if (song.englishLyrics) {
    if (Array.isArray(song.englishLyrics)) {
      formattedEnglishLyrics = song.englishLyrics.filter(line => typeof line === 'string');
    } else if (typeof song.englishLyrics === 'string') {
      // If it's a string (due to JSON parsing issue), try to parse it
      try {
        const parsed = JSON.parse(song.englishLyrics as unknown as string);
        if (Array.isArray(parsed)) {
          formattedEnglishLyrics = parsed.filter(line => typeof line === 'string');
        }
      } catch (e) {
        console.error("Error parsing englishLyrics:", e);
      }
    }
  }

  const result = {
    id: song.id,
    primaryTitle,
    secondaryTitle,
    primaryArtist,
    secondaryArtist,
    simplifiedLyrics: song.simplifiedLyrics || song.lyrics || '',
    pinyinLyrics: formattedPinyinLyrics,
    englishLyrics: formattedEnglishLyrics,
    genre: song.genre || 'Chinese Music',
    views: song.views || 0,
    createdAt: song.createdAt || new Date()
  };

  console.log("Formatted song data result:", Object.keys(result));

  return result;
}

/**
 * Generate the HTML content for the song
 */
function generateSongHtmlContent(song: any): string {
  // Create a properly formatted date
  const formattedDate = new Date(song.createdAt).toISOString().split('T')[0];

  // Format SEO meta tags - include all required elements
  const pinyinTitle = song.pinyinLyrics.length > 0 ? song.pinyinLyrics[0].pinyin : '';

  const metaTitle = `${song.primaryTitle} - ${song.primaryArtist} | PinyinHub`;

  const metaDescription = `Learn ${song.primaryTitle} (${song.secondaryTitle || pinyinTitle}) by ${song.primaryArtist} with Pinyin transliteration and English translation. Perfect for Chinese language learners.`;

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
  <meta property="og:url" content="https://pinyinhub.com/songs/${song.id}">
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
  <link rel="canonical" href="https://pinyinhub.com/songs/${song.id}">

  <!-- Google Fonts for Chinese and Pinyin -->
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;500;700&family=Noto+Sans:wght@400;500;700&display=swap">

  <!-- External CSS -->
  <link rel="stylesheet" href="/styles/song-page.css">
</head>
<body>
  <div class="header">
    <div class="header-content">
      <a href="https://pinyinhub.com" class="logo">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M5 8l5 3l5 -3l5 3v6l-5 3l-5 -3l-5 3v-6l5 -3z"></path>
          <path d="M10 6l5 -3l5 3"></path>
        </svg>
        <span>PinyinHub</span>
      </a>
    </div>
  </div>

  <div class="main">
    <a href="https://pinyinhub.com/browse" class="back-button">
      ← Back to songs
    </a>

    <!-- Song header -->
    <div class="song-header">
      <div class="song-cover">
        <img src="${getBackgroundImage(song.id)}" alt="${song.primaryTitle} by ${song.primaryArtist}">
        <div class="song-cover-overlay"></div>
        <div class="song-info">
          <h1 class="song-title">${song.primaryTitle}</h1>
          ${song.secondaryTitle ? `<p class="song-title-secondary">${song.secondaryTitle}</p>` : ''}
          <p class="song-artist">${song.primaryArtist}</p>
          ${song.secondaryArtist ? `<p class="song-artist-secondary">${song.secondaryArtist}</p>` : ''}
          <div class="song-meta">
            <span class="song-genre">${song.genre || 'Chinese Music'}</span>
            <span class="song-views">${song.views || 0} views</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Song content -->
    <div class="song-content">
      <h2>Lyrics with Pinyin</h2>
      <div class="lyrics-text">
        ${song.pinyinLyrics.map((line: {pinyin: string, chinese: string}) => `
        <div class="lyric-line">
          <div class="pinyin">${line.pinyin}</div>
          <div class="chinese">${line.chinese}</div>
        </div>
        `).join('')}
      </div>

      <!-- Actions -->
      <div class="actions">
        <a href="https://pinyinhub.com/songs/${song.id}" class="primary-button">
          View in PinyinHub App
        </a>
      </div>
    </div>
  </div>

  <div class="footer">
    <p>© ${new Date().getFullYear()} PinyinHub - Learn Chinese Through Music</p>
  </div>

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