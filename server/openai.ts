import OpenAI from "openai";
import { PinyinLine } from "@shared/schema";

// Initialize OpenAI client
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || "sk-dummy-key-for-development"
});

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const MODEL = "gpt-4.1-mini-2025-04-14";

/**
 * Process Chinese lyrics to generate pinyin and English translation
 */
export async function processChineseLyrics(lyrics: string): Promise<{
  simplifiedLyrics: string;
  pinyinLyrics: PinyinLine[];
  englishLyrics: string[];
}> {
  try {
    const response = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        {
          role: "system",
          content: 
            "You are a Chinese language expert specializing in transliteration and translation. " +
            "You will receive lyrics that may include both Chinese and English lines. " +
            "Convert only the Chinese parts into simplified characters, pinyin with tone marks, and English translation. " +
            "For lines that are already in English, do not change or translate them—just include them as-is in all outputs. " +
            "Format your response as valid JSON with these properties: " +
            "1. simplifiedLyrics: A string with all lyrics in simplified Chinese or original English, preserving original line order. " +
            "2. pinyinLyrics: An array of objects with {pinyin: string, chinese: string} for each line. For English lines, use {pinyin: null, chinese: line}. " +
            "3. englishLyrics: An array of English translation strings for each line. For original English lines, repeat the line as-is."
        },
        {
          role: "user",
          content: `Please process these Chinese lyrics: \n\n${lyrics}`
        }
      ],
      response_format: { type: "json_object" }
    });

    // Parse the JSON response
    const content = response.choices[0].message.content || '{}';
    const result = JSON.parse(content);
    
    return {
      simplifiedLyrics: result.simplifiedLyrics,
      pinyinLyrics: result.pinyinLyrics,
      englishLyrics: result.englishLyrics
    };
  } catch (error) {
    console.error("Error processing lyrics with OpenAI:", error);
    throw new Error("Failed to process lyrics: " + (error as Error).message);
  }
}

/**
 * Translate text between Chinese and English
 */
export async function translateText(text: string, targetLanguage: "chinese" | "english"): Promise<string> {
  try {
    const prompt = targetLanguage === "chinese" 
      ? `Translate this English text to Chinese: "${text}"`
      : `Translate this Chinese text to English: "${text}"`;

    const response = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        {
          role: "system",
          content: "You are a professional translator between Chinese and English. Provide only the translation without any additional text."
        },
        {
          role: "user",
          content: prompt
        }
      ]
    });

    const content = response.choices[0].message.content || "";
    return content.trim();
  } catch (error) {
    console.error("Error translating text with OpenAI:", error);
    throw new Error("Failed to translate text: " + (error as Error).message);
  }
}

/**
 * Get bidirectional translations for song titles and artists
 */
export async function getBidirectionalTranslation(
  title: string, 
  artist: string
): Promise<{
  titleChinese?: string;
  titleEnglish?: string;
  artistChinese?: string;
  artistEnglish?: string;
}> {
  try {
    const response = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        {
          role: "system",
          content: 
            "You are a music translator who can identify if text is in Chinese or English " +
            "and provide translations in the other language. Return a JSON object with ALL of these fields: " +
            "titleChinese, titleEnglish, artistChinese, artistEnglish. " +
            "IMPORTANT: Always return BOTH Chinese and English versions for BOTH title and artist, " +
            "regardless of the input language. If the input is already in one language, " +
            "translate it to the other, but always include both versions in your response. " +
            "If a title or artist is already in Chinese, still return it in titleChinese/artistChinese " +
            "AND provide the English translation in titleEnglish/artistEnglish. " +
            "Similarly, if a title or artist is in English, still return it in titleEnglish/artistEnglish " +
            "AND provide the Chinese translation in titleChinese/artistChinese."
        },
        {
          role: "user",
          content: `Title: ${title}\nArtist: ${artist}`
        }
      ],
      response_format: { type: "json_object" }
    });

    // Parse the JSON response
    const content = response.choices[0].message.content || '{}';
    return JSON.parse(content);
  } catch (error) {
    console.error("Error getting translations with OpenAI:", error);
    throw new Error("Failed to get translations: " + (error as Error).message);
  }
}
