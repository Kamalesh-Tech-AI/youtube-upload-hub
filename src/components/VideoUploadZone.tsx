import { useCallback, useState } from "react";
import { Upload, X, Film } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface VideoUploadZoneProps {
  onFileSelect: (file: File) => void;
  selectedFile: File | null;
  onClearFile: () => void;
  isUploading: boolean;
}

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

export const VideoUploadZone = ({ 
  onFileSelect, 
  selectedFile, 
  onClearFile,
  isUploading 
}: VideoUploadZoneProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateFile = (file: File): boolean => {
    setError(null);
    
    if (!file.type.startsWith('video/')) {
      setError('Please select a valid video file');
      return false;
    }
    
    if (file.size > MAX_FILE_SIZE) {
      setError('Video file must be less than 50MB');
      return false;
    }
    
    return true;
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragIn = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  }, []);

  const handleDragOut = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (validateFile(file)) {
        onFileSelect(file);
      }
    }
  }, [onFileSelect]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (validateFile(file)) {
        onFileSelect(file);
      }
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(2)} KB`;
    }
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  if (selectedFile) {
    return (
      <div className="relative border-2 border-border rounded-lg p-8 bg-card">
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2"
          onClick={onClearFile}
          disabled={isUploading}
        >
          <X className="h-4 w-4" />
        </Button>
        
        <div className="flex items-center gap-4">
          <div className="p-4 rounded-full bg-primary/10">
            <Film className="h-8 w-8 text-primary" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-foreground">{selectedFile.name}</p>
            <p className="text-sm text-muted-foreground">{formatFileSize(selectedFile.size)}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative border-2 border-dashed rounded-lg p-12 transition-all cursor-pointer",
        isDragging 
          ? "border-primary bg-primary/5 scale-[1.02]" 
          : "border-border hover:border-primary/50 hover:bg-muted/50",
        error && "border-destructive"
      )}
      onDragEnter={handleDragIn}
      onDragLeave={handleDragOut}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <input
        type="file"
        accept="video/*"
        onChange={handleFileInput}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        disabled={isUploading}
      />
      
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="p-6 rounded-full bg-gradient-to-br from-primary to-primary-glow">
          <Upload className="h-10 w-10 text-primary-foreground" />
        </div>
        
        <div>
          <h3 className="text-xl font-semibold mb-2 text-foreground">
            Drop your video here
          </h3>
          <p className="text-muted-foreground mb-1">
            or click to browse your files
          </p>
          <p className="text-sm text-muted-foreground">
            MP4, MOV, AVI, MKV, WebM (Max 50MB)
          </p>
        </div>

        {error && (
          <p className="text-sm text-destructive font-medium">{error}</p>
        )}
      </div>
    </div>
  );
};