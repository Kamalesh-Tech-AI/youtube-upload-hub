import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { VideoUploadZone } from "@/components/VideoUploadZone";
import { VideoDetailsForm, VideoFormData } from "@/components/VideoDetailsForm";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Video } from "lucide-react";

const Upload = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
  };

  const handleClearFile = () => {
    setSelectedFile(null);
    setUploadProgress(0);
  };

  const handleSubmit = async (data: VideoFormData) => {
    if (!selectedFile) {
      toast({
        title: "No file selected",
        description: "Please select a video file to upload",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        toast({
          title: "Authentication required",
          description: "Please log in to upload videos",
          variant: "destructive",
        });
        setIsUploading(false);
        return;
      }

      // Create file path with user ID
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('videos')
        .upload(filePath, selectedFile, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) throw uploadError;

      setUploadProgress(50);

      // Parse tags from comma-separated string
      const tagsArray = data.tags 
        ? data.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
        : [];

      // Save metadata to database
      const { error: dbError } = await supabase
        .from('video_uploads')
        .insert({
          user_id: user.id,
          title: data.title,
          description: data.description || null,
          tags: tagsArray,
          category: data.category || null,
          privacy: data.privacy,
          file_path: filePath,
          file_size: selectedFile.size,
          mime_type: selectedFile.type,
        });

      if (dbError) throw dbError;

      setUploadProgress(100);

      toast({
        title: "Upload successful!",
        description: "Your video has been uploaded successfully",
      });

      // Clear form and navigate
      setTimeout(() => {
        handleClearFile();
        navigate('/');
      }, 1500);

    } catch (error: any) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: error.message || "An error occurred during upload",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      <div className="container max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/')}
            className="hover:bg-muted"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-primary to-primary-glow">
              <Video className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Upload Video</h1>
              <p className="text-muted-foreground">Share your content with the world</p>
            </div>
          </div>
        </div>

        {/* Upload Zone */}
        <div className="mb-8">
          <VideoUploadZone
            onFileSelect={handleFileSelect}
            selectedFile={selectedFile}
            onClearFile={handleClearFile}
            isUploading={isUploading}
          />
        </div>

        {/* Upload Progress */}
        {isUploading && uploadProgress > 0 && (
          <div className="mb-8 p-4 rounded-lg bg-card border border-border">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-foreground">Uploading...</span>
              <span className="text-sm text-muted-foreground">{uploadProgress}%</span>
            </div>
            <Progress value={uploadProgress} className="h-2" />
          </div>
        )}

        {/* Details Form */}
        <div className="p-8 rounded-lg bg-card border border-border shadow-lg">
          <h2 className="text-2xl font-semibold mb-6 text-foreground">Video Details</h2>
          <VideoDetailsForm
            onSubmit={handleSubmit}
            isUploading={isUploading}
            hasFile={!!selectedFile}
          />
        </div>
      </div>
    </div>
  );
};

export default Upload;