import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/use-auth";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { ProtectedRoute } from "./lib/protected-route";

import HomePage from "@/pages/home-page";
import NotFound from "@/pages/not-found";
import AuthPage from "@/pages/auth-page";
import SongDetail from "@/pages/song-detail";
import AddSong from "@/pages/add-song";
import BrowseSongs from "@/pages/browse-songs";
import AdminPage from "@/pages/admin";
import ArtistsPage from "@/pages/artists";
import ArtistDetailPage from "@/pages/artist-detail";

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/auth" component={AuthPage} />
      <Route path="/songs/:id" component={SongDetail} />
      <Route path="/browse" component={BrowseSongs} />
      <Route path="/artists" component={ArtistsPage} />
      <Route path="/artists/:name" component={ArtistDetailPage} />
      <ProtectedRoute path="/add-song" component={AddSong} />
      <ProtectedRoute path="/admin" component={AdminPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light">
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
