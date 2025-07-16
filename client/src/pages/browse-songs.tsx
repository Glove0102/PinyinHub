import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { Loader2, Search } from "lucide-react";

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Song } from "@shared/schema";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// A more detailed list item for the browse page
const SongListItem = ({ song }: { song: Song }) => (
    <div className="flex items-center justify-between py-3 px-4 hover:bg-gray-50 rounded-lg transition-colors">
        <div>
            <Link href={`/songs/${song.id}`} className="font-semibold text-gray-900 hover:text-primary">
                {song.titleChinese || song.title}
            </Link>
            {song.titleChinese && song.title !== song.titleChinese && (
                <p className="text-sm text-gray-500">{song.title}</p>
            )}
            <div className="text-sm text-gray-600 mt-1">
                <Link href={`/browse?search=${encodeURIComponent(song.artist)}`} className="hover:underline">
                    {song.artistChinese || song.artist}
                </Link>
                {song.artistChinese && song.artist !== song.artistChinese && (
                    <span className="text-gray-500"> / {song.artist}</span>
                )}
            </div>
        </div>
        <div className="text-right">
            <div className="text-sm font-medium text-gray-800">{song.views || 0} views</div>
            <div className="text-xs text-gray-500 capitalize">{song.genre || 'N/A'}</div>
        </div>
    </div>
);


export default function BrowseSongs() {
  const [searchTerm, setSearchTerm] = useState("");
  const [genreFilter, setGenreFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("views");
  const [page, setPage] = useState(1);
  const [location] = useLocation();
  const ITEMS_PER_PAGE = 15;

  // Extract search query from URL if present
  useEffect(() => {
    const url = new URL(window.location.href);
    const searchParam = url.searchParams.get('search');
    if (searchParam) {
      setSearchTerm(searchParam);
    }
  }, [location]);

  // SEO metadata
  useEffect(() => {
    document.title = searchTerm
      ? `Search Results for "${searchTerm}" | PinyinHub`
      : "Browse Chinese Songs with Pinyin | PinyinHub";
  }, [searchTerm]);

  const isSearching = searchTerm.trim().length > 0;

  // Fetch songs with pagination and sorting
  const { data: songs, isLoading, error } = useQuery<Song[]>({
      queryKey: isSearching 
          ? [`/api/songs/search?q=${encodeURIComponent(searchTerm)}`]
          : [`/api/songs?limit=${ITEMS_PER_PAGE}&offset=${(page - 1) * ITEMS_PER_PAGE}`],
      queryFn: async ({ queryKey }) => {
          const url = new URL(window.location.origin + queryKey[0]);
          const res = await fetch(url.toString());
          if (!res.ok) throw new Error('Network response was not ok');
          return res.json();
      },
  });
  
  // Apply client-side filtering and sorting for simplicity, though this should ideally be done server-side
  const processedSongs = songs?.filter(song => {
      if (genreFilter !== 'all' && song.genre !== genreFilter) return false;
      return true;
  }).sort((a, b) => {
      if (sortBy === 'views') return (b.views || 0) - (a.views || 0);
      if (sortBy === 'createdAt') return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
      return 0;
  });


  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow w-full">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Left Sidebar for Filters */}
          <aside className="md:col-span-1">
            <div className="sticky top-20">
              <h2 className="text-lg font-semibold mb-4">Filters</h2>
              <div className="space-y-6">
                <div>
                    <label htmlFor="search" className="text-sm font-medium text-gray-700">Search</label>
                    <div className="relative mt-1">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-4 w-4 text-gray-500" />
                        </div>
                        <Input 
                            id="search"
                            type="text"
                            placeholder="Song or artist..."
                            className="w-full pl-10"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div>
                    <label className="text-sm font-medium text-gray-700">Sort By</label>
                    <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger className="w-full mt-1">
                            <SelectValue placeholder="Sort by..." />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="views">Popularity</SelectItem>
                            <SelectItem value="createdAt">Newest</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                
                <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Genres</h3>
                    <div className="space-y-2">
                        {["all", "pop", "rock", "folk", "rap", "classical"].map(genre => (
                            <Button 
                                key={genre}
                                variant={genreFilter === genre ? "secondary" : "ghost"}
                                className="w-full justify-start capitalize"
                                onClick={() => setGenreFilter(genre)}
                            >
                                {genre}
                            </Button>
                        ))}
                    </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content for Songs */}
          <div className="md:col-span-3">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">
              {isSearching ? `Results for "${searchTerm}"` : "All Songs"}
            </h1>
            
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
              </div>
            ) : error ? (
              <div className="text-center py-10">
                <p className="text-red-500">Failed to load songs.</p>
              </div>
            ) : processedSongs && processedSongs.length > 0 ? (
                <div className="bg-white rounded-lg shadow-md">
                    <div className="divide-y divide-gray-200">
                        {processedSongs.map(song => (
                            <SongListItem key={song.id} song={song} />
                        ))}
                    </div>
                </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-gray-800">No Songs Found</h3>
                <p className="text-gray-500 mt-2">Try adjusting your filters or add a new song!</p>
                <Link href="/add-song" className="mt-4 inline-block">
                  <Button>Add a Song</Button>
                </Link>
              </div>
            )}
            
            {/* Pagination Controls */}
            {!isSearching && (
              <div className="mt-8 flex justify-between items-center">
                  <Button variant="outline" onClick={() => setPage(p => Math.max(1, p-1))} disabled={page === 1}>Previous</Button>
                  <span className="text-sm text-gray-600">Page {page}</span>
                  <Button variant="outline" onClick={() => setPage(p => p + 1)} disabled={!songs || songs.length < ITEMS_PER_PAGE}>Next</Button>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}