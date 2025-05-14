import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { SongForm } from "@/components/songs/song-form";
import { useAuth } from "@/hooks/use-auth";
import { Link, Redirect } from "wouter";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export default function AddSong() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Redirect to="/auth" />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow">
        <section id="add-song-section" className="mb-16 bg-white rounded-xl shadow-md overflow-hidden">
          <div className="md:flex">
            {/* Left panel with info */}
            <div className="md:w-2/5 bg-gradient-to-br from-primary to-primary-800 text-white p-8 flex items-center justify-center">
              <div className="text-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary-200 h-16 w-16 mx-auto mb-4">
                  <path d="M9 18V5l12-2v13"></path>
                  <circle cx="6" cy="18" r="3"></circle>
                  <circle cx="18" cy="16" r="3"></circle>
                </svg>
                <h2 className="text-2xl font-bold mb-4">Contribute to PinyinHub</h2>
                <p className="text-primary-100 mb-6">Help others learn Chinese by adding your favorite songs with lyrics</p>
                <ul className="text-left space-y-3 mb-6">
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400 mt-1 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>AI-powered translation and pinyin generation</span>
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400 mt-1 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Support for both traditional and simplified characters</span>
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400 mt-1 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Easy-to-use interface for submitting songs</span>
                  </li>
                </ul>
                <Link href="/browse">
                  <Button variant="secondary" className="mt-4">
                    Browse Existing Songs
                  </Button>
                </Link>
              </div>
            </div>
            
            {/* Right panel with form */}
            <div className="md:w-3/5 p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Add a New Song</h3>
              <SongForm />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
