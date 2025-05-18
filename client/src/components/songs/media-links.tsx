import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Music, Youtube } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface MediaLinksProps {
  youtubeLink?: string | null;
  spotifyLink?: string | null;
}

export function MediaLinks({ youtubeLink, spotifyLink }: MediaLinksProps) {
  const [activeDialog, setActiveDialog] = useState<"youtube" | "spotify" | null>(null);

  // Check if any media links are available
  const hasMediaLinks = youtubeLink || spotifyLink;
  
  if (!hasMediaLinks) return null;

  // Extract YouTube video ID from various YouTube URL formats
  const getYoutubeVideoId = (url: string) => {
    if (!url) return null;
    
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[7].length === 11) ? match[7] : null;
  };

  // Extract Spotify track ID from Spotify URL
  const getSpotifyTrackId = (url: string) => {
    if (!url) return null;
    
    // Handle regular track URLs: https://open.spotify.com/track/1234567890
    const regExpTrack = /^https?:\/\/open\.spotify\.com\/track\/([a-zA-Z0-9]+)(\?.*)?$/;
    const matchTrack = url.match(regExpTrack);
    
    if (matchTrack && matchTrack[1]) {
      return matchTrack[1];
    }
    
    // Handle embed URLs: https://open.spotify.com/embed/track/1234567890
    const regExpEmbed = /^https?:\/\/open\.spotify\.com\/embed\/track\/([a-zA-Z0-9]+)(\?.*)?$/;
    const matchEmbed = url.match(regExpEmbed);
    
    return (matchEmbed && matchEmbed[1]) ? matchEmbed[1] : null;
  };

  const youtubeVideoId = youtubeLink ? getYoutubeVideoId(youtubeLink) : null;
  const spotifyTrackId = spotifyLink ? getSpotifyTrackId(spotifyLink) : null;

  return (
    <div className="mt-6">
      <h3 className="text-lg font-medium mb-3">Listen to this song</h3>
      <div className="flex flex-wrap gap-2">
        {youtubeLink && (
          <Dialog open={activeDialog === 'youtube'} onOpenChange={(open) => setActiveDialog(open ? 'youtube' : null)}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center">
                <Youtube className="h-4 w-4 mr-2 text-red-600" /> 
                YouTube
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[800px]">
              <DialogHeader>
                <DialogTitle>Watch on YouTube</DialogTitle>
              </DialogHeader>
              <div className="aspect-video w-full mt-4">
                {youtubeVideoId ? (
                  <iframe 
                    width="100%" 
                    height="100%" 
                    src={`https://www.youtube.com/embed/${youtubeVideoId}`}
                    title="YouTube video player" 
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen>
                  </iframe>
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100">
                    <a 
                      href={youtubeLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      Open YouTube video
                    </a>
                  </div>
                )}
              </div>
              <div className="mt-4 text-center">
                <a 
                  href={youtubeLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:underline"
                >
                  Open in YouTube app
                </a>
              </div>
            </DialogContent>
          </Dialog>
        )}

        {spotifyLink && (
          <Dialog open={activeDialog === 'spotify'} onOpenChange={(open) => setActiveDialog(open ? 'spotify' : null)}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center">
                <Music className="h-4 w-4 mr-2 text-green-600" /> 
                Spotify
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Listen on Spotify</DialogTitle>
              </DialogHeader>
              <div className="w-full h-[380px] mt-4">
                {spotifyTrackId ? (
                  <iframe 
                    src={`https://open.spotify.com/embed/track/${spotifyTrackId}`}
                    width="100%" 
                    height="100%" 
                    frameBorder="0" 
                    allow="encrypted-media"
                    loading="lazy">
                  </iframe>
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100">
                    <a 
                      href={spotifyLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      Open Spotify track
                    </a>
                  </div>
                )}
              </div>
              <div className="mt-4 text-center">
                <a 
                  href={spotifyLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:underline"
                >
                  Open in Spotify app
                </a>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
}