import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Heart } from "lucide-react";
import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { SongTabs } from "@/components/songs/song-tabs";
import { Song } from "@shared/schema";

// Helper component for the new song list
const SongListItem = ({ song }: { song: Song }) => (
    <div className="py-2">
        <Link href={`/songs/${song.id}`} className="font-semibold text-gray-800 hover:text-primary">{song.titleChinese || song.title}</Link>
        <div className="text-sm text-gray-500">
            <Link href={`/browse?search=${encodeURIComponent(song.artist)}`} className="hover:underline">
                {song.artistChinese || song.artist}
            </Link>
        </div>
    </div>
);


export default function HomePage() {
  // Set SEO metadata for home page
  useEffect(() => {
    // Set page title
    document.title = "PinyinHub - Learn Chinese Through Music";

    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 
        "PinyinHub helps you understand Chinese songs with pinyin transliteration and English translations. Learn Chinese through music."
      );
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = "PinyinHub helps you understand Chinese songs with pinyin transliteration and English translations. Learn Chinese through music.";
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

    setMetaTag('og:title', "PinyinHub - Learn Chinese Through Music");
    setMetaTag('og:description', "Learn Chinese through music with lyrics, pinyin, and English translations");
    setMetaTag('og:image', "https://images.unsplash.com/photo-1507838153414-b4b713384a76?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=600");
    setMetaTag('og:url', window.location.href);
    setMetaTag('og:type', 'website');
  }, []);

  // Fetch featured song (for demo, we'll just fetch the first song)
  const { data: featuredSong, isLoading: isFeaturedLoading } = useQuery<Song[]>({
    queryKey: ["/api/songs"],
    select: (data) => data.length > 0 ? [data[0]] : []
  });

  // Fetch all songs for the new list view
  const { data: allSongs, isLoading: areAllSongsLoading } = useQuery<Song[]>({
    queryKey: ["/api/songs?limit=100"], // Fetch more songs
  });

  // Group songs by artist
  const songsByArtist: { [artist: string]: Song[] } = {};
  if (allSongs) {
      allSongs.forEach(song => {
          const artistName = song.artist;
          if (!songsByArtist[artistName]) {
              songsByArtist[artistName] = [];
          }
          songsByArtist[artistName].push(song);
      });
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow">
        {/* Hero Section */}
        <section className="mb-12">
          <div className="relative rounded-xl overflow-hidden bg-primary shadow-xl">
            <div className="absolute inset-0 bg-cover bg-center opacity-20" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1507838153414-b4b713384a76?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=600')" }}></div>
            <div className="relative px-6 py-12 sm:px-12 sm:py-16 lg:py-20 lg:px-16 text-center">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight mb-4">
                Learn Chinese Through Music
              </h1>
              <p className="text-lg text-white max-w-2xl mx-auto mb-8">
                PinyinHub helps you understand Chinese songs with pinyin transliteration and English translations
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link href="/browse">
                  <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                    Explore Songs
                  </Button>
                </Link>
                <Link href="/add-song">
                  <Button size="lg" className="w-full sm:w-auto bg-black border border-white">
                    Add a Song
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 ml-2">
                      <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
                    </svg>
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Song */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Featured Song</h2>
            <Link href="/browse" className="text-primary hover:text-primary-700 text-sm font-medium flex items-center">
              View all songs 
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 ml-1">
                <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 7.29a.75.75 0 111.04-1.08l3.5 3.25a.75.75 0 010 1.08l-3.5 3.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>

          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            {isFeaturedLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : featuredSong && featuredSong[0] ? (
              <div className="md:flex">
                <div className="md:w-1/3 md:shrink-0 relative h-64 md:h-auto">
                  <img 
                    className="h-full w-full object-cover" 
                    src="https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=1000" 
                    alt="Chinese singer performing on stage"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 md:hidden">
                    <h3 className="text-xl font-bold text-white">{featuredSong[0].titleChinese || featuredSong[0].title}</h3>
                    <p className="text-primary-100">{featuredSong[0].title !== featuredSong[0].titleChinese ? featuredSong[0].title : ''}</p>
                    <p className="text-white text-sm">{featuredSong[0].artistChinese || featuredSong[0].artist}</p>
                  </div>
                </div>

                <div className="p-6 md:p-8 md:w-2/3">
                  <div className="hidden md:block mb-4">
                    <h3 className="text-2xl font-bold text-gray-900">{featuredSong[0].titleChinese || featuredSong[0].title}</h3>
                    <p className="text-lg text-primary mb-1">{featuredSong[0].title !== featuredSong[0].titleChinese ? featuredSong[0].title : ''}</p>
                    <p className="text-gray-700">{featuredSong[0].artistChinese || featuredSong[0].artist}</p>
                  </div>

                  {/* Limit display height with max-h-60 and add overflow-y-auto for scrolling if needed */}
                  <div className="max-h-60 overflow-y-auto">
                    <SongTabs song={featuredSong[0]} />
                  </div>

                  <div className="mt-6 flex justify-between items-center">
                    <Button variant="ghost" size="sm" className="text-gray-600 hover:text-primary">
                      <Heart className="h-4 w-4 mr-1" /> Favorite
                    </Button>
                    <Link href={`/songs/${featuredSong[0].id}`} className="inline-flex items-center text-sm font-medium text-primary hover:text-primary-700">
                      View full song 
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 ml-1">
                        <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 7.29a.75.75 0 111.04-1.08l3.5 3.25a.75.75 0 010 1.08l-3.5 3.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center">
                <p className="text-gray-500">No featured songs available yet. Be the first to add one!</p>
                <Link href="/add-song">
                  <Button className="mt-4">Add a Song</Button>
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* New All Songs Section */}
        <section id="all-songs" className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">All Songs</h2>
            <Link href="/browse" className="text-primary hover:text-primary-700 text-sm font-medium flex items-center">
              Browse All
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 ml-1">
                <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 7.29a.75.75 0 111.04-1.08l3.5 3.25a.75.75 0 010 1.08l-3.5 3.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
          {areAllSongsLoading ? (
             <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
          ) : allSongs && allSongs.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-x-8 gap-y-4">
                {Object.keys(songsByArtist).map(artist => (
                    <div key={artist}>
                        <h3 className="text-lg font-bold text-gray-800 mt-4 mb-2 border-b pb-2">
                            <Link href={`/browse?search=${encodeURIComponent(artist)}`} className="hover:underline">
                                {artist}
                            </Link>
                        </h3>
                        <div className="divide-y divide-gray-200">
                            {songsByArtist[artist].map(song => (
                                <SongListItem key={song.id} song={song} />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
          ) : (
            <div className="col-span-3 p-8 text-center">
                <p className="text-gray-500">No songs available yet. Be the first to add one!</p>
                <Link href="/add-song">
                  <Button className="mt-4">Add a Song</Button>
                </Link>
              </div>
          )}
        </section>

        {/* Features */}
        <section className="mb-16 px-4 py-8">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">Discover the Features</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary text-white mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                  <path d="M9 18V5l12-2v13" />
                  <circle cx="6" cy="18" r="3" />
                  <circle cx="18" cy="16" r="3" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Pinyin Transliteration</h3>
              <p className="text-gray-600">View Chinese lyrics with accurate pinyin transliteration including tone marks to help with pronunciation.</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-green-500 text-white mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                  <path d="M5 8l5 3l5 -3l5 3v6l-5 3l-5 -3l-5 3v-6l5 -3z"></path>
                  <path d="M10 6l5 -3l5 3"></path>
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">English Translation</h3>
              <p className="text-gray-600">Read accurate English translations alongside the original Chinese lyrics to understand the meaning.</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-amber-500 text-white mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="8.5" cy="7" r="4" />
                  <path d="M20 8v6" />
                  <path d="M23 11h-6" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Contribute Songs</h3>
              <p className="text-gray-600">Register and add your favorite Chinese songs to help expand our community library.</p>
            </div>
          </div>
        </section>


      </main>

      <Footer />
    </div>
  );
}
