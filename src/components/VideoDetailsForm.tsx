import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const formSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title must be less than 100 characters"),
  description: z.string().max(5000, "Description must be less than 5000 characters").optional(),
  tags: z.string().optional(),
  category: z.string().optional(),
  privacy: z.enum(["public", "private", "unlisted"]),
});

export type VideoFormData = z.infer<typeof formSchema>;

interface VideoDetailsFormProps {
  onSubmit: (data: VideoFormData) => void;
  isUploading: boolean;
  hasFile: boolean;
}

export const VideoDetailsForm = ({ onSubmit, isUploading, hasFile }: VideoDetailsFormProps) => {
  const form = useForm<VideoFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      tags: "",
      category: "",
      privacy: "private",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title *</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Enter video title" 
                  {...field} 
                  disabled={isUploading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Tell viewers about your video"
                  className="min-h-[120px] resize-none"
                  {...field}
                  disabled={isUploading}
                />
              </FormControl>
              <FormDescription>
                Add a description to help people find your video
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tags</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Enter tags separated by commas"
                  {...field}
                  disabled={isUploading}
                />
              </FormControl>
              <FormDescription>
                Add tags to help people discover your video
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
                disabled={isUploading}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="education">Education</SelectItem>
                  <SelectItem value="entertainment">Entertainment</SelectItem>
                  <SelectItem value="gaming">Gaming</SelectItem>
                  <SelectItem value="howto">How-to & Style</SelectItem>
                  <SelectItem value="music">Music</SelectItem>
                  <SelectItem value="news">News & Politics</SelectItem>
                  <SelectItem value="sports">Sports</SelectItem>
                  <SelectItem value="technology">Science & Technology</SelectItem>
                  <SelectItem value="travel">Travel & Events</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="privacy"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Privacy *</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
                disabled={isUploading}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="public">Public - Everyone can see</SelectItem>
                  <SelectItem value="unlisted">Unlisted - Anyone with link can see</SelectItem>
                  <SelectItem value="private">Private - Only you can see</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button 
          type="submit" 
          className="w-full bg-gradient-to-r from-primary to-primary-glow"
          size="lg"
          disabled={!hasFile || isUploading}
        >
          {isUploading ? "Uploading..." : "Upload Video"}
        </Button>
      </form>
    </Form>
  );
};