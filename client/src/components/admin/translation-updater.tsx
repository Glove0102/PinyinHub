import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Languages } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function TranslationUpdaterButton() {
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = useState(false);

  const updateTranslationsMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/songs/update-translations");
      return await res.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Translations updated successfully!",
        description: `Updated ${data.updatedSongs?.length || 0} songs with proper bilingual translations.`,
      });
      
      // Invalidate the songs query to refresh the list
      queryClient.invalidateQueries({ queryKey: ["/api/songs"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to update translations",
        description: error.message || "An error occurred while updating translations.",
        variant: "destructive",
      });
    },
    onSettled: () => {
      setIsUpdating(false);
    },
  });

  function handleUpdateTranslations() {
    setIsUpdating(true);
    updateTranslationsMutation.mutate();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Update Translations</CardTitle>
        <CardDescription>
          Update all songs with proper bilingual translations (both Chinese and English for titles and artists).
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-500 mb-4">
          This will ensure all songs have both Chinese and English versions of titles and artists for better searchability.
        </p>
        <Button 
          onClick={handleUpdateTranslations}
          disabled={isUpdating}
          className="w-full"
        >
          {isUpdating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Updating translations...
            </>
          ) : (
            <>
              <Languages className="mr-2 h-4 w-4" />
              Update All Translations
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}