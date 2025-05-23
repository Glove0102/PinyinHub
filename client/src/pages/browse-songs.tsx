import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { SongCard } from "@/components/songs/song-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Search, Users } from "lucide-react";
import { Link, useLocation } from "wouter";
import { Song } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";

export default function BrowseSongs() {
  const [searchTerm, setSearchTerm] = useState("");
  const [genreFilter, setGenreFilter] = useState<string>("all");
  const [artistFilter, setArtistFilter] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [location] = useLocation();
  const { user } = useAuth();
  const ITEMS_PER_PAGE = 9;
  
  // Extract search query from URL if present
  useEffect(() => {
    const url = new URL(window.location.href);
    const searchParam = url.searchParams.get('search');
    if (searchParam) {
      setSearchTerm(searchParam);
    }
  }, [location]);
  
  // Set SEO metadata for browse page
  useEffect(() => {
    // Set page title based on search or browse context
    document.title = searchTerm 
      ? `Search Results for "${searchTerm}" | PinyinHub` 
      : "Browse Chinese Songs with Pinyin | PinyinHub";
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    const description = searchTerm
      ? `Find Chinese songs matching "${searchTerm}" with pinyin and English translations on PinyinHub.`
      : "Browse a collection of Chinese songs with pinyin transliteration and English translations. Learn Chinese through music on PinyinHub.";
    
    if (metaDescription) {
      metaDescription.setAttribute('content', description);
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = description;
      document.head.appendChild(meta);
    }
    
    // Add Open Graph tags for social media sharing
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
    
    const title = searchTerm 
      ? `Search Results for "${searchTerm}" | PinyinHub` 
      : "Browse Chinese Songs with Pinyin | PinyinHub";
      
    setMetaTag('og:title', title);
    setMetaTag('og:description', description);
    setMetaTag('og:image', "https://images.unsplash.com/photo-1507838153414-b4b713384a76?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=600");
    setMetaTag('og:url', window.location.href);
    setMetaTag('og:type', 'website');
  }, [searchTerm]);

  // Determine if we're searching or browsing
  const isSearching = searchTerm.trim().length > 0;

  // Fetch songs (either all or search results)
  const {
    data: songs,
    isLoading,
    error,
    refetch
  } = useQuery<Song[]>({
    queryKey: isSearching 
      ? [`/api/songs/search?q=${encodeURIComponent(searchTerm)}`] 
      : [`/api/songs?limit=${ITEMS_PER_PAGE * page}&offset=0`],
  });

  // Fetch artists for filter dropdown
  const { data: artists } = useQuery<Array<{ artist: string; artistChinese: string | null; songCount: number; totalViews: number }>>({
    queryKey: ["artists"],
    queryFn: async () => {
      const res = await fetch("/api/artists");
      if (!res.ok) throw new Error("Failed to fetch artists");
      return res.json();
    },
  });

  // Filter songs by genre and artist
  let filteredSongs = songs;
  if (filteredSongs && genreFilter !== "all") {
    filteredSongs = filteredSongs.filter(song => song.genre === genreFilter);
  }
  if (filteredSongs && artistFilter !== "all") {
    filteredSongs = filteredSongs.filter(song => 
      song.artist === artistFilter || song.artistChinese === artistFilter
    );
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // The search is handled automatically by the query key change
  };

  const handleGenreClick = (genre: string) => {
    setGenreFilter(genre);
    setPage(1); // Reset to first page when changing filters
  };

  const handleArtistChange = (artist: string) => {
    setArtistFilter(artist);
    setPage(1); // Reset to first page when changing filters
  };

  const handleLoadMore = () => {
    setPage(prev => prev + 1);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div className="flex flex-col md:flex-row md:items-center gap-3">
            <h1 className="text-3xl font-bold text-gray-900 mb-4 md:mb-0">
              {isSearching ? "Search Results" : "Browse Songs"}
            </h1>
          </div>
          
          {/* Search form */}
          <form onSubmit={handleSearch} className="w-full md:w-auto">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-500" />
              </div>
              <Input 
                type="text"
                placeholder="Search songs or artists..."
                className="w-full md:w-80 pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </form>
        </div>
        
        {/* Filters */}
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          {/* Artist filter */}
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-gray-500" />
            <Select value={artistFilter} onValueChange={handleArtistChange}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by artist" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Artists</SelectItem>
                {artists?.map((artist) => (
                  <SelectItem key={artist.artist} value={artist.artist}>
                    {artist.artistChinese ? `${artist.artistChinese} (${artist.artist})` : artist.artist}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Genre filters */}
          <div className="flex space-x-2 overflow-x-auto pb-2">
            <Button 
              variant={genreFilter === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => handleGenreClick("all")}
              className="whitespace-nowrap"
            >
              All Genres
            </Button>
            <Button 
              variant={genreFilter === "pop" ? "default" : "outline"}
              size="sm"
              onClick={() => handleGenreClick("pop")}
              className="whitespace-nowrap"
            >
              Pop
            </Button>
            <Button 
              variant={genreFilter === "rock" ? "default" : "outline"}
              size="sm"
              onClick={() => handleGenreClick("rock")}
              className="whitespace-nowrap"
            >
              Rock
            </Button>
            <Button 
              variant={genreFilter === "folk" ? "default" : "outline"}
              size="sm"
              onClick={() => handleGenreClick("folk")}
              className="whitespace-nowrap"
            >
              Folk
            </Button>
            <Button 
              variant={genreFilter === "rap" ? "default" : "outline"}
              size="sm"
              onClick={() => handleGenreClick("rap")}
              className="whitespace-nowrap"
            >
              Rap/Hip-Hop
            </Button>
            <Button 
              variant={genreFilter === "classical" ? "default" : "outline"}
              size="sm"
              onClick={() => handleGenreClick("classical")}
              className="whitespace-nowrap"
            >
              Classical
            </Button>
          </div>
        </div>
        
        {/* Songs grid */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Error Loading Songs</h2>
            <p className="text-gray-600 mb-6">
              An error occurred while loading songs. Please try again later.
            </p>
          </div>
        ) : filteredSongs && filteredSongs.length > 0 ? (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {filteredSongs.map(song => (
                <SongCard key={song.id} song={song} />
              ))}
            </div>
            
            {!isSearching && (
              <div className="text-center">
                <Button 
                  variant="outline" 
                  onClick={handleLoadMore}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    <>
                      Load more songs
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 ml-2">
                        <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                      </svg>
                    </>
                  )}
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <h2 className="text-xl font-bold text-gray-900 mb-4">No Songs Found</h2>
            <p className="text-gray-600 mb-6">
              {isSearching 
                ? `No songs match your search for "${searchTerm}"`
                : "There are no songs in our database yet."}
            </p>
            <Link href="/add-song">
              <Button>
                Add a Song
              </Button>
            </Link>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
