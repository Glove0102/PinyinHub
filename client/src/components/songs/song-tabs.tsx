import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Song, PinyinLine } from "@shared/schema";
import { Loader2 } from "lucide-react";

interface SongTabsProps {
  song: Song;
  isLoading?: boolean;
  isPreview?: boolean;
}

export function SongTabs({ song, isLoading = false, isPreview = false }: SongTabsProps) {
  const [activeTab, setActiveTab] = useState("pinyin");

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  // Helper function to limit lines for preview mode
  const getLimitedLines = (content: string | PinyinLine[] | string[] | null, limit: number = 3) => {
    if (!content) return [];
    
    if (typeof content === 'string') {
      return content.split('\n').slice(0, limit);
    }
    
    return content.slice(0, limit);
  };

  return (
    <Tabs defaultValue="pinyin" value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="-mb-px flex space-x-6 border-b border-gray-200">
        <TabsTrigger 
          value="pinyin" 
          className={`whitespace-nowrap py-2 px-1 border-b-2 border-transparent font-medium text-sm ${
            activeTab === 'pinyin' ? 'text-primary border-primary' : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          Pinyin
        </TabsTrigger>
        <TabsTrigger 
          value="chinese" 
          className={`whitespace-nowrap py-2 px-1 border-b-2 border-transparent font-medium text-sm ${
            activeTab === 'chinese' ? 'text-primary border-primary' : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          简体
        </TabsTrigger>
        <TabsTrigger 
          value="english" 
          className={`whitespace-nowrap py-2 px-1 border-b-2 border-transparent font-medium text-sm ${
            activeTab === 'english' ? 'text-primary border-primary' : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          English/Chinese
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="pinyin" className="pt-4 lyrics-text">
        {song.pinyinLyrics && (
          isPreview 
            ? getLimitedLines(song.pinyinLyrics as PinyinLine[], 3).map((line, index) => (
                <div key={index} className="mb-4">
                  <span className="pinyin">{line.pinyin}</span>
                  <span className="chinese">{line.chinese}</span>
                </div>
              ))
            : (song.pinyinLyrics as PinyinLine[]).map((line, index) => (
                <div key={index} className="mb-4">
                  <span className="pinyin">{line.pinyin}</span>
                  <span className="chinese">{line.chinese}</span>
                </div>
              ))
        )}pan>
            <span className="chinese">{line.chinese}</span>
          </div>
        ))}
      </TabsContent>
      
      <TabsContent value="chinese" className="pt-4 lyrics-text">
        {song.simplifiedLyrics && (
          isPreview
            ? getLimitedLines(song.simplifiedLyrics, 3).map((line, index) => (
                <p key={index} className="chinese mb-3">
                  {line}
                </p>
              ))
            : song.simplifiedLyrics.split('\n').map((line, index) => (
                <p key={index} className="chinese mb-3">
                  {line}
                </p>
              ))
        )}
      </TabsContent>
      
      <TabsContent value="english" className="pt-4 lyrics-text">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            {song.simplifiedLyrics && (
              isPreview
                ? getLimitedLines(song.simplifiedLyrics, 3).map((line, index) => (
                    <p key={index} className="chinese mb-2">
                      {line}
                    </p>
                  ))
                : song.simplifiedLyrics.split('\n').map((line, index) => (
                    <p key={index} className="chinese mb-2">
                      {line}
                    </p>
                  ))
            )}
          </div>
          <div>
            {song.englishLyrics && (
              isPreview
                ? getLimitedLines(song.englishLyrics as string[], 3).map((line, index) => (
                    <p key={index} className="english mb-2">
                      {line}
                    </p>
                  ))
                : (song.englishLyrics as string[]).map((line, index) => (
                    <p key={index} className="english mb-2">
                      {line}
                    </p>
                  ))
            )}
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
}
