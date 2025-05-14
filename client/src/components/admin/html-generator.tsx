import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Loader2, FileOutput } from "lucide-react";

export function HtmlGeneratorButton() {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);

  const generateHtml = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/songs/generate-html", {});
      return await res.json();
    },
    onSuccess: (data) => {
      toast({
        title: "HTML files generated successfully",
        description: data.message || "Static HTML files have been generated for SEO purposes.",
      });
      setIsGenerating(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to generate HTML files",
        description: error.message || "An error occurred while generating HTML files.",
        variant: "destructive",
      });
      setIsGenerating(false);
    },
  });

  function handleGenerateHtml() {
    setIsGenerating(true);
    generateHtml.mutate();
  }

  return (
    <div className="p-4 border rounded-lg bg-gray-50">
      <h3 className="text-lg font-medium mb-2">SEO HTML Generator</h3>
      <p className="text-sm text-gray-500 mb-4">
        Generate static HTML files for all songs to improve search engine visibility.
      </p>
      <Button
        onClick={handleGenerateHtml}
        disabled={isGenerating}
        className="flex items-center"
      >
        {isGenerating ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <FileOutput className="mr-2 h-4 w-4" />
            Generate HTML Files
          </>
        )}
      </Button>
    </div>
  );
}