import { Link, useRoute } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Music, Play, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SongCard } from "@/components/songs/song-card";
import type { Song } from "@shared/schema";

export default function ArtistDetailPage() {
  const [match, params] = useRoute("/artists/:name");
  const artistName = params?.name ? decodeURIComponent(params.name) : "";

  const { data: songs, isLoading, error } = useQuery<Song[]>({
    queryKey: ["artist-songs", artistName],
    queryFn: async () => {
      const res = await fetch(`/api/artists/${encodeURIComponent(artistName)}/songs`);
      if (!res.ok) throw new Error("Failed to fetch artist songs");
      return res.json();
    },
    enabled: !!artistName,
  });

  // Get artist info from the first song
  const artistInfo = songs?.[0] ? {
    english: songs[0].artist,
    chinese: songs[0].artistChinese
  } : null;

  const totalViews = songs?.reduce((sum, song) => sum + (song.views || 0), 0) || 0;

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading artist...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-500">Error loading artist</div>
      </div>
    );
  }

  if (!songs || songs.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Link to="/artists">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Artists
          </Button>
        </Link>
        <div className="text-center py-12">
          <p className="text-muted-foreground">No songs found for this artist</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link to="/artists">
        <Button variant="ghost" className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Artists
        </Button>
      </Link>

      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Music className="w-8 h-8" />
          <div>
            {artistInfo?.chinese && (
              <h1 className="text-3xl font-bold">{artistInfo.chinese}</h1>
            )}
            <h2 className={artistInfo?.chinese ? "text-xl text-muted-foreground" : "text-3xl font-bold"}>
              {artistInfo?.english}
            </h2>
          </div>
        </div>
        
        <div className="flex gap-4 mb-6">
          <Badge variant="secondary" className="flex items-center gap-1">
            <Music className="w-3 h-3" />
            {songs.length} song{songs.length !== 1 ? 's' : ''}
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1">
            <Eye className="w-3 h-3" />
            {totalViews.toLocaleString()} total views
          </Badge>
        </div>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Play className="w-5 h-5" />
          Songs
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {songs.map((song) => (
            <SongCard key={song.id} song={song} />
          ))}
        </div>
      </div>
    </div>
  );
}