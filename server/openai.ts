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
            "For lines containing Chinese characters, even if they also contain English words, you must generate pinyin with tone marks for the Chinese parts and keep the English words as they are. " +
            "For example, for the line 'Baby 我们的感情', the pinyin part should be 'Baby wǒ men de gǎn qíng'. " +
            "For lines that are entirely in English, you should not generate pinyin. " +
            "Format your response as a valid JSON object with these properties: " +
            "1. simplifiedLyrics: A string with all lyrics converted to simplified Chinese characters, preserving original English words and line order. " +
            "2. pinyinLyrics: An array of objects, where each object has a 'pinyin' and a 'chinese' property. For lines with Chinese text, the 'pinyin' property should contain the pinyin with tone marks for the Chinese characters and the original English words. The 'chinese' property should contain the corresponding line in simplified Chinese. For purely English lines, the 'pinyin' property can be null. " +
            "3. englishLyrics: An array of strings, where each string is the English translation of the corresponding line of lyrics. For lines already in English, just repeat the line."
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
