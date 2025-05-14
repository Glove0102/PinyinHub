import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { SongCard } from "@/components/songs/song-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Search, RefreshCw } from "lucide-react";
import { Link, useLocation } from "wouter";
import { Song } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function BrowseSongs() {
  const [searchTerm, setSearchTerm] = useState("");
  const [genreFilter, setGenreFilter] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [location] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const ITEMS_PER_PAGE = 9;
  
  // Extract search query from URL if present
  useEffect(() => {
    const url = new URL(window.location.href);
    const searchParam = url.searchParams.get('search');
    if (searchParam) {
      setSearchTerm(searchParam);
    }
  }, [location]);

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
  
  // Mutation for updating translations
  const updateTranslationsMutation = useMutation({
    mutationFn: async () => {
      return apiRequest('/api/songs/update-translations', {
        method: 'POST'
      });
    },
    onSuccess: () => {
      toast({
        title: "Translations updated",
        description: "Song titles and artists have been updated with translations.",
      });
      refetch();
    },
    onError: (error: Error) => {
      toast({
        title: "Error updating translations",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  // Filter songs by genre if necessary
  const filteredSongs = songs && genreFilter !== "all"
    ? songs.filter(song => song.genre === genreFilter)
    : songs;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // The search is handled automatically by the query key change
  };

  const handleGenreClick = (genre: string) => {
    setGenreFilter(genre);
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
            
            {/* Admin button - only visible to logged in users */}
            {user && (
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center" 
                onClick={() => updateTranslationsMutation.mutate()}
                disabled={updateTranslationsMutation.isPending}
              >
                <RefreshCw className={`h-4 w-4 mr-1 ${updateTranslationsMutation.isPending ? 'animate-spin' : ''}`} />
                {updateTranslationsMutation.isPending ? 'Updating...' : 'Update Translations'}
              </Button>
            )}
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
        
        {/* Genre filters */}
        <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
          <Button 
            variant={genreFilter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => handleGenreClick("all")}
            className="whitespace-nowrap"
          >
            All
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
