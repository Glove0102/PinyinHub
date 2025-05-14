import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { HtmlGeneratorButton } from "@/components/admin/html-generator";
import { TranslationUpdaterButton } from "@/components/admin/translation-updater";
import { useAuth } from "@/hooks/use-auth";
import { Redirect } from "wouter";
import { Loader2 } from "lucide-react";

export default function AdminPage() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Only authenticate users with username 'glove' can access admin page
  if (!user || user.username !== 'glove') {
    return <Redirect to="/" />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Manage PinyinHub settings and perform administrative tasks.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <HtmlGeneratorButton />
          <TranslationUpdaterButton />
          
          <div className="p-4 border rounded-lg bg-gray-50">
            <h3 className="text-lg font-medium mb-2">Site Statistics</h3>
            <p className="text-sm text-gray-500 mb-4">
              Overview of PinyinHub usage and statistics.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-3 rounded-md shadow-sm">
                <div className="text-sm text-gray-500">Total Songs</div>
                <div className="text-2xl font-semibold">2</div>
              </div>
              <div className="bg-white p-3 rounded-md shadow-sm">
                <div className="text-sm text-gray-500">Total Users</div>
                <div className="text-2xl font-semibold">1</div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}