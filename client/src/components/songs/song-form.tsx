import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { insertSongSchema } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { Loader2 } from "lucide-react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

// Create a modified schema for form validation
const songFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  artist: z.string().min(1, "Artist name is required"),
  lyrics: z.string().min(10, "Lyrics should be at least 10 characters long"),
  genre: z.string().optional(),
  youtubeLink: z.string().url("Please enter a valid YouTube URL").optional().or(z.literal("")),
  spotifyLink: z.string().url("Please enter a valid Spotify URL").optional().or(z.literal("")),
});

type SongFormValues = z.infer<typeof songFormSchema>;

export function SongForm() {
  const { toast } = useToast();
  const [_, setLocation] = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<SongFormValues>({
    resolver: zodResolver(songFormSchema),
    defaultValues: {
      title: "",
      artist: "",
      lyrics: "",
      genre: "",
      youtubeLink: "",
      spotifyLink: "",
    },
  });

  const createSongMutation = useMutation({
    mutationFn: async (data: SongFormValues) => {
      const res = await apiRequest("POST", "/api/songs", data);
      return await res.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Song added successfully!",
        description: "Your song has been processed and added to PinyinHub.",
      });
      
      // Invalidate the songs query to refresh the list
      queryClient.invalidateQueries({ queryKey: ["/api/songs"] });
      
      // Redirect to the song detail page
      setLocation(`/songs/${data.id}`);
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to add song",
        description: error.message || "An error occurred while processing your song.",
        variant: "destructive",
      });
    },
    onSettled: () => {
      setIsSubmitting(false);
    },
  });

  function onSubmit(data: SongFormValues) {
    setIsSubmitting(true);
    createSongMutation.mutate(data);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Song Title</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter in Chinese or English"
                  {...field}
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="artist"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Artist</FormLabel>
              <FormControl>
                <Input
                  placeholder="Artist name in Chinese or English"
                  {...field}
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="lyrics"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Lyrics (Chinese)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Paste Chinese lyrics here (Simplified or Traditional)"
                  className="resize-none min-h-[200px]"
                  {...field}
                  disabled={isSubmitting}
                />
              </FormControl>
              <p className="text-xs text-gray-500 mt-1">
                Both Traditional and Simplified Chinese characters are supported.
              </p>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="genre"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Genre (Optional)</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                disabled={isSubmitting}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a genre" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="pop">Pop</SelectItem>
                  <SelectItem value="rock">Rock</SelectItem>
                  <SelectItem value="folk">Folk</SelectItem>
                  <SelectItem value="rap">Rap/Hip-Hop</SelectItem>
                  <SelectItem value="classical">Classical</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="youtubeLink"
          render={({ field }) => (
            <FormItem>
              <FormLabel>YouTube Link (Optional)</FormLabel>
              <FormControl>
                <Input
                  placeholder="https://www.youtube.com/watch?v=..."
                  {...field}
                  disabled={isSubmitting}
                />
              </FormControl>
              <p className="text-xs text-gray-500 mt-1">
                Paste a link to the song on YouTube
              </p>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="spotifyLink"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Spotify Link (Optional)</FormLabel>
              <FormControl>
                <Input
                  placeholder="https://open.spotify.com/track/..."
                  {...field}
                  disabled={isSubmitting}
                />
              </FormControl>
              <p className="text-xs text-gray-500 mt-1">
                Paste a link to the song on Spotify
              </p>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button 
          type="submit" 
          className="w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>Process and Submit Song</>
          )}
        </Button>
      </form>
    </Form>
  );
}
