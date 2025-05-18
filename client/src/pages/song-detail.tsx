import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { Loader2, Heart, ChevronLeft } from "lucide-react";
import { useEffect } from "react";

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { SongTabs } from "@/components/songs/song-tabs";
import { MediaLinks } from "@/components/songs/media-links";
import { Button } from "@/components/ui/button";
import { Song } from "@shared/schema";

export default function SongDetail() {
  const { id } = useParams<{ id: string }>();
  const songId = parseInt(id);

  const { data: song, isLoading, error } = useQuery<Song>({
    queryKey: [`/api/songs/${songId}`],
  });
  
  // Update page metadata for SEO
  useEffect(() => {
    if (song) {
      // Set page title
      document.title = `${song.titleChinese || song.title} - ${song.artistChinese || song.artist} | PinyinHub`;
      
      // Update meta tags
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', 
          `Learn ${song.titleChinese || song.title} by ${song.artistChinese || song.artist} with pinyin and English translation on PinyinHub.`
        );
      } else {
        const meta = document.createElement('meta');
        meta.name = 'description';
        meta.content = `Learn ${song.titleChinese || song.title} by ${song.artistChinese || song.artist} with pinyin and English translation on PinyinHub.`;
        document.head.appendChild(meta);
      }
      
      // Add Open Graph tags for social media sharing
      setOpenGraphTags({
        title: `${song.titleChinese || song.title} - ${song.artistChinese || song.artist}`,
        description: `Learn Chinese with lyrics, pinyin, and English translation for ${song.title} by ${song.artist}`,
        image: getBackgroundImage(song.id),
        url: window.location.href
      });
    }
    
    // Cleanup function to restore default title
    return () => {
      document.title = 'PinyinHub - Learn Chinese Through Music';
    };
  }, [song]);
  
  // Helper function to set Open Graph tags
  const setOpenGraphTags = ({ title, description, image, url }: { 
    title: string, description: string, image: string, url: string 
  }) => {
    // Helper to create or update meta tags
    const setMetaTag = (property: string, content: string) => {
      let meta = document.querySelector(`meta[property="${property}"]`);
      if (meta) {
        meta.setAttribute('content', content);
      } else {
        meta = document.createElement('meta');
        meta.setAttribute('property', property);
        meta.setAttribute('content', content);
        document.head.appendChild(meta);
      }
    };
    
    setMetaTag('og:title', title);
    setMetaTag('og:description', description);
    setMetaTag('og:image', image);
    setMetaTag('og:url', url);
    setMetaTag('og:type', 'website');
  };

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow">
          <div className="flex justify-center items-center h-96">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !song) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow">
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Song Not Found</h2>
            <p className="text-gray-600 mb-6">
              {error?.message || "The song you're looking for could not be found."}
            </p>
            <Link href="/browse">
              <Button>
                Browse All Songs
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Get a background image based on song ID
  const getBackgroundImage = (id: number) => {
    const images = [
      "https://images.unsplash.com/photo-1516280440614-37939bbacd81?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
      "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
      "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
      "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=1000"
    ];
    return images[id % images.length];
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow">
        {/* Back button */}
        <div className="mb-6">
          <Link href="/browse">
            <Button variant="outline" size="sm" className="flex items-center">
              <ChevronLeft className="h-4 w-4 mr-1" /> Back to songs
            </Button>
          </Link>
        </div>

        {/* Song header */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
          <div className="relative h-64 md:h-80 w-full overflow-hidden">
            <img
              src={getBackgroundImage(song.id)}
              alt={`${song.artist} - ${song.title}`}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 text-white">
              <div className="max-w-4xl">
                <h1 className="text-3xl md:text-4xl font-bold mb-2">
                  {song.titleChinese || song.title}
                </h1>
                {song.titleChinese && song.title !== song.titleChinese && (
                  <p className="text-xl md:text-2xl text-gray-200 mb-2">
                    {song.title}
                  </p>
                )}
                <p className="text-lg md:text-xl font-medium text-gray-300 mb-1">
                  {song.artistChinese || song.artist}
                </p>
                {song.artistChinese && song.artist !== song.artistChinese && (
                  <p className="text-md md:text-lg text-gray-400">
                    {song.artist}
                  </p>
                )}
                <div className="flex items-center mt-4">
                  <span className="bg-primary/80 text-white text-xs px-2 py-1 rounded">
                    {song.genre || "Pop"}
                  </span>
                  <span className="text-gray-300 text-sm ml-4">
                    {song.views || 0} views
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Song content */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
          <div className="p-6 md:p-8">
            {/* Song tabs */}
            <SongTabs song={song} />
            
            {/* Media Links */}
            <MediaLinks 
              youtubeLink={song.youtubeLink} 
              spotifyLink={song.spotifyLink} 
            />
            
            {/* Actions */}
            <div className="mt-8 flex justify-between items-center">
              <Button variant="outline" size="sm" className="flex items-center">
                <Heart className="h-4 w-4 mr-1" /> Favorite
              </Button>
              <div className="text-sm text-gray-500">
                Added on {song.createdAt ? new Date(song.createdAt as string).toLocaleDateString() : 'Unknown date'}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
