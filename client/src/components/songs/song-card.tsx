import { Card, CardContent } from "@/components/ui/card";
import { Eye } from "lucide-react";
import { Link } from "wouter";
import { Song } from "@shared/schema";

type SongCardProps = {
  song: Song;
};

export function SongCard({ song }: SongCardProps) {
  // Get the image URL based on song or artist - this would be better to store in DB
  // For the prototype, we'll use placeholder images
  const getImageUrl = (index: number) => {
    const images = [
      "https://images.unsplash.com/photo-1516280440614-37939bbacd81?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
      "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
      "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
      "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=1000"
    ];
    return images[index % images.length];
  };

  return (
    <Card className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="h-48 overflow-hidden">
        <img 
          src={getImageUrl(song.id)}
          alt={`${song.artist} - ${song.title}`} 
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
        />
      </div>
      <CardContent className="p-5">
        <h3 className="text-lg font-bold text-gray-900 mb-1">
          {song.titleChinese || song.title}
        </h3>
        <p className="text-sm text-primary-600 mb-2">
          {song.artistChinese || song.artist}
        </p>
        {(song.titleChinese && song.title !== song.titleChinese) && (
          <p className="text-sm text-gray-500 mb-3">
            {song.title}
          </p>
        )}
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-500 flex items-center">
            <Eye className="h-3 w-3 mr-1" /> {song.views || 0} views
          </span>
          <Link 
            href={`/songs/${song.id}`}
            className="text-sm font-medium text-primary hover:text-primary-700 flex items-center"
          >
            View <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 ml-1">
              <path fillRule="evenodd" d="M5 10a.75.75 0 01.75-.75h6.638L10.23 7.29a.75.75 0 111.04-1.08l3.5 3.25a.75.75 0 010 1.08l-3.5 3.25a.75.75 0 11-1.04-1.08l2.158-1.96H5.75A.75.75 0 015 10z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
