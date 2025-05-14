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
 * Generates SEO-friendly static HTML for a song
 * @param song The song data
 * @returns The path to the generated HTML file
 */
export async function generateSongHtml(song: Song): Promise<string> {
  try {
    console.log('Starting HTML generation for song:', song.id);
    
    // Create a clean URL-friendly slug
    const slug = createSlug(song.id, song.title, song.titleChinese);
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
    /* Base styles */
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      margin: 0;
      padding: 0;
      background-color: #f5f5f7;
    }
    
    /* Layout */
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 16px;
    }
    
    .header {
      background-color: #fff;
      padding: 16px 0;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }
    
    .header-content {
      display: flex;
      align-items: center;
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 16px;
    }
    
    .logo {
      display: flex;
      align-items: center;
      color: #111;
      text-decoration: none;
      font-weight: 600;
      font-size: 1.2rem;
    }
    
    .logo svg {
      width: 32px;
      height: 32px;
      margin-right: 8px;
      color: #2563eb;
    }
    
    .main {
      max-width: 1200px;
      margin: 0 auto;
      padding: 32px 16px;
    }
    
    .footer {
      background-color: #fff;
      padding: 16px 0;
      box-shadow: 0 -1px 3px rgba(0, 0, 0, 0.1);
      margin-top: 32px;
      text-align: center;
      font-size: 0.875rem;
      color: #6b7280;
    }
    
    /* Song header section */
    .back-button {
      margin-bottom: 24px;
      display: inline-block;
      padding: 8px 12px;
      font-size: 0.875rem;
      color: #4b5563;
      background-color: #fff;
      border: 1px solid #e5e7eb;
      border-radius: 4px;
      cursor: pointer;
      text-decoration: none;
      transition: all 0.2s;
    }
    
    .back-button:hover {
      background-color: #f9fafb;
    }
    
    .song-header {
      background-color: #fff;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
      margin-bottom: 32px;
    }
    
    .song-cover {
      position: relative;
      height: 320px;
      overflow: hidden;
    }
    
    .song-cover img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    
    .song-cover-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(to top, rgba(0, 0, 0, 0.9) 0%, rgba(0, 0, 0, 0.5) 50%, transparent 100%);
    }
    
    .song-info {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      padding: 32px;
      color: #fff;
    }
    
    .song-title {
      font-size: 2rem;
      font-weight: 700;
      margin-bottom: 8px;
    }
    
    .song-title-secondary {
      font-size: 1.5rem;
      color: #e5e7eb;
      margin-bottom: 8px;
    }
    
    .song-artist {
      font-size: 1.25rem;
      font-weight: 500;
      color: #d1d5db;
      margin-bottom: 4px;
    }
    
    .song-artist-secondary {
      font-size: 1rem;
      color: #9ca3af;
    }
    
    .song-meta {
      display: flex;
      align-items: center;
      margin-top: 16px;
    }
    
    .song-genre {
      background-color: rgba(37, 99, 235, 0.8);
      color: #fff;
      font-size: 0.75rem;
      padding: 4px 8px;
      border-radius: 4px;
    }
    
    .song-views {
      margin-left: 16px;
      font-size: 0.875rem;
      color: #d1d5db;
    }
    
    /* Song content section */
    .song-content {
      background-color: #fff;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
      padding: 24px 32px 32px;
    }
    
    /* Tabs */
    .tabs {
      border-bottom: 1px solid #e5e7eb;
      display: flex;
      margin-bottom: 24px;
    }
    
    .tab {
      padding: 8px 0;
      margin-right: 24px;
      font-size: 0.875rem;
      font-weight: 500;
      color: #6b7280;
      border-bottom: 2px solid transparent;
      cursor: pointer;
    }
    
    .tab.active {
      color: #2563eb;
      border-color: #2563eb;
    }
    
    /* Lyrics content */
    .tab-content {
      padding-top: 16px;
    }
    
    .lyrics-text .pinyin {
      color: #4b5563;
      display: block;
      font-size: 0.9rem;
      line-height: 1.5;
    }
    
    .lyrics-text .chinese {
      font-size: 1.1rem;
      line-height: 1.5;
      display: block;
      margin-bottom: 16px;
    }
    
    .lyrics-text .english {
      color: #6b7280;
      font-style: italic;
      line-height: 1.5;
      margin-bottom: 16px;
    }
    
    /* Actions section */
    .actions {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 32px;
    }
    
    .favorite-button {
      display: inline-flex;
      align-items: center;
      padding: 6px 12px;
      font-size: 0.875rem;
      color: #4b5563;
      background-color: #fff;
      border: 1px solid #e5e7eb;
      border-radius: 4px;
      cursor: pointer;
      text-decoration: none;
    }
    
    .favorite-button svg {
      width: 16px;
      height: 16px;
      margin-right: 4px;
    }
    
    .date-added {
      font-size: 0.875rem;
      color: #6b7280;
    }
    
    /* App link */
    .app-link {
      display: block;
      text-align: center;
      margin: 32px auto;
      max-width: 300px;
      padding: 16px;
      background-color: #2563eb;
      color: white;
      text-decoration: none;
      border-radius: 8px;
      font-weight: 600;
      box-shadow: 0 4px 6px -1px rgba(37, 99, 235, 0.2);
      transition: all 0.2s;
    }
    
    .app-link:hover {
      background-color: #1d4ed8;
      box-shadow: 0 6px 10px -1px rgba(37, 99, 235, 0.3);
    }
    
    /* Responsive adjustments */
    @media (max-width: 768px) {
      .song-cover {
        height: 240px;
      }
      
      .song-title {
        font-size: 1.5rem;
      }
      
      .song-title-secondary {
        font-size: 1.25rem;
      }
      
      .song-content {
        padding: 16px 24px 24px;
      }
    }
    
    /* Side-by-side layout for English/Chinese tab */
    .columns {
      display: grid;
      grid-template-columns: 1fr;
      gap: 16px;
    }
    
    @media (min-width: 768px) {
      .columns {
        grid-template-columns: 1fr 1fr;
      }
    }
  </style>
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
    <a href="https://pinyinhub.replit.app/browse" class="back-button">
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
    
    <!-- Song content with tabs -->
    <div class="song-content">
      <div class="tabs">
        <div class="tab active" id="tab-pinyin">Pinyin</div>
        <div class="tab" id="tab-chinese">简体</div>
        <div class="tab" id="tab-english">English/Chinese</div>
      </div>
      
      <!-- Pinyin tab content -->
      <div class="tab-content lyrics-text" id="content-pinyin">
        ${song.pinyinLyrics.map((line: {pinyin: string, chinese: string}) => `
        <div>
          <span class="pinyin">${line.pinyin}</span>
          <span class="chinese">${line.chinese}</span>
        </div>
        `).join('')}
      </div>
      
      <!-- Chinese tab content (hidden by default) -->
      <div class="tab-content lyrics-text" id="content-chinese" style="display: none;">
        ${song.simplifiedLyrics.split('\n').map((line: string) => `
        <p class="chinese">${line}</p>
        `).join('')}
      </div>
      
      <!-- English/Chinese tab content (hidden by default) -->
      <div class="tab-content lyrics-text" id="content-english" style="display: none;">
        <div class="columns">
          <div>
            ${song.simplifiedLyrics.split('\n').map((line: string) => `
            <p class="chinese">${line}</p>
            `).join('')}
          </div>
          <div>
            ${song.englishLyrics.map((line: string) => `
            <p class="english">${line}</p>
            `).join('')}
          </div>
        </div>
      </div>
      
      <!-- Actions -->
      <div class="actions">
        <a href="https://pinyinhub.replit.app/songs/${song.id}" class="favorite-button">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
          </svg>
          Favorite
        </a>
        <div class="date-added">
          Added on ${new Date(song.createdAt).toLocaleDateString()}
        </div>
      </div>
    </div>
    
    <a href="https://pinyinhub.replit.app/songs/${song.id}" class="app-link">
      View This Song in the PinyinHub App
    </a>
  </div>
  
  <div class="footer">
    <p>© ${new Date().getFullYear()} PinyinHub - Learn Chinese Through Music</p>
  </div>
  
  <!-- Hidden lyrics content for search engines -->
  <div style="display:none" aria-hidden="true">
    ${lyricsPreview}
  </div>
  
  <!-- Simple tab switching script -->
  <script>
    document.addEventListener('DOMContentLoaded', function() {
      const tabs = document.querySelectorAll('.tab');
      const contents = document.querySelectorAll('.tab-content');
      
      tabs.forEach(tab => {
        tab.addEventListener('click', function() {
          // Remove active class from all tabs
          tabs.forEach(t => t.classList.remove('active'));
          // Add active class to clicked tab
          this.classList.add('active');
          
          // Hide all tab contents
          contents.forEach(content => content.style.display = 'none');
          
          // Show the corresponding content
          const contentId = 'content-' + this.id.split('-')[1];
          document.getElementById(contentId).style.display = 'block';
        });
      });
    });
  </script>
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