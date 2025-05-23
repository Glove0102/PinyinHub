import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Music, Users, Play } from "lucide-react";

interface Artist {
  artist: string;
  artistChinese: string | null;
  songCount: number;
  totalViews: number;
}

export default function ArtistsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: artists, isLoading, error } = useQuery<Artist[]>({
    queryKey: ["artists"],
    queryFn: async () => {
      const res = await fetch("/api/artists");
      if (!res.ok) throw new Error("Failed to fetch artists");
      return res.json();
    },
  });

  const filteredArtists = artists?.filter(artist =>
    artist.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (artist.artistChinese && artist.artistChinese.includes(searchQuery))
  ) || [];

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading artists...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-500">Error loading artists</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4 flex items-center gap-2">
          <Users className="w-8 h-8" />
          Browse Artists
        </h1>
        <p className="text-muted-foreground mb-6">
          Discover songs by your favorite Chinese artists
        </p>
        
        <Input
          type="search"
          placeholder="Search artists..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-md"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredArtists.map((artist) => (
          <Link
            key={artist.artist}
            to={`/artists/${encodeURIComponent(artist.artist)}`}
            className="block hover:scale-105 transition-transform"
          >
            <Card className="h-full hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Music className="w-5 h-5" />
                  <div>
                    {artist.artistChinese && (
                      <div className="text-lg font-semibold">
                        {artist.artistChinese}
                      </div>
                    )}
                    <div className={artist.artistChinese ? "text-sm text-muted-foreground" : "text-lg font-semibold"}>
                      {artist.artist}
                    </div>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div className="space-y-2">
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <Music className="w-3 h-3" />
                      {artist.songCount} song{artist.songCount !== 1 ? 's' : ''}
                    </Badge>
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Play className="w-3 h-3" />
                      {artist.totalViews.toLocaleString()} views
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {filteredArtists.length === 0 && searchQuery && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No artists found matching "{searchQuery}"</p>
        </div>
      )}
    </div>
  );
}