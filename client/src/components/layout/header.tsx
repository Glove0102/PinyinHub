import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";
import { Search, Plus, Menu, X } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "wouter";

export function Header() {
  const { user, logoutMutation } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [location, setLocation] = useLocation();

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and navigation */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary w-8 h-8 mr-2">
                <path d="M5 8l5 3l5 -3l5 3v6l-5 3l-5 -3l-5 3v-6l5 -3z"></path>
                <path d="M10 6l5 -3l5 3"></path>
              </svg>
              <span className="text-xl font-semibold text-gray-900">PinyinHub</span>
            </Link>
            <nav className="hidden md:ml-8 md:flex md:space-x-8">
              <Link href="/" className={`px-3 py-2 text-sm font-medium ${location === "/" ? "text-primary hover:text-primary-600" : "text-gray-700 hover:text-primary"}`}>
                Home
              </Link>
              <Link href="/browse" className={`px-3 py-2 text-sm font-medium ${location === "/browse" ? "text-primary hover:text-primary-600" : "text-gray-700 hover:text-primary"}`}>
                Browse Songs
              </Link>
              {user && (
                <Link href="/admin" className={`px-3 py-2 text-sm font-medium ${location === "/admin" ? "text-primary hover:text-primary-600" : "text-gray-700 hover:text-primary"}`}>
                  Admin
                </Link>
              )}
            </nav>
          </div>
          
          {/* Search bar */}
          <div className="hidden md:block flex-1 max-w-md mx-auto">
            <form action="/browse" method="get">
              <div className="relative text-gray-500 focus-within:text-gray-900">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4" />
                </div>
                <Input 
                  type="text"
                  name="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md" 
                  placeholder="Search songs or artists..."
                />
              </div>
            </form>
          </div>
          
          {/* User account and actions */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <span className="hidden md:inline-block text-sm font-medium text-gray-700">
                  {user.username}
                </span>
                <Button 
                  variant="ghost" 
                  className="hidden md:inline-flex"
                  onClick={() => logoutMutation.mutate()}
                >
                  Sign out
                </Button>
              </>
            ) : (
              <>
                <Link href="/auth">
                  <Button 
                    variant="outline" 
                    className="hidden md:inline-flex"
                  >
                    Sign in
                  </Button>
                </Link>
                <Link href="/auth?tab=register">
                  <Button
                    className="hidden md:inline-flex"
                  >
                    Sign up
                  </Button>
                </Link>
              </>
            )}
            <Link href="/add-song">
              <Button 
                variant="secondary"
                className="inline-flex items-center"
              >
                <Plus className="h-4 w-4 mr-1 md:mr-2" />
                <span className="hidden sm:inline">Add Song</span>
              </Button>
            </Link>
            <Button
              variant="ghost"
              className="md:hidden p-2"
              onClick={toggleMobileMenu}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6 text-gray-500" />
              ) : (
                <Menu className="h-6 w-6 text-gray-500" />
              )}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 py-2 px-4 space-y-2">
          <nav className="flex flex-col space-y-2 mb-3">
            <Link href="/" className="px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md">
              Home
            </Link>
            <Link href="/browse" className="px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md">
              Browse Songs
            </Link>
            <Link href="/about" className="px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md">
              About
            </Link>
            {user && (
              <Link href="/admin" className="px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md">
                Admin
              </Link>
            )}
          </nav>
          
          {user ? (
            <div className="border-t border-gray-200 pt-2">
              <div className="px-3 py-2 text-sm font-medium text-gray-900">
                Signed in as {user.username}
              </div>
              <Button 
                variant="ghost" 
                className="w-full text-left px-3 py-2 text-sm font-medium text-gray-700"
                onClick={() => {
                  logoutMutation.mutate();
                  setMobileMenuOpen(false);
                }}
              >
                Sign out
              </Button>
            </div>
          ) : (
            <div className="border-t border-gray-200 pt-2 flex flex-col space-y-2">
              <Link href="/auth">
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign in
                </Button>
              </Link>
              <Link href="/auth?tab=register">
                <Button
                  className="w-full"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign up
                </Button>
              </Link>
            </div>
          )}
          
          {/* Mobile search */}
          <div className="relative text-gray-500 focus-within:text-gray-900 mt-2">
            <form action="/browse" method="get">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4" />
              </div>
              <Input 
                type="text"
                name="search" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md" 
                placeholder="Search songs or artists..."
              />
            </form>
          </div>
        </div>
      )}
    </header>
  );
}
