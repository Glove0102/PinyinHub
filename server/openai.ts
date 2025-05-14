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
            "Convert Chinese lyrics into simplified characters, pinyin with tone marks, and English translation. " +
            "Format your response as valid JSON with these properties: " +
            "1. simplifiedLyrics: A string with the lyrics in simplified Chinese." +
            "2. pinyinLyrics: An array of objects with {pinyin: string, chinese: string} for each line." +
            "3. englishLyrics: An array of English translation strings for each line."
        },
        {
          role: "user",
          content: `Please process these Chinese lyrics: \n\n${lyrics}`
        }
      ],
      response_format: { type: "json_object" }
    });

    // Parse the JSON response
    const result = JSON.parse(response.choices[0].message.content);
    
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

    return response.choices[0].message.content?.trim() || "";
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
            "and provide translations in the other language. Return a JSON object with these fields: " +
            "titleChinese, titleEnglish, artistChinese, artistEnglish. Only fill the fields that are appropriate " +
            "based on the input language. For example, if the title is already in Chinese, provide titleEnglish but not titleChinese."
        },
        {
          role: "user",
          content: `Title: ${title}\nArtist: ${artist}`
        }
      ],
      response_format: { type: "json_object" }
    });

    // Parse the JSON response
    return JSON.parse(response.choices[0].message.content);
  } catch (error) {
    console.error("Error getting translations with OpenAI:", error);
    throw new Error("Failed to get translations: " + (error as Error).message);
  }
}
